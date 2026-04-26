function getRuleScore(text) {
  let score = 0;
  text = (text || "").toLowerCase();

  // =========================
  // 💸 PAYMENT / MONEY SCAMS
  // =========================
  if (
    text.includes("fee") ||
    text.includes("payment") ||
    text.includes("deposit") ||
    text.includes("registration") ||
    text.includes("amount")
  ) {
    score += 40;
  }

  // =========================
  // ⏰ URGENCY / PRESSURE
  // =========================
  if (
    text.includes("urgent") ||
    text.includes("limited") ||
    text.includes("hurry") ||
    text.includes("immediately") ||
    text.includes("act now")
  ) {
    score += 20;
  }

  // =========================
  // 📱 EXTERNAL CONTACT
  // =========================
  if (
    text.includes("whatsapp") ||
    text.includes("telegram") ||
    text.includes("contact hr")
  ) {
    score += 30;
  }

  // =========================
  // 💰 UNREALISTIC EARNINGS
  // =========================
  if (
    text.includes("earn") &&
    (text.includes("daily") || text.includes("per day"))
  ) {
    score += 25;
  }

  // =========================
  // 🎯 EASY JOB TRAPS
  // =========================
  if (
    text.includes("no experience") ||
    text.includes("no work") ||
    text.includes("easy job")
  ) {
    score += 15;
  }

  // =========================
  // 🎁 TOO GOOD TO BE TRUE
  // =========================
  if (
    text.includes("guaranteed") ||
    text.includes("bonus") ||
    text.includes("100% job")
  ) {
    score += 15;
  }

  // =========================
  // 🔐 PHISHING / OFFER LETTER
  // =========================
  if (
    text.includes("offer letter") ||
    text.includes("download offer") ||
    text.includes("download document")
  ) {
    score += 30;
  }

  if (
    text.includes("verify") ||
    text.includes("verification") ||
    text.includes("complete process")
  ) {
    score += 20;
  }

  // =========================
  // 💰 CRYPTO / INVESTMENT SCAMS
  // =========================
  if (
    text.includes("crypto") ||
    text.includes("bitcoin") ||
    text.includes("trading") ||
    text.includes("investment")
  ) {
    score += 35;
  }

  if (
    text.includes("guaranteed profit") ||
    text.includes("guaranteed returns")
  ) {
    score += 40;
  }

  return Math.min(score, 100);
}

module.exports = { getRuleScore };