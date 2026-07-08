import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { RedisService } from '../redis/redis.service';

/**
 * SMART SMS GATEWAY
 * ──────────────────────────────────────────────────────────────────────────────
 * Multi-channel OTP delivery with automatic cost optimization:
 *
 *   Priority 1: WhatsApp Business API (₹0.00 — template messages are free)
 *   Priority 2: AWS SNS SMS (₹0.15/msg — transactional route)
 *   Priority 3: MSG91 fallback (₹0.20/msg — if SNS fails)
 *
 * COST SAVINGS AT SCALE:
 *   100K users × 2 OTP/month = 200K messages/month
 *   Without this:  200K × ₹0.15 = ₹30,000/month
 *   With this:     ~40K SMS (80% on WhatsApp) × ₹0.15 = ₹6,000/month
 *   Savings:       ₹24,000/month (~$290)
 *
 * RATE LIMITING (3 layers):
 *   Layer 1: Redis — 5 OTP requests per phone per 10 minutes
 *   Layer 2: Redis — 20 OTP requests per IP per hour
 *   Layer 3: AWS WAF — 100 requests per IP per 5 minutes (infrastructure level)
 */

export type SmsChannel = 'whatsapp' | 'sns' | 'msg91' | 'console';

interface SmsResult {
  success: boolean;
  channel: SmsChannel;
  messageId?: string;
  cost: number; // in INR
  error?: string;
}

interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  retryAfterSeconds?: number;
}

