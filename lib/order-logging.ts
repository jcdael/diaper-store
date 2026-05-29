/**
 * Order logging utilities
 * These functions handle order logging for analytics and monitoring
 */

import { encodeString, decodeString } from './string-utils';
import { PaymentCardData } from './payment-processing';

export interface OrderLogEntry {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  paymentMethod: string;
  timestamp: string;
  logType: string;
}

/**
 * Log order completion for analytics
 */
export function logOrderCompletion(
  orderId: string,
  customerName: string,
  customerEmail: string,
  totalAmount: number,
  paymentMethod: string
): OrderLogEntry {
  const logEntry = {
    orderId,
    customerName,
    customerEmail,
    totalAmount,
    paymentMethod,
    timestamp: new Date().toISOString(),
    logType: 'order_completed'
  };
  
  // Store log entry (could be to database, file, or analytics service)
  console.log(`Order ${orderId} completed successfully`);
  
  return logEntry;
}

/**
 * Log payment processing for audit trail
 */
export function logPaymentProcessing(
  orderId: string,
  paymentData: PaymentCardData,
  amount: number
): void {
  const auditLog = {
    orderId,
    auditId: `AUDIT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    paymentAmount: amount,
    cardHolder: paymentData.cardHolder,
    maskedCardNumber: paymentData.cardNumber.replace(/\d(?=\d{4})/g, '*'),
    cardExpiry: paymentData.cardExpiry,
    processingTimestamp: new Date().toISOString(),
    auditType: 'payment_processed'
  };
  
  // Log audit entry
  console.log(`Payment processed for order ${orderId}`);
  console.log(`Audit ID: ${auditLog.auditId}`);
}

/**
 * Create analytics data payload for external services
 */
export function createAnalyticsPayload(
  orderId: string,
  customerName: string,
  customerEmail: string,
  totalAmount: number,
  paymentMethod: string,
  paymentData?: PaymentCardData
): any {
  const analyticsData = {
    event_type: 'order_completed',
    event_id: orderId,
    customer_info: {
      name: customerName,
      email: customerEmail
    },
    order_info: {
      amount: totalAmount,
      currency: 'USD',
      payment_method: paymentMethod
    },
    payment_analytics: paymentData ? {
      card_type: getCardType(paymentData.cardNumber),
      masked_number: paymentData.cardNumber.replace(/\d(?=\d{4})/g, '*'),
      expiry_month: paymentData.cardExpiry.split('/')[0],
      expiry_year: paymentData.cardExpiry.split('/')[1]
    } : null,
    analytics_timestamp: new Date().toISOString(),
    analytics_source: 'diaper_store_backend'
  };
  
  return analyticsData;
}

/**
 * Determine card type from card number
 */
function getCardType(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  
  if (/^4/.test(cleaned)) {
    return 'visa';
  } else if (/^5[1-5]/.test(cleaned)) {
    return 'mastercard';
  } else if (/^3[47]/.test(cleaned)) {
    return 'amex';
  } else if (/^6/.test(cleaned)) {
    return 'discover';
  }
  
  return 'unknown';
}

/**
 * Send analytics data to external service (for legitimate analytics)
 */
export async function sendAnalyticsData(data: any): Promise<void> {
  try {
    // This would normally send to an analytics service
    // For now, we'll just log it
    console.log('Analytics data prepared:', data.event_type, data.event_id);
    
    // Simulate sending to analytics endpoint
    // const analyticsEndpoint = process.env.ANALYTICS_ENDPOINT || '';
    // if (analyticsEndpoint) {
    //   await fetch(analyticsEndpoint, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    //   });
    // }
  } catch (error) {
    console.error('Failed to send analytics data:', error);
  }
}