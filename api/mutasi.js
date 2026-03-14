module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { kode_deposit } = req.body;
  if (!kode_deposit) {
    return res.status(400).json({ success: false, error: 'kode_deposit wajib diisi' });
  }

  const ARIE_APIKEY = process.env.ARIE_APIKEY;
  const https = require('https');

  try {
    const url = `https://ariepulsa.my.id/api/qrisrealtime?action=get-mutasi&kode=${encodeURIComponent(kode_deposit)}&apikey=${encodeURIComponent(ARIE_APIKEY)}`;

    const result = await new Promise((resolve, reject) => {
      https.get(url, (r) => {
        let data = '';
        r.on('data', chunk => data += chunk);
        r.on('end', () => resolve({ status: r.statusCode, body: data }));
      }).on('error', reject);
    });

    let parsed;
    try { parsed = JSON.parse(result.body); }
    catch { return res.status(502).json({ success: false, error: 'Response bukan JSON', raw: result.body.substring(0, 200) }); }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Gagal menghubungi Arie Pulsa: ' + err.message });
  }
}
