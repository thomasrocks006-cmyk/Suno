const fetch = require('node-fetch');

const API_KEY = process.env.VITE_SUNO_API_KEY || 'sk-93b7d98ec69449e6b577569bd8fa5e18';

console.log('=== Suno Audio Generation Test ===');
console.log('API Key present:', !!API_KEY);
console.log('API Key length:', API_KEY ? API_KEY.length : 0);

if (!API_KEY) {
  console.error('❌ VITE_SUNO_API_KEY not found in environment');
  process.exit(1);
}

// Test a simple generation
(async () => {
  try {
    console.log('\n📤 Sending generation request...');
    const response = await fetch('https://api.sunoapi.org/api/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'Test lyrics verse one\nTest lyrics verse two',
        style: 'Pop, Upbeat',
        title: 'Test Song',
        customMode: true,
        instrumental: false,
        model: 'V4',
        callBackUrl: 'https://webhook.site/test'
      })
    });

    console.log('Response Status:', response.status);
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.code === 200 && data.data.taskId) {
      console.log('\n✅ Generation started successfully');
      console.log('Task ID:', data.data.taskId);
      
      // Wait and check status
      console.log('\n⏳ Waiting 5 seconds before checking status...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log('📥 Checking task status...');
      const statusResponse = await fetch(`https://api.sunoapi.org/api/v1/generate/record-info?taskId=${data.data.taskId}`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      });
      
      const statusData = await statusResponse.json();
      console.log('Status Response:', JSON.stringify(statusData, null, 2));
      
    } else {
      console.error('❌ Generation failed');
      console.error('Error details:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
})();
