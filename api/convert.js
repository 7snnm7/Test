var q = q || "";

function getVal(label){
  var re = new RegExp(label + "\\?\\s*([^◆]+)","i");
  var m = q.match(re);
  return m ? m[1].trim().toLowerCase() : "";
}

function calc(q){
  var base = 0.1845; // 18.45%

  if(getVal("Zombie villager")==="yes") base *= 0.05;
  if(getVal("Baby")==="yes") base *= 0.05;
  if(getVal("Jockey")==="yes") base *= 0.05;

  // Armor block
  if(getVal("Armor")==="yes"){
    base *= 0.15;
    var pieces = Number(getVal("Armor pieces"))||0;
    var pieceMults = [1,1,0.9,0.81,0.729];
    base *= pieceMults[pieces]||1;

    var ench = Number(getVal("Armor pieces enchanted"))||0;
    // each enchanted piece halves the chance (50% per piece) — modelled as 0.5^ench
    if(ench>0) base *= Math.pow(0.5,ench);

    var t = getVal("Armor type");
    var types = { l:0.236, co:0.3223, ch:0.0973, g:0.3329, i:0.011, d:0.0004 };
    if(types[t]) base *= types[t];
  }

  // Loot / weapon
  var loot = getVal("Loot"); // expected: sword/shovel/can pick up/none
  if(loot==="sword"||loot==="shovel"){
    base *= 0.05;
    base *= (loot==="sword") ? (1/3) : (2/3);
    if(getVal("Enchanted weapon")==="yes") base *= 0.25;
  } else if(loot==="can pick up"){
    base *= 0.55;
  }

  // Left-hand modifier: if has weapon or can pick up AND hand L
  var hand = getVal("Hand");
  if(hand==="l" && (loot==="sword"||loot==="shovel"||loot==="can pick up")){
    base *= 0.11;
  }

  // Halloween head
  var pumpkin = getVal("Halloween pumpkin");
  if(pumpkin==="carved") base *= 0.225;
  if(pumpkin==="lantern") base *= 0.025;

  if(base<=0) return "Your naturally spawned zombie rarity in max local difficulty is 0% (impossible)";

  // compute values
  var pct = (base*100);
  // format percent with up to 16 decimals then trim
  var pctStr = pct.toFixed(16).replace(/\.?0+$/,"");
  // calculate 1 in N — use rounding for huge numbers
  var oneIn = Math.round(1/base);
  return "Your naturally spawned zombie rarity in max local difficulty is 1/" + oneIn + " or " + pctStr + "%";
}

// If missing required label -> show exact "Wrong input" message + shoutout (ignore other checks)
q.toLowerCase().includes("zombie villager?") ? calc(q) : 'Wrong input. Input should be in this state “ !zr Zombie villager? yes/no (x) ◆ Baby? yes/no (x) ◆ Jockey? yes/no (x) ◆ Armor? yes/no (x) ◆ Armor pieces (if yes) 1/2/3/4 (x) ◆ Armor pieces enchanted (if yes) 0/1/2/3/4 (x) ◆ Armor type (if yes) L/co/ch/i/g/d (x) ◆ Loot? sword/shovel/can pick up/none (x) ◆ Enchanted weapon? (if yes) yes/no (x) ◆ Hand? (if yes) R/L (x) ◆ Halloween pumpkin? (if yes) carved/lantern (x) “ if no ignore the question. Check out my creator twitch.tv/hassannm7';