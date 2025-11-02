// zombie.js
var wrongInputMsg = 'Wrong input. Input should be in this state “!zr Zombie villager? yes/no (x) ◆ Baby? yes/no (x) ◆ Jockey? yes/no (x) ◆ Armor? yes/no (x) ◆ Armor pieces (if yes) 1/2/3/4 (x) ◆ Armor pieces enchanted (if yes) 0/1/2/3/4 (x) ◆ Armor type (if yes) L/co/ch/i/g/d (x) ◆ Loot? sword/shovel/can pick up/none (x) ◆ Enchanted weapon? (if yes) yes/no (x) ◆ Hand? (if yes) R/L (x) ◆ Halloween pumpkin? (if yes) carved/lantern (x)” if no ignore the question. Check out my creator twitch.tv/hassannm7';

try {
  if (!q || !q.includes('Zombie villager?')) throw 0;
  let data = q.split('◆').map(x=>x.trim().toLowerCase());

  function yes(x){return x.includes('(yes)')};
  function val(x){let m=x.match(/\((.*?)\)/);return m?m[1].trim():''};

  let rarity = 95/515; // base spawn chance

  if (yes(data[0])) rarity *= 0.05;
  if (yes(data[1])) rarity *= 0.05;
  if (yes(data[2])) rarity *= 0.05;

  if (yes(data[3])) {
    rarity *= 0.15;
    let pieces = parseInt(val(data[4])) || 1;
    let mult = [1,0.9,0.81,0.729][pieces-1] || 1;
    rarity *= mult;

    let ench = parseInt(val(data[5])) || 0;
    rarity *= Math.pow(0.5, ench);

    let armorType = val(data[6]);
    let typeRates = {l:0.236, co:0.3223, ch:0.0973, g:0.3329, i:0.011, d:0.0004};
    rarity *= typeRates[armorType] || 1;
  }

  let loot = val(data[7]);
  if (loot === 'sword') rarity *= 0.05*(1/3);
  else if (loot === 'shovel') rarity *= 0.05*(2/3);
  else if (loot === 'can pick up') rarity *= 0.55;

  if (yes(data[8])) rarity *= 1.25;
  if (val(data[9])==='l') rarity *= 0.11;

  let halloween = val(data[10]);
  if (halloween==='carved') rarity *= 0.225;
  else if (halloween==='lantern') rarity *= 0.025;

  let chance = rarity * 100;
  let oneIn = 1/rarity;

  oneIn = oneIn.toLocaleString('en-US');
  return `Your naturally spawned zombie rarity in max local difficulty is 1/${oneIn} or ${chance.toExponential(12)}%`;
} catch(e) {
  return wrongInputMsg;
}