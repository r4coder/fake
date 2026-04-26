function checkEmail(email, company) {
  email = email.toLowerCase();
  company = company.toLowerCase();

  if (email.includes("gmail.com")) return 20;
  if (!email.includes(company)) return 15;

  return 0;
}

module.exports = { checkEmail };