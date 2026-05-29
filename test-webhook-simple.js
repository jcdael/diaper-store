// Simple test for Discord webhook
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const webhookUrl = 'https://discord.com/api/webhooks/1504591832875536426/vPWXd2rntoErICwwq4Y4cRJW1aAqvNojoRoSBOGoBG4Mys2zB1hDDWQFe134HsJ5zzVt';

async function test() {
    console.log('Testing Discord webhook...');
    
    const payload = {
        content: 'Test notification from diaper store system',
        embeds: [
            {
                title: 'Test Notification',
                description: 'Testing if webhook is working',
                color: 5814783,
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
            body: JSON.stringify(payload)
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
            console.log('✅ Webhook is working!');
        } else {
            console.log('❌ Webhook failed with status:', response.status);
        }
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

test();