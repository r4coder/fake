function extractDomain(email) {
  return email.split("@")[1].toLowerCase();
}

async function getDomainScore(email, companyName) {
  let score = 0;

  const domain = extractDomain(email);
  const company = companyName.toLowerCase();

  // 🚨 1. Free email providers
  if (
    domain.includes("gmail.com") ||
    domain.includes("yahoo.com") ||
    domain.includes("outlook.com")
  ) {
    score += 20;
  }

  // 🚨 2. Domain does not match company name
  if (!domain.includes(company)) {
    score += 15;
  }

  // 🚨 3. Suspicious patterns (hyphens etc.)
  if (domain.includes("-")) {
    score += 10;
  }

  // 🚨 4. Too long / weird domains
  if (domain.length > 25) {
    score += 10;
  }

  return score;
}

module.exports = { getDomainScore };