function getBehaviorScore(text) {
  let score = 0;
  text = (text || "").toLowerCase();

  // =========================
  // 🚫 NO PROPER HIRING PROCESS
  // =========================
  if (text.includes("no interview")) score += 25;
  if (text.includes("direct selection")) score += 25;
  if (text.includes("instant joining")) score += 20;
  if (text.includes("without interview")) score += 25;

  // =========================
  // 💻 SUSPICIOUS DOWNLOAD / ONBOARDING
  // =========================
  if (text.includes("download")) score += 20;

  if (text.includes("download") && text.includes("software")) {
    score += 20;
  }

  // =========================
  // 💸 REIMBURSEMENT SCAMS
  // =========================
  if (
    text.includes("purchase") &&
    (text.includes("submit") || text.includes("invoice"))
  ) {
    score += 25;
  }

  // =========================
  // ⏳ DEADLINE / PRESSURE
  // =========================
  if (
    text.includes("within 24 hours") ||
    text.includes("deadline") ||
    text.includes("expire") ||
    text.includes("expires")
  ) {
    score += 25;
  }

  // =========================
  // 📩 FAKE ONBOARDING FLOW
  // =========================
  if (
    text.includes("complete onboarding") ||
    text.includes("confirm your job") ||
    text.includes("complete verification")
  ) {
    score += 20;
  }

  return Math.min(score, 100);
}

module.exports = { getBehaviorScore };