function convert(q) {
  try {
    if (!q.includes("Zombie villager?"))
      return 'Wrong input. Input should be in this state “ !zr Zombie villager? yes/no (x) ◆ Baby? yes/no (x) ◆ Jockey? yes/no (x) ◆ Armor? yes/no (x) ◆ Armor pieces (if yes) 1/2/3/4 (x) ◆ Armor pieces enchanted (if yes) 1/2/3/4 ◆ Armor type (if yes) L/co/ch/i/g/d (x) ◆ Loot? sword/shovel/can pick up/none (x) ◆ Enchanted weapon? (if yes) yes/no ◆ Hand? (if yes) R/L (x) ◆ Halloween pumpkin? (if yes) carved/lantern (x)” Check out my creator twitch.tv/hassannm7';

    let base = 0.20; // 20%

    const get = (label) => {
      const r = new RegExp(label + "\\?\\s*([^◆]+)");
      const m = q.match(r);
      return m ? m[1].trim().toLowerCase() : "";
    };

    // Villager
    if (get("Zombie villager") === "yes") base *= 0.05;

    // Baby
    if (get("Baby") === "yes") base *= 0.05;

    // Jockey
    if (get("Jockey") === "yes") base *= 0.05;

    // Armor
    if (get("Armor") === "yes") {
      base *= 0.15;
      const pieces = Number(get("Armor pieces")) || 0;
      const pieceMult = [1, 1, 0.9, 0.81, 0.729][pieces] || 1;
      base *= pieceMult;

      const enchanted = Number(get("Armor pieces enchanted")) || 0;
      if (enchanted && pieces)
        base *= 0.5 * (enchanted / pieces);

      const type = get("Armor type");
      const map = { l: 0.236, co: 0.3223, ch: 0.0973, g: 0.3329, i: 0.011, d: 0.0004 };
      if (map[type]) base *= map[type];
    }

    // Loot
    const loot = get("Loot");
    if (loot === "sword" || loot === "shovel") {
      base *= 0.05;
      base *= loot === "sword" ? 1/3 : 2/3;
      if (get("Enchanted weapon") === "yes") base *= 0.25;
    } else if (loot === "can pick up") {
      base *= 0.55;
    }

    // Hand
    if (get("Hand") === "l") base *= 0.11;

    // Halloween
    const pumpkin = get("Halloween pumpkin");
    if (pumpkin === "carved") base *= 0.225;
    if (pumpkin === "lantern") base *= 0.025;

    const percent = (base * 100).toFixed(10);
    const oneIn = (1 / base).toFixed(0);

    return `Your naturally spawned zombie in max local difficulty is ${percent}% or 1 in ${oneIn}`;
  } catch {
    return "Something went wrong, check your syntax! Check out my creator twitch.tv/hassannm7";
  }
}

var result = convert(q);
result;