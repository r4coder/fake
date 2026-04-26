const express = require("express");
const router = express.Router();

const { getRuleScore } = require("../utils/ruleEngine");
const { checkEmail } = require("../utils/emailCheck");
const { verifyCompany } = require("../utils/companyCheck");
const { getDomainScore } = require("../utils/domainCheck");
const { getBehaviorScore } = require("../utils/behaviorCheck");
const { highlightText } = require("../utils/highlight");
const { getMLScore } = require("../services/mlService");

// 🔥 Threshold config (easy tuning later)
const THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60
};

router.post("/", async (req, res) => {
  try {
    const { jobText = "", companyName = "", email = "" } = req.body;

    if (!jobText.trim()) {
      return res.status(400).json({ error: "Job description is required" });
    }

    const text = jobText.toLowerCase();

    // =========================
    // 🔹 PARALLEL SCORING (faster)
    // =========================
    const [
      companyScore,
      domainScore,
      mlScore
    ] = await Promise.all([
      verifyCompany(companyName),
      getDomainScore(email, companyName),
      getMLScore(jobText)
    ]);

    const ruleScore = getRuleScore(jobText);
    const emailScore = checkEmail(email, companyName);
    const behaviorScore = getBehaviorScore(jobText);

    // =========================
    // 🔥 NORMALIZATION (safety)
    // =========================
    const safeML = Math.min(100, Math.max(0, mlScore || 0));

    // =========================
    // 🔥 HYBRID SCORING (adaptive)
    // =========================
    let finalScore =
      safeML * 0.55 +
      ruleScore * 0.2 +
      emailScore * 0.1 +
      domainScore * 0.1 +
      behaviorScore * 0.05;

    // =========================
    // 🔥 HARD TRIGGERS (critical)
    // =========================

    // 💸 Payment + external contact
    if (
      (text.includes("whatsapp") || text.includes("telegram")) &&
      (text.includes("fee") || text.includes("payment"))
    ) {
      finalScore = Math.max(finalScore, 92);
    }

    // 📄 Offer letter phishing
    if (
      text.includes("offer") &&
      text.includes("download") &&
      (text.includes("deadline") || text.includes("24 hours"))
    ) {
      finalScore = Math.max(finalScore, 88);
    }

    // 💰 Crypto scam
    if (
      (text.includes("crypto") || text.includes("investment")) &&
      (text.includes("profit") || text.includes("returns"))
    ) {
      finalScore = Math.max(finalScore, 85);
    }

    // 💻 Reimbursement scam
    if (
      text.includes("purchase") &&
      text.includes("invoice")
    ) {
      finalScore = Math.max(finalScore, 85);
    }

    // =========================
    // 🔥 CONFIDENCE ADJUSTMENT
    // =========================

    // reduce false positives
    if (
      safeML < 30 &&
      ruleScore < 10 &&
      behaviorScore < 10
    ) {
      finalScore *= 0.7;
    }

    // boost strong agreement
    if (
      safeML > 70 &&
      (ruleScore > 20 || behaviorScore > 20)
    ) {
      finalScore += 10;
    }

    finalScore = Math.min(100, Math.max(0, finalScore));

    // =========================
    // 🔥 STATUS CLASSIFICATION
    // =========================
    let status = "Likely Real";

    if (finalScore >= THRESHOLDS.HIGH) {
      status = "Highly Likely Fake";
    } else if (finalScore >= THRESHOLDS.MEDIUM) {
      status = "Suspicious";
    }

    // =========================
    // 🔥 EXPLAINABILITY (clean)
    // =========================
    const reasons = [];

    if (safeML > 75)
      reasons.push("ML model strongly indicates fraud");

    if (ruleScore >= 30)
      reasons.push("Contains payment or scam-related keywords");

    if (ruleScore >= 10 && ruleScore < 30)
      reasons.push("Uses urgency or pressure language");

    if (emailScore > 0)
      reasons.push("Email domain mismatch or free provider");

    if (companyScore >= 20)
      reasons.push("Company credibility is low");

    if (domainScore >= 20)
      reasons.push("Suspicious or newly created domain");

    if (behaviorScore >= 15)
      reasons.push("Unusual hiring or onboarding process");

    if (text.includes("crypto"))
      reasons.push("Crypto-related job detected (high scam risk)");

    // =========================
    // 🔹 RESPONSE
    // =========================
    res.json({
      fraudScore: Math.round(finalScore),
      status,
      confidence: Math.round(safeML),
      reasons,
      highlightedText: highlightText(jobText),
      breakdown: {
        mlScore: Math.round(safeML),
        ruleScore,
        emailScore,
        companyScore,
        domainScore,
        behaviorScore
      }
    });

  } catch (err) {
    console.error("🔥 ANALYZE ERROR:", err);

    res.status(500).json({
      error: "Internal server error",
      details: err.message
    });
  }
});

module.exports = router;