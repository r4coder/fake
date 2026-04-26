const axios = require("axios");

async function getMLScore(text) {
  try {
    const res = await axios.post(
      process.env.ML_API_URL || "http://localhost:8000/predict",
      { text }
    );

    // 🔥 Handle different ML API responses safely
    let prob =
      res.data.probability ??
      res.data.ml_score ??const axios = require("axios");

async function getMLScore(text) {
  try {
    const url = process.env.ML_API_URL;

    if (!url) {
      console.error("❌ ML_API_URL not set");
      return 50;
    }

    const res = await axios.post(
      url,
      { text },
      {
        timeout: 5000 // 🔥 prevent hanging requests
      }
    );

    // 🔥 Safe response parsing
    const data = res?.data || {};

    let prob =
      data.probability ??
      data.ml_score ??
      data.score ??
      0;

    // 🔥 Ensure it's a number
    if (typeof prob !== "number") {
      console.error("❌ Invalid ML response:", data);
      return 50;
    }

    // 🔥 Normalize (0–1 → 0–100)
    if (prob <= 1) prob = prob * 100;

    // 🔥 Clamp value
    return Math.min(100, Math.max(0, prob));

  } catch (err) {
    console.error("🔥 ML Service Error:", err.message);

    // 🔥 Safe fallback (no crash)
    return 50;
  }
}

module.exports = { getMLScore };      res.data.score ??
      0;

    // Convert to percentage if needed
    if (prob <= 1) prob = prob * 100;

    return Math.min(100, Math.max(0, prob));
  } catch (err) {
    console.error("ML Service Error:", err.message);

    // ❗ DO NOT use random — use safe fallback
    return 50; // neutral score
  }
}

module.exports = { getMLScore };
