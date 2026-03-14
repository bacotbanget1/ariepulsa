module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const testUrl = 'https://cekid-ariepulsa.my.id/qris/?action=get-deposit&kode=TEST123&nominal=1000&apikey=' + (process.env.ARIE_APIKEY || 'TIDAK_ADA');
    
    const https = require('https');
    const result = await new Promise((resolve, reject) => {
      https.get(testUrl, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ status: r.statusCode, body: data }));
      }).on('error', reject);
    });

    return res.status(200).json({
      env_key_ada: !!process.env.ARIE_APIKEY,
      status_code: result.status,
      response_preview: result.body.substring(0, 300)
    });
  } catch (err) {
    return res.status(200).json({
      env_key_ada: !!process.env.ARIE_APIKEY,
      error: err.message
    });
  }
}
