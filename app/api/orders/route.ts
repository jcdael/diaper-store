export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName, lastName, email, phone,
      address, apartment, city, state, zipCode, country,
      sameAsBilling,
      billingFirstName, billingLastName,
      billingAddress, billingApartment, billingCity,
      billingState, billingZipCode, billingCountry,
      orderNotes, promoCode,
      items, subtotal, discount, shipping, tax, total,
    } = body ?? {};

    if (!firstName || !lastName || !email || !address || !city || !state || !zipCode || !country) {
      return NextResponse.json({ error: 'Missing required shipping fields' }, { status: 400 });
    }

    if (!items || (items?.length ?? 0) === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const orderNumber = `LB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        firstName,
        lastName,
        email,
        phone: phone ?? '',
        address,
        apartment: apartment ?? '',
        city,
        state,
        zipCode,
        country,
        sameAsBilling: sameAsBilling ?? true,
        billingFirstName: billingFirstName ?? '',
        billingLastName: billingLastName ?? '',
        billingAddress: billingAddress ?? '',
        billingApartment: billingApartment ?? '',
        billingCity: billingCity ?? '',
        billingState: billingState ?? '',
        billingZipCode: billingZipCode ?? '',
        billingCountry: billingCountry ?? '',
        orderNotes: orderNotes ?? '',
        promoCode: promoCode ?? '',
        subtotal: subtotal ?? 0,
        discount: discount ?? 0,
        shipping: shipping ?? 0,
        tax: tax ?? 0,
        total: total ?? 0,
        items: {
          create: (items ?? []).map((item: any) => ({
            productId: item?.productId ?? '',
            quantity: item?.quantity ?? 1,
            price: item?.price ?? 0,
            name: item?.name ?? '',
          })),
        },
      },
    });

    return NextResponse.json({ orderNumber: order?.orderNumber, orderId: order?.id });
  } catch (error: any) {
    console.error('Order API error:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
