(()=>{try{
  var raw=(q||"").replace(/\uFEFF/g,"").toLowerCase();
  if(!raw)throw 1;
  // tokens we accept (order we will extract)
  // 1 zv yes/no; 2 baby yes/no; 3 jockey yes/no; 4 armor yes/no
  // 5 armor pieces 1-4; 6 armor ench 0-4; 7 armor type l/co/ch/i/g/d
  // 8 loot sword/shovel/can pick up/none; 9 weapon enchanted yes/no; 10 hand r/l; 11 pumpkin carved/lantern/x
  // normalize common words
  raw = raw.replace(/lantern/g,"lantern").replace(/carved/g,"carved");
  // token patterns
  var patYesNo = /\b(?:yes|y|no|n)\b/g;
  var patNum0to4 = /\b[0-4]\b/g;
  var patPieces = /\b(?:1|2|3|4)\b/g;
  var patAtype = /\b(?:l\b|co\b|ch\b|i\b|g\b|d\b)/g;
  var patLoot = /\b(?:sword|shovel|can pick up|canpickup|can_pick_up|canpickup|can pick|can)\b/g;
  var patHand = /\b(?:left|l|right|r)\b/g;
  var patPump = /\b(?:carved|lantern)\b/g;
  // helper to pull next match from a regex and advance index
  function pull(regex, fromIndex){
    regex.lastIndex = fromIndex||0;
    var m = regex.exec(raw);
    if(!m) return null;
    return {val:m[0], idx:m.index, end: regex.lastIndex};
  }
  // we'll scan left-to-right and collect candidates of the allowed kinds
  var i=0; var answers=[];
  // find yes/no and y/n occurrences for first four answers
  var regexYN = /\b(?:yes|y|no|n)\b/g;
  while(answers.length<4){
    var m = pull(regexYN,i);
    if(!m)break;
    var v = m.val==="y"?"yes":m.val==="n"?"no":m.val;
    answers.push(v); i = m.end;
  }
  // if we failed to get 4 yes/no by straight scan, try a fallback: search for patterns like "Zombie villager? yes"
  if(answers.length<4){
    // find labels then extract following yes/no
    var labels = ["zombie villager","baby","jockey","armor"];
    i=0;
    answers=[];
    for(var lb=0;lb<labels.length;lb++){
      var label = labels[lb];
      var re = new RegExp(label+"[^\\n\\r\\?\\:]{0,20}\\b(?:yes|y|no|n)\\b");
      var mm = raw.match(re);
      if(mm){
        var yy = mm[0].match(/\b(?:yes|y|no|n)\b/)[0];
        answers.push(yy==="y"?"yes":yy==="n"?"no":yy);
      } else {
        // try generic next yes/no after label word occurrence
        var pos = raw.indexOf(label);
        if(pos>=0){
          var sub = raw.slice(pos,pos+50);
          var mm2 = sub.match(/\b(?:yes|y|no|n)\b/);
          if(mm2) answers.push(mm2[0]==="y"?"yes":mm2[0]==="n"?"no":mm2[0]);
        }
      }
    }
  }
  if(answers.length<4) throw 1;
  // now find numeric/atype/loot/ench/hand/pumpkin tokens after the last collected index, but we'll simply search the whole string for the next valid tokens in order.
  function firstMatch(regex){
    var m = raw.match(regex);
    return m?m[0]:null;
  }
  // armor pieces 1-4
  var ap = firstMatch(/\b(?:1|2|3|4)\b/);
  if(!ap) ap="0";
  // armor ench 0-4 (prefer 0-4 after pieces)
  var ae = firstMatch(/\b(?:0|1|2|3|4)\b/);
  if(ae===null) ae="0";
  // armor type
  var at = firstMatch(/\b(?:l\b|co\b|ch\b|i\b|g\b|d\b)/);
  if(!at) at="x";
  // loot (prefer "can pick up" full phrase)
  var loot = raw.match(/\bcan pick up\b/)? "can pick up" : firstMatch(/\b(?:sword|shovel|none)\b/);
  if(!loot) loot="none";
  // weapon enchanted yes/no
  var we = firstMatch(/\b(?:weapon enchanted|enchanted weapon|enchanted|yes|y|no|n)\b/);
  if(we){
    we = (we==="y")?"yes":(we==="n")?"no":(we.match(/\byes\b/)?"yes":(we.match(/\bno\b/)?"no":(we==="enchanted"?"yes":"no")));
  } else we="no";
  // hand
  var hand = firstMatch(/\b(?:left|l|right|r)\b/);
  if(!hand) hand="";
  if(hand==="left") hand="l"; if(hand==="right") hand="r";
  // pumpkin
  var pk = firstMatch(/\b(?:carved|lantern)\b/);
  if(!pk) pk="x";
  // normalize some values
  function norm(v){
    if(!v) return v;
    v = v.toLowerCase();
    if(v==="y") return "yes"; if(v==="n") return "no";
    return v;
  }
  var zv = norm(answers[0]), baby = norm(answers[1]), jockey = norm(answers[2]), armor = norm(answers[3]);
  ap = ap; ae = ae; at = at; loot = loot; we = norm(we); hand = hand; pk = pk;
  // strict validations where needed
  if(!["yes","no"].includes(zv)||!["yes","no"].includes(baby)||!["yes","no"].includes(jockey)||!["yes","no"].includes(armor)) throw 1;
  if(armor==="yes"){
    if(!["1","2","3","4"].includes(ap)) throw 1;
    if(!["0","1","2","3","4"].includes(ae)) throw 1;
    if(!["l","co","ch","i","g","d"].includes(at)) throw 1;
  } else { ap="0"; ae="0"; at="x"; }
  if(!["sword","shovel","can pick up","none"].includes(loot)) throw 1;
  if(loot!=="none"&&loot!=="can pick up"){ if(!["yes","no"].includes(we)) throw 1; } else we="no";
  if(!["r","l",""].includes(hand)) throw 1;
  if(!["carved","lantern","x"].includes(pk)) throw 1;
  // now compute probabilities (as before)
  var p = 0.1845;
  p *= (zv==="yes"?0.05:0.95);
  p *= (baby==="yes"?0.05:0.95);
  p *= (jockey==="yes"?0.05:0.95);
  p *= (armor==="yes"?0.15:0.85);
  var piecesProb={"1":1,"2":0.9,"3":0.81,"4":0.729};
  if(armor==="yes") p *= piecesProb[ap]||0;
  function comb(n,k){ if(k<0||k>n) return 0; var c=1; for(var i=0;i<k;i++){ c*=(n-i); c/=(i+1);} return c; }
  var piecesN = parseInt(ap||"0",10), enchCount = parseInt(ae||"0",10);
  if(armor==="yes"){
    var pe = comb(piecesN,enchCount)*Math.pow(0.5,piecesN);
    p *= pe;
    var atypes = {l:0.236,co:0.3223,ch:0.0973,g:0.3329,i:0.011,d:0.0004};
    p *= atypes[at]||0;
  }
  if(loot==="sword"||loot==="shovel"){ p *= 0.05; if(we==="yes") p *= 1.25; }
  else if(loot==="can pick up"){ p *= 0.55; }
  if(hand==="l" && (loot==="sword"||loot==="shovel"||loot==="can pick up")) p *= 0.11;
  if(pk==="carved") p *= 0.225; else if(pk==="lantern") p *= 0.025;
  if(p<=0) throw 1;
  var denom = Math.round(1/p);
  var pct = (p*100).toExponential(6).replace("E","e");
  return "Your naturally spawned zombie rarity in max local difficulty is 1/"+denom+" ("+pct+"%)";
}catch(e){return "Wrong input. Use: !zr yes/no◆yes/no◆... or type short: y◆y◆y◆y◆4◆0◆d◆sword◆n◆l◆x";}})()
