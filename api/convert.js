var q = q || "";
q = q.trim();

// if no input or single word
if (!q || q.split(/\s+/).length === 1) {
  "check out my creator twitch.tv/HassanNM7";
} else {
  var enToAr = {
    q: "ض", w: "ص", e: "ث", r: "ق", t: "ف", y: "غ", u: "ع", i: "ه", o: "خ", p: "ح",
    "[": "ج", "]": "د", a: "ش", s: "س", d: "ي", f: "ب", g: "ل", h: "ا", j: "ت",
    k: "ن", l: "م", ";": "ك", "'": "ط", z: "ئ", x: "ء", c: "ؤ", v: "ر", b: "لا",
    n: "ى", m: "ة", ",": "و", ".": "ز", "/": "ظ"
  };

  var arToEn = {};
  for (var key in enToAr) {
    var val = enToAr[key];
    arToEn[val] = key;
  }

  var hasArabic = /[\u0600-\u06FF]/.test(q);

  if (hasArabic) {
    // Arabic → English
    var out = "";
    for (var i = 0; i < q.length; i++) {
      var two = q.slice(i, i + 2);
      if (arToEn[two]) {
        out += arToEn[two];
        i++;
      } else if (arToEn[q[i]]) {
        out += arToEn[q[i]];
      } else {
        out += q[i];
      }
    }
    out;
  } else {
    // English → Arabic
    q.split("").map(c => enToAr[c.toLowerCase()] || c).join("");
  }
}