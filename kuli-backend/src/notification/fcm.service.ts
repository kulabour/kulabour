import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * FIREBASE CLOUD MESSAGING SERVICE
 * ──────────────────────────────────────────────────────────────────────────────
 * Sends push notifications via FCM HTTP v1 API.
 * Falls back to console logging when FIREBASE_PROJECT_ID is not set (dev mode).
 *
 * Same graceful-degradation pattern as SmsGatewayService.
 */

@Injectable()
export class FcmService {
  private readonly projectId: string | undefined;

  constructor(private readonly config: ConfigService) {
    this.projectId = this.config.get<string>('FIREBASE_PROJECT_ID');
  }

  /**
   * Send a push notification via FCM HTTP v1 API.
   * In dev mode (no FIREBASE_PROJECT_ID), logs to console instead.
   */
  async sendPush(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // Dev mode: just log to console
    if (!this.projectId) {
      console.log(`\n🔔 [DEV FCM] Push to token: ${fcmToken.substring(0, 20)}...`);
      console.log(`   Title: ${title}`);
      console.log(`   Body: ${body}`);
      if (data) console.log(`   Data: ${JSON.stringify(data)}\n`);
      return { success: true, messageId: `dev_fcm_${Date.now()}` };
    }

    try {
      const url = `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`;

      const message: Record<string, any> = {
        message: {
          token: fcmToken,
          notification: { title, body },
        },
      };

      if (data) {
        message.message.data = data;
      }

      // In production, use a service account OAuth2 token
      // For now we use the private key from env to generate access token
      const accessToken = await this.getAccessToken();

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`📤 FCM push sent: ${title}`);
        return { success: true, messageId: result.name };
      }

      const errorBody = await response.text();
      console.error(`❌ FCM push failed: HTTP ${response.status} — ${errorBody}`);
      return { success: false, error: `HTTP ${response.status}` };
    } catch (error) {
      console.error(`❌ FCM push error:`, error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get OAuth2 access token for FCM v1 API.
   * In production, use Google Auth Library with service account credentials.
   * For MVP, returns empty string and relies on dev-mode bypass above.
   */
  private async getAccessToken(): Promise<string> {
    // TODO: Implement proper Google OAuth2 service account flow
    // using FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY env vars
    // For now, return placeholder — the dev-mode bypass above handles it
    const clientEmail = this.config.get<string>('FIREBASE_CLIENT_EMAIL');
    const privateKey = this.config.get<string>('FIREBASE_PRIVATE_KEY');

    if (!clientEmail || !privateKey) {
      console.warn('⚠️ FCM credentials not configured, push will fail in production');
      return '';
    }

    // Placeholder: In production, generate JWT and exchange for access token
    // via https://oauth2.googleapis.com/token
    return '';
  }
}
