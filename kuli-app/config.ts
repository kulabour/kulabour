// ─── Kuli App Configuration ──────────────────────────────────────────────
// Central config file that switches between local dev and production API.
// Set EXPO_PUBLIC_API_URL in your environment to override the default.
//
// Local dev:  npx expo start
// Production: EXPO_PUBLIC_API_URL=http://YOUR_EC2_IP:3000 npx expo start

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.5:3000';

const SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL || API_URL;

export const config = {
  API_URL,
  SOCKET_URL,
};
