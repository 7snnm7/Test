function convert(q) {
  const arToEn = {
    ض: "q", ص: "w", ث: "e", ق: "r", ف: "t", غ: "y", ع: "u", ه: "i", خ: "o", ح: "p",
    ج: "[", د: "]", ش: "a", س: "s", ي: "d", ب: "f", ل: "g", ا: "h", ت: "j",
    ن: "k", م: "l", ك: ";", ط: "'", ئ: "z", ء: "x", ؤ: "c", ر: "v", لا: "b",
    ى: "n", ة: "m", و: ",", ز: ".", ظ: "/"
  };

  const enToAr = {};
  for (const [key, val] of Object.entries(arToEn)) {
    enToAr[val] = key;
  }

  q = q.trim();
  if (!q) return "check out my creator twitch.tv/HassanNM7";

  const hasArabic = /[\u0600-\u06FF]/.test(q);

  if (hasArabic) {
    // Arabic → English
    return q
      .split("")
      .map((char) => arToEn[char] || char)
      .join("");
  } else {
    // English → Arabic
    return q
      .split("")
      .map((char) => enToAr[char.toLowerCase()] || char)
      .join("");
  }
}

var result = convert(q);
result;