function highlightText(text) {
  const keywords = ["fee", "payment", "urgent", "whatsapp"];

  let result = text;

  keywords.forEach(word => {
    const regex = new RegExp(`(${word})`, "gi");
    result = result.replace(regex, "<mark>$1</mark>");
  });

  return result;
}

module.exports = { highlightText };