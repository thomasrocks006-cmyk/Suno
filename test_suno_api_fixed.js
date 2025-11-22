const API_BASE_URL = 'https://api.sunoapi.org/api/v1';
const API_KEY = '72e1e9376958f8249913c44e21666c4a';

async function testSunoAPI() {
    console.log('Testing Suno API with callback URL...');
    
    try {
        const payload = {
            prompt: "A simple test song about debugging",
            style: "pop, upbeat",
            title: "Test Song",
            customMode: false,
            instrumental: false,
            model: "V4",
            callBackUrl: "https://webhook.site/placeholder"
        };
        
        console.log('\nPayload:', JSON.stringify(payload, null, 2));
        
        const response = await fetch(`${API_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        console.log('\nResponse Status:', response.status);
        
        const text = await response.text();
        const json = JSON.parse(text);
        console.log('\nResponse:', JSON.stringify(json, null, 2));
        
        if (json.code === 200) {
            console.log('\n✅ Success! Task ID:', json.data?.taskId);
        } else {
            console.error('\n❌ Error:', json.msg);
        }
        
    } catch (error) {
        console.error('\n❌ Exception:', error.message);
    }
}

testSunoAPI();
