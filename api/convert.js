/*
 * Minecraft Zombie Rarity Calculator for Nightbot
 *
 * This script is designed to be fetched by a Nightbot command.
 * It expects a variable `q` (from `$(querystring)`) containing the user's input.
 *
 * Example Input `q`:
 * "Zombie villager? yes/no (yes) ◆ Baby? yes/no (yes) ◆ Jockey? yes/no (yes) ◆ Armor? yes/no (yes) ◆ Armor pieces (if yes) 1/2/3/4 (4) ◆ Armor pieces enchanted (if yes) 0/1/2/3/4 (0) ◆ Armor type (if yes) L/co/ch/i/g/d (d) ◆ Loot? sword/shovel/can pick up/none (sword) ◆ Enchanted weapon? (if yes) yes/no (no) ◆ Hand? (if yes) R/L (l) ◆ Halloween pumpkin? (if yes) carved/lantern (x)"
 */

(function() {
    // The error message to return on bad input
    const errorMessage = "Wrong input. Input should be in this state “ !zr Zombie villager? yes/no (x) ◆ Baby? yes/no (x) ◆ Jockey? yes/no (x) ◆ Armor? yes/no (x) ◆ Armor pieces (if yes) 1/2/3/4 (x) ◆ Armor pieces enchanted (if yes) 0/1/2/3/4 (x) ◆ Armor type (if yes) L/co/ch/i/g/d (x) ◆ Loot? sword/shovel/can pick up/none (x) ◆ Enchanted weapon? (if yes) yes/no (x) ◆ Hand? (if yes) R/L (x) ◆ Halloween pumpkin? (if yes) carved/lantern (x) “ if no ignore the question. Check out my creator twitch.tv/hassannm7";

    try {
        // Helper function for factorial (for combinations)
        function factorial(n) {
            if (n < 0) return -1;
            if (n === 0) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        // Helper function for combinations C(n, k)
        function combinations(n, k) {
            if (k < 0 || k > n) return 0;
            return factorial(n) / (factorial(k) * factorial(n - k));
        }

        // Check if query variable `q` exists
        if (typeof q === 'undefined' || q.length === 0) {
            return errorMessage;
        }

        const parts = q.split(' ◆ ');
        if (parts.length !== 11) {
            return errorMessage;
        }

        // Regex to extract the value from within the parentheses
        const valueRegex = /\(([^)]+)\)/;
        const vals = parts.map(part => {
            const match = part.match(valueRegex);
            if (!match || match[1] === undefined) {
                // This will be caught by the outer try/catch
                throw new Error("Bad input format");
            }
            return match[1].toLowerCase().trim();
        });

        // --- Start Calculation ---
        let rarity = 0.20; // Base 20% chance to spawn a zombie

        // 1. Zombie Villager
        rarity *= (vals[0] === 'yes') ? 0.05 : 0.95;

        // 2. Baby
        rarity *= (vals[1] === 'yes') ? 0.05 : 0.95;

        // 3. Jockey (Assuming Chicken Jockey)
        // Note: This is 5% chance *if* it's a baby.
        // But the input implies they are separate. We follow the input structure.
        rarity *= (vals[2] === 'yes') ? 0.05 : 0.95;

        // 4. Armor
        const hasArmor = (vals[3] === 'yes');
        rarity *= hasArmor ? 0.15 : 0.85;

        if (hasArmor) {
            // 5. Armor Pieces
            let numPieces = 0;
            switch (vals[4]) {
                case '1': rarity *= 1.0; numPieces = 1; break; // User's probability
                case '2': rarity *= 0.90; numPieces = 2; break; // User's probability
                case '3': rarity *= 0.81; numPieces = 3; break; // User's probability
                case '4': rarity *= 0.729; numPieces = 4; break; // User's probability
            }

            // 6. Enchanted Pieces
            if (numPieces > 0) {
                let numEnchanted = parseInt(vals[5], 10);
                if (isNaN(numEnchanted) || numEnchanted < 0 || numEnchanted > numPieces) {
                    numEnchanted = 0; // Default to 0 if input is invalid
                }
                // Binomial probability: C(n, k) * p^k * (1-p)^(n-k)
                // Here p = 0.5, so p^k * (1-p)^(n-k) = 0.5^n
                let enchantedMultiplier = combinations(numPieces, numEnchanted) * Math.pow(0.5, numPieces);
                rarity *= enchantedMultiplier;
            }

            // 7. Armor Type
            switch (vals[6]) {
                case 'l': rarity *= 0.236; break;
                case 'co': rarity *= 0.3223; break;
                case 'ch': rarity *= 0.0973; break;
                case 'g': rarity *= 0.3329; break;
                case 'i': rarity *= 0.011; break;
                case 'd': rarity *= 0.0004; break;
            }
        }

        // 8. Loot
        const lootType = vals[7];
        const hasWeapon = (lootType === 'sword' || lootType === 'shovel');
        const canPickup = (lootType === 'can pick up');

        if (hasWeapon) {
            // Has a weapon (5% chance)
            rarity *= 0.05;
            // Sword (1/3) or Shovel (2/3)
            rarity *= (lootType === 'sword') ? (1 / 3) : (2 / 3);

            // 9. Enchanted Weapon
            rarity *= (vals[8] === 'yes') ? 0.25 : 0.75;
        } else if (canPickup) {
            // No weapon (95%), but can pick up (55%)
            rarity *= (1 - 0.05) * 0.55;
        } else {
            // 'none' - No weapon (95%), cannot pick up (45%)
            rarity *= (1 - 0.05) * (1 - 0.55);
        }

        // 10. Hand
        // Only applies if has weapon or can pick up
        if (hasWeapon || canPickup) {
            rarity *= (vals[9] === 'l') ? 0.11 : 0.89;
        }

        // 11. Halloween Pumpkin
        switch (vals[10]) {
            case 'carved': rarity *= 0.225; break;
            case 'lantern': rarity *= 0.025; break;
            default: rarity *= 0.75; break; // 'x' or anything else
        }

        // --- Format Output ---
        if (rarity === 0) {
            return "This zombie is impossible to spawn naturally.";
        }

        const inverseRarity = 1 / rarity;
        const percentRarity = rarity * 100;

        let percentString;
        if (percentRarity < 0.00001) {
            // Use exponential notation for very small numbers
            percentString = percentRarity.toExponential(2) + "%";
        } else {
            // Use fixed decimal for larger numbers
            percentString = percentRarity.toFixed(10) + "%";
        }

        return "Your naturally spawned zombie rarity in max local difficulty is 1/" + inverseRarity.toFixed(0) + " or " + percentString;

    } catch (e) {
        // If anything fails (parsing, etc.), return the error message
        return errorMessage;
    }
})();

