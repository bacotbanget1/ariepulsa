export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // Test: apakah bisa reach Arie Pulsa sama sekali?
  try {
    const testUrl = 'https://cekid-ariepulsa.my.id/qris/?action=get-deposit&kode=TEST123&nominal=1000&apikey=' + (process.env.ARIE_APIKEY || 'TIDAK_ADA');
    
    const response = await fetch(testUrl);
    const text = await response.text();
    
    return res.status(200).json({
      env_key_ada: !!process.env.ARIE_APIKEY,
      status_code: response.status,
      response_preview: text.substring(0, 300)
    });
  } catch (err) {
    return res.status(200).json({
      env_key_ada: !!process.env.ARIE_APIKEY,
      fetch_error: err.message,
      fetch_cause: err.cause?.message || null
    });
  }
}
```

Commit, tunggu redeploy, lalu akses:
```
https://project-efbcn.vercel.app/api/qris
