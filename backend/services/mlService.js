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
      res.data.ml_score ??
      res.data.score ??
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