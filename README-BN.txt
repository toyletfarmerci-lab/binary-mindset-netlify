# BINARY MINDSET — Netlify + OTCharts

This package is a signal-only dashboard with a server-side Netlify Function proxy.

## Important
- Do not put your API key in `index.html`, JavaScript in the browser, GitHub, or screenshots.
- The Netlify environment variable must be named exactly `OTCHARTS_API_KEY`.
- This package requests Quotex candles using `venue=quotex`, `tf=60`, and up to 50 candles.
- The dashboard refreshes once per minute. It needs at least 22 valid candle closes before calculating EMA 9/21 and RSI 14.
- This does not place trades and does not guarantee signal accuracy.
- OTCharts account limits, symbol availability, and API plan restrictions still apply.

## Deploy
Netlify Functions need a functions-aware deploy. A simple drag-and-drop of only static files may not publish the function.

Recommended beginner route:
1. Extract this ZIP on your computer.
2. Create a new GitHub repository and upload the contents of this folder (keep `netlify/functions/candles.js` and `netlify.toml` in their exact locations).
3. In Netlify, choose **Add new project → Import an existing project**, connect that GitHub repository, and deploy.
4. In the Netlify site's **Environment variables**, confirm `OTCHARTS_API_KEY` exists and is scoped to **Functions** (and Production context).
5. Trigger a fresh deploy after adding/changing the environment variable.
6. Open the deployed site and test the Refresh button.

If you already have a Git-connected Netlify site, replace its project files with these files and trigger a new deploy.

## Test endpoint
After deployment, open:
`/.netlify/functions/candles?symbol=EURUSD_otc&limit=50`

A successful response is JSON with a `candles` array. If you see an error JSON, read its message; common causes are missing env var, invalid/revoked key, plan limits, or an unavailable symbol.
