function convert(q) {
  const mapping = {
    q: "q"
  };

  const hasArabic = /[\u0600-\u06FF]/.test(q);

  if (hasArabic) {
    return "Input should be in English, so I’ll shoutout my creator, check out twitch.tv/HassanNM7 :D";
  }

  const converted = q
    .split("")
    .map((char) => mapping[char.toLowerCase()] || char)
    .join("");

  return converted;
}

var result = convert(q);
result;