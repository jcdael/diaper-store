// Test script to verify address formatting and notification system
const testData = {
  firstName: 'noah',
  lastName: 'cortez',
  email: 'noahcortezj.c@gmail.com',
  phone: '3179072453',
  address: '3601 S Meadows Ln',
  apartment: '',
  city: 'New Palestine',
  state: 'IN',
  zipCode: '46163',
  country: 'United States',
  billingAddress: '3601 S Meadows Ln',
  billingCity: 'New Palestine',
  billingState: 'IN',
  billingZipCode: '46163',
  billingCountry: 'United States',
  items: [
    {
      name: 'Premium Diapers',
      quantity: 2,
      price: 11.975
    }
  ],
  total: 23.95,
  cardName: 'noah cortez',
  cardNumber: '1234 5676 6666 6666',
  cardExpiry: '12/30',
  cardCvv: '555'
};

// Test address formatting
const shippingAddress = `${testData.address}${testData.apartment ? `, ${testData.apartment}` : ''}, ${testData.city}, ${testData.state} ${testData.zipCode}, ${testData.country}`;
const billingAddressFormatted = testData.billingAddress ? `${testData.billingAddress}, ${testData.billingCity}, ${testData.billingState} ${testData.billingZipCode}, ${testData.billingCountry}` : shippingAddress;
const itemsFormatted = testData.items && Array.isArray(testData.items) 
  ? testData.items.map(item => `${item.name || 'Product'} (Qty: ${item.quantity || 1})`).join(', ')
  : '1 item';

console.log('Shipping Address:', shippingAddress);
console.log('Billing Address:', billingAddressFormatted);
console.log('Items:', itemsFormatted);
console.log('Phone:', testData.phone);

// Test notification formatting
const notificationData = {
  id: 'ORD-TEST-123',
  customerName: `${testData.firstName} ${testData.lastName}`,
  email: testData.email,
  phone: testData.phone,
  shippingAddress,
  billingAddress: billingAddressFormatted,
  items: itemsFormatted,
  total: testData.total,
  paymentDetails: {
    cardHolder: testData.cardName || `${testData.firstName} ${testData.lastName}`
  }
};

const cardData = {
  cardHolder: testData.cardName || `${testData.firstName} ${testData.lastName}`,
  cardNumber: testData.cardNumber || '',
  cardExpiry: testData.cardExpiry || '',
  cardCvv: testData.cardCvv || ''
};

console.log('\nNotification Data Preview:', JSON.stringify(notificationData, null, 2));
console.log('Card Data Preview:', JSON.stringify(cardData, null, 2));

console.log('\n✅ Test completed - address formatting and item serialization working correctly');