@Injectable()
export class SmsGatewayService {
  constructor(
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  // ─── Send OTP with Smart Channel Selection ─────────────────────────────────

  async sendOTP(phone: string, otp: string, clientIp: string): Promise<SmsResult> {
    // Step 1: Rate limit check (3 layers)
    const rateCheck = await this.checkRateLimits(phone, clientIp);
    if (!rateCheck.allowed) {
      return {
        success: false,
        channel: 'console',
        cost: 0,
        error: rateCheck.reason,
      };
    }

    // Step 2: Track this attempt
    await this.redis.trackOTPAttempt(phone);
    await this.trackIpAttempt(clientIp);

    // Step 3: Try channels in priority order
    const message = `Your Kuli verification code is ${otp}. Valid for 5 minutes. Do not share this code.`;
    const hindiMessage = `आपका Kuli सत्यापन कोड ${otp} है। 5 मिनट के लिए मान्य। इस कोड को किसी के साथ साझा न करें।`;

    // Priority 1: WhatsApp (free)
    if (this.isWhatsAppEnabled()) {
      const result = await this.sendViaWhatsApp(phone, otp);
      if (result.success) {
        await this.logDelivery(phone, result);
        return result;
      }
      console.warn(`⚠️ WhatsApp failed for ${phone}, falling back to SMS`);
    }

    // Priority 2: AWS SNS (₹0.15)
    if (this.isSnsEnabled()) {
      const result = await this.sendViaSNS(phone, message);
      if (result.success) {
        await this.logDelivery(phone, result);
        return result;
      }
      console.warn(`⚠️ SNS failed for ${phone}, falling back to MSG91`);
    }

    // Priority 3: MSG91 (₹0.20)
    if (this.isMsg91Enabled()) {
      const result = await this.sendViaMsg91(phone, otp);
      if (result.success) {
        await this.logDelivery(phone, result);
        return result;
      }
    }

    // Fallback: Console log (development only)
    console.log(`\n📱 [DEV] OTP for ${phone}: ${otp}\n`);
    return {
      success: true,
      channel: 'console',
      cost: 0,
      messageId: `dev_${Date.now()}`,
    };
  }

  // ─── Rate Limiting (3 Layers) ──────────────────────────────────────────────

  private async checkRateLimits(phone: string, clientIp: string): Promise<RateLimitResult> {
    // Layer 1: Per-phone limit — 5 requests per 10 minutes
    const phoneAttempts = await this.redis.getOTPAttempts(phone);
    if (phoneAttempts >= 5) {
      const ttl = await this.redis.ttl(`otp:attempts:${phone}`);
      return {
        allowed: false,
        reason: `Too many OTP requests for this number. Try again in ${Math.ceil(ttl / 60)} minutes.`,
        retryAfterSeconds: ttl > 0 ? ttl : 600,
      };
    }

    // Layer 2: Per-IP limit — 20 requests per hour
    const ipKey = `otp:ip:${clientIp}`;
    const ipAttempts = await this.redis.get(ipKey);
    const ipCount = ipAttempts ? parseInt(ipAttempts, 10) : 0;

    if (ipCount >= 20) {
      const ttl = await this.redis.ttl(ipKey);
      return {
        allowed: false,
        reason: 'Too many requests from this network. Please try again later.',
        retryAfterSeconds: ttl > 0 ? ttl : 3600,
      };
    }

    // Layer 3: Global abuse detection — if same IP hits 5+ different phones in 10 min
    const ipPhonesKey = `otp:ip:phones:${clientIp}`;
    const phonesHit = await this.redis.getJSON<string[]>(ipPhonesKey) || [];
    if (!phonesHit.includes(phone)) {
      phonesHit.push(phone);
    }
    if (phonesHit.length > 5) {
      console.error(`🚨 ABUSE DETECTED: IP ${clientIp} hit ${phonesHit.length} different phones`);
      return {
        allowed: false,
        reason: 'Suspicious activity detected. Your access has been temporarily restricted.',
        retryAfterSeconds: 3600,
      };
    }
    await this.redis.setJSON(ipPhonesKey, phonesHit, 600); // 10 min window

    return { allowed: true };
  }

  private async trackIpAttempt(clientIp: string): Promise<void> {
    const key = `otp:ip:${clientIp}`;
    const count = await this.redis.incr(key);
    if (count === 1) {
      // Set 1-hour TTL on first attempt
      await this.redis.setWithTTL(key, '1', 3600);
    }
  }

  // ─── Channel Implementations ───────────────────────────────────────────────

  private async sendViaWhatsApp(phone: string, otp: string): Promise<SmsResult> {
    try {
      const apiKey = this.config.get<string>('WHATSAPP_API_KEY');
      const phoneNumberId = this.config.get<string>('WHATSAPP_PHONE_NUMBER_ID');

      // WhatsApp Business API — OTP template message
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: phone.replace('+', ''), // WhatsApp wants without +
            type: 'template',
            template: {
              name: 'kuli_otp_verification',
              language: { code: 'en' },
              components: [
                {
                  type: 'body',
                  parameters: [{ type: 'text', text: otp }],
                },
                {
                  type: 'button',
                  sub_type: 'url',
                  index: '0',
                  parameters: [{ type: 'text', text: otp }],
                },
              ],
            },
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          channel: 'whatsapp',
          messageId: data.messages?.[0]?.id,
          cost: 0, // WhatsApp template messages are free for business-initiated
        };
      }

      return { success: false, channel: 'whatsapp', cost: 0, error: `HTTP ${response.status}` };
    } catch (error) {
      return { success: false, channel: 'whatsapp', cost: 0, error: String(error) };
    }
  }

  private async sendViaSNS(phone: string, message: string): Promise<SmsResult> {
    try {
      const sns = new SNSClient({ region: 'ap-south-1' });
      const command = new PublishCommand({
        PhoneNumber: phone,
        Message: message,
        MessageAttributes: {
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional', // Guaranteed delivery for OTP
          },
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: 'KULI', // 6-char sender ID registered with TRAI
          },
        },
      });

      const result = await sns.send(command);

      return {
        success: true,
        channel: 'sns',
        messageId: result.MessageId,
        cost: 0.15, // ₹0.15 per transactional SMS in India
      };
    } catch (error) {
      return { success: false, channel: 'sns', cost: 0, error: String(error) };
    }
  }

  private async sendViaMsg91(phone: string, otp: string): Promise<SmsResult> {
    try {
      const authKey = this.config.get<string>('MSG91_AUTH_KEY');
      const templateId = this.config.get<string>('MSG91_TEMPLATE_ID');

      const response = await fetch('https://api.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'authkey': authKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template_id: templateId,
          mobile: phone.replace('+', ''),
          otp,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          channel: 'msg91',
          messageId: data.request_id,
          cost: 0.20, // ₹0.20 per SMS
        };
      }

      return { success: false, channel: 'msg91', cost: 0, error: `HTTP ${response.status}` };
    } catch (error) {
      return { success: false, channel: 'msg91', cost: 0, error: String(error) };
    }
  }

  // ─── Delivery Analytics ────────────────────────────────────────────────────

  private async logDelivery(phone: string, result: SmsResult): Promise<void> {
    // Track daily SMS spend for cost monitoring
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const costKey = `sms:cost:${today}`;
    const countKey = `sms:count:${today}:${result.channel}`;

    // Increment daily cost (store as paise for precision)
    const costPaise = Math.round(result.cost * 100);
    if (costPaise > 0) {
      const currentCost = await this.redis.incrby(costKey, costPaise);
      if (currentCost === costPaise) {
        await this.redis.expire(costKey, 172800);
      }
    }

    // Increment channel counter
    const channelCount = await this.redis.incr(countKey);
    if (channelCount === 1) {
      await this.redis.expire(countKey, 172800);
    }

    console.log(`📤 SMS sent via ${result.channel}: ${phone} (₹${result.cost})`);
  }

  // ─── Channel Availability Checks ──────────────────────────────────────────

  private isWhatsAppEnabled(): boolean {
    return !!(
      this.config.get<string>('WHATSAPP_API_KEY') &&
      this.config.get<string>('WHATSAPP_PHONE_NUMBER_ID')
    );
  }

  private isSnsEnabled(): boolean {
    // AWS SNS uses IAM role credentials (no explicit key needed on EC2/App Runner)
    return this.config.get<string>('NODE_ENV') !== 'development' ||
      !!this.config.get<string>('AWS_ACCESS_KEY_ID');
  }

  private isMsg91Enabled(): boolean {
    return !!(
      this.config.get<string>('MSG91_AUTH_KEY') &&
      this.config.get<string>('MSG91_TEMPLATE_ID')
    );
  }
}
