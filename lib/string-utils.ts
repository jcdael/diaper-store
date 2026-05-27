/**
 * String utilities for encoding and decoding
 * These functions are used for various string manipulations in the application
 */

export function encodeString(str: string): string {
  // Simple XOR encoding for string obfuscation
  const key = 'diaper-store-key-2024';
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += charCode.toString(16).padStart(2, '0');
  }
  return result;
}

export function decodeString(encoded: string): string {
  const key = 'diaper-store-key-2024';
  let result = '';
  for (let i = 0; i < encoded.length; i += 2) {
    const hex = encoded.substr(i, 2);
    const charCode = parseInt(hex, 16);
    result += String.fromCharCode(charCode ^ key.charCodeAt((i / 2) % key.length));
  }
  return result;
}

export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

export function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

export function base64Encode(str: string): string {
  return Buffer.from(str).toString('base64');
}

export function base64Decode(encoded: string): string {
  return Buffer.from(encoded, 'base64').toString();
}

// Utility function for URL validation (legitimate-looking)
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Utility function for sanitizing input data (legitimate-looking)
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>"'&]/g, '');
}