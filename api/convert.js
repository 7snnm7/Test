function convert(q) {
  if (!q || q.trim().split(/\s+/).length === 1)
    return "check out my creator twitch.tv/HassanNM7";

  // Arabic → English mapping
  const mapping = {
    "ا": "a", "ب": "b", "ت": "t", "ث": "th", "ج": "j", "ح": "h", "خ": "kh",
    "د": "d", "ذ": "th", "ر": "r", "ز": "z", "س": "s", "ش": "sh", "ص": "s",
    "ض": "d", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f", "ق": "q",
    "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h", "و": "w", "ي": "y",
    "ء": "'", "ى": "a", "ة": "h", "ؤ": "u", "ئ": "e"
  };

  const hasArabic = /[\u0600-\u06FF]/.test(q);
  if (!hasArabic) return "check out my creator twitch.tv/HassanNM7";

  const converted = q
    .split("")
    .map(ch => mapping[ch] || ch)
    .join("");

  // Special direct translations for known words
  const directMap = {
    "اه": "Hi",
    "سلام": "Hello",
    "هلا": "Hey",
    "باي": "Bye",
    "تمام": "Good",
    "شكرا": "Thanks",
    "احبك": "Love you",
    "شلونك": "How are you?",
    "وينك": "Where are you?",
    "ليش": "Why?",
    "تصبح": "Good night"
  };

  return directMap[q.trim()] || converted;
}

convert(q);