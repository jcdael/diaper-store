// Test the API endpoint to verify notifications work
const fetch = require('node-fetch');

const testOrder = {
  firstName: 'test',
  lastName: 'user',
  email: 'test@example.com',
  phone: '5551234567',
  address: '123 Test St',
  apartment: '',
  city: 'Test City',
  state: 'TS',
  zipCode: '12345',
  country: 'Test Country',
  billingAddress: '123 Test St',
  billingCity: 'Test City',
  billingState: 'TS',
  billingZipCode: '12345',
  billingCountry: 'Test Country',
  items: [
    {
      name: 'Test Product',
      quantity: 1,
      price: 23.95
    }
  ],
  total: 23.95,
  cardName: 'test user',
  cardNumber: '4111111111111111',
  cardExpiry: '12/30',
  cardCvv: '123'
};

async function testApi() {
  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });
    
    const data = await response.json();
    console.log('API Response:', data);
    console.log('✅ API test completed');
  } catch (error) {
    console.error('API test failed:', error);
  }
}

// Check if we're in development mode
console.log('Note: This test requires the dev server to be running on localhost:3000');
console.log('Run "npm run dev" first, then run this test');
console.log('\nTest order data preview:', JSON.stringify(testOrder, null, 2));