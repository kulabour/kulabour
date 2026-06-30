import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

/**
 * DEVICE TRUST SERVICE
 * ──────────────────────────────────────────────────────────────────────────────
 * After first OTP verification, issues a long-lived device token (30 days).
 * On subsequent logins from the SAME device, user skips OTP entirely.
 *
 * COST IMPACT: Eliminates ~80% of repeat SMS costs.
 *   → Average user opens app ~20x/month, OTP needed only once per 30 days.
 *   → At 100K users: saves ₹24,000/month in SMS costs.
 *
 * SECURITY MODEL:
 *   - SHA-256 hashed tokens (raw never stored server-side)
 *   - Bound to (phone + deviceId) pair
 *   - Max 3 trusted devices per phone (FIFO eviction)
 *   - Immediate revocation on invalid token (possible theft)
 *   - Full revocation on logout / account lock
 */

const DEVICE_TRUST_TTL = 60 * 60 * 24 * 30; // 30 days
const MAX_TRUSTED_DEVICES = 3;

export interface TrustedDevice {
  tokenHash: string;
  deviceId: string;
  deviceName: string;
  platform: 'android' | 'ios' | 'web';
  createdAt: string;
  lastUsedAt: string;
}

@Injectable()
export class DeviceTrustService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly rawRedis: Redis,
    private readonly redis: RedisService,
    private readonly config: ConfigService,
  ) {}

  // ─── Register Trusted Device ────────────────────────────────────────────────

  async registerTrustedDevice(
    phone: string,
    deviceId: string,
    deviceName: string,
    platform: 'android' | 'ios' | 'web' = 'android',
  ): Promise<{ deviceToken: string; expiresIn: number }> {
    const listKey = `device:list:${phone}`;

    // Get current device list
    const currentList = await this.redis.getJSON<string[]>(listKey) || [];

    // Enforce max devices — evict oldest if at limit
    if (currentList.length >= MAX_TRUSTED_DEVICES && !currentList.includes(deviceId)) {
      const oldestDeviceId = currentList[0]; // FIFO
      await this.redis.del(`device:trust:${phone}:${oldestDeviceId}`);
      currentList.shift();
      console.log(`♻️ Evicted oldest device: ${oldestDeviceId.slice(0, 8)}...`);
    }

    // Generate device token
    const rawToken = crypto.randomBytes(48).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const now = new Date().toISOString();

    const trustData: TrustedDevice = {
      tokenHash,
      deviceId,
      deviceName,
      platform,
      createdAt: now,
      lastUsedAt: now,
    };

    // Store device trust data
    await this.redis.setJSON(`device:trust:${phone}:${deviceId}`, trustData, DEVICE_TRUST_TTL);

    // Update device list
    const updatedList = currentList.filter(id => id !== deviceId);
    updatedList.push(deviceId);
    await this.redis.setJSON(listKey, updatedList, DEVICE_TRUST_TTL);

    console.log(`🔐 Device trusted: ${phone} → ${deviceName} (${platform})`);

    return { deviceToken: rawToken, expiresIn: DEVICE_TRUST_TTL };
  }

  // ─── Verify Device Trust (Called BEFORE OTP) ────────────────────────────────

  async verifyDeviceTrust(
    phone: string,
    deviceId: string,
    deviceToken: string,
  ): Promise<{ trusted: boolean; reason?: string }> {
    const key = `device:trust:${phone}:${deviceId}`;
    const stored = await this.redis.getJSON<TrustedDevice>(key);

    if (!stored) {
      return { trusted: false, reason: 'DEVICE_NOT_REGISTERED' };
    }

    // Compare token hashes
    const incomingHash = crypto.createHash('sha256').update(deviceToken).digest('hex');

    if (stored.tokenHash !== incomingHash) {
      // SECURITY: Invalid token = possible theft → revoke immediately
      await this.revokeDevice(phone, deviceId);
      console.warn(`🚨 SECURITY: Invalid device token for ${phone}:${deviceId} — REVOKED`);
      return { trusted: false, reason: 'INVALID_TOKEN_REVOKED' };
    }

    // Update last used (without resetting TTL)
    const remainingTTL = await this.redis.ttl(key);
    if (remainingTTL > 0) {
      stored.lastUsedAt = new Date().toISOString();
      await this.redis.setJSON(key, stored, remainingTTL);
    }

    return { trusted: true };
  }

  // ─── Revoke Single Device ──────────────────────────────────────────────────

  async revokeDevice(phone: string, deviceId: string): Promise<void> {
    await this.redis.del(`device:trust:${phone}:${deviceId}`);

    // Update list
    const listKey = `device:list:${phone}`;
    const list = await this.redis.getJSON<string[]>(listKey) || [];
    const filtered = list.filter(id => id !== deviceId);
    if (filtered.length > 0) {
      const ttl = await this.redis.ttl(listKey);
      await this.redis.setJSON(listKey, filtered, ttl > 0 ? ttl : DEVICE_TRUST_TTL);
    } else {
      await this.redis.del(listKey);
    }
  }

  // ─── Revoke ALL Devices (Logout Everywhere / Account Lock) ─────────────────

  async revokeAllDevices(phone: string): Promise<number> {
    const listKey = `device:list:${phone}`;
    const list = await this.redis.getJSON<string[]>(listKey) || [];

    for (const deviceId of list) {
      await this.redis.del(`device:trust:${phone}:${deviceId}`);
    }
    await this.redis.del(listKey);

    console.log(`🚫 All ${list.length} trusted devices revoked for ${phone}`);
    return list.length;
  }

  // ─── List Devices (Profile → Security Screen) ──────────────────────────────

  async listTrustedDevices(phone: string): Promise<Omit<TrustedDevice, 'tokenHash'>[]> {
    const listKey = `device:list:${phone}`;
    const list = await this.redis.getJSON<string[]>(listKey) || [];
    const devices: Omit<TrustedDevice, 'tokenHash'>[] = [];

    for (const deviceId of list) {
      const data = await this.redis.getJSON<TrustedDevice>(`device:trust:${phone}:${deviceId}`);
      if (data) {
        const { tokenHash, ...safe } = data;
        devices.push(safe);
      }
    }

    return devices;
  }
}
