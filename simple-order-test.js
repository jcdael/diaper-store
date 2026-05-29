// Simple test to verify the webhook system is working
console.log('Testing Discord webhook system...');

// Test the webhook directly
const webhookUrl = "https://discord.com/api/webhooks/1504591832875536426/vPWXd2rntoErICwwq4Y4cRJW1aAqvNojoRoSBOGoBG4Mys2zB1hDDWQFe134HsJ5zzVt";

async function testWebhook() {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: 'Test notification from diaperstoreABACUS - system check',
        embeds: [{
          title: 'System Diagnostic Test',
          description: 'This is a test to verify Discord webhook functionality is working',
          color: 5814783,
          fields: [
            {
              name: 'Test Type',
              value: 'Webhook connectivity test',
              inline: true
            },
            {
              name: 'Timestamp',
              value: new Date().toISOString(),
              inline: true
            },
            {
              name: 'Status',
              value: 'Testing...',
              inline: true
            }
          ]
        }]
      })
    });

    if (response.status === 204) {
      console.log('✅ Discord webhook is working correctly');
      console.log('✅ Response status: 204 (No Content)');
      console.log('✅ Webhook is ready to receive notifications');
    } else {
      console.log(`⚠️ Unexpected response status: ${response.status}`);
      console.log('This might indicate the webhook URL is incorrect or Discord is having issues');
    }
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
    console.error('This could be due to:');
    console.error('1. Network connectivity issues');
    console.error('2. Invalid webhook URL');
    console.error('3. Discord API issues');
  }
}

testWebhook();