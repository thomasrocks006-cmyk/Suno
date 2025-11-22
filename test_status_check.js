const API_BASE_URL = 'https://api.sunoapi.org/api/v1';
const API_KEY = '72e1e9376958f8249913c44e21666c4a';

// Use the task ID from our previous successful test
const taskId = '78b84141e64d582b48c2d115fbf0f0ec';

async function checkStatus() {
    console.log('Checking task status...');
    console.log('Task ID:', taskId);
    
    try {
        const url = `${API_BASE_URL}/generate/record-info?taskId=${taskId}`;
        console.log('\nRequest URL:', url);
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        });
        
        console.log('Response Status:', response.status);
        
        const json = await response.json();
        console.log('\nFull Response:', JSON.stringify(json, null, 2));
        
        if (json.code === 200 && json.data) {
            console.log('\n--- Status Info ---');
            console.log('Status:', json.data.status);
            console.log('Task ID:', json.data.taskId);
            
            if (json.data.response?.data?.[0]) {
                const track = json.data.response.data[0];
                console.log('\n--- Track Info ---');
                console.log('Title:', track.title);
                console.log('Audio URL:', track.audio_url);
                console.log('Duration:', track.duration);
            }
            
            if (json.data.errorMessage) {
                console.log('\n❌ Error Message:', json.data.errorMessage);
            }
        }
        
    } catch (error) {
        console.error('\n❌ Exception:', error.message);
    }
}

checkStatus();
