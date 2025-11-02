(() => {
  try{
    var parts = (q||"").split("◆").map(s=>s.trim().toLowerCase());
    if(parts.length < 11) throw 1;
    var get = i=>parts[i]||"";
    var validYN = v=> v==="yes"||v==="no";
    var zv=get(0), baby=get(1), jockey=get(2), armor=get(3), apieces=get(4), aench=get(5), atype=get(6), loot=get(7), weench=get(8), hand=get(9), pumpkin=get(10);
    if(!validYN(zv)||!validYN(baby)||!validYN(jockey)||!validYN(armor)) throw 1;
    if(armor==="yes"){
      if(!["1","2","3","4"].includes(apieces)) throw 1;
      if(!["0","1","2","3","4"].includes(aench)) throw 1;
      if(!["l","co","ch","i","g","d"].includes(atype)) throw 1;
    } else { apieces="0"; aench="0"; atype="x"; }
    if(!["sword","shovel","can pick up","none"].includes(loot)) throw 1;
    if(loot!=="none"&&loot!=="can pick up"){ if(!["yes","no"].includes(weench)) throw 1; } else { weench="no"; }
    if(!["r","l",""].includes(hand)) throw 1;
    if(!["carved","lantern","x"].includes(pumpkin)) throw 1;

    var p = 0.1845;
    p *= (zv==="yes"?0.05:0.95);
    p *= (baby==="yes"?0.05:0.95);
    p *= (jockey==="yes"?0.05:0.95);
    p *= (armor==="yes"?0.15:0.85);
    var piecesProb = {"1":1,"2":0.9,"3":0.81,"4":0.729};
    if(armor==="yes") p *= piecesProb[apieces]||0;

    function comb(n,k){ if(k<0||k>n) return 0; var c=1; for(var i=0;i<k;i++){ c*= (n-i); c/= (i+1); } return c; }
    var pieces = parseInt(apieces,10);
    var enchCount = parseInt(aench,10);
    if(armor==="yes"){
      var pe = comb(pieces,enchCount)*Math.pow(0.5,pieces);
      p *= pe;
      var atypes = { l:0.236, co:0.3223, ch:0.0973, g:0.3329, i:0.011, d:0.0004 };
      p *= atypes[atype]||0;
    }

    if(loot==="sword"||loot==="shovel"){ p *= 0.05; if(weench==="yes") p *= 1.25; }
    else if(loot==="can pick up"){ p *= 0.55; }

    if(hand==="l" && (loot==="sword"||loot==="shovel"||loot==="can pick up")) p *= 0.11;
    if(pumpkin==="carved") p *= 0.225; else if(pumpkin==="lantern") p *= 0.025;
    if(p<=0) throw 1;
    var denom = Math.round(1/p);
    var pct = (p*100).toPrecision(6).replace(/\.?0+$/,"");
    return "Your naturally spawned zombie rarity in max local difficulty is 1/" + denom + " or " + pct + "% Check out my creator twitch.tv/hassannm7";
  }catch(e){
    return "Wrong input. Input should be in this state “ !zr Zombie villager? yes/no (x) ◆ Baby? yes/no (x) ◆ Jockey? yes/no (x) ◆ Armor? yes/no (x) ◆ Armor pieces (if yes) 1/2/3/4 (x) ◆ Armor pieces enchanted (if yes) 0/1/2/3/4 (x) ◆ Armor type (if yes) L/co/ch/i/g/d (x) ◆ Loot? sword/shovel/can pick up/none (x) ◆ Enchanted weapon? (if yes) yes/no (x) ◆ Hand? (if yes) R/L (x) ◆ Halloween pumpkin? (if yes) carved/lantern (x) “ if no ignore the question. Check out my creator twitch.tv/hassannm7";
  }
})()
