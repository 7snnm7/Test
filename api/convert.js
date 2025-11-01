var q = q || "";

function rarityCalc(q) {
  function get(label) {
    var re = new RegExp(label + "\\?\\s*([^◆]+)");
    var m = q.match(re);
    return m ? m[1].trim().toLowerCase() : "";
  }

  var base = 0.20; // 20%

  if (get("Zombie villager") === "yes") base *= 0.05;
  if (get("Baby") === "yes") base *= 0.05;
  if (get("Jockey") === "yes") base *= 0.05;

  // Armor
  if (get("Armor") === "yes") {
    base *= 0.15;
    var pieces = Number(get("Armor pieces")) || 0;
    var pieceMults = [1, 1, 0.9, 0.81, 0.729];
    base *= pieceMults[pieces] || 1;

    var enchantedPieces = Number(get("Armor pieces enchanted")) || 0;
    // each enchanted piece multiplies by 0.5 chance -> multiply by 0.5^ench
    if (enchantedPieces > 0) base *= Math.pow(0.5, enchantedPieces);

    var type = get("Armor type");
    var types = { l: 0.236, co: 0.3223, ch: 0.0973, g: 0.3329, i: 0.011, d: 0.0004 };
    if (types[type]) base *= types[type];
  }

  // Loot / Weapon
  var loot = get("Loot"); // sword/shovel/can pick up/none
  if (loot === "sword" || loot === "shovel") {
    base *= 0.05;
    base *= (loot === "sword") ? (1/3) : (2/3);
    if (get("Enchanted weapon") === "yes") base *= 0.25;
  } else if (loot === "can pick up") {
    base *= 0.55;
  }

  // Left hand (applies if loot present and hand == L)
  var hand = get("Hand");
  if (hand === "l" && (loot === "sword" || loot === "shovel" || loot === "can pick up")) {
    base *= 0.11;
  }

  // Halloween head
  var pumpkin = get("Halloween pumpkin");
  if (pumpkin === "carved") base *= 0.225;
  if (pumpkin === "lantern") base *= 0.025;

  // guard against zero
  if (base <= 0) return "Your naturally spawned zombie rarity in max local difficulty is 0% (impossible)";

  var percent = (base * 100);
  // format percent with up to 10 decimals, trim trailing zeros
  var pct = percent.toFixed(10).replace(/\.?0+$/, "");
  var oneIn = Math.round(1 / base);
  return "Your naturally spawned zombie rarity in max local difficulty is 1/" + oneIn + " or " + pct + "%";
}

// top-level: if missing Zombie villager? label, show wrong-input help + shoutout
q.toLowerCase().includes("zombie villager?") ? rarityCalc(q) : 'Wrong input. Input should be in this state “ !zr Zombie villager? yes/no (x) ◆ Baby? yes/no (x) ◆ Jockey? yes/no (x) ◆ Armor? yes/no (x) ◆ Armor pieces (if yes) 1/2/3/4 (x) ◆ Armor pieces enchanted (if yes) 0/1/2/3/4 (x) ◆ Armor type (if yes) L/co/ch/i/g/d (x) ◆ Loot? sword/shovel/can pick up/none (x) ◆ Enchanted weapon? (if yes) yes/no (x) ◆ Hand? (if yes) R/L (x) ◆ Halloween pumpkin? (if yes) carved/lantern (x)“ if no ignore the question. Check out my creator twitch.tv/hassannm7';