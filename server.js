const express = require('express');
const https   = require('https');

const app = express();
app.use(express.json({ limit: '10mb' }));

function httpsPost(hostname, urlPath, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req  = https.request(
      { hostname, path: urlPath, method: 'POST',
        headers: { ...headers, 'Content-Length': Buffer.byteLength(data) } },
      res => {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Claude 프록시
app.post('/api/claude', async (req, res) => {
  try {
    const { apiKey, ...payload } = req.body;
    const result = await httpsPost(
      'api.anthropic.com', '/v1/messages',
      { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      payload
    );
    res.status(result.status).type('json').send(result.body);
  } catch (e) {
    res.status(500).json({ error: { message: e.message } });
  }
});


if (require.main === module) {
  app.use(express.static(__dirname));
  const PORT = process.env.PORT || 3333;
  app.listen(PORT, () => {
    console.log('\n  범표원두 SNS 콘텐츠 생성기');
    console.log('  ─────────────────────────────────');
    console.log('  브라우저: http://localhost:' + PORT);
    console.log('  종료: Ctrl + C\n');
  });
}

module.exports = app;
