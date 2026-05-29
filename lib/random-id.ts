// Simple random ID generation
export function getRandomId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

export function generateOrderNumber(): string {
  return `DSP-${Date.now().toString(36).substr(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
}