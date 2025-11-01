function convert(q) {
  // promo for single token (one word / one letter)
  if (!q || q.trim().split(/\s+/).length === 1) {
    return "check out my creator twitch.tv/HassanNM7";
  }

  // english -> arabic mapping (your original)
  const enToAr = {
    q: "ض", w: "ص", e: "ث", r: "ق", t: "ف", y: "غ", u: "ع", i: "ه", o: "خ", p: "ح",
    "[": "ج", "]": "د", a: "ش", s: "س", d: "ي", f: "ب", g: "ل", h: "ا", j: "ت",
    k: "ن", l: "م", ";": "ك", "'": "ط", z: "ئ", x: "ء", c: "ؤ", v: "ر", b: "لا",
    n: "ى", m: "ة", ",": "و", ".": "ز", "/": "ظ"
  };

  // build arabic -> english by inverting enToAr (taking care of multi-char values like "لا")
  const arToEn = {};
  for (const key in enToAr) {
    const val = enToAr[key];
    // if Arabic value length >1 (like "لا") map that exact sequence to the english key
    arToEn[val] = key;
  }

  // detect Arabic presence
  const hasArabic = /[\u0600-\u06FF]/.test(q);

  if (hasArabic) {
    // transliterate Arabic -> English
    // We need to handle the "لا" two-letter sequence first to avoid splitting it
    // We'll scan the string and greedily match 2-char then 1-char.
    const chars = [];
    for (let i = 0; i < q.length; i++) {
      // try two-char Arabic ligature (like لا)
      const two = q.slice(i, i + 2);
      if (two && arToEn[two]) {
        chars.push(arToEn[two]);
        i++; // skip extra char
        continue;
      }
      const one = q[i];
      if (arToEn[one]) chars.push(arToEn[one]);
      else chars.push(one); // keep untouched (spaces, punctuation)
    }
    return chars.join("");
  } else {
    // transliterate English -> Arabic
    // preserve case? we'll convert to lower for mapping, but keep original char if not in map
    return q
      .split("")
      .map(ch => {
        const lower = ch.toLowerCase();
        return enToAr.hasOwnProperty(lower) ? enToAr[lower] : ch;
      })
      .join("");
  }
}

convert(q);