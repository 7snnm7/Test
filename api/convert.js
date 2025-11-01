var q = q || "";

function rarityCalc(q) {
  const get = (k) => {
    const m = q.match(new RegExp(k + "\\?\\s*([^◆]+)"));
    return m ? m[1].trim().toLowerCase() : "";
  };

  let base = 0.2; // base zombie spawn

  if (get("Zombie villager") === "yes") base *= 0.05;
  if (get("Baby") === "yes") base *= 0.05;
  if (get("Jockey") === "yes") base *= 0.05;

  if (get("Armor") === "yes") {
    base *= 0.15;
    const pieces = Number(get("Armor pieces")) || 0;
    const multi = [1, 1, 0.9, 0.81, 0.729][pieces] || 1;
    base *= multi;

    const ench = Number(get("Armor pieces enchanted")) || 0;
    if (ench && pieces) base *= 0.5 * (ench / pieces);

    const type = get("Armor type");
    const types = { l: 0.236, co: 0.3223, ch: 0.0973, g: 0.3329, i: 0.011, d: 0.0004 };
    if (types[type]) base *= types[type];
  }

  const loot = get("Loot");
  if (loot === "sword" || loot === "shovel") {
    base *= 0.05;
    base *= loot === "sword" ? 1 / 3 : 2 / 3;
    if (get("Enchanted weapon") === "yes") base *= 0.25;
  } else if (loot === "can pick up") base *= 0.55;

  if (get("Hand") === "l") base *= 0.11;

  const pumpkin = get("Halloween pumpkin");
  if (pumpkin === "carved") base *= 0.225;
  if (pumpkin === "lantern") base *= 0.025;

  const percent = (base * 100).toFixed(8);
  const oneIn = (1 / base).toFixed(0);
  return `Your naturally spawned zombie in max local difficulty is ${percent}% or 1 in ${oneIn}`;
}

if (!q.includes("Zombie villager?")) {
  "Wrong input. Input should be in this state “ !zr Zombie villager? yes/no (x) ◆ Baby? yes/no (x) ◆ Jockey? yes/no (x) ◆ Armor? yes/no (x) ◆ Armor pieces (if yes) 1/2/3/4 (x) ◆ Armor pieces enchanted (if yes) 1/2/3/4 ◆ Armor type (if yes) L/co/ch/i/g/d (x) ◆ Loot? sword/shovel/can pick up/none (x) ◆ Enchanted weapon? (if yes) yes/no ◆ Hand? (if yes) R/L (x) ◆ Halloween pumpkin? (if yes) carved/lantern (x)” Check out my creator twitch.tv/hassannm7";
} else {
  rarityCalc(q);
}