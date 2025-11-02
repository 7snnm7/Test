// zr.js
try{
  // parse input parts separated by "◆"
  var parts = (typeof q === "string" ? q : "").split("◆").map(s=>s.trim().toLowerCase());
  var expectCount = 11;
  if(parts.length < expectCount) throw 1;

  // helper parse answers in order:
  // 0: Zombie villager? yes/no
  // 1: Baby? yes/no
  // 2: Jockey? yes/no
  // 3: Armor? yes/no
  // 4: Armor pieces 1/2/3/4 (if armor yes)
  // 5: Armor pieces enchanted 0/1/2/3/4
  // 6: Armor type l/co/ch/i/g/d
  // 7: Loot? sword/shovel/can pick up/none
  // 8: Enchanted weapon? yes/no
  // 9: Hand? r/l
  // 10: Halloween pumpkin? carved/lantern/x

  var get = i=>parts[i]||"";
  var yesNo = s=> (s==="yes"||s==="y");
  var zv = get(0); var baby = get(1); var jockey = get(2);
  var armor = get(3); var apieces = get(4); var aench = get(5);
  var atype = get(6); var loot = get(7); var weench = get(8);
  var hand = get(9); var pumpkin = get(10);

  // validate required fields basic
  var validYN = v=> v==="yes"||v==="no";
  if(!validYN(zv) || !validYN(baby) || !validYN(jockey) || !validYN(armor) ) throw 1;
  if(armor==="yes"){
    if(!["1","2","3","4"].includes(apieces)) throw 1;
    if(!["0","1","2","3","4"].includes(aench)) throw 1;
    if(!["l","co","ch","i","g","d"].includes(atype)) throw 1;
  } else {
    apieces="0"; aench="0"; atype="x";
  }
  if(!["sword","shovel","can pick up","none"].includes(loot)) throw 1;
  if(loot!=="none" && loot!=="can pick up"){
    if(!["yes","no"].includes(weench)) throw 1;
  } else {
    weench="no";
  }
  if(!["r","l",""].includes(hand)) throw 1;
  if(!["carved","lantern","x"].includes(pumpkin)) throw 1;

  // probabilities (as decimals)
  var p = 1;
  var zombieSpawn = 0.1845; // spawn chance to be zombie in first place
  p *= zombieSpawn;

  // among spawned zombies
  p *= (zv==="yes"?0.05:0.95);
  p *= (baby==="yes"?0.05:0.95);
  p *= (jockey==="yes"?0.05:0.95);

  // armor
  p *= (armor==="yes"?0.15:0.85);
  var pieces = parseInt(apieces,10);
  var piecesProbMap = { "1":1.00, "2":0.90, "3":0.81, "4":0.729 };
  if(armor==="yes") p *= piecesProbMap[apieces]||0;

  // armor enchantment: probability of exactly e enchanted out of pieces (each piece 50%)
  function comb(n,k){
    if(k<0||k>n) return 0;
    var c=1;
    for(var i=0;i<k;i++){ c *= (n-i); c /= (i+1); }
    return c;
  }
  var enchCount = parseInt(aench,10);
  if(armor==="yes"){
    var pe = comb(pieces,enchCount) * Math.pow(0.5,pieces);
    p *= pe;
    // armor type
    var atypes = { l:0.236, co:0.3223, ch:0.0973, g:0.3329, i:0.011, d:0.0004 };
    p *= atypes[atype]||0;
  }

  // weapon / loot
  // base: if has weapon 5%
  var weaponBase = 0.05;
  var canPickBase = 0.55;
  if(loot==="sword" || loot==="shovel"){
    p *= weaponBase;
    // sword vs shovel split only matters if we treat base split; user explicitly picked so no extra multiplier
    // handle enchanted weapon: "25% extra" interpreted as 1.25x multiplier on this branch
    if(weench==="yes") p *= 1.25;
  } else if(loot==="can pick up"){
    p *= canPickBase;
  } else { // none
    p *= 1; // no change
  }

  // left-hand condition: "If has weapon or can pick up loot in left hand 11%"
  if(hand==="l"){
    if(loot==="sword"||loot==="shovel"||loot==="can pick up"){
      p *= 0.11;
    } else {
      p *= 1;
    }
  }

  // pumpkin
  if(pumpkin==="carved") p *= 0.225;
  else if(pumpkin==="lantern") p *= 0.025;

  // finalize
  if(p<=0) throw 1;
  var oneOver = 1 / p;
  // format numbers
  function fmtBig(n){
    if(n<1e6) return Math.round(n).toString();
    return Math.round(n).toString();
  }
  var pct = p*100;
  var pctStr = pct.toPrecision(6).replace(/\.?0+$/,"");
  var denom = Math.round(oneOver);
  var out = "Your naturally spawned zombie rarity in max local difficulty is 1/" + denom + " or " + pctStr + "%";
  out += " Check out my creator twitch.tv/hassannm7";
  out;
}catch(e){
  "Wrong input. Input should be in this state “ !zr Zombie villager? yes/no (x) ◆ Baby? yes/no (x) ◆ Jockey? yes/no (x) ◆ Armor? yes/no (x) ◆ Armor pieces (if yes) 1/2/3/4 (x) ◆ Armor pieces enchanted (if yes) 0/1/2/3/4 (x) ◆ Armor type (if yes) L/co/ch/i/g/d (x) ◆ Loot? sword/shovel/can pick up/none (x) ◆ Enchanted weapon? (if yes) yes/no (x) ◆ Hand? (if yes) R/L (x) ◆ Halloween pumpkin? (if yes) carved/lantern (x) “ if no ignore the question. Check out my creator twitch.tv/hassannm7";
}
