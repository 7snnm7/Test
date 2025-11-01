// The command input is passed to this script as the variable 'q'
const errorMsg = 'Wrong input. Input should be in this state: !zr Zombie villager? yes/no (x) ◆ Baby? yes/no (x) ◆ Jockey? yes/no (x) ◆ Armor? yes/no (x) ◆ Armor pieces (if yes) 1/2/3/4 (x) ◆ Armor pieces enchanted (if yes) 1/2/3/4 (x) ◆ Armor type (if yes) L/co/ch/i/g/d (x) ◆ Loot? sword/shovel/can pick up/none (x) ◆ Enchanted weapon? (if yes) yes/no (x) ◆ Hand? (if yes) R/L (x) ◆ Halloween pumpkin? (if yes) carved/lantern (x) Check out my creator twitch.tv/hassannm7';

// 1. Check for empty input. Return an empty string to ignore the command.
if (!q || q.trim() === '') {
    return ''; 
}

const input = q.toLowerCase().replace(/[\u200b-\u200f\u2028-\u202f\u2060-\u2064\u206a-\u206f]/g, '').trim();
const parts = input.split(' ◆ ');

// --- Input Validation ---
if (parts.length !== 11) {
    return errorMsg;
}

// Function to extract the answer from the 'Question? answer (x)' string
const extractAnswer = (part, expectedPrefix) => {
    // Escape special regex characters like '?' and '('
    const regex = new RegExp(`^${expectedPrefix.replace(/[?()]/g, '\\$&')}\\s*([a-z0-9\\s/]+)\\s*\\(x\\)$`);
    const match = part.match(regex);
    if (match) {
        return match[1].trim().toLowerCase();
    }
    return null; // Return null if the format or prefix is wrong
};

// --- Variable Mapping and Calculation ---
let prob = 0.20; // Base: Zombie spawning 20%

const zombieVillager = extractAnswer(parts[0], 'zombie villager?');
const baby = extractAnswer(parts[1], 'baby?');
const jockey = extractAnswer(parts[2], 'jockey?');
const armor = extractAnswer(parts[3], 'armor?');
const armorPieces = extractAnswer(parts[4], 'armor pieces (if yes)');
const armorEnchanted = extractAnswer(parts[5], 'armor pieces enchanted (if yes)');
const armorType = extractAnswer(parts[6], 'armor type (if yes)');
const loot = extractAnswer(parts[7], 'loot?');
const enchantedWeapon = extractAnswer(parts[8], 'enchanted weapon? (if yes)');
const hand = extractAnswer(parts[9], 'hand? (if yes)');
const pumpkin = extractAnswer(parts[10], 'halloween pumpkin? (if yes)');

// Check if any extraction failed (meaning a part was malformed)
if (!zombieVillager || !baby || !jockey || !armor || !loot || !pumpkin || 
    (armor === 'yes' && (!armorPieces || !armorEnchanted || !armorType)) ||
    ((loot === 'sword' || loot === 'shovel') && !enchantedWeapon) ||
    ((loot === 'sword' || loot === 'shovel' || loot === 'can pick up') && !hand)) 
{
    return errorMsg;
}


// 1. Zombie Villager
prob *= (zombieVillager === 'yes') ? 0.05 : 0.95; 
// 2. Baby
prob *= (baby === 'yes') ? 0.05 : 0.95; 
// 3. Jockey
prob *= (jockey === 'yes') ? 0.05 : 0.95; 

// 4. Armor
if (armor === 'yes') {
    prob *= 0.15; // Armor 15%
    
    // 5. Armor Pieces
    switch (armorPieces) {
        case '1': prob *= 1.0; break;
        case '2': prob *= 0.90; break;
        case '3': prob *= 0.81; break;
        case '4': prob *= 0.729; break;
        default: return errorMsg; 
    }
    
    // 6. Armor Enchanted
    const pieces = parseInt(armorEnchanted);
    if (!isNaN(pieces) && pieces >= 1 && pieces <= 4) {
        prob *= Math.pow(0.50, pieces);
    } else {
        return errorMsg; 
    }
    
    // 7. Armor Type
    switch (armorType) {
        case 'l': prob *= 0.236; break;
        case 'co': prob *= 0.3223; break;
        case 'ch': prob *= 0.0973; break;
        case 'g': prob *= 0.3329; break;
        case 'i': prob *= 0.011; break;
        case 'd': prob *= 0.0004; break;
        default: return errorMsg; 
    }
} else {
    prob *= 0.85; // No Armor
}

// 8. Loot
if (loot === 'sword' || loot === 'shovel') {
    prob *= 0.05; // Weapon 5%
    prob *= (loot === 'sword') ? (1/3) : (2/3); // Sword 1/3, Shovel 2/3
    // 9. Enchanted Weapon
    prob *= (enchantedWeapon === 'yes') ? 0.25 : 0.75;
    
    // 10. Hand (only if weapon or can pick up)
    if (hand === 'l') { prob *= 0.11; } else if (hand === 'r') { prob *= 0.89; }
    
} else if (loot === 'can pick up') {
    prob *= 0.55; // Can pick up item 55%
    // 10. Hand (only if weapon or can pick up)
    if (hand === 'l') { prob *= 0.11; } else if (hand === 'r') { prob *= 0.89; }

} else if (loot === 'none') {
    // No operation needed for loot === 'none'
} else {
    return errorMsg;
}

// 11. Halloween Pumpkin
if (pumpkin === 'carved') { prob *= 0.225; } 
else if (pumpkin === 'lantern') { prob *= 0.025; } 
else { prob *= 0.75; } 

// --- Final Formatting ---
let percent = (prob * 100).toFixed(6); 
let result = '';

if (prob * 100 < 0.0001) { 
    result = 'less than 0.0001'; 
} else {
    // Trim trailing zeros and limit to 4 decimal places
    result = parseFloat(percent).toFixed(4).replace(/(\.0+)?0$/, '');
}

// Final output string
`Your naturally spawned zombie in max local difficulty is ${result}%`
