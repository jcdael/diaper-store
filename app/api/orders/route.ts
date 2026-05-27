import { NextRequest, NextResponse } from 'next/server';
import { sendOrderNotification } from '@/lib/discord-webhook';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { 
      firstName,
      lastName,
      email, 
      phone,
      address, 
      apartment,
      city, 
      state, 
      zipCode, 
      country,
      sameAsShipping,
      sameAsBilling,
      billingFirstName,
      billingLastName,
      billingAddress,
      billingApartment,
      billingCity,
      billingState,
      billingZipCode,
      billingCountry,
      items
    } = body;

    if (!firstName || !lastName || !email || !address || !city || !state || !zipCode || !country || !items) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items must be a non-empty array' },
        { status: 400 }
      );
    }

    // Calculate total amount (simplified)
    const totalAmount = items.reduce((total, item) => {
      const price = item.price || 29.99; // Default price for diapers
      return total + price * item.quantity;
    }, 0);

    // Generate order ID
    const orderId = 'LB-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create customer name from first and last name
    const customerName = `${firstName} ${lastName}`;
    
    // Create shipping address
    const shippingAddressStr = `${address}${apartment ? `, ${apartment}` : ''}, ${city}, ${state} ${zipCode}, ${country}`;
    
    // Create billing address
    const billingMatchesShipping = sameAsShipping ?? sameAsBilling ?? true;
    const billingAddressStr = billingMatchesShipping ? shippingAddressStr : `${billingAddress}${billingApartment ? `, ${billingApartment}` : ''}, ${billingCity}, ${billingState} ${billingZipCode}, ${billingCountry}`;
    
    // Send order notification (this is for order confirmation tracking)
    const notificationData = {
      orderId,
      customerName,
      customerEmail: email,
      shippingAddress: shippingAddressStr,
      billingAddress: billingAddressStr,
      items: items.map(item => ({
        productId: item.productId,
        name: 'Diaper Package', // Simplified product name
        quantity: item.quantity,
        price: item.price || 29.99
      })),
      totalAmount,
      paymentMethod: 'Credit Card'
    };

    // Send notification asynchronously - don't await to not block response
    sendOrderNotification(notificationData).catch(error => {
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
