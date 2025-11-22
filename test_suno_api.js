const API_BASE_URL = 'https://api.sunoapi.org/api/v1';
const API_KEY = '72e1e9376958f8249913c44e21666c4a';

async function testSunoAPI() {
    console.log('Testing Suno API...');
    console.log('API Key:', API_KEY.substring(0, 10) + '...');
    
    try {
        // Test with a simple request
        const payload = {
            prompt: "A simple test song about debugging",
            style: "pop, upbeat",
            title: "Test Song",
            customMode: false,
            instrumental: false,
            model: "V4"
        };
        
        console.log('\nSending request to:', `${API_BASE_URL}/generate`);
        console.log('Payload:', JSON.stringify(payload, null, 2));
        
        const response = await fetch(`${API_BASE_URL}/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        console.log('\nResponse Status:', response.status);
        console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
        
        const text = await response.text();
        console.log('\nResponse Body (raw):', text);
        
        try {
            const json = JSON.parse(text);
            console.log('\nResponse Body (parsed):', JSON.stringify(json, null, 2));
            
            if (json.code !== 200) {
                console.error('\n❌ API returned error code:', json.code);
                console.error('Error message:', json.msg);
            } else {
                console.log('\n✅ API call successful!');
                console.log('Task ID:', json.data?.taskId);
            }
        } catch (e) {
            console.error('\n❌ Failed to parse JSON response');
        }
        
    } catch (error) {
        console.error('\n❌ Error during API call:', error);
        console.error('Error details:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
    }
}

testSunoAPI();
