const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
// Using a mock token since authMiddleware is present - server might need to be in dev mode to bypass if we can't get a real token easily
const MOCK_TOKEN = 'test-token'; 

const testCases = [
  { name: 'SAFE INPUT', input: 'https://google.com' },
  { name: 'SUSPICIOUS INPUT', input: 'https://suspicious-site-example.pw' },
  { name: 'HIGH-RISK INPUT', input: 'URGENT: Your account is suspended. Click here to verify: http://bit.ly/fake-login-secure' }
];

async function runTests() {
  console.log('🚀 Starting Runtime Detection & AI Verification...\n');

  for (const tc of testCases) {
    console.log(`Testing: ${tc.name} [${tc.input.substring(0, 30)}...]`);
    try {
      const start = Date.now();
      const response = await axios.post(`${BASE_URL}/scan/unified`, 
        { input: tc.input },
        { 
          headers: { 
            'Authorization': `Bearer ${MOCK_TOKEN}`,
            'x-test-bypass': 'true'
          },
          timeout: 20000 
        }
      ).catch(e => e.response);

      const duration = Date.now() - start;

      if (response?.status === 200) {
        const data = response.data;
        console.log(`✅ Success (${duration}ms)`);
        console.log(`   Score: ${data.riskScore}/100`);
        console.log(`   Confidence: ${data.confidence?.level} (${data.confidence?.score}%)`);
        console.log(`   AI Result: ${data.aiExplanation ? 'PRESENT' : 'MISSING'}`);
        if (data.aiExplanation) {
          console.log(`   AI Snippet: ${data.aiExplanation.substring(0, 100)}...`);
        }
      } else {
        console.log(`❌ Failed: HTTP ${response?.status} - ${JSON.stringify(response?.data)}`);
      }
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }
    console.log('--------------------------------------------------\n');
  }
  process.exit(0);
}

// Check if server is up
axios.get(`${BASE_URL}/health`)
  .then(() => runTests())
  .catch(() => {
    console.error('❌ Server is not running on http://localhost:5000. Start it first.');
    process.exit(1);
  });
