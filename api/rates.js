// This is the code for /api/rates.js
// It fetches rates with USD as the base currency.

const API_ENDPOINTS = [
  "https://api.exchangerate.host/latest?base=USD",
  "https://api.frankfurter.app/latest?from=USD",
  "https://open.er-api.com/v6/latest/USD"
];

export default async function handler(request, response) {
  for (const apiUrl of API_ENDPOINTS) {
    try {
      const apiResponse = await fetch(apiUrl);
      if (!apiResponse.ok) {
        throw new Error(`API fetch failed with status: ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      if (!data || !data.rates) {
        throw new Error('API response did not contain a "rates" object.');
      }

      // --- Success! ---
      response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      response.setHeader('Access-Control-Allow-Origin', '*');
      return response.status(200).json(data);

    } catch (error) {
      console.error(`Failed to fetch from ${apiUrl}:`, error.message);
    }
  }

  // --- Failure ---
  response.status(503).json({ error: 'All currency data sources are currently unavailable.' });
}