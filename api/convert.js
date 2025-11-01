var map = {
  q: "ض", w: "ص", e: "ث", r: "ق", t: "ف", y: "غ", u: "ع", i: "ه", o: "خ", p: "ح",
  "[": "ج", "]": "د", a: "ش", s: "س", d: "ي", f: "ب", g: "ل", h: "ا", j: "ت",
  k: "ن", l: "م", ";": "ك", "'": "ط", z: "ئ", x: "ء", c: "ؤ", v: "ر", b: "لا",
  n: "ى", m: "ة", ",": "و", ".": "ز", "/": "ظ"
};

// Reverse map for Arabic → English
var reverseMap = {};
for (var key in map) reverseMap[map[key]] = key;

function convert(q) {
  let engToAr = [...q].map(ch => map[ch.toLowerCase()] || ch).join("");
  let arToEng = [...q].map(ch => reverseMap[ch] || ch).join("");

  // Decide which direction: detect Arabic letters
  if (/[ء-ي]/.test(q)) return arToEng;
  else return engToAr;
}

// Nightbot expects plain text output
convert(q);