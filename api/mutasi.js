// api/mutasi.js
// Vercel Function — proxy ke Arie Pulsa (cek status pembayaran)
// Deploy ke Vercel, lalu set env var: ARIE_APIKEY

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { kode_deposit } = req.body;

  if (!kode_deposit) {
    return res.status(400).json({ success: false, error: 'kode_deposit wajib diisi' });
  }

  const ARIE_APIKEY = process.env.ARIE_APIKEY;

  if (!ARIE_APIKEY) {
    return res.status(500).json({ success: false, error: 'API key tidak dikonfigurasi' });
  }

  try {
    const url = `https://cekid-ariepulsa.my.id/qris/?action=get-mutasi`
      + `&kode=${encodeURIComponent(kode_deposit)}`
      + `&apikey=${encodeURIComponent(ARIE_APIKEY)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ success: false, error: 'Response bukan JSON', raw: text.substring(0, 200) });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ success: false, error: 'Gagal menghubungi Arie Pulsa: ' + err.message });
  }
}
