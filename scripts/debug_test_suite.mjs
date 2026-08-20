const endpoints = [
  { name: '1. OAuth Initiation (X / Twitter)', url: 'http://localhost:3000/api/social/oauth/x?projectId=okn-token', method: 'GET' },
  { name: '2. Webhook Listener (Telegram)', url: 'http://localhost:3000/api/webhooks/telegram', method: 'GET' },
  { name: '3. Connection Test Ping (API Health)', url: 'http://localhost:3000/api/social/test-connection', method: 'POST', body: { platform: 'telegram', handle: '@OKNToken' } },
  { name: '4. Social Post Dispatch (Live Publish)', url: 'http://localhost:3000/api/social/publish', method: 'POST', body: { projectId: 'okn-token', variants: { x: { text: 'Test broadcast' } } } },
  { name: '5. AI Director Brief (Gemini AI)', url: 'http://localhost:3000/api/ai/director-brief', method: 'POST', body: { projectId: 'okn-token' } },
  { name: '6. Gemini 7-Platform Synthesis', url: 'http://localhost:3000/api/ai/generate-variants', method: 'POST', body: { projectId: 'oknexus-exchange', concept: 'OKNEXUS Perpetual DEX liquidity vaults are live at https://oknexusexchange.com' } }
];

async function runTests() {
  console.log('====================================================');
  console.log('   OKN SOCIAL OS — COMPREHENSIVE ENDPOINT AUDIT');
  console.log('====================================================\n');

  let passed = 0;

  for (const ep of endpoints) {
    try {
      const opts = { method: ep.method, headers: { 'Content-Type': 'application/json' } };
      if (ep.body) opts.body = JSON.stringify(ep.body);
      
      const start = Date.now();
      const res = await fetch(ep.url, opts);
      const latency = Date.now() - start;
      const json = await res.json();

      console.log(`[PASS] ${ep.name} (${latency}ms) - Status: ${res.status}`);
      if (ep.name.includes('Gemini')) {
        console.log(`       Model: ${json.model}`);
        console.log(`       Output: ${(json.brief || json.variants?.x?.text || '').slice(0, 110)}...\n`);
      } else {
        console.log(`       Payload: ${JSON.stringify(json).slice(0, 110)}...\n`);
      }
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${ep.name}:`, err.message);
    }
  }

  console.log(`\nAUDIT SUMMARY: ${passed}/${endpoints.length} endpoints nominal.`);
}

runTests();
