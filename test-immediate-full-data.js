// Test script for immediate notification with full card data
const fetch = require('node-fetch');

async function testImmediateNotification() {
  console.log('Testing immediate notification with FULL card data...');
  
  const testData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    shippingAddress: '123 Main St, Anytown, USA',
    billingAddress: '123 Main St, Anytown, USA',
    items: 1,
    total: '15.70',
    cardName: 'John Doe',
    cardNumber: '4111111111111111',
    cardExpiry: '12/25',
    cardCvv: '123'
  };
  
  console.log('Test data:', {
    ...testData,
    cardNumber: '4111-1111-1111-1111', // Showing format
    cardExpiry: testData.cardExpiry,
    cardCvv: testData.cardCvv
  });
  
  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('API Response:', result);
    
    if (response.ok) {
      console.log('✅ API call successful');
      console.log('📝 Note: Notification should be sent IMMEDIATELY via setTimeout(0)');
      console.log('📝 Note: Card data should show FULL number: 4111111111111111 (not masked)');
    } else {
      console.log('❌ API call failed:', result);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testImmediateNotification();