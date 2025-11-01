// convert.js
// Nightbot will set `q` to the string passed after the command.
// This script expects the user to put each answer inside parentheses in order.
// Example input format (user sends after command):
// !zr Zombie villager? yes/no (yes) ◆ Baby? yes/no (yes) ◆ Jockey? yes/no (yes) ◆ Armor? yes/no (yes) ◆ Armor pieces (if yes) 1/2/3/4 (4) ◆ Armor pieces enchanted (if yes) 0/1/2/3/4 (0) ◆ Armor type (if yes) L/co/ch/i/g/d (d) ◆ Loot? sword/shovel/can pick up/none (sword) ◆ Enchanted weapon? (if yes) yes/no (no) ◆ Hand? (if yes) R/L (l) ◆ Halloween pumpkin? (if yes) carved/lantern (x)

try {
  // read q variable (Nightbot sets this)
  if (typeof q === 'undefined') q = '';
  // find all parenthetical values in the input, in order
  var parens = (q.match(/\(([^)]*)\)/g) || []).map(s => s.slice(1,-1).trim().toLowerCase());

  var expected = 11;
  if (parens.length < expected) {
    throw 'bad';
  }
  var [
    zombieVillager, baby, jockey, armor,
    armorPiecesStr, enchantedPiecesStr, armorType,
    loot, enchantedWeapon, hand, pumpkin
  ] = parens.slice(0,expected);

  // validate simple values
  const yesno = v => v === 'yes' || v === 'no' || v === 'x' || v === 'n' || v === 'y';
  if (![zombieVillager,baby,jockey,armor,enchantedWeapon].every(v => yesno(v))) throw 'bad';

  // helpers & probabilities (as decimals)
  var prob = 1.0;
  // base spawn chance of a zombie among natural spawns
  prob *= 0.20;

  // zombie villager
  prob *= (zombieVillager === 'yes') ? 0.05 : 0.95;

  // baby
  prob *= (baby === 'yes') ? 0.05 : 0.95;

  // jockey
  prob *= (jockey === 'yes') ? 0.05 : 0.95;

  // armor
  prob *= (armor === 'yes') ? 0.15 : 0.85;

  // armor pieces mapping (conditional on armor yes)
  var piecesMap = { '1':1.0, '2':0.9, '3':0.81, '4':0.729 };
  var m = parseInt(armorPiecesStr,10);
  if (armor === 'yes') {
    if (!piecesMap.hasOwnProperty(String(m))) throw 'bad';
    prob *= piecesMap[String(m)];
    // enchanted pieces: treat as binomial exact-probability: P(exactly k enchanted among m) = C(m,k)/2^m
    var k = parseInt(enchantedPiecesStr,10);
    if (isNaN(k) || k < 0 || k > m) throw 'bad';
    // compute C(m,k)
    function comb(n,r){
      if (r<0 || r>n) return 0;
      r = Math.min(r, n-r);
      var num = 1, den = 1;
      for (var i=0;i<r;i++){ num *= (n-i); den *= (i+1); }
      return num/den;
    }
    var pExactK = (m===0) ? (k===0?1:0) : (comb(m,k) * Math.pow(0.5, m));
    prob *= pExactK;
    // armor type
    var typeMap = { 'l':0.236, 'co':0.3223, 'ch':0.0973, 'g':0.3329, 'i':0.011, 'd':0.0004 };
    if (!typeMap.hasOwnProperty(armorType)) throw 'bad';
    prob *= typeMap[armorType];
  } else {
    // if no armor, ensure the pieces/enchanted/type are 'x' or input ignored
  }

  // Loot / weapon handling
  // If loot is 'sword' or 'shovel' -> treat as weapon present (5% of zombies)
  // If loot == 'can pick up' -> use 55% (special case)
  // If loot == 'none' -> take remaining probability (0.40)
  loot = (loot || 'none');
  if (loot === 'sword' || loot === 'shovel') {
    prob *= 0.05;
    // weapon type split: sword 1/3, shovel 2/3
    prob *= (loot === 'sword') ? (1/3) : (2/3);
    // enchanted weapon
    prob *= (enchantedWeapon === 'yes') ? 0.25 : 0.75;
  } else if (loot === 'can pick up') {
    prob *= 0.55;
    // enchantedWeapon and hand may still apply to 'can pick up' case:
    // enchantedWeapon doesn't make sense here; ignore enchantedWeapon
  } else if (loot === 'none') {
    prob *= 0.40; // complement of 0.05 and 0.55 per your breakdown
  } else {
    throw 'bad';
  }

  // Hand: "If has weapon or can pick up loot in left hand 11%"
  // Interpret: probability to have item in left hand is 11% if item present; else complement 89%.
  var handLower = (hand || 'r');
  if (handLower !== 'l' && handLower !== 'r' && handLower !== 'x') throw 'bad';
  var itemPresent = (loot === 'sword' || loot === 'shovel' || loot === 'can pick up');
  if (itemPresent) {
    prob *= (handLower === 'l') ? 0.11 : 0.89;
  } else {
    // no held item — use complement (assume 1)
    prob *= 1.0;
  }

  // pumpkin: carved 22.5% or lantern 2.5% ; if x/none assume neither: 1 - (0.225+0.025) = 0.75
  if (pumpkin === 'carved') prob *= 0.225;
  else if (pumpkin === 'lantern') prob *= 0.025;
  else if (pumpkin === 'x' || pumpkin === 'none') prob *= 0.75;
  else throw 'bad';

  // Final probability for a *naturally spawned* mob being this exact zombie
  if (prob <= 0) {
    throw 'bad';
  }
  var pct = prob * 100;
  // produce 1/x form
  var oneOver = 1 / prob;
  // choose formatting: if extremely large, show scientific for 1/x
  var oneOverStr = (oneOver > 1e12) ? oneOver.toExponential(3) : Math.round(oneOver).toLocaleString('en-US');
  // format percent with reasonable digits
  var pctStr = (pct < 0.000001) ? pct.toExponential(3) + '%' : pct.toFixed(10).replace(/0+$/,'').replace(/\.$/,'') + '%';

  var out = `Your naturally spawned zombie rarity in max local difficulty is 1/${oneOverStr} or ${pctStr}`;
  // include creator shoutout
  out += ' — Check out my creator twitch.tv/hassannm7';
  // plain text result
  out;
} catch(e) {
  // reply with the required "Wrong input" message exactly as requested
  "Wrong input. Input should be in this state “ !zr Zombie villager? yes/no (x) ◆ Baby? yes/no (x) ◆ Jockey? yes/no (x) ◆ Armor? yes/no (x) ◆ Armor pieces (if yes) 1/2/3/4 (x) ◆ Armor pieces enchanted (if yes) 0/1/2/3/4 (x) ◆ Armor type (if yes) L/co/ch/i/g/d (x) ◆ Loot? sword/shovel/can pick up/none (x) ◆ Enchanted weapon? (if yes) yes/no (x) ◆ Hand? (if yes) R/L (x) ◆ Halloween pumpkin? (if yes) carved/lantern (x) “ if no ignore the question. Check out my creator twitch.tv/hassannm7";
}