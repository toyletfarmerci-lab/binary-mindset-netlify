// Netlify serverless proxy: keeps OTCHARTS_API_KEY out of browser code.
exports.handler = async (event) => {
  const apiKey = process.env.OTCHARTS_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Missing OTCHARTS_API_KEY environment variable in Netlify." }) };
  }

  const params = event.queryStringParameters || {};
  const symbol = params.symbol || "EURUSD_otc";
  const allowed = new Set(["EURUSD_otc", "GBPUSD_otc", "USDJPY_otc", "AUDUSD_otc", "EURGBP_otc", "USDCHF_otc"]);
  if (!allowed.has(symbol)) {
    return { statusCode: 400, headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Unsupported OTC symbol." }) };
  }

  const limit = Math.min(100, Math.max(22, Number.parseInt(params.limit || "50", 10) || 50));
  const url = new URL("https://otcharts.com/v1/candles");
  url.search = new URLSearchParams({ venue: "quotex", symbol, tf: "60", limit: String(limit) }).toString();

  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: { "Authorization": `Bearer ${apiKey}`, "Accept": "application/json" }
    });
    const raw = await upstream.text();
    let payload;
    try { payload = JSON.parse(raw); }
    catch { payload = { error: "OTCharts returned a non-JSON response." }; }

    return {
      statusCode: upstream.status,
      headers: { "content-type": "application/json", "cache-control": "no-store" },
      body: JSON.stringify(payload)
    };
  } catch (err) {
    return { statusCode: 502, headers: { "content-type": "application/json" },
      body: JSON.stringify({ error: "Could not reach OTCharts. Check network and API availability." }) };
  }
};
