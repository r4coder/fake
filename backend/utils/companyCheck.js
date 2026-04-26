const axios = require("axios");

async function searchCompany(query) {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
    const res = await axios.get(url, { timeout: 3000 });

    return res.data.RelatedTopics?.length || 0;
  } catch {
    return 0;
  }
}

async function verifyCompany(companyName) {
  let score = 0;

  const q1 = await searchCompany(companyName);
  const q2 = await searchCompany(companyName + " linkedin");
  const q3 = await searchCompany(companyName + " company");
  const q4 = await searchCompany(companyName + " careers");

  const total = q1 + q2 + q3 + q4;

  if (total > 15) score = 0;
  else if (total > 5) score = 10;
  else score = 25;

  return score;
}

module.exports = { verifyCompany };