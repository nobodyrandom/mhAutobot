// ==UserScript==
// @name        MouseHunt AutoBot ENHANCED + REVAMP
// @author      NobodyRandom, Hazado, Ooi Keng Siang, CnN
// @version    	2.2.2b
// @description Currently the most advanced script for automizing MouseHunt and MH BETA UI. Supports ALL new areas and FIREFOX. Revamped of original by Ooi + Enhanced Version by CnN
// @icon        https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/mice.png
// @require     https://code.jquery.com/jquery-2.2.2.min.js
// @require     https://greasyfork.org/scripts/7601-parse-db-min/code/Parse%20DB%20min.js?version=132819
// @require     https://greasyfork.org/scripts/16046-ocrad/code/OCRAD.js?version=100053
// @require     https://greasyfork.org/scripts/16036-mh-auto-kr-solver/code/MH%20Auto%20KR%20Solver.js?version=102270
// @namespace   https://greasyfork.org/users/6398, http://ooiks.com/blog/mousehunt-autobot, https://devcnn.wordpress.com/
// @updateURL	https://greasyfork.org/scripts/32971-mousehunt-autobot-enhanced-revamp/code/MouseHunt%20AutoBot%20ENHANCED%20+%20REVAMP.meta.js
// @downloadURL	https://greasyfork.org/scripts/32971-mousehunt-autobot-enhanced-revamp/code/MouseHunt%20AutoBot%20ENHANCED%20+%20REVAMP.user.js
// @license 	GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @exclude		http://*.google.com/*
// @exclude		https://*.google.com/*
// @grant		unsafeWindow
// @grant		GM_info
// @run-at		document-end
// ==/UserScript==

// == Basic User Preference Setting (Begin) ==
// // The variable in this section contain basic option will normally edit by most user to suit their own preference
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // ERROR CHECKING ONLY: Script debug
var debug = true;
// // ERROR CHECKING ONLY: KR debug
var debugKR = false;

// // Extra delay time before sounding the horn. (in seconds)
// // Default: 10 - 360
var hornTimeDelayMin = 10;
var hornTimeDelayMax = 360;

// // Bot aggressively by ignore all safety measure such as check horn image visible before sounding it. (true/false)
// // Note: Highly recommended to turn off because it increase the chances of getting caught in botting.
// // Note: It will ignore the hornTimeDelayMin and hornTimeDelayMax.
// // Note: It may take a little bit extra of CPU processing power.
var aggressiveMode = false;

// // Enable trap check once an hour. (true/false)
var enableTrapCheck = false;

// // Trap check time different value (00 minutes - 45 minutes)
// // Note: Every player had different trap check time, set your trap check time here. It only take effect if enableTrapCheck = true;
// // Example: If you have XX:00 trap check time then set 00. If you have XX:45 trap check time, then set 45.
var trapCheckTimeDiff = 15;

// // Extra delay time to trap check. (in seconds)
// // Note: It only take effect if enableTrapCheck = true;
var checkTimeDelayMin = 15;
var checkTimeDelayMax = 120;

// // Play sound when encounter king's reward (true/false)
var isKingWarningSound = false;

// // Which sound to play when encountering king's reward (need to be .mp3)
var kingWarningSound = 'https://raw.githubusercontent.com/nobodyrandom/libs/master/resource/horn.mp3';

// // Which email to send KR notiff to (leave blank to disable feature)
var kingRewardEmail = '';

// // Which number to send SMS to
var kingRewardPhone = '';

// // Verification code sent to this number
var kingRewardPhoneVerify = '';

// // Play sound when no more cheese (true/false)
var isNoCheeseSound = false;

// // Reload the the page according to kingPauseTimeMax when encountering King Reward. (true/false)
// // Note: No matter how many time you refresh, the King's Reward won't go away unless you resolve it manually.
var reloadKingReward = false;

// // Duration of pausing the script before reload the King's Reward page (in seconds)
// // Note: It only take effect if reloadKingReward = true;
var kingPauseTimeMax = 18000;

// // Auto solve KR
var isAutoSolve = true;

// // Extra delay time before solving KR. (in seconds)
// // Default: 10 - 30
var krDelayMin = 10;
var krDelayMax = 30;

// // Time to start and stop solving KR. (in hours, 24-hour format)
// // Example: Script would not auto solve KR between 00:00 - 6:00 when krStopHour = 0 & krStartHour = 6;
// // To disable this feature, set both to the same value.
var krStopHour = 3;
var krStartHour = 4;

// // Extra delay time to start solving KR after krStartHour. (in minutes)
var krStartHourDelayMin = 10;
var krStartHourDelayMax = 30;

// // Maximum retry of solving KR.
// // If KR solved more than this number, pls solve KR manually ASAP in order to prevent MH from caught in botting
var kingsRewardRetryMax = 3;

// // State to indicate whether to save KR image into localStorage or not
var saveKRImage = true;

// // Maximum number of KR image to be saved into localStorage
var maxSaveKRImage = 75;

// // The script will pause if player at different location that hunt location set before. (true/false)
// // Note: Make sure you set showTimerInPage to true in order to know what is happening.
var pauseAtInvalidLocation = false;

// // Time to wait after trap selector clicked (in second)
var secWait = 7;

// // Stop trap arming after X retry
var armTrapRetry = 3;

// // Maximum number of log to be saved into sessionStorage
var maxSaveLog = 750;

// // Popup on KR or not, the script will throw out an alert box if true.
var autoPopupKR = false;

// == Basic User Preference Setting (End) ==

// == Advance User Preference Setting (Begin) ==
// // The variable in this section contain some advance option that will change the script behavior.
// // Edit this variable only if you know what you are doing
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Display timer and message in page title. (true/false)
var showTimerInTitle = true;

// // Embed a timer in page to show next hunter horn timer, highly recommended to turn on. (true/false)
// // Note: You may not access some option like pause at invalid location if you turn this off.
var showTimerInPage = true;

// // Display the last time the page did a refresh or reload. (true/false)
var showLastPageLoadTime = true;

// // Default time to reload the page when bot encounter error. (in seconds)
var errorReloadTime = 60;

// // Time interval for script timer to update the time. May affect timer accuracy if set too high value. (in seconds)
var timerRefreshInterval = 1;

// // Trap arming status
var LOADING = -1;
var NOT_FOUND = 0;
var ARMED = 1;

// // Trap List
var objTrapList = {
    weapon: [],
    base: [],
    trinket: [],
    bait: []
};

// // Trap Collection
var objTrapCollection = {
    weapon: ["Chrome Temporal Turbine", "Chrome Grand Arcanum Trap", "Rocket Propelled Gavel Trap", "Timesplit Dissonance Weapon", "Meteor Prison Core Trap", "Sprinkly Cupcake Surprise Trap", "New Horizon Trap", "New Year's Fireworks Trap", "Holiday Hydro Hailstone Trap", "Festive Forgotten Fir Trap", "Interdimensional Crossbow Trap", "Droid Archmagus Trap", "Sandcastle Shard", "Crystal Mineral Crusher Trap", "Biomolecular Re-atomizer Trap", "Chrome Arcane Capturing Rod", "Law Laser Trap", "Zugzwang's Ultimate Move", "2010 Blastoff Trap", "2012 Big Boom Trap", "500 Pound Spiked Crusher", "Ambrosial Portal", "Ambush", "Ancient Box Trap", "Ancient Gauntlet", "Ancient Spear Gun", "Arcane Blast Trap", "Arcane Capturing Rod Of Never Yielding Mystery", "Bandit Deflector", "Birthday Candle Kaboom", "Birthday Party Piñata Bonanza", "Blackstone Pass Trap", "Bottomless Grave", "Brain Extractor", "Bubbles: The Party Crasher Trap", "Cackle Lantern Trap", "Candy Crusher Trap", "Chesla's Revenge", "Christmas Cracker Trap", "Chrome DeathBot", "Chrome DrillBot", "Chrome MonstroBot", "Chrome Nannybot", "Chrome Oasis Water Node Trap", "Chrome Onyx Mallet", "Chrome Phantasmic Oasis Trap", "Chrome RhinoBot", "Chrome Sphynx Wrath", "Chrome Tacky Glue Trap", "Clockapult of Time", "Clockapult of Winter Past", "Clockwork Portal Trap", "Crystal Crucible Trap", "Crystal Tower", "Digby DrillBot", "Dimensional Chest Trap", "Double Diamond Adventure", "Dragon Lance", "Dreaded Totem Trap", "Endless Labyrinth Trap", "Engine Doubler", "Enraged RhinoBot", "Event Horizon", "Explosive Toboggan Ride", "Festive Gauntlet Crusher", "Fluffy DeathBot", "Focused Crystal Laser", "The Forgotten Art of Dance", "Forgotten Pressure Plate Trap", "Giant Speaker", "Gingerbread House Surprise", "Glacier Gatler", "Gorgon Trap", "Grand Arcanum Trap", "Grungy DeathBot", "Harpoon Gun", "Heat Bath", "High Tension Spring", "HitGrab Horsey", "HitGrab Rainbow Rockin' Horse", "HitGrab Rockin' Horse", "Horrific Venus Mouse Trap", "Ice Blaster", "Ice Maiden", "Icy RhinoBot", "Infinite Labyrinth Trap", "Isle Idol Trap", "Isle Idol Trap", "Isle Idol Trap", "Kraken Chaos", "The Law Draw", "Maniacal Brain Extractor", "Mouse DeathBot", "Mouse Hot Tub", "Mouse Mary O'Nette", "Mouse Rocketine", "Mouse Trebuchet", "Multi-Crystal Laser", "Mutated Venus Mouse Trap", "Mysteriously unYielding Null-Onyx Rampart of Cascading Amperes", "Mystic Pawn Pincher", "Nannybot", "Net Cannon", "Ninja Ambush Trap", "Nutcracker Nuisance Trap", "NVMRC Forcefield Trap", "Oasis Water Node Trap", "Obelisk of Incineration", "Obelisk of Slumber", "Obvious Ambush Trap", "Onyx Mallet", "PartyBot", "Phantasmic Oasis Trap", "Pneumatic Tube Trap", "Pumpkin Pummeler", "Reaper's Perch", "Rewers Riposte", "RhinoBot", "Rune Shark Trap", "S.A.M. F.E.D. DN-5", "S.L.A.C.", "S.L.A.C. II", "S.U.P.E.R. Scum Scrubber", "Sandstorm MonstroBot", "Sandtail Sentinel", "School of Sharks", "Scum Scrubber", "Shrink Ray Trap", "Sinister Portal", "Snow Barrage", "Snowglobe Trap", "Soul Catcher", "Soul Harvester", "Sphynx Wrath", "Stale Cupcake Golem Trap", "Steam Laser Mk. I", "Steam Laser Mk. II", "Steam Laser Mk. II (Broken!)", "Steam Laser Mk. III", "Supply Grabber", "Swiss Army Mouse Trap", "Tacky Glue Trap", "Tarannosaurus Rex Trap", "Technic Pawn Pincher", "Temporal Turbine", "Terrifying Spider Trap", "Thorned Venus Mouse Trap", "Ultra MegaMouser MechaBot Trap", "Veiled Vine Trap", "Venus Mouse Trap", "Warden Slayer Trap", "Warpath Thrasher", "Wrapped Gift Trap", "Zugzwang's First Move", "Zugzwang's Last Move", "Zurreal's Folly"],
    base: ["Ancient Booster Base", "Ultimate Iceberg Base", "Clockwork Base", "Sprinkly Sweet Cupcake Birthday Base", "Rooster Jade Base", "2017 New Year's Base", "Aqua Base", "Attuned Enerchi Induction Base", "Bacon Base", "Bamboozler Base", "Birthday Cake Base", "Birthday Dragée Cake Base", "Bronze Tournament Base", "Candy Cane Base", "Carrot Birthday Cake Base", "Cheesecake Base", "Chocolate Birthday Cake Base", "Claw Shot Base", "Crushed Birthday Cake Base", "Cupcake Birthday Base", "Deep Freeze Base", "Dehydration Base", "Depth Charge Base", "Dragon Jade Base", "Eerie Base", "Eerier Base", "Enerchi Induction Base", "Explosive Base", "Extra Sweet Cupcake Birthday Base", "Fan Base", "Firecracker Base", "Fissure Base", "Fracture Base", "Gingerbread Base", "Golden Tournament Base", "Hearthstone Base", "Horse Jade Base", "Hothouse Base", "Jade Base", "Labyrinth Base", "Living Base", "Magma Base", "Magnet Base", "Minotaur Base", "Molten Shrapnel Base", "Monkey Jade Base", "Monolith Base", "Papyrus Base", "Physical Brace Base", "Polar Base", "Polluted Base", "Refined Pollutinum Base", "Remote Detonator Base", "Rift Base", "Runic Base", "Seasonal Base", "Sheep Jade Base", "Silver Tournament Base", "Skello-ton Base", "Snake Jade Base", "Soiled Base", "Spellbook Base", "Spiked Base", "Stone Base", "Tidal Base", "Tiki Base", "Tribal Base", "Tribal Kaboom Base", "Washboard Base", "Wooden Base", "Wooden Base with Target"],
    bait: ["Magical Rancid Radioactive Blue Cheese", "Undead String Emmental", "Ancient String Cheese", "Runic String Cheese", "Sunrise Cheese", "Dumpling Cheese", "Crescent Cheese", "Ancient Cheese", "Arctic Asiago Cheese", "Ascended Cheese", "Brie Cheese", "Brie String Cheese", "Candy Corn Cheese", "Checkmate Cheese", "Cheddar Cheese", "Cherry Cheese", "Combat Cheese", "Creamy Havarti Cheese", "Crunchy Cheese", "Crunchy Havarti Cheese", "Cupcake Colby", "Dewthief Camembert", "Diamond Cheese", "Duskshade Camembert", "Extra Sweet Cupcake Colby", "Festive Feta", "Fishy Fromage", "Fusion Fondue", "Galleon Gouda", "Gauntlet Cheese Tier 2", "Gauntlet Cheese Tier 3", "Gauntlet Cheese Tier 4", "Gauntlet Cheese Tier 5", "Gauntlet Cheese Tier 6", "Gauntlet Cheese Tier 7", "Gauntlet Cheese Tier 8", "Gemstone Cheese", "Ghoulgonzola Cheese", "Gilded Cheese", "Gingerbread Cheese", "Glowing Gruyere Cheese", "Glutter Cheese", "Gnarled Cheese", "Gouda Cheese", "Graveblossom Camembert", "Grilled Cheese", "Gumbo Cheese", "Inferno Havarti Cheese", "Lactrodectus Lancashire Cheese", "Limelight Cheese", "Lunaria Camembert", "Magical Havarti Cheese", "Magical String Cheese", "Maki Cheese", "Maki String Cheese", "Marble Cheese", "Marble String Cheese", "Marshmallow Monterey", "Master Fusion Cheese", "Mineral Cheese", "Moon Cheese", "Mozzarella Cheese", "Null Onyx Gorgonzola", "Nutmeg Cheese", "Onyx Gorgonzola", "Polluted Parmesan Cheese", "Pungent Havarti Cheese", "Radioactive Blue Cheese", "Rancid Radioactive Blue Cheese", "Rift Combat Cheese", "Rift Glutter Cheese", "Rift Rumble Cheese", "Rift Susheese Cheese", "Riftiago Cheese", "Resonator Cheese", "Rockforth Cheese", "Rumble Cheese", "Runic Cheese", "Runny Cheese", "Seasoned Gouda", "Shell Cheese", "Snowball Bocconcini", "Spicy Havarti Cheese", "SUPER|brie+", "Susheese Cheese", "Sweet Havarti Cheese", "Swiss Cheese", "Swiss String Cheese", "Terre Ricotta Cheese", "Toxic Brie", "Toxic SUPER|brie+", "Undead Emmental", "Vanilla Stilton Cheese", "Vengeful Vanilla Stilton Cheese", "White Cheddar Cheese", "Wicked Gnarly Cheese"],
    trinket: ["Rift Airship Charm", "Ultimate Wealth Charm", "Super Enerchi Charm", "Rift Charm", "Nightlight Charm", "Rift Wealth Charm", "Rift Extreme Luck Charm", "Rift Luck Charm", "Rift Super Luck Charm", "Rift Antiskele Charm", "Realm Ripper Charm", "Timesplit Charm", "Lucky Valentine Charm", "Festive Anchor Charm", "2014 Charm", "2015 Charm", "2016 Charm", "2017 Charm", "Airship Charm", "Amplifier Charm", "Ancient Charm", "Antiskele Charm", "Artisan Charm", "Athlete Charm", "Attraction Charm", "Baitkeep Charm", "Black Powder Charm", "Blue Double Sponge Charm", "Brain Charm", "Bravery Charm", "Cackle Charm", "Cactus Charm", "Candy Charm", "Champion Charm", "Cherry Charm", "Chrome Charm", "Clarity Charm", "Compass Magnet Charm", "Crucible Cloning Charm", "Cupcake Charm", "Dark Chocolate Charm", "Derr Power Charm", "Diamond Boost Charm", "Door Guard Charm", "Dragonbane Charm", "Dragonbreath Charm", "Dreaded Charm", "Dusty Coal Charm", "Eggscavator Charge Charm", "Eggstra Charge Charm", "Eggstra Charm", "Elub Power Charm", "EMP400 Charm", "Empowered Anchor Charm", "Enerchi Charm", "Extra Spooky Charm", "Extra Sweet Cupcake Charm", "Extreme Ancient Charm", "Extreme Attraction Charm", "Extreme Luck Charm", "Extreme Polluted Charm", "Extreme Power Charm", "Extreme Wealth Charm", "Festive Ultimate Luck Charm", "Festive Ultimate Power Charm", "Firecracker Charm", "First Ever Charm", "Flamebane Charm", "Forgotten Charm", "Freshness Charm", "Gargantua Guarantee Charm", "Gemstone Boost Charm", "Gilded Charm", "Glowing Gourd Charm", "Gnarled Charm", "Golden Anchor Charm", "Greasy Glob Charm", "Growth Charm", "Grub Salt Charm", "Grub Scent Charm", "Grubling Bonanza Charm", "Grubling Chow Charm", "Haunted Ultimate Luck Charm", "Horsepower Charm", "Hydro Charm", "Lantern Oil Charm", "Luck Charm", "Lucky Power Charm", "Lucky Rabbit Charm", "Magmatic Crystal Charm", "Mining Charm", "Mobile Charm", "Monger Charm", "Monkey Fling Charm", "Nanny Charm", "Nerg Power Charm", "Nightshade Farming Charm", "Nitropop Charm", "Oxygen Burst Charm", "Party Charm", "Polluted Charm", "Power Charm", "Prospector's Charm", "Rainbow Luck Charm", "Ramming Speed Charm", "Red Double Sponge Charm", "Red Sponge Charm", "Regal Charm", "Rift Power Charm", "Rift Ultimate Luck Charm", "Rift Ultimate Lucky Power Charm", "Rift Ultimate Power Charm", "Rift Vacuum Charm", "Roof Rack Charm", "Rook Crumble Charm", "Rotten Charm", "Safeguard Charm", "Scholar Charm", "Scientist's Charm", "Searcher Charm", "Shadow Charm", "Shamrock Charm", "Shattering Charm", "Sheriff's Badge Charm", "Shielding Charm", "Shine Charm", "Shortcut Charm", "Smart Water Jet Charm", "Snakebite Charm", "Snowball Charm", "Soap Charm", "Softserve Charm", "Spellbook Charm", "Spiked Anchor Charm", "Sponge Charm", "Spooky Charm", "Spore Charm", "Stagnant Charm", "Sticky Charm", "Striker Charm", "Super Ancient Charm", "Super Attraction Charm", "Super Brain Charm", "Super Cactus Charm", "Super Luck Charm", "Super Nightshade Farming Charm", "Super Polluted Charm", "Super Power Charm", "Super Regal Charm", "Super Rift Vacuum Charm", "Super Rotten Charm", "Super Salt Charm", "Super Soap Charm", "Super Spore Charm", "Super Warpath Archer Charm", "Super Warpath Cavalry Charm", "Super Warpath Commander's Charm", "Super Warpath Mage Charm", "Super Warpath Scout Charm", "Super Warpath Warrior Charm", "Super Wealth Charm", "Supply Schedule Charm", "Tarnished Charm", "Taunting Charm", "Treasure Trawling Charm", "Ultimate Anchor Charm", "Ultimate Ancient Charm", "Ultimate Attraction Charm", "Ultimate Charm", "Ultimate Luck Charm", "Ultimate Lucky Power Charm", "Ultimate Polluted Charm", "Ultimate Power Charm", "Ultimate Spore Charm", "Uncharged Scholar Charm", "Unstable Charm", "Valentine Charm", "Warpath Archer Charm", "Warpath Cavalry Charm", "Warpath Commander's Charm", "Warpath Mage Charm", "Warpath Scout Charm", "Warpath Warrior Charm", "Water Jet Charm", "Wax Charm", "Wealth Charm", "Wild Growth Charm", "Winter Builder Charm", "Winter Charm", "Winter Hoarder Charm", "Winter Miser Charm", "Winter Screw Charm", "Winter Spring Charm", "Winter Wood Charm", "Yellow Double Sponge Charm", "Yellow Sponge Charm"]
};

// // Best weapon/base/charm/bait pre-determined by user. Edit ur best weapon/base/charm/bait in ascending order. e.g. [best, better, good]
var objBestTrap = {
    weapon: {
        arcane: ['New Horizon Trap', 'Event Horizon', 'Grand Arcanum Trap', 'Chrome Arcane Capturing Rod', 'Arcane Blast Trap', 'Arcane Capturing Rod Of Nev'],
        draconic: ['Dragon Lance', 'Ice Maiden'],
        forgotten: ['Infinite Labyrinth Trap', 'Endless Labyrinth Trap', 'Crystal Crucible Trap', 'Stale Cupcake Golem Trap', 'Tarannosaurus Rex Trap', 'Crystal Mineral Crusher Trap', 'The Forgotten Art of Dance'],
        hydro: ['School of Sharks', 'Rune Shark Trap', 'Chrome Phantasmic Oasis Trap', 'Phantasmic Oasis Trap', 'Oasis Water Node Trap', 'Steam Laser Mk. III', 'Steam Laser Mk. II', 'Steam Laser Mk. I', 'Ancient Spear Gun'],
        law: ['Meteor Prison Core Trap', 'The Law Draw', 'Law Laser Trap', 'Engine Doubler', 'Bandit Deflector', 'Supply Grabber', 'S.L.A.C. II', 'S.L.A.C.'],
        physical: ['Chrome MonstroBot', 'Sandstorm MonstroBot', 'Sandtail Sentinel', 'Enraged RhinoBot'],
        rift: ['Mysteriously unYielding', 'Multi-Crystal Laser', 'Focused Crystal Laser', 'Biomolecular Re-atomizer Trap', 'Crystal Tower'],
        shadow: ['Temporal Turbine', 'Clockwork Portal Trap', 'Reaper\'s Perch', 'Dreaded Totem Trap', 'Candy Crusher Trap', 'Clockapult of Time', 'Clockapult of Winter Past'],
        tactical: ['Chrome Sphynx Wrath', 'Sphynx Wrath', 'Zugzwang\'s Ultimate Move', 'Zugzwang\'s First Move']
    },
    base: {
        luck: ['Minotaur Base', 'Fissure Base', 'Rift Base', 'Attuned Enerchi Induction Base', 'Monkey Jade Base', 'Sheep Jade Base', 'Depth Charge Base', 'Horse Jade Base', 'Snake Jade Base', 'Dragon Jade Base', 'Eerier Base', 'Papyrus Base'],
        power: ['Minotaur Base', 'Tidal Base', 'Golden Tournament Base', 'Spellbook Base']
    }
};

// // Fiery Warpath Preference
var commanderCharm = ['Super Warpath Commander\'s', 'Warpath Commander\'s'];
var objPopulation = {
    WARRIOR: 0,
    SCOUT: 1,
    ARCHER: 2,
    CAVALRY: 3,
    MAGE: 4,
    ARTILLERY: 5,
    name: ['Warrior', 'Scout', 'Archer', 'Cavalry', 'Mage', 'Artillery']
};
var g_arrFWSupportRetreat = [0, 10, 18, 26];
var g_fwStreakLength = 15;
var objDefaultFW = {
    weapon: 'Sandtail Sentinel',
    base: 'Physical Brace',
    focusType: 'NORMAL',
    priorities: 'HIGHEST',
    cheese: new Array(g_fwStreakLength).fill('Gouda'),
    charmType: new Array(g_fwStreakLength).fill('Warpath'),
    special: new Array(g_fwStreakLength).fill('None'),
    lastSoldierConfig: 'CONFIG_GOUDA',
    includeArtillery: true,
    disarmAfterSupportRetreat: false,
    warden: {
        before: {
            weapon: '',
            base: '',
            trinket: '',
            bait: ''
        },
        after: {
            weapon: '',
            base: '',
            trinket: '',
            bait: ''
        }
    }
};

// // Living Garden Preference
var bestLGBase = ['Living Base', 'Hothouse Base'];
var bestSalt = ['Super Salt', 'Grub Salt'];
var bestAnchor = ['Golden Anchor', 'Spiked Anchor', 'Empowered Anchor'];
var bestOxygen = ['Oxygen Burst', 'Empowered Anchor'];
var wasteCharm = ['Tarnished', 'Unstable', 'Wealth'];
var redSpongeCharm = ['Red Double', 'Red Sponge'];
var yellowSpongeCharm = ['Yellow Double', 'Yellow Sponge'];
var spongeCharm = ['Double Sponge', 'Sponge'];
var supplyDepotTrap = ['Supply Grabber', 'S.L.A.C. II', 'The Law Draw', 'S.L.A.C.'];
var raiderRiverTrap = ['Bandit Deflector', 'S.L.A.C. II', 'The Law Draw', 'S.L.A.C.'];
var daredevilCanyonTrap = ['Engine Doubler', 'S.L.A.C. II', 'The Law Draw', 'S.L.A.C.'];
var coalCharm = ['Magmatic Crystal', 'Black Powder', 'Dusty Coal'];
//var chargeCharm = ['Eggstra Charge', 'Eggscavator'];
var scOxyBait = ['Fishy Fromage', 'Gouda'];

// // Sunken City Preference
// // DON'T edit this variable if you don't know what are you editing
var objSCZone = {
    ZONE_NOT_DIVE: 0,
    ZONE_DEFAULT: 1,
    ZONE_CORAL: 2,
    ZONE_SCALE: 3,
    ZONE_BARNACLE: 4,
    ZONE_TREASURE: 5,
    ZONE_DANGER: 6,
    ZONE_DANGER_PP: 7,
    ZONE_OXYGEN: 8,
    ZONE_BONUS: 9,
    ZONE_DANGER_PP_LOTA: 10
};
var bestSCBase = ['Minotaur Base', 'Fissure Base', 'Depth Charge Base'];

// // Spring Egg Hunt
var chargeCharm = ['Eggstra Charge', 'Eggscavator'];
var chargeHigh = 17;
var chargeMedium = 12;

// // Labyrinth
var bestLabyBase = ['Minotaur Base', 'Labyrinth Base'];
var objCodename = {
    FEALTY: "y",
    TECH: "h",
    SCHOLAR: "s",
    TREASURY: "t",
    FARMING: "f",
    PLAIN: "p",
    SUPERIOR: "s",
    EPIC: "e",
    SHORT: "s",
    MEDIUM: "m",
    LONG: "l"
};
var arrHallwayOrder = [
    'sp', 'mp', 'lp',
    'ss', 'ms', 'ls',
    'se', 'me', 'le'];
var objDefaultLaby = {
    districtFocus: 'None',
    between0and14: ['lp'],
    between15and59: ['sp', 'ls'],
    between60and100: ['sp', 'ss', 'le'],
    chooseOtherDoors: false,
    typeOtherDoors: "SHORTEST_FEWEST",
    securityDisarm: false,
    lastHunt: 0,
    armOtherBase: 'false',
    disarmCompass: true,
    nDeadEndClue: 0,
    weaponFarming: 'Forgotten'
};
var objLength = {
    SHORT: 0,
    MEDIUM: 1,
    LONG: 2
};

// // Furoma Rift
var objFRBattery = {
    level: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    name: ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
    capacity: [20, 45, 75, 120, 200, 310, 450, 615, 790, 975],
    cumulative: [20, 65, 140, 260, 460, 770, 1220, 1835, 2625, 3600]
};

var g_arrHeirloom = []; // to be refresh once page reload

var g_objConstTrap = {
    bait: {
        ANY_HALLOWEEN: {
            sort: 'any',
            name: ['Ghoulgonzola', 'Candy Corn']
        },
        ANY_MASTER: {
            sort: 'any',
            name: ['Rift Glutter', 'Rift Combat', 'Rift Susheese']
        },
        ANY_LUNAR: {
            sort: 'any',
            name: ['Moon Cheese', 'Crescent Cheese']
        },
        ANY_FESTIVE_BRIE: {
            sort: 'best',
            name: ['Arctic Asiago', 'Nutmeg', 'Snowball Bocconcini', 'Festive Feta', 'Gingerbread', 'Brie Cheese']
        },
        ANY_FESTIVE_GOUDA: {
            sort: 'best',
            name: ['Arctic Asiago', 'Nutmeg', 'Snowball Bocconcini', 'Festive Feta', 'Gingerbread', 'Gouda']
        },
        ANY_FESTIVE_SB: {
            sort: 'best',
            name: ['Arctic Asiago', 'Nutmeg', 'Snowball Bocconcini', 'Festive Feta', 'Gingerbread', 'SUPER']
        }
    },
    trinket: {
        GAC_EAC: {
            sort: 'best',
            name: ['Golden Anchor', 'Empowered Anchor']
        },
        SAC_EAC: {
            sort: 'best',
            name: ['Spiked Anchor', 'Empowered Anchor']
        },
        UAC_EAC: {
            sort: 'best',
            name: ['Ultimate Anchor', 'Empowered Anchor']
        },
        'ANCHOR_FAC/EAC': {
            sort: 'best',
            name: ['Festive Anchor Charm', 'Empowered Anchor Charm']
        }
    }
};

// // Addon code (default: empty string)
var addonCode = "";

// == Advance User Preference Setting (End) ==

// WARNING - Do not modify the code below unless you know how to read and write the script.

// All global variable declaration and default value
var g_strHTTP = 'http';
var g_strVersion = "";
var g_strScriptHandler = "";
var scriptVersion = GM_info.script.version;
var fbPlatform = false;
var hiFivePlatform = false;
var mhPlatform = false;
var mhMobilePlatform = false;
var secureConnection = false;
var lastDateRecorded = new Date();
var hornTime = 900;
var hornTimeDelay = 0;
var checkTimeDelay = 0;
var isKingReward = false;
var lastKingRewardSumTime;
var kingPauseTime;
var baitQuantity = -1;
var g_nBaitQuantity = -1;
var huntLocation;
var currentLocation;
var today = new Date();
var checkTime = (today.getMinutes() >= trapCheckTimeDiff) ? 3600 + (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds()) : (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds());
today = undefined;
var hornRetryMax = 10;
var hornRetry = 0;
var nextActiveTime = 900;
var timerInterval = 2;
var checkMouseResult = null;
var armingQueue = [];
var dequeueingCTA = false;
var dequeueIntRunning = false;
var mouseList = [];
var eventLocation = "None";
var discharge = false;
var arming = false;
var best = 0;
var g_arrArmingList = [];
var kingsRewardRetry = 0;
var keyKR = [];
var separator = "~";

// element in page
var titleElement;
var nextHornTimeElement;
var checkTimeElement;
var kingTimeElement;
var lastKingRewardSumTimeElement;
var optionElement;
var travelElement;
var hornButton = 'hornbutton';
var campButton = 'campbutton';
var header = 'header';
var hornReady = 'hornready';
var isNewUI = false;

// NOB vars
var NOBhasPuzzle;
var NOBtickerTimout;
var NOBtickerInterval;
var NOBtraps = []; // Stores ALL traps, bases, cheese etc available to user
var NOBhuntsLeft = 0; // Temp for huntFor();
var NOBpage = false;
var mapRequestFailed = false;
var clockTicking = false;
var clockNeedOn = false;
var NOBadFree = false;
var LOCATION_TIMERS = [
    ['Seasonal Garden', {
        first: 1283616000,
        length: 288000,
        breakdown: [1, 1, 1, 1],
        name: ['Summer', 'Fall', 'Winter', 'Spring'],
        color: ['Red', 'Orange', 'Blue', 'Green'],
        effective: ['tactical', 'shadow', 'hydro', 'physical']
    }],
    ['Balack\'s Cove', {
        first: 1294680060,
        length: 1200,
        breakdown: [48, 3, 2, 3],
        name: ['Low', 'Medium (in)', 'High', 'Medium (out)'],
        color: ['Green', 'Orange', 'Red', 'Orange']
    }],
    ['Forbidden Grove', {
        first: 1285704000,
        length: 14400,
        breakdown: [4, 1],
        name: ['Open', 'Closed'],
        color: ['Green', 'Red']
    }],
    ['Toxic Spill', {
        first: 1503597600,
        length: 3600,
        breakdown: [15, 16, 18, 18, 24, 24, 24, 12, 12, 24, 24, 24, 18, 18, 16, 15],
        name: ['Hero', 'Knight', 'Lord', 'Baron', 'Count', 'Duke', 'Grand Duke', 'Archduke', 'Archduke', 'Grand Duke', 'Duke', 'Count', 'Baron', 'Lord', 'Knight', 'Hero'],
        color: ['Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Green', 'Green'],
        effective: ['Rising', 'Rising', 'Rising', 'Rising', 'Rising', 'Rising', 'Rising', 'Rising', 'Falling', 'Falling', 'Falling', 'Falling', 'Falling', 'Falling', 'Falling', 'Falling']
    }],
    ['Relic Hunter', {
        url: 'http://horntracker.com/backend/relichunter.php?functionCall=relichunt'
    }]
];

// console logging
function saveToSessionStorage() {
    var i;
    var str = "";
    for (i = 0; i < arguments.length; i++) {
        if (!isNullOrUndefined(arguments[i]) && typeof arguments[i] === 'object') { // if it is object
            str += JSON.stringify(arguments[i]);
        }
        else
            str += arguments[i];
        if (i != arguments.length - 1)
            str += " ";
    }
    var key = "";
    var arrLog = [];
    for (i = 0; i < window.sessionStorage.length; i++) {
        key = window.sessionStorage.key(i);
        if (key.indexOf("Log_") > -1)
            arrLog.push(key);
    }
    if (arrLog.length > maxSaveLog) {
        arrLog = arrLog.sort();
        var count = Math.floor(maxSaveLog / 2);
        for (i = 0; i < count; i++)
            removeSessionStorage(arrLog[i]);
    }
    try {
        setSessionStorage("Log_" + (performance.timing.navigationStart + performance.now()), str);
    }
    catch (e) {
        if (e.name == "QuotaExceededError") {
            for (i = 0; i < window.sessionStorage.length; i++) {
                key = window.sessionStorage.key(i);
                if (key.indexOf('Log_') > -1)
                    removeSessionStorage(key);
            }
            saveToSessionStorage.apply(this, arguments);
        }
    }
}

console.plog = function () {
    saveToSessionStorage.apply(this, arguments);
    console.log.apply(console, arguments);
};
console.perror = function () {
    saveToSessionStorage.apply(this, arguments);
    console.error.apply(console, arguments);
};
console.pdebug = function () {
    saveToSessionStorage.apply(this, arguments);
    console.debug.apply(console, arguments);
};

// CNN KR SOLVER START
function FinalizePuzzleImageAnswer(answer) {
    if (debug) console.log("RUN FinalizePuzzleImageAnswer()");
    if (debug) console.log(answer);
    var myFrame;
    if (answer.length != 5) {
        //Get a new puzzle
        if (kingsRewardRetry >= kingsRewardRetryMax) {
            kingsRewardRetry = 0;
            setStorage("KingsRewardRetry", kingsRewardRetry);
            var strTemp = 'Max ' + kingsRewardRetryMax + 'retries. Pls solve it manually ASAP.';
            alert(strTemp);
            displayTimer(strTemp, strTemp, strTemp);
            console.debug(strTemp);
            return;
        } else {
            ++kingsRewardRetry;
            setStorage("KingsRewardRetry", kingsRewardRetry);
            var tagName = document.getElementsByTagName("a");
            for (var i = 0; i < tagName.length; i++) {
                if (tagName[i].innerText == "Click here to get a new one!") {
                    fireEvent(tagName[i], 'click');
                    if (isNewUI) {
                        myFrame = document.getElementById('myFrame');
                        if (!isNullOrUndefined(myFrame))
                            document.body.removeChild(myFrame);
                        window.setTimeout(function () {
                            CallKRSolver();
                        }, 6000);
                    }
                    return;
                }
            }
        }
    } else {
        //Submit answer
        var puzzleAns = document.getElementById("puzzle_answer");
        if (isNewUI) puzzleAns = document.getElementsByClassName("mousehuntPage-puzzle-form-code")[0];
        if (!puzzleAns) {
            console.debug("puzzleAns: " + puzzleAns);
            return;
        }
        puzzleAns.value = "";
        puzzleAns.value = answer.toLowerCase();
        var puzzleSubmit = document.getElementById("puzzle_submit");
        if (isNewUI) puzzleSubmit = document.getElementsByClassName("mousehuntPage-puzzle-form-code-button")[0];
        if (!puzzleSubmit) {
            console.debug("puzzleSubmit: " + puzzleSubmit);
            return;
        }

        fireEvent(puzzleSubmit, 'click');
        kingsRewardRetry = 0;
        setStorage("KingsRewardRetry", kingsRewardRetry);
        myFrame = document.getElementById('myFrame');
        if (myFrame)
            document.body.removeChild(myFrame);
        window.setTimeout(function () {
            CheckKRAnswerCorrectness();
        }, 5000);
    }
}

function receiveMessage(event) {
    console.debug("Event origin: " + event.origin);

    if (event.origin.indexOf("mhcdn") > -1 || event.origin.indexOf("mousehuntgame") > -1 || event.origin.indexOf("dropbox") > -1) {
        if (event.data.indexOf("~") > -1) {
            var result = event.data.substring(0, event.data.indexOf("~"));
            if (saveKRImage) {
                var processedImg = event.data.substring(event.data.indexOf("~") + 1, event.data.length);
                var strKR = "KR" + separator;
                strKR += Date.now() + separator;
                strKR += result + separator;
                strKR += "RETRY" + kingsRewardRetry;
                try {
                    setStorage(strKR, processedImg);
                }
                catch (e) {
                    console.perror('receiveMessage', e.message);
                }
            }
            FinalizePuzzleImageAnswer(result);
        } else if (event.data.indexOf("#") > -1) {
            var value = event.data.substring(1, event.data.length);
            setStorage("krCallBack", value);
        } else if (event.data.indexOf('Log_') > -1)
            console.plog(event.data.split('_')[1]);
        else if (event.data.indexOf('MHAKRS_') > -1) {
            var temp = event.data.split('_');
            console.plog(temp[0], temp[1]);
            setStorage(temp[0], temp[1]);
        }
    }
}

function CallKRSolver() {
    var frame = document.createElement('iframe');
    frame.setAttribute("id", "myFrame");
    var img;
    if (debugKR) {
        //frame.src = "https://dl.dropboxusercontent.com/s/4u5msso39hfpo87/Capture.PNG";
        //frame.src = "https://dl.dropboxusercontent.com/s/og73bcdsn2qod63/download%20%2810%29Ori.png";
        frame.src = "https://dl.dropboxusercontent.com/s/ppg0l35h25phrx3/download%20(16).png";
    } else {
        if (isNewUI) {
            img = document.getElementsByClassName('mousehuntPage-puzzle-form-captcha-image')[0];
            frame.src = img.style.backgroundImage.slice(4, -1).replace(/"/g, "");
        }
        else {
            img = document.getElementById('puzzleImage');
            frame.src = img.src;
        }
    }
    document.body.appendChild(frame);
}

function CheckKRAnswerCorrectness() {
    var strTemp = '';
    if (isNewUI) {
        var codeError = document.getElementsByClassName("mousehuntPage-puzzle-form-code-error");
        for (var i = 0; i < codeError.length; i++) {
            if (codeError[i].innerText.toLowerCase().indexOf("incorrect claim code") > -1) {
                if (kingsRewardRetry >= kingsRewardRetryMax) {
                    kingsRewardRetry = 0;
                    setStorage("KingsRewardRetry", kingsRewardRetry);
                    strTemp = 'Max ' + kingsRewardRetryMax + 'retries. Pls solve it manually ASAP.';
                    alert(strTemp);
                    displayTimer(strTemp, strTemp, strTemp);
                    console.perror(strTemp);
                }
                else {
                    ++kingsRewardRetry;
                    setStorage("KingsRewardRetry", kingsRewardRetry);
                    CallKRSolver();
                }
                return;
            }
        }
    } else {
        var pageMsg = document.getElementById('pagemessage');
        if (!isNullOrUndefined(pageMsg) && pageMsg.innerText.toLowerCase().indexOf("unable to claim reward") > -1) { // KR answer not correct, re-run OCR
            if (kingsRewardRetry >= kingsRewardRetryMax) {
                kingsRewardRetry = 0;
                setStorage("KingsRewardRetry", kingsRewardRetry);
                strTemp = 'Max ' + kingsRewardRetryMax + 'retries. Pls solve it manually ASAP.';
                alert(strTemp);
                displayTimer(strTemp, strTemp, strTemp);
                console.perror(strTemp);
            }
            else {
                ++kingsRewardRetry;
                setStorage("KingsRewardRetry", kingsRewardRetry);
                CallKRSolver();
            }
            return;
        }
    }

    window.setTimeout(function () {
        CheckKRAnswerCorrectness();
    }, 1000);
}

window.addEventListener("message", receiveMessage, false);
if (debugKR)
    CallKRSolver();
// CNN KR SOLVER END

// start executing script
if (debug) console.log('STARTING SCRIPT - ver: ' + scriptVersion);
if (window.top != window.self) {
    if (debug) console.log('In IFRAME - may cause firefox to error, location: ' + window.location.href);
    //return;
} else {
    if (debug) console.log('NOT IN IFRAME - will not work in fb MH');
}

var getMapPort;
try {
    if (!isNullOrUndefined(chrome.runtime.id)) {
        g_strScriptHandler = "Extensions";
        g_strVersion = chrome.runtime.getManifest().version;
        getMapPort = chrome.runtime.connect({name: 'map'});
        getMapPort.onMessage.addListener(function (msg) {
            console.log(msg);
            if (msg.array.length > 0)
                checkCaughtMouse(msg.obj, msg.array);
        });
    } else {
        g_strScriptHandler = GM_info.scriptHandler + " " + GM_info.version;
        g_strVersion = GM_info.script.version;
    }
} catch (e) {
    console.perror('Before exeScript', e.message);
    getMapPort = undefined;
    g_strVersion = undefined;
    g_strScriptHandler = undefined;
}

exeScript();

function exeScript() {
    if (debug) console.log('RUN exeScript()');
    browser = browserDetection();
    try {
        var titleElm = document.getElementById('titleElement');
        if (titleElm) {
            titleElm.parentNode.remove();
        }
    } catch (e) {
        if (debug) console.log('No past title elements found.');
    } finally {
        titleElm = null;
    }

    trapCheckTimeDiff = GetTrapCheckTime();

    try {
        // check the trap check setting first
        if (trapCheckTimeDiff == 60) {
            trapCheckTimeDiff = 0;
        } else if (trapCheckTimeDiff < 0 || trapCheckTimeDiff > 60) {
            // invalid value, just disable the trap check
            enableTrapCheck = false;
        }

        if (showTimerInTitle) {
            // check if they are running in iFrame
            var contentElement = undefined;
            var breakFrameDivElement = undefined;
            if (window.location.href.indexOf("apps.facebook.com/mousehunt/") != -1) {
                contentElement = document.getElementById('pagelet_canvas_content');
                if (contentElement) {
                    breakFrameDivElement = document.createElement('div');
                    breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
                    breakFrameDivElement.innerHTML = "Timer cannot show on title page. You can <a href='http://www.mousehuntgame.com/canvas/'>run MouseHunt without iFrame (Facebook)</a> to enable timer on title page";
                    contentElement.parentNode.insertBefore(breakFrameDivElement, contentElement);
                }
                contentElement = undefined;
            } else if (window.location.href.indexOf("hi5.com/friend/games/MouseHunt") != -1) {
                contentElement = document.getElementById('apps-canvas-body');
                if (contentElement) {
                    breakFrameDivElement = document.createElement('div');
                    breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
                    breakFrameDivElement.innerHTML = "Timer cannot show on title page. You can <a href='http://mousehunt.hi5.hitgrab.com/'>run MouseHunt without iFrame (Hi5)</a> to enable timer on title page";
                    contentElement.parentNode.insertBefore(breakFrameDivElement, contentElement);
                }
                contentElement = breakFrameDivElement = undefined;
            }
        }

        // check user running this script from where
        if (window.location.href.indexOf("mousehuntgame.com/canvas/") != -1) {
            // from facebook
            fbPlatform = true;
            setStorage('Platform', 'FB');
        } else if (window.location.href.indexOf("mousehuntgame.com") != -1) {
            // need to check if it is running in mobile version
            var version = getCookie("switch_to");
            if (version !== null && version == "mobile") {
                // from mousehunt game mobile version
                mhMobilePlatform = true;
                setStorage('Platform', 'MHMobile');
            } else {
                // from mousehunt game standard version
                mhPlatform = true;
                setStorage('Platform', 'MH');
            }
            version = undefined;
        } else if (window.location.href.indexOf("mousehunt.hi5.hitgrab.com") != -1) {
            // from hi5
            hiFivePlatform = true;
            setStorage('Platform', 'Hi5');
        }

        // check if user running in https secure connection, true/false
        secureConnection = (window.location.href.indexOf("https://") > -1);

        if (fbPlatform) {
            if (window.location.href == "http://www.mousehuntgame.com/canvas/" ||
                window.location.href == "http://www.mousehuntgame.com/canvas/#" ||
                window.location.href == "https://www.mousehuntgame.com/canvas/" ||
                window.location.href == "https://www.mousehuntgame.com/canvas/#" ||
                window.location.href.indexOf("mousehuntgame.com/canvas/index.php") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/canvas/turn.php") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/canvas/?newpuzzle") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/canvas/?") != -1) {
                // page to execute the script!

                // make sure all the preference already loaded
                loadPreferenceSettingFromStorage();

                // this is the page to execute the script
                if (!checkIntroContainer() && retrieveDataFirst()) {
                    // embed a place where timer show
                    embedTimer(true);

                    // embed script to horn button
                    embedScript();

                    // start script action
                    action();
                } else {
                    // fail to retrieve data, display error msg and reload the page
                    document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                    window.setTimeout(function () {
                        reloadPage(false);
                    }, errorReloadTime * 1000);
                }
            } else {
                // not in hunters camp, just show the title of autobot version
                embedTimer(false);
            }
        } else if (mhPlatform) {
            if (window.location.href == "http://www.mousehuntgame.com/" ||
                window.location.href == "http://www.mousehuntgame.com/#" ||
                window.location.href == "http://www.mousehuntgame.com/?switch_to=standard" ||
                window.location.href == "https://www.mousehuntgame.com/" ||
                window.location.href == "https://www.mousehuntgame.com/#" ||
                window.location.href == "https://www.mousehuntgame.com/?switch_to=standard" ||
                window.location.href.indexOf("mousehuntgame.com/turn.php") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/?newpuzzle") != -1 ||
                window.location.href.indexOf("mousehuntgame.com/index.php") != -1) {
                // page to execute the script!

                // make sure all the preference already loaded
                loadPreferenceSettingFromStorage();

                // this is the page to execute the script
                if (!checkIntroContainer() && retrieveDataFirst()) {
                    // embed a place where timer show
                    embedTimer(true);

                    // embed script to horn button
                    embedScript();

                    // start script action
                    action();
                } else {
                    // fail to retrieve data, display error msg and reload the page
                    document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                    window.setTimeout(function () {
                        reloadPage(false);
                    }, errorReloadTime * 1000);
                }
            } else {
                // not in hunters camp, just show the title of autobot version
                embedTimer(false);
            }
        } else if (mhMobilePlatform) {
            // execute at all page of mobile version
            //if (true) {
            // page to execute the script!

            // make sure all the preference already loaded
            loadPreferenceSettingFromStorage();

            // embed a place where timer show
            embedTimer(false);
            //}
        } else if (hiFivePlatform) {
            if (window.location.href == "http://mousehunt.hi5.hitgrab.com/#" ||
                window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/?") != -1 ||
                window.location.href == "http://mousehunt.hi5.hitgrab.com/" ||
                window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/turn.php") != -1 ||
                window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/?newpuzzle") != -1 ||
                window.location.href.indexOf("http://mousehunt.hi5.hitgrab.com/index.php") != -1) {
                // page to execute the script!

                // make sure all the preference already loaded
                loadPreferenceSettingFromStorage();

                // this is the page to execute the script
                if (!checkIntroContainer() && retrieveDataFirst()) {
                    // embed a place where timer show
                    embedTimer(true);

                    // embed script to horn button
                    embedScript();

                    // start script action
                    action();
                } else {
                    // fail to retrieve data, display error msg and reload the page
                    document.title = "Fail to retrieve data from page. Reloading in " + timeformat(errorReloadTime);
                    window.setTimeout(function () {
                        reloadPage(false);
                    }, errorReloadTime * 1000);
                }
            } else {
                // not in hunters camp, just show the title of autobot version
                embedTimer(false);
            }
        }
    } catch (e) {
        if (debug) console.log('exeScript error - ' + e)
    }
}

function GetTrapCheckTime() {
    try {
        var passiveElement = document.getElementsByClassName('passive');
        if (passiveElement.length > 0) {
            var time = passiveElement[0].textContent;
            time = time.substr(time.indexOf('m -') - 4, 2);
            setStorage("TrapCheckTimeOffset", time);
            return parseInt(time);
        }
        else throw new Error('passiveElement not found');
    }
    catch (e) {
        console.perror('GetTrapCheckTime', e.message);
        var tempStorage = getStorage('TrapCheckTimeOffset');
        if (isNullOrUndefined(tempStorage)) {
            tempStorage = 0;
            setStorage("TrapCheckTimeOffset", tempStorage);
        }
        return parseInt(tempStorage);
    }
}

function checkIntroContainer() {
    if (debug) console.log('RUN checkIntroContainer()');
    var gotIntroContainerDiv = false;

    var introContainerDiv = document.getElementById('introContainer');
    if (introContainerDiv) {
        introContainerDiv = undefined;
        gotIntroContainerDiv = true;
    } else {
        gotIntroContainerDiv = false;
    }

    try {
        return gotIntroContainerDiv;
    } finally {
        gotIntroContainerDiv = undefined;
    }
}

function getJournalDetail() {
    var strLastRecordedJournal = getStorageToVariableStr('LastRecordedJournal', '');
    var classJournal = document.getElementsByClassName('journaltext');
    var i, j, eleA, strTrap, temp, nIndexStart, nIndexEnd, nIndexCharm, nIndexCheese;
    var objResave = {
        trinket: false,
        bait: false
    };
    for (i = 0; i < classJournal.length; i++) {
        if (classJournal[i].parentNode.textContent == strLastRecordedJournal)
            break;

        eleA = classJournal[i].getElementsByTagName('a');
        if (eleA.length > 0) { // has loot(s)
            for (j = 0; j < eleA.length; j++) {
                strTrap = '';
                temp = eleA[j].textContent;
                if (temp.indexOf('Charm') > -1) {
                    strTrap = 'trinket';
                    temp = temp.replace(/Charms/, 'Charm');
                }
                else if (temp.indexOf('Cheese') > -1)
                    strTrap = 'bait';
                temp = temp.replace(/\d+/, '');
                temp = temp.trimLeft();
                if (strTrap !== '' && objTrapList[strTrap].indexOf(temp) < 0) {
                    console.plog('Add', temp, 'into', strTrap, 'list');
                    objTrapList[strTrap].unshift(temp);
                    objResave[strTrap] = true;
                }
            }
        }
        else {
            nIndexStart = -1;
            temp = classJournal[i].textContent.replace(/\./, '');
            temp = temp.replace(/Charms/, 'Charm');
            temp = temp.split(' ');
            if (classJournal[i].textContent.indexOf('crafted') > -1) {
                nIndexStart = temp.indexOf('crafted');
                if (nIndexStart > -1)
                    nIndexStart += 2;
            }
            else if (classJournal[i].textContent.indexOf('purchased') > -1) {
                nIndexStart = temp.indexOf('purchased');
                if (nIndexStart > -1)
                    nIndexStart += 2;
            }
            if (nIndexStart > -1) {
                strTrap = '';
                nIndexEnd = -1;
                nIndexCharm = temp.indexOf('Charm');
                nIndexCheese = temp.indexOf('Cheese');
                if (nIndexCharm > -1) {
                    strTrap = 'trinket';
                    nIndexEnd = nIndexCharm + 1;
                }
                else if (nIndexCheese > -1) {
                    strTrap = 'bait';
                    nIndexEnd = nIndexCheese + 1;
                }
                if (strTrap !== '' && nIndexEnd > -1) {
                    temp = temp.slice(nIndexStart, nIndexEnd);
                    temp = temp.join(' ');
                    if (temp !== '' && objTrapList[strTrap].indexOf(temp) < 0) {
                        console.plog('Add', temp, 'into', strTrap, 'list');
                        objTrapList[strTrap].unshift(temp);
                        objResave[strTrap] = true;
                    }
                }
            }
        }
    }
    for (var prop in objResave) {
        if (objResave.hasOwnProperty(prop) && objResave[prop] === true)
            setStorage("TrapList" + capitalizeFirstLetter(prop), objTrapList[prop].join(","));
    }
    setStorage('LastRecordedJournal', classJournal[0].parentNode.textContent);
}

function getJournalDetailFRift() {
    if (g_arrHeirloom.length != 3)
        return;
    var strLastRecordedJournal = getStorageToVariableStr('LastRecordedJournalFRift', '');
    var classJournal = document.getElementsByClassName('journaltext');
    var i, j, eleA, temp, nIndex;
    for (i = 0; i < classJournal.length; i++) {
        if (classJournal[i].parentNode.textContent == strLastRecordedJournal)
            break;
        eleA = classJournal[i].getElementsByTagName('a');
        if (eleA.length > 0) { // has loot(s)
            for (j = 0; j < eleA.length; j++) {
                temp = eleA[j].textContent;
                if (temp.indexOf('Chi Belt Heirloom') > -1)
                    nIndex = 0;
                else if (temp.indexOf('Chi Fang Heirloom') > -1)
                    nIndex = 1;
                else if (temp.indexOf('Chi Claw Heirloom') > -1)
                    nIndex = 2;
                else
                    nIndex = -1;
                if (nIndex > -1)
                    g_arrHeirloom[nIndex]++;
            }
        }
    }
    setStorage('LastRecordedJournalFRift', classJournal[0].parentNode.textContent);
}

/*function specialFeature(caller) {
    return;
    var strSpecial = getStorageToVariableStr("SpecialFeature", "None");
    console.plog('Special Selected:', strSpecial, 'Call From:', caller);
    switch (strSpecial) {
        case 'PILLOWCASE':
            magicalPillowcase();
            break;
        default:
            break;
    }
}*/

//// EMBEDING ENHANCED EDITION CODE
function eventLocationCheck(caller) {
    var selAlgo = getStorageToVariableStr("eventLocation", "None");
    var temp = "";

    if (selAlgo != null || selAlgo != "")
        console.debug("Running " + selAlgo + " bot.");

    switch (selAlgo) {
        case 'Hunt For':
            huntFor();
            break;
        case 'Charge Egg 2015':
            checkCharge(12);
            break;
        case 'Charge Egg 2015(17)':
            checkCharge(17);
            break;
        case 'Charge Egg 2016 Medium + High':
            checkCharge2016(chargeMedium);
            break;
        case 'Charge Egg 2016 High':
            checkCharge2016(chargeHigh);
            break;
        case 'Gnawnian Express(Empty)':
            gnawnianExpress(false);
            break;
        case 'Gnawnian Express(Full)':
            gnawnianExpress(true);
            break;
        case 'GES':
            ges();
            break;
        case 'Burroughs Rift(Red)':
            BurroughRift(true, 19, 20);
            break;
        case 'Burroughs Rift(Green)':
            BurroughRift(true, 6, 18);
            break;
        case 'Burroughs Rift(Yellow)':
            BurroughRift(true, 1, 5);
            break;
        case 'Burroughs Rift Custom':
            BRCustom();
            break;
        case 'Halloween 2016':
            Halloween2016();
            break;
        case 'Halloween 2015':
            Halloween2015();
            break;
        case 'Winter 2015':
            Winter2015();
            break;
        case 'GWH2016R':
            gwh();
            break;
        case 'WWRift':
            wwrift();
            break;
        case 'All LG Area':
            var objLGTemplate = {
                isAutoFill: false,
                isAutoPour: false,
                maxSaltCharged: 25,
                base: {
                    before: '',
                    after: ''
                },
                trinket: {
                    before: '',
                    after: ''
                },
                bait: {
                    before: '',
                    after: ''
                }
            };
            var objDefaultLG = {
                LG: JSON.parse(JSON.stringify(objLGTemplate)),
                TG: JSON.parse(JSON.stringify(objLGTemplate)),
                LC: JSON.parse(JSON.stringify(objLGTemplate)),
                CC: JSON.parse(JSON.stringify(objLGTemplate)),
                SD: JSON.parse(JSON.stringify(objLGTemplate)),
                SC: JSON.parse(JSON.stringify(objLGTemplate)),
            };
            temp = getStorageToObject("LGArea", objDefaultLG);
            lgGeneral(temp);
            break;
        case 'Sunken City':
            SunkenCity(false);
            break;
        case 'Sunken City Aggro':
            SunkenCity(true);
            break;
        case 'Sunken City Custom':
            SCCustom();
            break;
        case 'Zugzwang\'s Tower':
            ZTower();
            break;
        case 'Fiery Warpath':
            fieryWarpath();
            break;
        case 'Fiery Warpath Super':
            fieryWarpath(true);
            break;
        case 'Iceberg (Wax)':
            iceberg('wax');
            break;
        case 'Iceberg (Sticky)':
            iceberg('sticky');
            break;
        case 'Labyrinth':
        //labyrinth();
        //break;
        case 'Zokor':
            //zokor();
            labyZokor();
            break;
        case 'Furoma Rift':
            fRift();
            break;
        case 'BC/JOD':
            balackCoveJOD();
            break;
        case 'FG/AR':
            forbiddenGroveAR();
            break;
        case 'Bristle Woods Rift':
            bwRift();
            break;
        case 'Fort Rox':
            fortRox();
            break;
        default:
            break;
    }
}

function huntFor() {
    if (NOBhuntsLeft <= 0) {
        disarmTrap('bait');
    }
}

function mapHunting() {
    var objDefaultMapHunting = {
        status: false,
        selectedMouse: [],
        logic: 'OR',
        weapon: 'Remain',
        base: 'Remain',
        trinket: 'Remain',
        bait: 'Remain',
        leave: false
    };
    var objMapHunting = getStorageToObject('MapHunting', objDefaultMapHunting);
    var strViewState = getPageVariable('user.quests.QuestRelicHunter.view_state');
    var bHasMap = (strViewState == 'hasMap' || strViewState == 'hasReward');
    if (!objMapHunting.status || !bHasMap || objMapHunting.selectedMouse.length === 0)
        return;

    checkCaughtMouse(objMapHunting);
}

function checkCaughtMouse(obj, arrUpdatedUncaught) {
    var arrUncaughtMouse = [];
    if (!(Array.isArray(arrUpdatedUncaught)))
        arrUpdatedUncaught = [];

    var bHasReward = (getPageVariable('user.quests.QuestRelicHunter.view_state') == 'hasReward');
    if (!bHasReward && arrUpdatedUncaught.length === 0) {
        var nRemaining = -1;
        var classTreasureMap = document.getElementsByClassName('mousehuntHud-userStat treasureMap')[0];
        if (classTreasureMap.children[2].textContent.toLowerCase().indexOf('remaining') > -1)
            nRemaining = parseInt(classTreasureMap.children[2].textContent);

        if (Number.isNaN(nRemaining) || nRemaining == -1)
            return;

        var temp = getStorageToVariableStr('Last Record Uncaught', null);
        if (!isNullOrUndefined(temp))
            arrUncaughtMouse = temp.split(",");

        if (arrUncaughtMouse.length != nRemaining) {
            // get updated uncaught mouse list
            arrUncaughtMouse = [];
            var objData = {
                sn: 'Hitgrab',
                hg_is_ajax: 1,
                action: 'info',
                uh: getPageVariable('user.unique_hash')
            };
            if (isNullOrUndefined(getMapPort)) {
                // direct call jquery
                ajaxPost(window.location.origin + '/managers/ajax/users/relichunter.php', objData, function (data) {
                    console.log(data.treasure_map);
                    if (!isNullOrUndefined(data.treasure_map.groups)) {
                        var arrUncaught = [];
                        for (var i = 0; i < data.treasure_map.groups.length; i++) {
                            if (data.treasure_map.groups[i].is_uncaught === true) {
                                for (var j = 0; j < data.treasure_map.groups[i].mice.length; j++) {
                                    arrUncaught.push(data.treasure_map.groups[i].mice[j].name);
                                }
                            }
                        }
                        if (arrUncaught.length > 0)
                            checkCaughtMouse(obj, arrUncaught);
                    }
                }, function (error) {
                    console.error('ajax:', error);
                });
            }
            else {
                getMapPort.postMessage({
                    request: "getUncaught",
                    data: objData,
                    url: window.location.origin + '/managers/ajax/users/relichunter.php',
                    objMapHunting: obj
                });
            }
            return;
        }
    } else {
        if (bHasReward)
            setStorage('Last Record Uncaught', '');
        else
            setStorage('Last Record Uncaught', arrUpdatedUncaught.join(","));
        arrUncaughtMouse = arrUpdatedUncaught.slice();
    }

    console.plog('Uncaught:', arrUncaughtMouse);
    var i;
    var bChangeTrap = false;
    var bCanLeave = false;
    var arrIndex = [];
    for (i = 0; i < obj.selectedMouse.length; i++) {
        arrIndex.push(arrUncaughtMouse.indexOf(obj.selectedMouse[i]));
    }
    if (obj.logic == 'AND') {
        bChangeTrap = (countArrayElement(-1, arrIndex) == arrIndex.length || bHasReward);
    } else {
        bChangeTrap = (countArrayElement(-1, arrIndex) > 0 || bHasReward);
    }

    bCanLeave = !bHasReward && bChangeTrap;
    if (bChangeTrap) {
        for (i = arrIndex.length - 1; i >= 0; i--) {
            if (arrIndex[i] == -1)
                obj.selectedMouse.splice(i, 1);
        }
        setStorage('MapHunting', JSON.stringify(obj));
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) &&
                (prop == 'weapon' || prop == 'base' || prop == 'trinket' || prop == 'bait')) {
                if (obj[prop] != 'Remain') {
                    if (obj[prop] == 'None')
                        disarmTrap(prop);
                    else
                        checkThenArm(null, prop, obj[prop]);
                }
            }
        }
    }

    if (bCanLeave && obj.leave) {
        var objData = {
            sn: 'Hitgrab',
            hg_is_ajax: 1,
            action: 'discard',
            uh: getPageVariable('user.unique_hash')
        };
        if (isNullOrUndefined(getMapPort)) {
            // direct call jquery
            ajaxPost(window.location.origin + '/managers/ajax/users/relichunter.php', objData, function (data) {
                console.plog('Map discarded');
            }, function (error) {
                console.perror('ajax discard:', error);
            });
        }
        else {
            getMapPort.postMessage({
                request: "discard",
                data: objData,
                url: window.location.origin + '/managers/ajax/users/relichunter.php',
            });
        }
    }
}

function GetCurrentLocation() {
    var loc = getPageVariable('user.location');
    console.plog('Current Location:', loc);
    return loc;
}

function bwRift() {
    if (GetCurrentLocation().indexOf("Bristle Woods Rift") < 0)
        return;

    var objDefaultBWRift = {
        order: ['NONE', 'GEARWORKS', 'ANCIENT', 'RUNIC', 'TIMEWARP', 'GUARD', 'SECURITY', 'FROZEN', 'FURNACE', 'INGRESS', 'PURSUER', 'ACOLYTE_CHARGING', 'ACOLYTE_DRAINING', 'ACOLYTE_DRAINED', 'LUCKY', 'HIDDEN'],
        master: {
            weapon: new Array(32).fill('Mysteriously unYielding'),
            base: new Array(32).fill('Fissure Base'),
            trinket: new Array(32).fill('Rift Vacuum Charm'),
            bait: new Array(32).fill('Brie String'),
            activate: new Array(32).fill(false),
        },
        specialActivate: {
            forceActivate: new Array(32).fill(false),
            remainingLootActivate: new Array(32).fill(1),
            forceDeactivate: new Array(32).fill(false),
            remainingLootDeactivate: new Array(32).fill(1)
        },
        gw: {
            weapon: new Array(4).fill('MASTER'),
            base: new Array(4).fill('MASTER'),
            trinket: new Array(4).fill('MASTER'),
            bait: new Array(4).fill('MASTER'),
            activate: new Array(4).fill('MASTER'),
        },
        al: {
            weapon: new Array(4).fill('MASTER'),
            base: new Array(4).fill('MASTER'),
            trinket: new Array(4).fill('MASTER'),
            bait: new Array(4).fill('MASTER'),
            activate: new Array(4).fill('MASTER'),
        },
        rl: {
            weapon: new Array(4).fill('MASTER'),
            base: new Array(4).fill('MASTER'),
            trinket: new Array(4).fill('MASTER'),
            bait: new Array(4).fill('MASTER'),
            activate: new Array(4).fill('MASTER'),
        },
        gb: {
            weapon: new Array(14).fill('MASTER'),
            base: new Array(14).fill('MASTER'),
            trinket: new Array(14).fill('MASTER'),
            bait: new Array(14).fill('MASTER'),
            activate: new Array(14).fill('MASTER'),
        },
        ic: {
            weapon: new Array(8).fill('MASTER'),
            base: new Array(8).fill('MASTER'),
            trinket: new Array(8).fill('MASTER'),
            bait: new Array(8).fill('MASTER'),
            activate: new Array(8).fill('MASTER'),
        },
        fa: {
            weapon: new Array(32).fill('MASTER'),
            base: new Array(32).fill('MASTER'),
            trinket: new Array(32).fill('MASTER'),
            bait: new Array(32).fill('MASTER'),
            activate: new Array(32).fill('MASTER'),
        },
        choosePortal: false,
        choosePortalAfterCC: false,
        priorities: ['SECURITY', 'FURNACE', 'PURSUER', 'ACOLYTE', 'LUCKY', 'HIDDEN', 'TIMEWARP', 'RUNIC', 'ANCIENT', 'GEARWORKS', 'GEARWORKS', 'GEARWORKS', 'GEARWORKS'],
        prioritiesCursed: ['SECURITY', 'FURNACE', 'PURSUER', 'ANCIENT', 'GEARWORKS', 'RUNIC', 'GEARWORKS', 'GEARWORKS', 'GEARWORKS', 'GEARWORKS', 'GEARWORKS', 'GEARWORKS', 'GEARWORKS'],
        minTimeSand: [70, 70, 50, 50, 50, 50, 40, 40, 999],
        minRSCType: 'NUMBER',
        minRSC: 0,
        enterMinigameWCurse: false
    };

    var objBWRift = getStorageToObject('BWRift', objDefaultBWRift);
    var objUser = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestRiftBristleWoods)'));
    var nIndex = -1;
    var nLootRemaining = objUser.progress_remaining;
    var nTimeSand = parseInt(objUser.items.rift_hourglass_sand_stat_item.quantity);
    var strChamberName = objUser.chamber_name.split(' ')[0].toUpperCase();
    var strTestName = objUser.chamber_name.toUpperCase();
    if (strTestName.indexOf('LUCK') > -1)
        strChamberName = 'LUCKY';
    if (strChamberName == 'ACOLYTE') { // in Acolyte Chamber
        var strStatus;
        if (objUser.minigame.acolyte_chamber.obelisk_charge < 100) {
            strStatus = 'ACOLYTE_CHARGING';
            nLootRemaining = 100 - objUser.minigame.acolyte_chamber.obelisk_charge;
        }
        else if (objUser.minigame.acolyte_chamber.acolyte_sand > 0) {
            strStatus = 'ACOLYTE_DRAINING';
            nLootRemaining = Number.MAX_SAFE_INTEGER;
        }
        else {
            strStatus = 'ACOLYTE_DRAINED';
            nLootRemaining = Number.MAX_SAFE_INTEGER;
        }
        console.plog('Status:', strStatus, 'Obelisk:', objUser.minigame.acolyte_chamber.obelisk_charge, 'Acolyte Sand:', objUser.minigame.acolyte_chamber.acolyte_sand);
        nIndex = objBWRift.order.indexOf(strStatus);
    } else if (strChamberName == 'RIFT')
        nIndex = 0;
    else {
        if (nLootRemaining > 0)
            nIndex = objBWRift.order.indexOf(strChamberName);
        else
            nIndex = 0;
    }
    console.plog('Status:', objUser.chamber_status, 'Name:', objUser.chamber_name, 'Shortname:', strChamberName, 'Index:', nIndex, 'Remaining Loot:', nLootRemaining, 'Time Sand:', nTimeSand);
    if (nIndex < 0)
        return;
    var nIndexBuffCurse = 0;
    if (!(objUser.status_effects.un.indexOf('default') > -1 || objUser.status_effects.un.indexOf('remove') > -1) ||
        !(objUser.status_effects.fr.indexOf('default') > -1 || objUser.status_effects.fr.indexOf('remove') > -1) ||
        !(objUser.status_effects.st.indexOf('default') > -1 || objUser.status_effects.st.indexOf('remove') > -1))
        nIndexBuffCurse = 8;
    else {
        if (objUser.status_effects.ng.indexOf('default') < 0)
            nIndexBuffCurse |= 0x04;
        if (objUser.status_effects.ac.indexOf('default') < 0)
            nIndexBuffCurse |= 0x02;
        if (objUser.status_effects.ex.indexOf('default') < 0)
            nIndexBuffCurse |= 0x01;
    }
    console.plog('Buff & Curse Index:', nIndexBuffCurse, 'Obj:', objUser.status_effects);
    if (nIndex === 0 || objUser.chamber_status == 'open') {
        var classPortalContainer = document.getElementsByClassName('riftBristleWoodsHUD-portalContainer');
        if (classPortalContainer.length > 0) {
            var objPortal = {
                arrName: new Array(classPortalContainer[0].children.length).fill(''),
                arrIndex: new Array(classPortalContainer[0].children.length).fill(Number.MAX_SAFE_INTEGER)
            };
            var i, j;
            var arrPriorities = (nIndexBuffCurse == 8) ? objBWRift.prioritiesCursed : objBWRift.priorities;
            var nIndexCustom = -1;
            for (i = 0; i < arrPriorities.length; i++) {
                if (arrPriorities[i].indexOf('AL/RL') > -1) {
                    nIndexCustom = i;
                    break;
                }
            }
            for (i = 0; i < objPortal.arrName.length; i++) {
                objPortal.arrName[i] = classPortalContainer[0].children[i].getElementsByClassName('riftBristleWoodsHUD-portal-name')[0].textContent;
                strTestName = objPortal.arrName[i].toUpperCase();
                if (strTestName.indexOf('LUCK') > -1)
                    objPortal.arrName[i] = 'LUCKY';
                else if (strTestName.indexOf('HIDDEN') > -1 || strTestName.indexOf('TREASUR') > -1)
                    objPortal.arrName[i] = 'HIDDEN';
                objPortal.arrName[i] = objPortal.arrName[i].split(' ')[0].toUpperCase();
                objPortal.arrIndex[i] = arrPriorities.indexOf(objPortal.arrName[i]);
                if (nIndexCustom > -1 && (objPortal.arrName[i] == 'ANCIENT' || objPortal.arrName[i] == 'RUNIC')) {
                    if (objPortal.arrIndex[i] < 0 || nIndexCustom < objPortal.arrIndex[i])
                        objPortal.arrIndex[i] = nIndexCustom;
                }
                if (objPortal.arrIndex[i] < 0)
                    objPortal.arrIndex[i] = Number.MAX_SAFE_INTEGER;
            }
            console.plog(objPortal);
            if (objBWRift.choosePortal) {
                if (nIndex === 0 || (nIndex > 0 && objUser.chamber_status == 'open' && objBWRift.choosePortalAfterCC)) {
                    var nIndexOld = nIndex;
                    var arrIndices = [];
                    var nRSCPot = parseInt(objUser.items.runic_string_cheese_potion.quantity);
                    var nRSC = parseInt(objUser.items.runic_string_cheese.quantity);
                    var nTotalRSC = nRSC + nRSCPot * 2;
                    var nIndexTemp = objPortal.arrName.indexOf('ACOLYTE');
                    if (nIndexTemp > -1) {
                        if (!Number.isInteger(nTotalRSC))
                            nTotalRSC = Number.MAX_SAFE_INTEGER;
                        console.plog('RSC Pot:', nRSCPot, 'RSC:', nRSC, 'Total RSC:', nTotalRSC);
                        var nMinRSC = -1;
                        if (objBWRift.minRSCType == 'NUMBER')
                            nMinRSC = objBWRift.minRSC;
                        else if (objBWRift.minRSCType == 'GEQ')
                            nMinRSC = objBWRift.minTimeSand[nIndexBuffCurse];
                        if (nTotalRSC < nMinRSC || nTimeSand < objBWRift.minTimeSand[nIndexBuffCurse]) {
                            arrIndices = getAllIndices(objPortal.arrName, 'ACOLYTE');
                            for (i = 0; i < arrIndices.length; i++)
                                objPortal.arrIndex[arrIndices[i]] = Number.MAX_SAFE_INTEGER;
                        }
                    }
                    var arrTemp = ['TIMEWARP', 'GUARD'];
                    for (i = 0; i < arrTemp.length; i++) {
                        nIndexTemp = objPortal.arrName.indexOf(arrTemp[i]);
                        if (nIndexTemp > -1 && nTimeSand >= objBWRift.minTimeSand[nIndexBuffCurse]) {
                            arrIndices = getAllIndices(objPortal.arrName, arrTemp[i]);
                            for (j = 0; j < arrIndices.length; j++)
                                objPortal.arrIndex[arrIndices[j]] = Number.MAX_SAFE_INTEGER;
                        }
                    }
                    arrTemp = ['GUARD', 'FROZEN', 'INGRESS'];
                    for (i = 0; i < arrTemp.length; i++) {
                        nIndexTemp = objPortal.arrName.indexOf(arrTemp[i]);
                        if (nIndexTemp > -1 && nIndexBuffCurse == 8 && objBWRift.enterMinigameWCurse === false) {
                            arrIndices = getAllIndices(objPortal.arrName, arrTemp[i]);
                            for (j = 0; j < arrIndices.length; j++)
                                objPortal.arrIndex[arrIndices[j]] = Number.MAX_SAFE_INTEGER;
                        }
                    }
                    var arrAL = getAllIndices(objPortal.arrName, 'ANCIENT');
                    var arrRL = getAllIndices(objPortal.arrName, 'RUNIC');
                    if (arrAL.length > 0 && arrRL.length > 0 && nIndexCustom > -1) {
                        var nASCPot = parseInt(objUser.items.ancient_string_cheese_potion.quantity);
                        var nASC = parseInt(objUser.items.ancient_string_cheese.quantity);
                        var nTotalASC = nASCPot + nASC;
                        if (arrPriorities[nIndexCustom].indexOf('MSC') > -1)
                            nTotalASC += nASCPot;
                        console.plog('ASC Pot:', nASCPot, 'ASC:', nASC, 'Total ASC:', nTotalASC, 'RSC Pot:', nRSCPot, 'RSC:', nRSC, 'Total RSC:', nTotalRSC);
                        if (nTotalASC < nTotalRSC) { // ancient first
                            for (j = 0; j < arrRL.length; j++)
                                objPortal.arrIndex[arrRL[j]] = Number.MAX_SAFE_INTEGER;
                        }
                        else { // runic first
                            for (j = 0; j < arrAL.length; j++)
                                objPortal.arrIndex[arrAL[j]] = Number.MAX_SAFE_INTEGER;
                        }
                    }
                    nIndexTemp = objPortal.arrName.indexOf('ENTER');
                    if (nIndexTemp > -1)
                        objPortal.arrIndex[nIndexTemp] = 1;
                    console.plog(objPortal);
                    var nMinIndex = minIndex(objPortal.arrIndex);
                    if (objPortal.arrIndex[nMinIndex] == Number.MAX_SAFE_INTEGER || classPortalContainer[0].children[nMinIndex] == 'frozen')
                        nIndex = nIndexOld;
                    else {
                        if (objPortal.arrName[nMinIndex] == 'ACOLYTE') {
                            console.plog('Chosen Portal:', objPortal.arrName[nMinIndex], 'Index: Unknown');
                            fireEvent(classPortalContainer[0].children[nMinIndex], 'click');
                            window.setTimeout(function () {
                                fireEvent(document.getElementsByClassName('mousehuntActionButton small')[1], 'click');
                            }, 1000);
                            window.setTimeout(function () {
                                bwRift();
                            }, 2000);
                            return;
                        }
                        if (objPortal.arrName[nMinIndex] == 'ENTER')
                            nIndex = objBWRift.order.indexOf('GEARWORKS');
                        else
                            nIndex = objBWRift.order.indexOf(objPortal.arrName[nMinIndex]);
                        if (nIndex > -1) {
                            console.plog('Chosen Portal:', objPortal.arrName[nMinIndex], 'Index:', nIndex);
                            strChamberName = objBWRift.order[nIndex];
                            fireEvent(classPortalContainer[0].children[nMinIndex], 'click');
                            window.setTimeout(function () {
                                fireEvent(document.getElementsByClassName('mousehuntActionButton small')[1], 'click');
                            }, 1000);
                            nLootRemaining = Number.MAX_SAFE_INTEGER;
                        }
                        else
                            nIndex = nIndexOld;
                    }
                }
            }
        }
    }
    var objTemp = {
        weapon: '',
        base: '',
        trinket: '',
        bait: '',
        activate: false
    };
    if (nIndex === 0)
        strChamberName = 'NONE';
    if (nIndexBuffCurse == 8)
        nIndex += 16;
    if (strChamberName == 'GEARWORKS' || strChamberName == 'ANCIENT' || strChamberName == 'RUNIC') {
        var nCleaverAvailable = (objUser.cleaver_status == 'available') ? 1 : 0;
        console.plog('Cleaver Available Status:', nCleaverAvailable);
        var strTemp = '';
        if (strChamberName == 'GEARWORKS')
            strTemp = 'gw';
        else if (strChamberName == 'ANCIENT')
            strTemp = 'al';
        else
            strTemp = 'rl';
        if (nIndexBuffCurse == 8)
            nCleaverAvailable += 2;
        for (var prop in objTemp) {
            if (objTemp.hasOwnProperty(prop))
                objTemp[prop] = (objBWRift[strTemp][prop][nCleaverAvailable] == 'MASTER') ? objBWRift.master[prop][nIndex] : objBWRift[strTemp][prop][nCleaverAvailable];
        }
    } else if (strChamberName == 'GUARD') {
        var nAlertLvl = (isNullOrUndefined(objUser.minigame.guard_chamber)) ? -1 : parseInt(objUser.minigame.guard_chamber.status.split("_")[1]);
        console.plog('Guard Barracks Alert Lvl:', nAlertLvl);
        if (Number.isNaN(nAlertLvl) || nAlertLvl < 0 || nAlertLvl > 6) {
            for (var prop in objTemp) {
                if (objTemp.hasOwnProperty(prop))
                    objTemp[prop] = objBWRift.master[prop][nIndex];
            }
        }
        else {
            if (nIndexBuffCurse == 8)
                nAlertLvl += 7;
            for (var prop in objTemp) {
                if (objTemp.hasOwnProperty(prop))
                    objTemp[prop] = (objBWRift.gb[prop][nAlertLvl] == 'MASTER') ? objBWRift.master[prop][nIndex] : objBWRift.gb[prop][nAlertLvl];
            }
        }
    }
    /*else if(strChamberName == 'INGRESS'){
	}
	else if(strChamberName == 'FROZEN'){
	}*/
    else {
        for (var prop in objTemp) {
            if (objTemp.hasOwnProperty(prop))
                objTemp[prop] = objBWRift.master[prop][nIndex];
        }
    }

    checkThenArm(null, 'weapon', objTemp.weapon);
    checkThenArm(null, 'base', objTemp.base);
    checkThenArm(null, 'trinket', objTemp.trinket);
    if (objTemp.bait == 'Runic/Ancient')
        checkThenArm('any', 'bait', ['Runic String Cheese', 'Ancient String Cheese']);
    else if (objTemp.bait == 'Runic=>Ancient')
        checkThenArm('best', 'bait', ['Runic String Cheese', 'Ancient String Cheese']);
    else
        checkThenArm(null, 'bait', objTemp.bait);
    var classLootBooster = document.getElementsByClassName('riftBristleWoodsHUD-portalEquipment lootBooster mousehuntTooltipParent')[0];
    var bPocketwatchActive = (classLootBooster.getAttribute('class').indexOf('selected') > -1);
    var classButton = classLootBooster.getElementsByClassName('riftBristleWoodsHUD-portalEquipment-action')[0];
    var bForce = false;
    var bToggle = false;
    if (objTemp.activate) {
        bForce = (objBWRift.specialActivate.forceDeactivate[nIndex] && nLootRemaining <= objBWRift.specialActivate.remainingLootDeactivate[nIndex]);
        if (bForce === bPocketwatchActive)
            bToggle = true;
    } else {
        bForce = (objBWRift.specialActivate.forceActivate[nIndex] && nLootRemaining <= objBWRift.specialActivate.remainingLootActivate[nIndex]);
        if (bForce !== bPocketwatchActive)
            bToggle = true;
    }
    console.plog('QQ Activated:', bPocketwatchActive, 'Activate?:', objTemp.activate, 'Force:', bForce, 'Toggle:', bToggle);
    if (bToggle) {
        var nRetry = 5;
        var intervalPocket = setInterval(function () {
            if (classLootBooster.getAttribute('class').indexOf('chamberEmpty') < 0 || --nRetry <= 0) {
                fireEvent(classButton, 'click');
                clearInterval(intervalPocket);
                intervalPocket = null;
            }
        }, 1000);
    }
}

function fortRox() {
    if (GetCurrentLocation().indexOf("Fort Rox") < 0)
        return;

    var objDefaultFRox = {
        stage: ['DAY', 'stage_one', 'stage_two', 'stage_three', 'stage_four', 'stage_five', 'DAWN'],
        order: ['DAY', 'TWILIGHT', 'MIDNIGHT', 'PITCH', 'UTTER', 'FIRST', 'DAWN'],
        weapon: new Array(7).fill(''),
        base: new Array(7).fill(''),
        trinket: new Array(7).fill('None'),
        bait: new Array(7).fill('Gouda'),
        activate: new Array(7).fill(false),
        fullHPDeactivate: true
    };

    var objFRox = getStorageToObject('FRox', objDefaultFRox);
    var objUser = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestFortRox)'));
    var nIndex = -1;
    if (objUser.is_dawn === true) {
        nIndex = 6;
        console.plog('In Dawn');
    } else if (objUser.current_phase == 'night') {
        nIndex = objFRox.stage.indexOf(objUser.current_stage);
        console.plog('In Night, Current Stage:', objUser.current_stage);
    } else if (objUser.current_phase == 'day') {
        nIndex = 0;
        console.plog('In Day');
    }

    if (nIndex < 0)
        return;
    checkThenArm(null, 'weapon', objFRox.weapon[nIndex]);
    checkThenArm(null, 'base', objFRox.base[nIndex]);
    checkThenArm(null, 'trinket', objFRox.trinket[nIndex]);
    if (objFRox.bait[nIndex] == 'ANY_LUNAR')
        checkThenArm('any', 'bait', ['Moon Cheese', 'Crescent Cheese']);
    else if (objFRox.bait[nIndex].indexOf('=>') > -1) {
        var arr = objFRox.bait[nIndex].split('=>');
        checkThenArm('best', 'bait', arr);
    }
    else
        checkThenArm(null, 'bait', objFRox.bait[nIndex]);

    var bTowerActive = !(objUser.tower_status.indexOf('inactive') > -1);
    var nMana = parseInt(document.getElementsByClassName('fortRoxHUD-mana quantity')[0].textContent);
    console.plog('Tower Active:', bTowerActive, 'Mana:', nMana, 'Current HP:', objUser.hp, 'Max HP:', objUser.max_hp);
    if (nMana > 0 && nIndex > 0) {
        var classButton = document.getElementsByClassName('fortRoxHUD-spellTowerButton')[0];
        if (bTowerActive) {
            if (objFRox.activate[nIndex]) {
                if (objFRox.fullHPDeactivate && objUser.hp >= objUser.max_hp) {
                    // deactivate tower
                    fireEvent(classButton, 'click');
                }
            }
            else {
                //deactivate tower
                fireEvent(classButton, 'click');
            }
        }
        else {
            if (objFRox.activate[nIndex]) {
                //activate tower
                fireEvent(classButton, 'click');
            }
        }
    }
}

function Halloween2014() {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Haunted Terrortories") > -1) {
        var areaName = document.getElementsByClassName('halloween2014Hud-areaDetails-name')[0].innerHTML;
        var warning = document.getElementsByClassName('halloween2014Hud-areaDetails-warning active').length;
        var isWarning = (warning > 0);
        console.debug('Current Area Name: ' + areaName + " Warning: " + isWarning);
        if (isWarning) {
            var trickContainer = document.getElementsByClassName('halloween2014Hud-bait trick_cheese clear-block')[0];
            var treatContainer = document.getElementsByClassName('halloween2014Hud-bait treat_cheese clear-block')[0];
            if (trickContainer.children[2].getAttribute('class') == 'armNow active') {
                console.debug('Currently armed: Trick cheese, Going to arm Treat cheese');
                fireEvent(treatContainer.children[2], 'click');
            } else {
                console.debug('Currently armed: Treat cheese, Going to arm Trick cheese');
                fireEvent(trickContainer.children[2], 'click');
            }
        }
    }
}

function Halloween2015() {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Haunted Terrortories") > -1) {
        var areaName = document.getElementsByClassName('halloweenHud-areaDetails-name')[0].innerHTML;
        var warning = document.getElementsByClassName('halloweenHud-areaDetails-warning active').length;
        var isWarning = (warning > 0);
        console.debug('Current Area Name: ' + areaName + " Warning: " + isWarning);
        if (isWarning) {
            var trickContainer = document.getElementsByClassName('halloweenHud-bait trick_cheese clear-block')[0];
            var treatContainer = document.getElementsByClassName('halloweenHud-bait treat_cheese clear-block')[0];
            if (trickContainer.children[2].getAttribute('class') == 'armNow active') {
                console.debug('Currently armed: Trick cheese, Going to arm Treat cheese');
                fireEvent(treatContainer.children[2], 'click');
            } else {
                console.debug('Currently armed: Treat cheese, Going to arm Trick cheese');
                fireEvent(trickContainer.children[2], 'click');
            }
        }
    }
}

function Halloween2016() {
    if (GetCurrentLocation().indexOf("Spooky Sandcastle") < 0)
        return;

    var areaName = document.getElementsByClassName('halloweenHud-areaDetails-name')[0].innerHTML;
    var warning = document.getElementsByClassName('halloweenHud-areaDetails-warning active').length;
    var isWarning = (warning > 0);
    var trickContainer = document.getElementsByClassName('halloweenHud-bait trick_cheese clear-block')[0];
    var treatContainer = document.getElementsByClassName('halloweenHud-bait treat_cheese clear-block')[0];
    var bTricking = (trickContainer.children[2].getAttribute('class') == 'armNow active');
    var bTreating = (treatContainer.children[2].getAttribute('class') == 'armNow active');
    console.plog('Current Area Name:', areaName, 'Warning:', isWarning, 'Tricking:', bTricking, 'Treating:', bTreating);
    if (!(bTricking || bTreating))
        return;
    if (isWarning) {
        if (bTricking) {
            if (parseInt(treatContainer.children[1].textContent) > 0)
                fireEvent(treatContainer.children[2], 'click');
            else {
                disarmTrap('trinket');
                checkThenArm(null, 'bait', 'Brie Cheese');
            }
        }
        else {
            if (parseInt(trickContainer.children[1].textContent) > 0)
                fireEvent(trickContainer.children[2], 'click');
            else {
                disarmTrap('trinket');
                checkThenArm(null, 'bait', 'Brie Cheese');
            }
        }
    } else {
        var i;
        var nSquareMin = 0;
        var classContent = document.getElementsByClassName('halloweenHud-trinket-content clear-block');
        for (i = 0; i < classContent.length; i += 3) {
            if (classContent[i].children[3].getAttribute('class').indexOf('armNow active') > -1)
                nSquareMin++;
        }
        if (nSquareMin === 0)
            return;
        i = (areaName.indexOf('Haunted Dream') > -1) ? 0 : 1;
        var stageContainer = document.getElementsByClassName('halloweenHud-progress-stage-row-container')[i];
        i = (bTricking) ? 0 : 1;
        var nSquareLeft = stageContainer.children[i].getElementsByTagName('i').length;
        console.plog('Min Square:', nSquareMin, 'Square Left:', nSquareLeft);
        if (nSquareLeft <= nSquareMin) {
            for (i = 0; i < classContent.length; i += 3) {
                if (classContent[i].children[3].getAttribute('class').indexOf('armNow active') > -1)
                    fireEvent(classContent[i].children[3], 'click');
            }
        }

    }
}

// For G Express
function gnawnianExpress(load) {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Gnawnian Express") > -1) {
        var onTrain = getPageVariable('user.quests.QuestTrainStation.on_train');
        var charmArmed = getPageVariable('user.trinket_name');
        var trapArmed = getPageVariable('user.weapon_name');
        if (onTrain == 'false' || onTrain == 0) {
            if (charmArmed.indexOf('Supply Schedule') > -1 || charmArmed.indexOf('Roof Rack') > -1 || charmArmed.indexOf('Greasy Glob') > -1 || charmArmed.indexOf('Door Guard') > -1 || charmArmed.indexOf('Dusty Coal') > -1 || charmArmed.indexOf('Black Powder') > -1 || charmArmed.indexOf('Magmatic Crystal') > -1)
                disarmTrap('trinket');

            if (trapArmed.indexOf('Supply Grabber') > -1 || trapArmed.indexOf('Bandit Deflector') > -1 || trapArmed.indexOf('Engine Doubler') > -1)
                checkThenArm('best', 'weapon', ['S.L.A.C. II', 'The Law Draw', 'S.L.A.C.']);
        } else {
            var phase = document.getElementsByClassName('phaseName')[0].textContent;
            phase = phase.substr(7, phase.length);
            console.debug('Current Active Train Phase: ' + phase);
            switch (phase) {
                case 'Supply Depot':
                    checkThenArm('best', 'weapon', supplyDepotTrap);
                    var supplyHoarder = parseInt(document.getElementsByClassName('supplyHoarderTab')[0].textContent.substr(0, 1));
                    if (supplyHoarder == 0) {
                        console.debug("Looking for supply hoarder");
                        checkThenArm(null, 'trinket', 'Supply Schedule');
                    } else {
                        console.debug("Supply hoarder is present. Disarming charm now...");
                        disarmTrap('trinket');
                    }
                    loadTrain('depot', load);
                    break;
                case 'Raider River':
                    checkThenArm('best', 'weapon', raiderRiverTrap);
                    var attacking = document.getElementsByClassName('attacked');
                    for (var i = 0; i < attacking.length; i++) {
                        if (attacking[i].tagName == 'DIV')
                            attacking = attacking[i].className.substr(0, attacking[i].className.indexOf(' '));
                    }
                    console.debug("Raiders are attacking " + attacking);
                    switch (attacking) {
                        case 'roof':
                            checkThenArm(null, 'trinket', 'Roof Rack', 'disarm');
                            break;
                        case 'door':
                            checkThenArm(null, 'trinket', 'Door Guard', 'disarm');
                            break;
                        case 'rails':
                            checkThenArm(null, 'trinket', 'Greasy Glob', 'disarm');
                            break;
                        default:
                            console.debug('Bot is confused, raiders are not attacking?');
                            disarmTrap('trinket');
                            break;
                    }
                    loadTrain('raider', load);
                    break;
                case 'Daredevil Canyon':
                    checkThenArm('best', 'weapon', daredevilCanyonTrap);
                    if (debug) console.log("Starting to look for " + coalCharm + " charm.");
                    checkThenArm('best', 'trinket', coalCharm);
                    if (debug) console.log("Done looking for charm.")
                    loadTrain('canyon', load);
                    break;
                default:
                    break;
            }
        }
    }
}

function loadTrain(location, load) {
    try {
        if (load) {
            switch (location) {
                case 'raider':
                    var repellents = parseInt(document.getElementsByClassName('mouseRepellent')[0].getElementsByClassName('quantity')[0].textContent);
                    if (repellents >= 10)
                        fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
                    break;
                case 'canyon':
                    var timeLeft = document.getElementsByClassName('phaseTimer')[0].textContent.substr(10);
                    // Fire only when time left is less than 16 mins :P (needs checking if works)
                    if (parseInt(timeLeft.substr(0, timeLeft.indexOf(':'))) == 0 && parseInt(timeLeft.substr(timeLeft.indexOf(':') + 1)) <= 16)
                        fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
                    break;
                default:
                    fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
                    break;
            }
        }
        return;
    } catch (e) {
        console.debug(e.message);
        return;
    }
}

function ges() {
    if (GetCurrentLocation().indexOf('Gnawnian Express Station') < 0)
        return;

    var i, j;
    var bOnTrain = (getPageVariable('user.quests.QuestTrainStation.on_train') == 'true');
    var charmArmed = getPageVariable("user.trinket_name");
    var arrCharm;
    var nCharmQuantity;
    var objDefaultGES = {
        bLoadCrate: false,
        nMinCrate: 11,
        bUseRepellent: false,
        nMinRepellent: 11,
        bStokeEngine: false,
        nMinFuelNugget: 20,
        SD_BEFORE: {
            weapon: '',
            base: '',
            trinket: '',
            bait: ''
        },
        SD_AFTER: {
            weapon: '',
            base: '',
            trinket: '',
            bait: ''
        },
        RR: {
            weapon: '',
            base: '',
            trinket: '',
            bait: ''
        },
        DC: {
            weapon: '',
            base: '',
            trinket: '',
            bait: ''
        },
        WAITING: {
            weapon: '',
            base: '',
            trinket: '',
            bait: ''
        }
    };
    var objGES = getStorageToObject('GES', objDefaultGES);
    var nPhaseSecLeft = parseInt(getPageVariable('user.quests.QuestTrainStation.phase_seconds_remaining'));
    var strCurrentPhase = '';
    if (!bOnTrain) {
        strCurrentPhase = 'WAITING';
    } else {
        var classPhase = document.getElementsByClassName('box phaseName');
        if (classPhase.length > 0 && classPhase[0].children.length > 1)
            strCurrentPhase = classPhase[0].children[1].textContent;
    }
    console.plog('Current Phase:', strCurrentPhase, 'Time Left (s):', nPhaseSecLeft);
    if (strCurrentPhase === '')
        return;

    var strStage = '';
    if (strCurrentPhase.indexOf('Supply Depot') > -1) {
        if (nPhaseSecLeft <= nextActiveTime || (enableTrapCheck && trapCheckTimeDiff === 0 && nPhaseSecLeft <= 900)) { // total seconds left to next phase less than next active time or next trap check time
            strStage = 'RR';
            checkThenArm(null, 'trinket', objGES[strStage].trinket);
        } else {
            var nTurn = parseInt(document.getElementsByClassName('supplyHoarderTab')[0].textContent.substr(0, 1));
            console.plog("Supply Hoarder Turn:", nTurn);
            if (nTurn <= 0) { // before
                strStage = 'SD_BEFORE';
                if (objGES.SD_BEFORE.trinket.indexOf('Supply Schedule') > -1 && charmArmed.indexOf('Supply Schedule') < 0) {
                    var classCharm = document.getElementsByClassName('charms');
                    var linkCharm = classCharm[0].children[0];
                    nCharmQuantity = parseInt(document.getElementsByClassName('charms')[0].getElementsByClassName('quantity')[0].textContent);
                    console.plog('Supply Schedule Charm Quantity:', nCharmQuantity);
                    if (Number.isInteger(nCharmQuantity) && nCharmQuantity > 0)
                        fireEvent(linkCharm, 'click');
                }
                else
                    checkThenArm(null, 'trinket', objGES.SD_BEFORE.trinket);
            }
            else {
                strStage = 'SD_AFTER';
                if (objGES.SD_AFTER.trinket.indexOf('Supply Schedule') > -1)
                    disarmTrap('trinket');
                else
                    checkThenArm(null, 'trinket', objGES.SD_AFTER.trinket);
            }
        }

        if (objGES.bLoadCrate) {
            var nCrateQuantity = parseInt(document.getElementsByClassName('supplyCrates')[0].getElementsByClassName('quantity')[0].textContent);
            console.plog('Crate Quantity:', nCrateQuantity);
            if (Number.isInteger(nCrateQuantity) && nCrateQuantity >= objGES.nMinCrate)
                fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
        }
    }
    else if (strCurrentPhase.indexOf('Raider River') > -1) {
        if (nPhaseSecLeft <= nextActiveTime || (enableTrapCheck && trapCheckTimeDiff === 0 && nPhaseSecLeft <= 900)) { // total seconds left to next phase less than next active time or next trap check time
            strStage = 'DC';
            checkThenArm(null, 'trinket', objGES[strStage].trinket);
        }
        else {
            strStage = 'RR';
            if (objGES.RR.trinket == 'AUTO') {
                // get raider status and arm respective charm
                arrCharm = ['Roof Rack', 'Door Guard', 'Greasy Glob'];
                var classTrainCarArea = document.getElementsByClassName('trainCarArea');
                nCharmQuantity = 0;
                var strAttack = '';
                for (i = 0; i < classTrainCarArea.length; i++) {
                    if (classTrainCarArea[i].className.indexOf('attacked') > -1) {
                        strAttack = classTrainCarArea[i].className.substr(0, classTrainCarArea[i].className.indexOf(' '));
                        nCharmQuantity = parseInt(classTrainCarArea[i].getElementsByClassName('quantity')[0].textContent);
                        console.plog('Raiders Attack:', capitalizeFirstLetter(strAttack), ',', arrCharm[i], 'Charm Quantity:', nCharmQuantity);
                        if (Number.isInteger(nCharmQuantity) && nCharmQuantity > 0 && charmArmed.indexOf(arrCharm[i]) < 0)
                            fireEvent(classTrainCarArea[i].firstChild, 'click');
                        else {
                            for (j = 0; j < arrCharm.length; j++) {
                                if (j != i && charmArmed.indexOf(arrCharm[j]) > -1) {
                                    disarmTrap('trinket');
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            else
                checkThenArm(null, 'trinket', objGES.RR.trinket);
        }

        if (objGES.bUseRepellent) {
            var nRepellentQuantity = parseInt(document.getElementsByClassName('mouseRepellent')[0].getElementsByClassName('quantity')[0].textContent);
            console.plog('Repellent Quantity:', nRepellentQuantity);
            if (Number.isInteger(nRepellentQuantity) && nRepellentQuantity >= objGES.nMinRepellent)
                fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
        }
    }
    else if (strCurrentPhase.indexOf('Daredevil Canyon') > -1) {
        if (nPhaseSecLeft <= nextActiveTime || (enableTrapCheck && trapCheckTimeDiff === 0 && nPhaseSecLeft <= 900)) { // total seconds left to next phase less than next active time or next trap check time
            strStage = 'WAITING';
            checkThenArm(null, 'trinket', objGES[strStage].trinket);
        }
        else {
            strStage = 'DC';
            arrCharm = ['Magmatic Crystal Charm', 'Black Powder Charm', 'Dusty Coal Charm'];
            if (objGES.DC.trinket == 'AUTO')
                checkThenArm('best', 'trinket', arrCharm);
            else {
                arrCharm.reverse();
                var nIndex = arrCharm.indexOf(objGES.DC.trinket);
                if (arrCharm.indexOf(objGES.DC.trinket) > -1) {
                    var classCharms = document.getElementsByClassName('charms');
                    nCharmQuantity = parseInt(classCharms[0].children[nIndex].getElementsByClassName('quantity')[0].textContent);
                    console.plog(objGES.DC.trinket, 'Quantity:', nCharmQuantity);
                    if (Number.isInteger(nCharmQuantity) && nCharmQuantity > 0 && charmArmed.indexOf(objGES.DC.trinket) < 0)
                        fireEvent(classCharms[0].children[nIndex], 'click');
                }
                else
                    checkThenArm(null, 'trinket', objGES.DC.trinket);
            }
        }

        if (objGES.bStokeEngine) {
            // get fuel nugget quantity
            var nFuelQuantity = parseInt(document.getElementsByClassName('fuelNugget')[0].getElementsByClassName('quantity')[0].textContent);
            console.plog('Fuel Nugget Quantity:', nFuelQuantity);
            if (Number.isInteger(nFuelQuantity) && nFuelQuantity >= objGES.nMinFuelNugget)
                fireEvent(document.getElementsByClassName('phaseButton')[0], 'click');
        }
    }
    else {
        strStage = 'WAITING';
        arrCharm = ['Supply Schedule', 'Roof Rack', 'Door Guard', 'Greasy Blob', 'Magmatic Crystal', 'Black Powder', 'Dusty Coal'];
        if (objGES.WAITING.trinket.indexOf(arrCharm) > -1)
            disarmTrap('trinket');
        else
            checkThenArm(null, 'trinket', objGES.WAITING.trinket);
    }
    checkThenArm(null, 'weapon', objGES[strStage].weapon);
    checkThenArm(null, 'base', objGES[strStage].base);
    checkThenArm(null, 'bait', objGES[strStage].bait);
}

function wwrift() {
    if (GetCurrentLocation().indexOf('Whisker Woods Rift') < 0)
        return;

    var objDefaultWWRift = {
        factionFocus: "CC",
        factionFocusNext: "Remain",
        faction: {
            weapon: new Array(3).fill(''),
            base: new Array(3).fill(''),
            trinket: new Array(3).fill('None'),
            bait: new Array(3).fill('None')
        },
        MBW: {
            minRageLLC: 40,
            rage4044: {
                weapon: new Array(7).fill(''),
                base: new Array(7).fill(''),
                trinket: new Array(7).fill('None'),
                bait: new Array(7).fill('None')
            },
            rage4548: {
                weapon: new Array(8).fill(''),
                base: new Array(8).fill(''),
                trinket: new Array(8).fill('None'),
                bait: new Array(8).fill('None')
            },
        },
    };
    var objWWRift = getStorageToObject('WWRift', objDefaultWWRift);
    if (isNullOrUndefined(objWWRift.factionFocusNext) || objWWRift.factionFocus === "")
        objWWRift.factionFocusNext = "Remain";
    objWWRift.order = ['CC', 'GGT', 'DL'];
    objWWRift.funnelCharm = ['Cherry Charm', 'Gnarled Charm', 'Stagnant Charm'];
    objWWRift.rage = new Array(3);
    var i;
    var temp = -1;
    var tempNext = -1;
    var nIndex = -1;
    var classRage = document.getElementsByClassName('riftWhiskerWoodsHUD-zone-rageLevel');
    for (i = 0; i < classRage.length; i++) {
        objWWRift.rage[i] = parseInt(classRage[i].textContent);
        if (Number.isNaN(objWWRift.rage[i]))
            return;
    }
    console.plog(objWWRift);
    var charmArmed = getPageVariable("user.trinket_name");
    var nBar25 = 0;
    var nBar44 = 0;
    var nBarMinRage = 0;
    var nIndexCharm = -1;
    var nLimit = 0;
    var bResave = false;
    if (objWWRift.factionFocus == 'MBW_40_44') {
        for (i = 0; i < objWWRift.rage.length; i++) {
            if (objWWRift.rage[i] >= 25)
                nBar25++;
        }
        if (nBar25 >= 3) {
            for (i = 0; i < objWWRift.rage.length; i++) {
                if (objWWRift.rage[i] >= objWWRift.MBW.minRageLLC)
                    nBarMinRage++;
            }
        }
        nIndex = nBarMinRage + nBar25;
        checkThenArm(null, 'weapon', objWWRift.MBW.rage4044.weapon[nIndex]);
        checkThenArm(null, 'base', objWWRift.MBW.rage4044.base[nIndex]);
        if (objWWRift.MBW.rage4044.trinket[nIndex].indexOf('FSC') > -1) {
            nIndexCharm = objWWRift.funnelCharm.indexOf(charmArmed);
            nLimit = (nIndex >= 3) ? objWWRift.MBW.minRageLLC : 25;
            if (nIndexCharm > -1) {
                if (objWWRift.rage[nIndexCharm] >= nLimit) {
                    temp = minIndex(objWWRift.rage);
                    if (temp > -1)
                        objWWRift.MBW.rage4044.trinket[nIndex] = objWWRift.funnelCharm[temp];
                }
                else
                    objWWRift.MBW.rage4044.trinket[nIndex] = charmArmed;
            }
            else {
                temp = minIndex(objWWRift.rage);
                if (temp > -1)
                    objWWRift.MBW.rage4044.trinket[nIndex] = objWWRift.funnelCharm[temp];
            }
        }
        checkThenArm(null, 'trinket', objWWRift.MBW.rage4044.trinket[nIndex]);
        checkThenArm(null, 'bait', objWWRift.MBW.rage4044.bait[nIndex]);
    }
    else if (objWWRift.factionFocus == 'MBW_45_48') {
        for (i = 0; i < objWWRift.rage.length; i++) {
            if (objWWRift.rage[i] >= 25)
                nBar25++;
        }
        if (nBar25 >= 3) {
            for (i = 0; i < objWWRift.rage.length; i++) {
                if (objWWRift.rage[i] >= 44)
                    nBar44++;
            }
        }
        if (nBar44 >= 3) {
            for (i = 0; i < objWWRift.rage.length; i++) {
                if (objWWRift.rage[i] >= objWWRift.MBW.minRageLLC)
                    nBarMinRage++;
            }
        }
        nIndex = nBar25 + nBar44 + nBarMinRage;
        checkThenArm(null, 'weapon', objWWRift.MBW.rage4548.weapon[nIndex]);
        checkThenArm(null, 'base', objWWRift.MBW.rage4548.base[nIndex]);
        if (objWWRift.MBW.rage4548.trinket[nIndex].indexOf('FSC') > -1) {
            nIndexCharm = objWWRift.funnelCharm.indexOf(charmArmed);
            nLimit = (nIndex >= 3) ? 44 : 25;
            if (nIndexCharm > -1) {
                if (objWWRift.rage[nIndexCharm] >= nLimit) {
                    temp = minIndex(objWWRift.rage);
                    if (temp > -1)
                        objWWRift.MBW.rage4548.trinket[nIndex] = objWWRift.funnelCharm[temp];
                }
                else
                    objWWRift.MBW.rage4548.trinket[nIndex] = charmArmed;
            }
            else {
                temp = minIndex(objWWRift.rage);
                if (temp > -1)
                    objWWRift.MBW.rage4548.trinket[nIndex] = objWWRift.funnelCharm[temp];
            }
        }
        checkThenArm(null, 'trinket', objWWRift.MBW.rage4548.trinket[nIndex]);
        checkThenArm(null, 'bait', objWWRift.MBW.rage4548.bait[nIndex]);
    }
    else {
        temp = objWWRift.order.indexOf(objWWRift.factionFocus);
        if (temp == -1)
            return;
        nIndex = Math.floor(objWWRift.rage[temp] / 25);
        checkThenArm(null, 'weapon', objWWRift.faction.weapon[nIndex]);
        checkThenArm(null, 'base', objWWRift.faction.base[nIndex]);
        if (objWWRift.faction.trinket[nIndex].indexOf('FSC') > -1) {
            if (objWWRift.factionFocusNext == "Remain" || objWWRift.factionFocus == objWWRift.factionFocusNext)
                objWWRift.faction.trinket[nIndex] = objWWRift.funnelCharm[temp];
            else {
                var nLastRage = getStorageToVariableInt("LastRage", 0);
                if (objWWRift.rage[temp] < nLastRage) {
                    tempNext = objWWRift.order.indexOf(objWWRift.factionFocusNext);
                    objWWRift.faction.trinket[nIndex] = objWWRift.funnelCharm[tempNext];
                    objWWRift.factionFocus = objWWRift.factionFocusNext;
                    bResave = true;
                }
                else
                    objWWRift.faction.trinket[nIndex] = objWWRift.funnelCharm[temp];
            }
        }
        checkThenArm(null, 'trinket', objWWRift.faction.trinket[nIndex]);
        checkThenArm(null, 'bait', objWWRift.faction.bait[nIndex]);
        if (bResave) {
            // resave into localStorage
            var obj = getStorageToObject('WWRift', objDefaultWWRift);
            obj.factionFocus = objWWRift.factionFocus;
            setStorage('WWRift', JSON.stringify(obj));
        }
        setStorage("LastRage", objWWRift.rage[temp]);
    }
}

function iceberg(waxOrSticky) { // takes in string 'wax' or 'sticky'
    var location = getPageVariable('user.location');
    console.debug(location);
    if (location.indexOf('Iceberg') > -1) {
        var stage = document.getElementsByClassName('currentPhase')[0].textContent;
        var progress = parseInt(document.getElementsByClassName('user_progress')[0].textContent.replace(',', ''));
        console.debug('In ' + stage + ' at ' + progress + ' feets right now.');

        // Check if theres general
        if (progress == 300 || progress == 600 || progress == 1600 || progress == 1800) {
            console.debug('General encountered.');
            checkThenArm('best', 'base', bestPowerBase);
            checkThenArm(null, 'trinket', 'Super Power', wasteCharm);
            return;
        }

        var icebergCharm;
        if (waxOrSticky == 'sticky') {
            icebergCharm = ['Sticky', 'Wax'];
        } else {
            icebergCharm = ['Wax', 'Sticky'];
        }

        switch (stage) {
            case 'Treacherous Tunnels':
                // magnet base
                checkThenArm(null, 'base', 'Magnet Base');
                checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
                break;
            case 'Brutal Bulwark':
                // spiked base
                checkThenArm(null, 'base', 'Spiked Base');
                checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
                break;
            case 'Bombing Run':
                // Remote det base
                checkThenArm('best', 'base', ['Remote Detonator Base', 'Magnet Base']);
                checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
                break;
            case 'The Mad Depths':
                // Hearthstone base
                checkThenArm(null, 'base', 'Hearthstone Base');
                checkThenArm('best', 'trinket', icebergCharm, wasteCharm);
                break;
            case 'Icewing\'s Lair':
            // Deep freeze base for the rest
            case 'Hidden Depths':
            case 'The Deep Lair':
                checkThenArm(null, 'base', 'Deep Freeze Base');
                var charmArmed = getPageVariable('user.trinket_name');
                if (charmArmed.indexOf('Wax') > -1 || charmArmed.indexOf('Sticky') > -1)
                    disarmTrap('trinket');
                break;
            default:
                break;
        }

        icebergCharm = null;
        stage = null;
    } else if (location.indexOf('Slushy Shoreline') > -1) {
        console.debug('Disarming cheese as wrong area now.');
        disarmTrap('bait');
    }
    location = null;
}

function icebergV2() {
    var loc = GetCurrentLocation();
    var arrOrder = ['GENERAL', 'TREACHEROUS', 'BRUTAL', 'BOMBING', 'MAD', 'ICEWING', 'HIDDEN', 'DEEP', 'SLUSHY'];
    var objDefaultIceberg = {
        base: new Array(9).fill(''),
        trinket: new Array(9).fill('None'),
        bait: new Array(9).fill('Gouda')
    };
    var objIceberg = getStorageToObject('Iceberg', objDefaultIceberg);
    var nIndex = -1;
    if (loc.indexOf('Iceberg') > -1) {
        var phase;
        var nProgress = -1;
        var classCurrentPhase = document.getElementsByClassName('currentPhase');
        if (classCurrentPhase.length > 0)
            phase = classCurrentPhase[0].textContent;
        else
            phase = getPageVariable('user.quests.QuestIceberg.current_phase');
        var classProgress = document.getElementsByClassName('user_progress');
        if (classProgress.length > 0)
            nProgress = parseInt(classProgress[0].textContent.replace(',', ''));
        else
            nProgress = parseInt(getPageVariable('user.quests.QuestIceberg.user_progress'));
        console.plog('In', phase, 'at', nProgress, 'feets');

        if (nProgress == 300 || nProgress == 600 || nProgress == 1600 || nProgress == 1800)
            nIndex = 0;
        else {
            phase = phase.toUpperCase();
            for (var i = 1; i < arrOrder.length; i++) {
                if (phase.indexOf(arrOrder[i]) > -1) {
                    nIndex = i;
                    break;
                }
            }
        }
    }
    else if (loc.indexOf('Slushy Shoreline') > -1)
        nIndex = arrOrder.indexOf('SLUSHY');
    if (nIndex < 0)
        return;
    checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
    checkThenArm(null, 'base', objIceberg.base[nIndex]);
    checkThenArm(null, 'trinket', objIceberg.trinket[nIndex]);
    checkThenArm(null, 'bait', objIceberg.bait[nIndex]);
}

function BurroughRift(bCheckLoc, minMist, maxMist, nToggle) {
    //Tier 0: 0 Mist Canisters
    //Tier 1/Yellow: 1-5 Mist Canisters
    //Tier 2/Green: 6-18 Mist Canisters
    //Tier 3/Red: 19-20 Mist Canisters
    if (bCheckLoc && GetCurrentLocation().indexOf('Burroughs Rift') < 0)
        return;

    var currentMistQuantity = parseInt(document.getElementsByClassName('mistQuantity')[0].innerText);
    var isMisting = (getPageVariable('user.quests.QuestRiftBurroughs.is_misting') == 'true');
    var mistButton = document.getElementsByClassName('mistButton')[0];
    console.plog('Current Mist Quantity:', currentMistQuantity, 'Is Misting:', isMisting);
    if (minMist === 0 && maxMist === 0) {
        if (isMisting) {
            console.plog('Stop mist...');
            fireEvent(mistButton, 'click');
        }
    }
    else if (currentMistQuantity >= maxMist && isMisting) {
        if (maxMist == 20 && Number.isInteger(nToggle)) {
            if (nToggle == 1) {
                console.plog('Stop mist...');
                fireEvent(mistButton, 'click');
            }
            else {
                var nCount20 = getStorageToVariableInt('BR20_Count', 0);
                nCount20++;
                if (nCount20 >= nToggle) {
                    nCount20 = 0;
                    console.plog('Stop mist...');
                    fireEvent(mistButton, 'click');
                }
                setStorage('BR20_Count', nCount20);
            }
        }
        else {
            console.plog('Stop mist...');
            fireEvent(mistButton, 'click');
        }
    }
    else if (currentMistQuantity <= minMist && !isMisting) {
        console.plog('Start mist...');
        fireEvent(mistButton, 'click');
    }
    return currentMistQuantity;
}

function BRCustom() {
    if (GetCurrentLocation().indexOf('Burroughs Rift') < 0)
        return;

    var objDefaultBRCustom = {
        hunt: '',
        toggle: 1,
        name: ['Red', 'Green', 'Yellow', 'None'],
        weapon: new Array(4),
        base: new Array(4),
        trinket: new Array(4),
        bait: new Array(4)
    };
    var objBR = getStorageToObject('BRCustom', objDefaultBRCustom);
    var mistQuantity = 0;
    if (objBR.hunt == 'Red')
        mistQuantity = BurroughRift(false, 19, 20, objBR.toggle);
    else if (objBR.hunt == 'Green')
        mistQuantity = BurroughRift(false, 6, 18);
    else if (objBR.hunt == 'Yellow')
        mistQuantity = BurroughRift(false, 1, 5);
    else
        mistQuantity = BurroughRift(false, 0, 0);

    var currentTier = '';
    if (mistQuantity >= 19)
        currentTier = 'Red';
    else if (mistQuantity >= 6)
        currentTier = 'Green';
    else if (mistQuantity >= 1)
        currentTier = 'Yellow';
    else
        currentTier = 'None';

    if (currentTier != objBR.hunt)
        return;

    var nIndex = objBR.name.indexOf(currentTier);
    checkThenArm(null, 'weapon', objBR.weapon[nIndex]);
    checkThenArm(null, 'base', objBR.base[nIndex]);
    checkThenArm(null, 'bait', objBR.bait[nIndex]);
    if (objBR.trinket[nIndex] == 'None')
        disarmTrap('trinket');
    else
        checkThenArm(null, 'trinket', objBR.trinket[nIndex]);
}

function lgGeneral(objLG) {
    var loc = GetCurrentLocation();
    switch (loc) {
        case 'Living Garden':
            livingGarden(objLG);
            break;
        case 'Lost City':
            lostCity(objLG);
            break;
        case 'Sand Dunes':
            sandDunes();
            break;
        case 'Twisted Garden':
            twistedGarden(objLG);
            break;
        case 'Cursed City':
            cursedCity(objLG);
            break;
        case 'Sand Crypts':
            sandCrypts(objLG);
            break;
        default:
            return;
    }
    DisarmLGSpecialCharm(loc);
}

function livingGarden(obj) {
    checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
    var charmArmed = getPageVariable('user.trinket_name');
    var baitArmed = getPageVariable('user.bait_name');
    var pourEstimate = document.getElementsByClassName('pourEstimate')[0];
    var estimateHunt = parseInt(pourEstimate.innerText);
    var strStatus = '';
    if (Number.isNaN(estimateHunt))
        strStatus = 'Poured';
    else if (estimateHunt >= 35)
        strStatus = 'Filled';
    else
        strStatus = 'Filling';
    console.plog('Estimate Hunt:', estimateHunt, 'Status:', strStatus);
    if (obj.LG.trinket.after.indexOf('Sponge') > -1)
        obj.LG.trinket.after = 'None';
    if (strStatus == 'Poured') {
        checkThenArm(null, 'base', obj.LG.base.after);
        checkThenArm(null, 'trinket', obj.LG.trinket.after);
        checkThenArm(null, 'bait', obj.LG.bait.after);
    }
    else if (strStatus == 'Filled') {
        var pourButton = document.getElementsByClassName('pour')[0];
        if (obj.LG.isAutoPour && !isNullOrUndefined(pourButton)) {
            fireEvent(pourButton, 'click');
            if (document.getElementsByClassName('confirm button')[0]) {
                window.setTimeout(function () {
                    fireEvent(document.getElementsByClassName('confirm button')[0], 'click');
                }, 1000);
                checkThenArm(null, 'base', obj.LG.base.after);
                checkThenArm(null, 'trinket', obj.LG.trinket.after);
                checkThenArm(null, 'bait', obj.LG.bait.after);
            }
            else {
                checkThenArm('best', 'base', bestLGBase);
                if (charmArmed.indexOf('Sponge') > -1)
                    disarmTrap('trinket');
                if (baitArmed.indexOf('Camembert') > -1)
                    checkThenArm(null, 'bait', 'Gouda');
            }
        }
        else {
            checkThenArm('best', 'base', bestLGBase);
            if (charmArmed.indexOf('Sponge') > -1)
                disarmTrap('trinket');
            if (baitArmed.indexOf('Camembert') > -1)
                checkThenArm(null, 'bait', 'Gouda');
        }
    }
    else if (strStatus == 'Filling') {
        checkThenArm('best', 'base', bestLGBase);
        if (!obj.LG.isAutoFill) {
            if (charmArmed.indexOf('Sponge') > -1 ||
                obj.LG.trinket.after.indexOf(charmArmed) > -1 || charmArmed.indexOf(obj.LG.trinket.after) > -1)
                disarmTrap('trinket');
        }
        else {
            if (estimateHunt >= 28)
                checkThenArm(null, 'trinket', 'Sponge');
            else
                checkThenArm('best', 'trinket', spongeCharm);
        }
        if (baitArmed.indexOf('Camembert') > -1 && baitArmed.indexOf('Duskshade') < 0)
            checkThenArm(null, 'bait', 'Gouda');
    }
}

function lostCity(obj) {
    checkThenArm('best', 'weapon', objBestTrap.weapon.arcane);
    checkThenArm(null, 'bait', 'Dewthief');
    var isCursed = (document.getElementsByClassName('stateBlessed hidden').length > 0);
    console.plog('Cursed:', isCursed);

    //disarm searcher charm when cursed is lifted
    if (!isCursed) {
        checkThenArm(null, 'base', obj.LG.base.after);
        if (obj.LC.trinket.after.indexOf('Searcher') > -1)
            obj.LC.trinket.after = 'None';
        checkThenArm(null, 'trinket', obj.LC.trinket.after);
    }
    else {
        checkThenArm(null, 'trinket', 'Searcher');
        checkThenArm('best', 'base', bestLGBase);
    }
}

function sandDunes() {
    var hasStampede = getPageVariable('user.quests.QuestSandDunes.minigame.has_stampede');
    console.plog('Has Stampede:', hasStampede);

    //disarm grubling chow charm when there is no stampede
    if (hasStampede == 'false') {
        if (getPageVariable('user.trinket_name').indexOf('Chow') > -1)
            disarmTrap('trinket');
    }
    else
        checkThenArm(null, 'trinket', 'Grubling Chow');
    checkThenArm('best', 'weapon', objBestTrap.weapon.shadow);
    checkThenArm('best', 'base', bestLGBase);
    checkThenArm(null, 'bait', 'Dewthief');
}

function twistedGarden(obj) {
    checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
    var red = parseInt(document.getElementsByClassName('itemImage red')[0].innerText);
    var yellow = parseInt(document.getElementsByClassName('itemImage yellow')[0].innerText);
    var nEstimateHunt = -1;
    var charmArmed = getPageVariable('user.trinket_name');
    var strStatus = '';
    if (Number.isNaN(red) || Number.isNaN(yellow) || document.getElementsByClassName('stateFilling hidden').length > 0) {
        strStatus = 'Poured';
        nEstimateHunt = parseInt(document.getElementsByClassName('pouring')[0].textContent);
    }
    else if (red == 10 && yellow == 10)
        strStatus = 'Filled';
    else
        strStatus = 'Filling';
    console.plog('Red:', red, 'Yellow:', yellow, 'Estimate Hunt:', nEstimateHunt, 'Status:', strStatus);
    var redPlusYellow = redSpongeCharm.concat(yellowSpongeCharm);
    if (obj.TG.trinket.after.indexOf('Red') > -1 || obj.TG.trinket.after.indexOf('Yellow') > -1)
        obj.TG.trinket.after = 'None';
    if (strStatus == 'Poured') {
        checkThenArm(null, 'base', obj.TG.base.after);
        checkThenArm(null, 'trinket', obj.TG.trinket.after);
        checkThenArm(null, 'bait', obj.TG.bait.after);
    }
    else if (strStatus == 'Filled') {
        var pourButton = document.getElementsByClassName('pour')[0];
        if (obj.TG.isAutoPour && !isNullOrUndefined(pourButton)) {
            fireEvent(pourButton, 'click');
            if (document.getElementsByClassName('confirm button')[0]) {
                window.setTimeout(function () {
                    fireEvent(document.getElementsByClassName('confirm button')[0], 'click');
                }, 1000);
                checkThenArm(null, 'base', obj.TG.base.after);
                checkThenArm(null, 'trinket', obj.TG.trinket.after);
                checkThenArm(null, 'bait', obj.TG.bait.after);
            }
            else {
                checkThenArm('best', 'base', bestLGBase);
                if (charmArmed.indexOf('Red') > -1 || charmArmed.indexOf('Yellow') > -1)
                    disarmTrap('trinket');
                checkThenArm(null, 'bait', 'Duskshade Camembert');
            }
        }
        else {
            checkThenArm('best', 'base', bestLGBase);
            if (charmArmed.indexOf('Red') > -1 || charmArmed.indexOf('Yellow') > -1)
                disarmTrap('trinket');
            checkThenArm(null, 'bait', 'Duskshade Camembert');
        }
    }
    else if (strStatus == 'Filling') {
        checkThenArm('best', 'base', bestLGBase);
        if (!obj.TG.isAutoFill) {
            if (charmArmed.indexOf('Red') > -1 || charmArmed.indexOf('Yellow') > -1 ||
                obj.TG.trinket.after.indexOf(charmArmed) > -1 || charmArmed.indexOf(obj.TG.trinket.after) > -1)
                disarmTrap('trinket');
        }
        else {
            if (red <= 8 && yellow <= 8)
                checkThenArm('best', 'trinket', redPlusYellow);
            else if (red < 10) {
                if (red <= 8)
                    checkThenArm('best', 'trinket', redSpongeCharm);
                else
                    checkThenArm(null, 'trinket', 'Red Sponge');
            }
            else if (red == 10 && yellow < 10) {
                if (yellow <= 8)
                    checkThenArm('best', 'trinket', yellowSpongeCharm);
                else
                    checkThenArm(null, 'trinket', 'Yellow Sponge');
            }
        }
        checkThenArm(null, 'bait', 'Duskshade Camembert');
    }
}

function cursedCity(obj) {
    checkThenArm('best', 'weapon', objBestTrap.weapon.arcane);
    checkThenArm(null, 'bait', 'Graveblossom');
    var objCC = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestLostCity.minigame)'));
    var curses = "";
    var charmArmed = getPageVariable('user.trinket_name');
    console.plog(objCC);
    if (objCC.is_cursed === false) {
        checkThenArm(null, 'base', obj.CC.base.after);
        if (obj.CC.trinket.after.indexOf('Bravery') > -1 || obj.CC.trinket.after.indexOf('Shine') > -1 || obj.CC.trinket.after.indexOf('Clarity') > -1)
            obj.CC.trinket.after = 'None';
        checkThenArm(null, 'trinket', obj.CC.trinket.after);
    }
    else {
        var cursedCityCharm = [];
        for (var i = 0; i < objCC.curses.length; ++i) {
            console.plog("i:", i, "Active:", objCC.curses[i].active);
            if (objCC.curses[i].active) {
                switch (i) {
                    case 0:
                        console.plog("Fear Active");
                        cursedCityCharm.push('Bravery');
                        break;
                    case 1:
                        console.plog("Darkness Active");
                        cursedCityCharm.push('Shine');
                        break;
                    case 2:
                        console.plog("Mist Active");
                        cursedCityCharm.push('Clarity');
                        break;
                }
            }
        }
        checkThenArm('any', 'trinket', cursedCityCharm);
        checkThenArm('best', 'base', bestLGBase);
    }
}

function sandCrypts(obj) {
    checkThenArm('best', 'weapon', objBestTrap.weapon.shadow);
    checkThenArm(null, 'bait', 'Graveblossom');
    var salt = parseInt(document.getElementsByClassName('salt_charms')[0].innerText);
    console.plog('Salted:', salt);
    if (salt >= obj.SC.maxSaltCharged) {
        checkThenArm(null, 'base', obj.SC.base.after);
        checkThenArm(null, 'trinket', 'Grub Scent');
    }
    else {
        checkThenArm(null, 'base', obj.SC.base.before);
        if ((obj.SC.maxSaltCharged - salt) == 1)
            checkThenArm(null, 'trinket', 'Grub Salt');
        else
            checkThenArm('best', 'trinket', bestSalt);
    }
}

function DisarmLGSpecialCharm(locationName) {
    var obj = {};
    obj['Living Garden'] = spongeCharm.slice();
    obj['Lost City'] = ['Searcher'];
    obj['Sand Dunes'] = ['Grubling Chow'];
    obj['Twisted Garden'] = redSpongeCharm.concat(yellowSpongeCharm);
    obj['Cursed City'] = ['Bravery', 'Shine', 'Clarity'];
    obj['Sand Crypts'] = bestSalt.slice();
    delete obj[locationName];
    var charmArmed = getPageVariable("user.trinket_name");
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            for (var i = 0; i < obj[prop].length; ++i) {
                if (charmArmed.indexOf(obj[prop][i]) === 0) {
                    disarmTrap('trinket');
                    return;
                }
            }
        }
    }
}

function ZTower() {
    var location = getPageVariable('user.location');
    console.debug(location);
    if (location.indexOf('Zugzwang\'s Tower') == -1 && location.indexOf('Seasonal Garden') == -1) {
        console.debug('Not in Zugzwang\'s Tower or Seasonal Garden.');
        return;
    }

    if (location.indexOf('Seasonal Garden') > -1) {
        checkThenArm(null, 'bait', 'Gouda');
        checkThenArm(null, 'trinket', 'Amplifier');
        checkThenArm('best', 'base', ['Seasonal', 'Fissure', 'Golden Tournament']);

        var season = nobCalculateOfflineTimers('seasonal');
        console.debug('It is ' + season + ' in Seasonal Gardens right now.');
        switch (season) {
            case 'Spring':
                checkThenArm('best', 'weapon', bestPhysical);
                checkThenArm('best', 'weapon', bestPhysicalBase);
                break;
            case 'Summer':
                checkThenArm('best', 'weapon', bestTactical);
                checkThenArm('best', 'weapon', bestPowerBase);
                break;
            case 'Fall':
                checkThenArm('best', 'weapon', bestShadow);
                checkThenArm('best', 'weapon', bestPowerBase);
                break;
            case 'Winter':
                checkThenArm('best', 'weapon', bestHydro);
                checkThenArm('best', 'weapon', bestPowerBase);
                break;
            default:
                break;
        }

        season = null;
        return;
    } else if (location.indexOf('Zugzwang\'s Tower') > -1) {
        var ztTriesLeft = 5;
        retrieveMouseList();
        var intervalZT = setInterval(
            function () {
                if (mouseList.length > 0) {
                    if (checkMouse("Chess Master")) {
                        //arm Uncharged Scholar Charm & Checkmate Cheese
                        checkThenArm(null, "trinket", "Uncharged Scholar");
                        checkThenArm(null, "bait", "Checkmate");
                    } else if (checkMouse("King")) {
                        //arm Checkmate Cheese
                        checkThenArm(null, "bait", "Checkmate");
                    } else if (checkMouse("Queen")) {
                        //arm another charm other than rook charm
                        checkThenArm(null, "trinket", "Super Power");
                        disarmTrap('trinket');
                    } else if (checkMouse("Rook")) {
                        //arm rook charm (if available)
                        checkThenArm(null, "trinket", "Rook Crumble");
                    } else if (checkMouse("Knight")) {
                        //arm Sphynx Wrath
                        checkThenArm(null, "weapon", "Sphynx Wrath");
                        checkThenArm('best', 'base', bestPowerBase);
                    }
                    clearInterval(intervalZT);
                    intervalZT = null;
                    mouseList = [];
                    return;
                } else {
                    if (debug) console.log("Count down to ZT bot give up: " + ztTriesLeft);
                    if (ztTriesLeft == 0) {
                        clearInterval(intervalZT);
                        intervalZT = null;
                        mouseList = [];
                        ztTriesLeft = null;
                    }
                    return;
                }
            }, 3000);
        return;
    }
}

/* V2 SG + ZTower */
function seasonalGarden() {
    if (GetCurrentLocation().indexOf('Seasonal Garden') < 0)
        return;

    var cheeseArmed = getPageVariable('user.bait_name');
    if (cheeseArmed.indexOf('Checkmate') > -1)
        checkThenArm(null, 'bait', 'Gouda');

    var objDefaultSG = {
        weapon: new Array(4).fill(''),
        base: new Array(4).fill(''),
        trinket: new Array(4).fill(''),
        bait: new Array(4).fill(''),
        disarmBaitAfterCharged: false
    };
    var objSG = getStorageToObject('SGarden', objDefaultSG);
    objSG.season = ['Spring', 'Summer', 'Fall', 'Winter'];
    var now = (g_nTimeOffset === 0) ? new Date() : new Date(Date.now() + g_nTimeOffset * 1000);
    var nTimeStamp = Date.parse(now) / 1000;
    var nFirstSeasonTimeStamp = 1283328000;
    var nSeasonLength = 288000; // 80hr
    var nSeason = Math.floor((nTimeStamp - nFirstSeasonTimeStamp) / nSeasonLength) % objSG.season.length;
    var nSeasonNext = nSeasonLength - ((nTimeStamp - nFirstSeasonTimeStamp) % nSeasonLength);
    var nCurrentAmp = parseInt(getPageVariable("user.viewing_atts.zzt_amplifier"));
    var nMaxAmp = parseInt(getPageVariable("user.viewing_atts.zzt_max_amplifier"));
    console.plog('Current Amplifier:', nCurrentAmp, 'Current Season:', objSG.season[nSeason], 'Next Season In:', timeFormat(nSeasonNext));
    if (nSeasonNext <= nextActiveTime) { // total seconds left to next season less than next active time
        nSeason++;
        if (nSeason >= objSG.season.length)
            nSeason = 0;
    }

    checkThenArm(null, 'weapon', objSG.weapon[nSeason]);
    checkThenArm(null, 'base', objSG.base[nSeason]);
    checkThenArm(null, 'trinket', objSG.trinket[nSeason]);
    if (nCurrentAmp + 1 >= nMaxAmp) {
        if (getPageVariable('user.trinket_name').indexOf('Amplifier') > -1)
            disarmTrap('trinket');
        if (nCurrentAmp >= nMaxAmp && objSG.disarmBaitAfterCharged)
            disarmTrap('bait');
        else
            checkThenArm(null, 'bait', objSG.bait[nSeason]);
    }
    else
        checkThenArm(null, 'bait', objSG.bait[nSeason]);
}

function zugzwangTower() {
    var loc = GetCurrentLocation();
    if (loc.indexOf("Seasonal Garden") > -1) {
        setStorage('eventLocation', 'SG');
        seasonalGarden();
        return;
    }
    else if (loc.indexOf("Zugzwang's Tower") < 0)
        return;

    var objDefaultZT = {
        focus: 'MYSTIC',
        order: ['PAWN', 'KNIGHT', 'BISHOP', 'ROOK', 'QUEEN', 'KING', 'CHESSMASTER'],
        weapon: new Array(14).fill(''),
        base: new Array(14).fill(''),
        trinket: new Array(14).fill('None'),
        bait: new Array(14).fill('Gouda'),
    };
    var objZT = getStorageToObject('ZTower', objDefaultZT);
    objZT.focus = objZT.focus.toUpperCase();
    var nProgressMystic = parseInt(getPageVariable('user.viewing_atts.zzt_mage_progress'));
    var nProgressTechnic = parseInt(getPageVariable('user.viewing_atts.zzt_tech_progress'));
    if (Number.isNaN(nProgressMystic) || Number.isNaN(nProgressTechnic))
        return;

    var strUnlockMystic = getZTUnlockedMouse(nProgressMystic);
    var strUnlockTechnic = getZTUnlockedMouse(nProgressTechnic);
    if (strUnlockMystic === "" || strUnlockTechnic === "")
        return;
    var nIndex = -1;
    console.plog(capitalizeFirstLetter(objZT.focus), 'Progress Mystic:', nProgressMystic, 'Unlock Mystic:', strUnlockMystic, 'Progress Technic:', nProgressTechnic, 'Unlock Technic:', strUnlockTechnic);
    if (objZT.focus.indexOf('MYSTIC') === 0) { // Mystic side first
        if (strUnlockMystic == 'CHESSMASTER' && objZT.focus.indexOf('=>') > -1) { // is double run?
            nIndex = objZT.order.indexOf(strUnlockTechnic);
            if (nIndex > -1)
                nIndex += 7;
        }
        else { // single run
            nIndex = objZT.order.indexOf(strUnlockMystic);
        }
    }
    else { // Technic side first
        if (strUnlockTechnic == 'CHESSMASTER' && objZT.focus.indexOf('=>') > -1) { // is double run?
            nIndex = objZT.order.indexOf(strUnlockMystic);
            if (nIndex > -1)
                nIndex += 7;
        }
        else { // single run
            nIndex = objZT.order.indexOf(strUnlockTechnic);
        }
    }

    if (nIndex == -1)
        return;

    if (objZT.weapon[nIndex] == 'MPP/TPP') {
        if (objZT.focus.indexOf('MYSTIC') === 0)
            objZT.weapon[nIndex] = (nIndex >= 7) ? 'Technic Pawn Pincher' : 'Mystic Pawn Pincher';
        else
            objZT.weapon[nIndex] = (nIndex >= 7) ? 'Mystic Pawn Pincher' : 'Technic Pawn Pincher';
    }
    else if (objZT.weapon[nIndex] == 'BPT/OAT') {
        if (objZT.focus.indexOf('MYSTIC') === 0)
            objZT.weapon[nIndex] = (nIndex >= 7) ? 'Obvious Ambush Trap' : 'Blackstone Pass Trap';
        else
            objZT.weapon[nIndex] = (nIndex >= 7) ? 'Blackstone Pass Trap' : 'Obvious Ambush Trap';
    }

    for (var prop in objZT) {
        if (objZT.hasOwnProperty(prop) &&
            (prop == 'weapon' || prop == 'base' || prop == 'trinket' || prop == 'bait')) {
            if (objZT[prop][nIndex] == 'None')
                disarmTrap(prop);
            else
                checkThenArm(null, prop, objZT[prop][nIndex]);
        }
    }
}

function getZTUnlockedMouse(nProgress) {
    var strUnlock = "";
    if (nProgress <= 7)
        strUnlock = 'PAWN';
    else if (nProgress <= 9)
        strUnlock = 'KNIGHT';
    else if (nProgress <= 11)
        strUnlock = 'BISHOP';
    else if (nProgress <= 13)
        strUnlock = 'ROOK';
    else if (nProgress <= 14)
        strUnlock = 'QUEEN';
    else if (nProgress <= 15)
        strUnlock = 'KING';
    else if (nProgress <= 16)
        strUnlock = 'CHESSMASTER';
    return strUnlock;
}

/* End V2 ZTower */

function balackCoveJOD() {
    var curLoc = GetCurrentLocation();
    var bInJOD = (curLoc.indexOf('Jungle') > -1);
    var bInBC = (curLoc.indexOf('Balack') > -1);
    if (!(bInJOD || bInBC))
        return;
    var objDefaultBCJOD = {
        order: ['JOD', 'LOW', 'MID', 'HIGH'],
        weapon: new Array(4).fill(''),
        base: new Array(4).fill(''),
        trinket: new Array(4).fill(''),
        bait: new Array(4).fill('')
    };
    var objBCJOD = getStorageToObject('BC_JOD', objDefaultBCJOD);
    var nIndex = -1;
    if (bInJOD)
        nIndex = 0;
    else {
        var i = 0;
        var objBC = {
            arrTide: ['Low Rising', 'Mid Rising', 'High Rising', 'High Ebbing', 'Mid Ebbing', 'Low Ebbing'],
            arrLength: [24, 3, 1, 1, 3, 24],
            arrAll: []
        };
        var nTimeStamp = Math.floor(Date.now() / 1000) + g_nTimeOffset * 1000;
        var nFirstTideTimeStamp = 1294708860;
        var nTideLength = 1200; // 20min
        for (i = 0; i < objBC.arrTide.length; i++) {
            objBC.arrAll = objBC.arrAll.concat(new Array(objBC.arrLength[i]).fill(objBC.arrTide[i]));
        }
        var nTideTotalLength = sumData(objBC.arrLength);
        var nDiff = nTimeStamp - nFirstTideTimeStamp;
        var nIndexCurrentTide = Math.floor(nDiff / nTideLength) % nTideTotalLength;
        var tideNameCurrent = objBC.arrAll[nIndexCurrentTide];
        var tideNameNext;
        if (tideNameCurrent.indexOf('Low') > -1)
            tideNameNext = 'Mid Rising';
        else if (tideNameCurrent.indexOf('High') > -1)
            tideNameNext = 'Mid Ebbing';
        else if (tideNameCurrent == 'Mid Rising')
            tideNameNext = 'High Rising';
        else if (tideNameCurrent == 'Mid Ebbing')
            tideNameNext = 'Low Ebbing';

        var nTideDist = objBC.arrAll.indexOf(tideNameNext) + nTideTotalLength - nIndexCurrentTide;
        nTideDist = nTideDist % nTideTotalLength;
        var nNextTideTime = nTideDist * nTideLength - nDiff % nTideLength;
        var strTempCurrent = tideNameCurrent.toUpperCase().split(' ')[0];
        var strTempNext = tideNameNext.toUpperCase().split(' ')[0];
        nIndex = objBCJOD.order.indexOf(strTempCurrent);
        if (nNextTideTime <= nextActiveTime && strTempNext != strTempCurrent) // total seconds left to next tide less than next active time
            nIndex = objBCJOD.order.indexOf(strTempNext);
        console.plog('Current Tide:', objBC.arrAll[nIndexCurrentTide], 'Index:', nIndex, 'Next Tide:', tideNameNext, 'In', timeFormat(nNextTideTime));
        if (nIndex < 0)
            return;
    }
    checkThenArm(null, 'weapon', objBCJOD.weapon[nIndex]);
    checkThenArm(null, 'base', objBCJOD.base[nIndex]);
    checkThenArm(null, 'trinket', objBCJOD.trinket[nIndex]);
    checkThenArm(null, 'bait', objBCJOD.bait[nIndex]);
}

function forbiddenGroveAR() {
    var curLoc = GetCurrentLocation();
    var bInFG = (curLoc.indexOf('Forbidden Grove') > -1);
    var bInAR = (curLoc.indexOf('Acolyte Realm') > -1);
    if (!(bInFG || bInAR))
        return;
    var objDefaultFGAR = {
        order: ['FG', 'AR'],
        weapon: new Array(2).fill(''),
        base: new Array(2).fill(''),
        trinket: new Array(2).fill(''),
        bait: new Array(2).fill('')
    };
    var objFGAR = getStorageToObject('FG_AR', objDefaultFGAR);
    var nIndex = (bInFG) ? 0 : 1;
    checkThenArm(null, 'weapon', objFGAR.weapon[nIndex]);
    checkThenArm(null, 'base', objFGAR.base[nIndex]);
    checkThenArm(null, 'trinket', objFGAR.trinket[nIndex]);
    checkThenArm(null, 'bait', objFGAR.bait[nIndex]);
}

function SunkenCity(isAggro) {
    if (GetCurrentLocation().indexOf("Sunken City") < 0)
        return;

    var zone = document.getElementsByClassName('zoneName')[0].innerText;
    console.plog('Current Zone:', zone);
    var currentZone = GetSunkenCityZone(zone);
    checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
    if (currentZone == objSCZone.ZONE_NOT_DIVE) {
        checkThenArm('best', 'base', objBestTrap.base.luck);
        checkThenArm(null, 'trinket', 'Oxygen Burst');
        checkThenArm('best', 'bait', ['Fishy Fromage', 'Gouda']);
        return;
    }

    checkThenArm('best', 'base', bestSCBase);
    var distance = parseInt(getPageVariable('user.quests.QuestSunkenCity.distance'));
    console.plog('Dive Distance(m):', distance);
    var charmArmed = getPageVariable("user.trinket_name");
    var charmElement = document.getElementsByClassName('charm');
    var isEACArmed = (charmArmed.indexOf('Empowered Anchor') > -1);
    var isWJCArmed = (charmArmed.indexOf('Water Jet') > -1);
    if (currentZone == objSCZone.ZONE_OXYGEN || currentZone == objSCZone.ZONE_TREASURE || currentZone == objSCZone.ZONE_BONUS) {
        if (isAggro && (currentZone == objSCZone.ZONE_TREASURE))
            checkThenArm('best', 'trinket', ['Golden Anchor', 'Empowered Anchor']);
        else {
            // arm Empowered Anchor Charm
            if (!isEACArmed) {
                if (parseInt(charmElement[0].innerText) > 0)
                    fireEvent(charmElement[0], 'click');
            }
        }

        checkThenArm(null, 'bait', 'SUPER');
    }
    else if (currentZone == objSCZone.ZONE_DANGER_PP || currentZone == objSCZone.ZONE_DANGER_PP_LOTA) {
        if (!isAggro) {
            // arm Empowered Anchor Charm
            if (!isEACArmed && !isAggro) {
                if (parseInt(charmElement[0].innerText) > 0)
                    fireEvent(charmElement[0], 'click');
            }
        }
        else
            checkThenArm('best', 'trinket', ['Spiked Anchor', 'Empowered Anchor']);
        checkThenArm(null, 'bait', 'Gouda');
    }
    else if ((currentZone == objSCZone.ZONE_DEFAULT) && isAggro) {
        var depth = parseInt(getPageVariable('user.quests.QuestSunkenCity.zones[1].length'));
        if (depth >= 500) {
            var nextZoneName = getPageVariable('user.quests.QuestSunkenCity.zones[2].name');
            var nextZoneLeft = parseInt(getPageVariable('user.quests.QuestSunkenCity.zones[2].left'));
            var nextZone = GetSunkenCityZone(nextZoneName);
            var distanceToNextZone = parseInt((nextZoneLeft - 80) / 0.6);
            console.plog('Distance to next zone(m):', distanceToNextZone);
            if (distanceToNextZone >= 480 || (distanceToNextZone >= 230 && nextZone == objSCZone.ZONE_DEFAULT)) {
                // arm Water Jet Charm
                checkThenArm('best', 'trinket', ['Smart Water Jet', 'Water Jet']);
            }
            else
                DisarmSCSpecialCharm(charmArmed);
        }
        else
            DisarmSCSpecialCharm(charmArmed);

        checkThenArm(null, 'bait', 'Gouda');
    }
    else {
        DisarmSCSpecialCharm(charmArmed);
        checkThenArm(null, 'bait', 'Gouda');
    }
}

function SCCustom() {
    if (GetCurrentLocation().indexOf("Sunken City") < 0)
        return;

    var objDefaultSCCustom = {
        zone: ['ZONE_NOT_DIVE', 'ZONE_DEFAULT', 'ZONE_CORAL', 'ZONE_SCALE', 'ZONE_BARNACLE', 'ZONE_TREASURE', 'ZONE_DANGER', 'ZONE_DANGER_PP', 'ZONE_OXYGEN', 'ZONE_BONUS', 'ZONE_DANGER_PP_LOTA'],
        zoneID: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        isHunt: new Array(11).fill(true),
        bait: new Array(11).fill('Gouda'),
        trinket: new Array(11).fill('None'),
        useSmartJet: false
    };
    var objSCCustom = getStorageToObject('SCCustom', objDefaultSCCustom);
    var zone = document.getElementsByClassName('zoneName')[0].innerText;
    var zoneID = GetSunkenCityZone(zone);
    checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
    if (zoneID == objSCZone.ZONE_NOT_DIVE) {
        checkThenArm('best', 'base', objBestTrap.base.luck);
        checkThenArm(null, 'trinket', objSCCustom.trinket[zoneID]);
        checkThenArm(null, 'bait', objSCCustom.bait[zoneID]);
        return;
    }
    var distance = parseInt(getPageVariable('user.quests.QuestSunkenCity.distance'));
    console.plog('Current Zone:', zone, 'ID', zoneID, 'at meter', distance);
    checkThenArm('best', 'base', bestSCBase);
    var canJet = false;
    if (!objSCCustom.isHunt[zoneID]) {
        var distanceToNextZone = [];
        var isNextZoneInHuntZone = [];
        var arrZone = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestSunkenCity.zones)'));
        var nActiveZone = parseInt(getPageVariable('user.quests.QuestSunkenCity.active_zone'));
        var nStartZoneIndex = 0;
        var i, nIndex;
        for (i = 0; i < arrZone.length; i++) {
            if (arrZone[i].num == nActiveZone) {
                nStartZoneIndex = i + 1;
                break;
            }
        }
        console.plog('Start Zone Index:', nStartZoneIndex);
        for (i = nStartZoneIndex; i < arrZone.length; i++) {
            nIndex = i - nStartZoneIndex;
            distanceToNextZone[nIndex] = parseInt((arrZone[i].left - 80) / 0.6);
            isNextZoneInHuntZone[nIndex] = (objSCCustom.isHunt[GetSunkenCityZone(arrZone[i].name)]);
            console.plog('Next Zone:', arrZone[i].name, 'in meter', distanceToNextZone[nIndex], 'Is In Hunt Zone:', isNextZoneInHuntZone[nIndex]);
        }
        if (distanceToNextZone.length === 0) {
            distanceToNextZone[0] = 0;
            isNextZoneInHuntZone[0] = true;
        }

        // jet through
        var charmElement = document.getElementsByClassName('charm');
        var charmArmed = getPageVariable("user.trinket_name");
        var isWJCArmed = (charmArmed.indexOf('Water Jet') > -1);
        if (distanceToNextZone[0] >= 480 || (distanceToNextZone[1] >= 480 && (!isNextZoneInHuntZone[0])) || (!(isNextZoneInHuntZone[0] || isNextZoneInHuntZone[1]))) {
            // arm Water Jet Charm
            if (objSCCustom.useSmartJet)
                checkThenArm('best', 'trinket', ['Smart Water Jet', 'Water Jet', objSCCustom.trinket[zoneID]]);
            else
                checkThenArm('best', 'trinket', ['Water Jet', objSCCustom.trinket[zoneID]]);
        }
        else
            checkThenArm(null, 'trinket', objSCCustom.trinket[zoneID]);
    }
    else
        checkThenArm(null, 'trinket', objSCCustom.trinket[zoneID]);
    checkThenArm(null, 'bait', objSCCustom.bait[zoneID]);
}

function DisarmSCSpecialCharm(charmArmedName) {
    var specialCharms = ['Golden Anchor', 'Spiked Anchor', 'Ultimate Anchor', 'Oxygen Burst', 'Empowered Anchor', 'Water Jet'];
    for (var i = 0; i < specialCharms.length; i++) {
        if (charmArmedName.indexOf(specialCharms[i]) > -1) {
            disarmTrap('trinket');
            break;
        }
    }
}

function GetSunkenCityZone(zoneName) {
    var returnZone = 0;
    switch (zoneName) {
        case 'Sand Dollar Sea Bar':
        case 'Pearl Patch':
        case 'Sunken Treasure':
            returnZone = objSCZone.ZONE_TREASURE;
            break;
        case 'Feeding Grounds':
        case 'Carnivore Cove':
            returnZone = objSCZone.ZONE_DANGER;
            break;
        case 'Monster Trench':
            returnZone = objSCZone.ZONE_DANGER_PP;
            break;
        case 'Lair of the Ancients':
            returnZone = objSCZone.ZONE_DANGER_PP_LOTA;
            break;
        case 'Deep Oxygen Stream':
        case 'Oxygen Stream':
            returnZone = objSCZone.ZONE_OXYGEN;
            break;
        case 'Magma Flow':
            returnZone = objSCZone.ZONE_BONUS;
            break;
        case 'Coral Reef':
        case 'Coral Garden':
        case 'Coral Castle':
            returnZone = objSCZone.ZONE_CORAL;
            break;
        case 'School of Mice':
        case 'Mermouse Den':
        case 'Lost Ruins':
            returnZone = objSCZone.ZONE_SCALE;
            break;
        case 'Rocky Outcrop':
        case 'Shipwreck':
        case 'Haunted Shipwreck':
            returnZone = objSCZone.ZONE_BARNACLE;
            break;
        case 'Shallow Shoals':
        case 'Sea Floor':
        case 'Murky Depths':
            returnZone = objSCZone.ZONE_DEFAULT;
            break;
        default:
            returnZone = objSCZone.ZONE_NOT_DIVE;
            break;
    }
    return returnZone;
}

function labyZokor() {
    if (GetCurrentLocation().indexOf("Labyrinth") < 0)
        zokor();
    else
        labyrinth();
}

function labyrinth() {
    if (debug) console.log("RUN labyrinth()");
    if (GetCurrentLocation().indexOf("Labyrinth") < 0) {
        console.debug("Not in labyrinth.");
        return;
    }

    var labyStatus = getPageVariable("user.quests.QuestLabyrinth.status");
    var isAtEntrance = (labyStatus == "intersection entrance");
    var isAtHallway = (labyStatus == "hallway");
    var isAtIntersection = (labyStatus == "intersection");
    var isAtExit = (labyStatus == "exit");
    var lastHunt = document.getElementsByClassName('labyrinthHUD-hallway-tile locked').length + 1;
    var totalClue = parseInt(document.getElementsByClassName('labyrinthHUD-clueBar-totalClues')[0].innerText);
    console.plog("Entrance:", isAtEntrance, "Intersection:", isAtIntersection, "Exit:", isAtExit);

    var objLaby = getStorageToObject('Labyrinth', objDefaultLaby);
    console.plog('District to focus:', objLaby.districtFocus);

    bestLabyBase = bestLabyBase.concat(objBestTrap.base.luck).concat(objBestTrap.base.power);
    var charmArmed = getPageVariable('user.trinket_name');
    if (objLaby.armOtherBase != 'false') {
        if (charmArmed.indexOf('Compass Magnet') === 0)
            checkThenArm(null, 'base', objLaby.armOtherBase);
        else
            checkThenArm('best', 'base', bestLabyBase);
    }
    else
        checkThenArm('best', 'base', bestLabyBase);

    var userVariable = undefined;
    if (objLaby.disarmCompass && charmArmed.indexOf('Compass Magnet') > -1) {
        userVariable = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestLabyrinth)'));
        for (var i = 0; i < userVariable.all_clues.length; i++) {
            if (userVariable.all_clues[i].name.toUpperCase().indexOf("DEAD") > -1) {
                if (userVariable.all_clues[i].quantity <= objLaby.nDeadEndClue)
                    disarmTrap('trinket');
                break;
            }
        }
    }

    if (isAtHallway) {
        var strCurHallwayFullname = document.getElementsByClassName('labyrinthHUD-hallwayName')[0].textContent.toUpperCase();
        if (strCurHallwayFullname.indexOf('FARMING') > -1) {
            if (objLaby.weaponFarming == 'Arcane')
                checkThenArm('best', 'weapon', objBestTrap.weapon.arcane.concat(objBestTrap.weapon.forgotten));
            else
                checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
        }
        else
            checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
        if (objLaby.securityDisarm) {
            var strCurHallwayTier = strCurHallwayFullname.split(' ')[1];
            var maxCluePerHunt = 0;
            if (strCurHallwayTier == 'PLAIN')
                maxCluePerHunt = 1;
            else if (strCurHallwayTier == 'SUPERIOR')
                maxCluePerHunt = 2;
            else
                maxCluePerHunt = 3;
            var classLantern = document.getElementsByClassName('labyrinthHUD-toggleLantern mousehuntTooltipParent');
            var bLanternActive = true;
            if (classLantern.length < 1)
                bLanternActive = (getPageVariable('user.quests.QuestLabyrinth.lantern_status') == 'active');
            else
                bLanternActive = (classLantern[0].getAttribute('class').indexOf('inactive') < 0);
            if (bLanternActive)
                maxCluePerHunt++;
            if (charmArmed.indexOf('Lantern Oil') > -1)
                maxCluePerHunt++;
            console.plog('Hallway Last Hunt :', lastHunt, 'Total Clues:', totalClue, 'Max Clue Per Hunt:', maxCluePerHunt);
            if (lastHunt <= objLaby.lastHunt && totalClue >= (100 - maxCluePerHunt * lastHunt))
                disarmTrap('bait');
        }
        return;
    }

    if (isAtEntrance || isAtExit || objLaby.districtFocus.indexOf('None') > -1) {
        checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
        checkThenArm(null, 'bait', 'Gouda');
        disarmTrap('trinket');
        return;
    }

    var doorsIntersect = document.getElementsByClassName('labyrinthHUD-door');
    var doorsExit = document.getElementsByClassName('labyrinthHUD-exit');
    var objDoors = {
        name: [],
        length: [],
        tier: [],
        clue: [],
        code: [],
        priorities: [],
        debug: []
    };
    var temp = "";
    for (var i = 0; i < doorsIntersect.length; i++) {
        if (doorsIntersect[i].getAttribute('class').indexOf('mystery') > -1) {
            isAtIntersection = false;
            return;
        }

        if (doorsIntersect[i].getAttribute('class').indexOf('broken') > -1 || doorsIntersect[i].children.length < 2) {
            objDoors.length.push("LONG");
            objDoors.tier.push("PLAIN");
            objDoors.name.push("BROKEN");
            objDoors.debug.push("LONG PLAIN BROKEN");
            objDoors.code.push("");
            objDoors.clue.push(Number.MAX_SAFE_INTEGER);
            objDoors.priorities.push(Number.MAX_SAFE_INTEGER);
        }
        else {
            temp = doorsIntersect[i].children[1].innerText.toUpperCase();
            objDoors.debug.push(temp);
            temp = temp.split(" ");
            objDoors.length.push(temp[0]);
            objDoors.tier.push(temp[1]);
            objDoors.name.push(temp[2]);
            objDoors.code.push(objCodename[temp[0]] + objCodename[temp[1]]);
            objDoors.clue.push(Number.MAX_SAFE_INTEGER);
            objDoors.priorities.push(Number.MAX_SAFE_INTEGER);
        }
        isAtIntersection = true;
    }

    console.plog(objDoors.debug.join(","));
    temp = "";
    var range = "";
    var index = [];
    try {
        if (isNullOrUndefined(userVariable))
            userVariable = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestLabyrinth)'));
        for (var i = 0; i < userVariable.all_clues.length; i++) {
            temp = userVariable.all_clues[i].name.toUpperCase();
            if (temp.indexOf("DEAD") > -1)
                continue;
            index = getAllIndices(objDoors.name, temp);
            for (var j = 0; j < index.length; j++) {
                objDoors.clue[index[j]] = userVariable.all_clues[i].quantity;
            }
        }

        index = objDoors.name.indexOf(objLaby.districtFocus);
        if (index < 0) {
            if (objLaby.chooseOtherDoors) {
                console.plog(objDoors);
                temp = min(objDoors.clue);
                var objFewestClue = {
                    num: temp,
                    indices: getAllIndices(objDoors.clue, temp),
                    count: countArrayElement(temp, objDoors.clue)
                };
                var objShortestLength = {
                    type: "SHORT",
                    indices: [],
                    count: 0
                };
                if (objDoors.length.indexOf("SHORT") > -1)
                    objShortestLength.type = "SHORT";
                else if (objDoors.length.indexOf("MEDIUM") > -1)
                    objShortestLength.type = "MEDIUM";
                else if (objDoors.length.indexOf("LONG") > -1)
                    objShortestLength.type = "LONG";
                objShortestLength.indices = getAllIndices(objDoors.length, objShortestLength.type);
                objShortestLength.count = objShortestLength.indices.length;
                console.plog(JSON.stringify(objShortestLength));
                console.plog(JSON.stringify(objFewestClue));
                if (objShortestLength.indices.length < 1 || objFewestClue.indices.length < 1) {
                    checkThenArm(null, 'bait', 'Gouda');
                    disarmTrap('trinket');
                    return;
                }

                var arrTemp = [];
                var nMin = Number.MAX_SAFE_INTEGER;
                var nMinIndex = -1;
                if (objLaby.typeOtherDoors.indexOf("SHORTEST") === 0) { // SHORTEST_ONLY / SHORTEST_FEWEST
                    if (objShortestLength.count > 1 && objLaby.typeOtherDoors.indexOf("FEWEST") > -1) {
                        for (var i = 0; i < objShortestLength.indices.length; i++) {
                            if (objDoors.clue[objShortestLength.indices[i]] < nMin) {
                                nMin = objDoors.clue[objShortestLength.indices[i]];
                                nMinIndex = objShortestLength.indices[i];
                            }
                        }
                        if (nMinIndex > -1)
                            arrTemp.push(nMinIndex);
                    }
                    else
                        arrTemp = objShortestLength.indices;
                }
                else if (objLaby.typeOtherDoors.indexOf("FEWEST") === 0) { // FEWEST_ONLY / FEWEST_SHORTEST
                    if (objFewestClue.count > 1 && objLaby.typeOtherDoors.indexOf("SHORTEST") > -1) {
                        var strTemp = "";
                        for (var i = 0; i < objFewestClue.indices.length; i++) {
                            strTemp = objDoors.length[objFewestClue.indices[i]].toUpperCase();
                            if (objLength.hasOwnProperty(strTemp) && objLength[strTemp] < nMin) {
                                nMin = objLength[strTemp];
                                nMinIndex = objFewestClue.indices[i];
                            }
                        }
                        if (nMinIndex > -1)
                            arrTemp.push(nMinIndex);
                    }
                    else
                        arrTemp = objFewestClue.indices;
                }
                for (var i = 0; i < arrTemp.length; i++) {
                    if (objDoors.name[arrTemp[i]].indexOf("BROKEN") < 0) {
                        if (objDoors.name[arrTemp[i]].indexOf('FARMING') > -1) {
                            if (objLaby.weaponFarming == 'Arcane')
                                checkThenArm('best', 'weapon', objBestTrap.weapon.arcane.concat(objBestTrap.weapon.forgotten));
                            else
                                checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
                        }
                        else
                            checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
                        checkThenArm(null, 'bait', 'Gouda');
                        disarmTrap('trinket');
                        fireEvent(doorsIntersect[arrTemp[i]], 'click');
                        window.setTimeout(function () {
                            fireEvent(document.getElementsByClassName('mousehuntActionButton confirm')[0], 'click');
                        }, 1500);
                        break;
                    }
                }
            }
            else {
                checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
                checkThenArm(null, 'bait', 'Gouda');
                disarmTrap('trinket');
            }
            return;
        }
        else {
            if (objDoors.clue[index] < 15)
                range = 'between0and14';
            else if (objDoors.clue[index] < 60)
                range = 'between15and59';
            else
                range = 'between60and100';
        }

        var arr;
        var arrAll = [];
        for (var i = 0; i < objLaby[range].length; i++) {
            // i = 0/1/2 = plain/superior/epic
            arr = [];
            for (var j = 0; j < 3; j++)
                arr.push(j + 1 + (objLaby[range].length - 1 - i) * 3);

            if (objLaby[range][i].indexOf(objCodename.LONG) === 0)
                arrAll = arrAll.concat(arr.reverse());
            else
                arrAll = arrAll.concat(arr);
        }

        for (var i = arrAll.length; i < arrHallwayOrder.length; i++)
            arrAll.push(Number.MAX_SAFE_INTEGER);

        for (var i = 0; i < objDoors.code.length; i++) {
            if (objDoors.name[i].indexOf(objLaby.districtFocus) > -1) {
                index = arrHallwayOrder.indexOf(objDoors.code[i]);
                if (index > -1) {
                    objDoors.priorities[i] = arrAll[index];
                }
            }
        }

        console.plog(objDoors);
        var sortedDoorPriorities = sortWithIndices(objDoors.priorities, "ascend");
        fireEvent(doorsIntersect[sortedDoorPriorities.index[0]], 'click');
        window.setTimeout(function () {
            fireEvent(document.getElementsByClassName('mousehuntActionButton confirm')[0], 'click');
        }, 1500);
        if (objLaby.districtFocus.indexOf('FARMING') > -1) {
            if (objLaby.weaponFarming == 'Arcane')
                checkThenArm('best', 'weapon', objBestTrap.weapon.arcane.concat(objBestTrap.weapon.forgotten));
            else
                checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
        }
        else
            checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
    }
    catch (e) {
        console.perror('labyrinth', e.message);
        checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
        checkThenArm(null, 'bait', 'Gouda');
        disarmTrap('trinket');
        return;
    }
}

function zokor() {
    var loc = GetCurrentLocation();
    if (loc.indexOf("Labyrinth") > -1) {
        setStorage('eventLocation', 'Labyrinth');
        labyrinth();
        return;
    }
    else if (loc.indexOf("Zokor") < 0)
        return;

    var objDefaultZokor = {
        bossStatus: ['INCOMING', 'ACTIVE', 'DEFEATED'],
        bait: new Array(3).fill('Gouda'),
        trinket: new Array(3).fill('None')
    };
    var objZokor = getStorageToObject('Zokor', objDefaultZokor);
    var objAncientCity = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestAncientCity)'));
    objAncientCity.boss = objAncientCity.boss.toUpperCase();
    var nIndex = objZokor.bossStatus.indexOf(objAncientCity.boss);
    console.plog('District Tier:', objAncientCity.district_tier, 'Boss Status:', objAncientCity.boss);
    if (objAncientCity.district_tier < 3)
        return;

    checkThenArm('best', 'weapon', objBestTrap.weapon.forgotten);
    checkThenArm('best', 'base', objBestTrap.base.luck);
    if (nIndex > -1) {
        checkThenArm(null, 'bait', objZokor.bait[nIndex]);
        if (objZokor.trinket[nIndex] == 'None')
            disarmTrap('trinket');
        else
            checkThenArm(null, 'trinket', objZokor.trinket[nIndex]);
    }
}

function fieryWarpath(superCharm) {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Fiery Warpath") > -1) {
        var wave = document.getElementsByClassName("sandwarpathhud")[0].className;
        wave = parseInt(wave.charAt(wave.indexOf("wave_") + 5));
        var streak = parseInt(document.getElementsByClassName("streak_quantity")[0].textContent);
        //var streakMouse;
        var retreating = false;
        if (document.getElementsByClassName('desert_general')[0]) {
            retreating = ((document.getElementsByClassName('desert_general')[0].className.indexOf('inactive') > -1) && (document.getElementsByClassName('desert_supply')[0].className.indexOf('inactive')));
        }

        console.log("Current Wave: " + wave + ", with " + streak + " streak(s) in " + ", mice retreating? " + retreating);

        if (retreating) {
            checkThenArm('best', 'weapon', bestPhysical);
            checkThenArm('best', 'base', bestPhysicalBase);
            checkThenArm('best', 'trinket', wasteCharm);
            return;
        }

        var wave4PhysicalTrap = ['Warden Slayer', 'Chrome MonstroBot', 'Sandstorm MonstroBot', 'Sandtail Sentinel'];

        commanderCharm = ["Super Warpath Commander", "Warpath Commander"];
        var warriorCharm = ["Super Warpath Warrior", "Warpath Warrior"];
        var scoutCharm = ["Super Warpath Scout", "Warpath Scout"];
        var archerCharm = ["Super Warpath Archer", "Warpath Archer"];
        var cavalryCharm = ["Super Warpath Cavalry", "Warpath Cavalry"];
        var mageCharm = ["Super Warpath Mage", "Warpath Mage"];
        var wardenCharm = wasteCharm;
        var bossCharm = ["Monger", "Super Power"];

        if (!superCharm) {
            commanderCharm = ["Warpath Commander"];
            warriorCharm = ["Warpath Warrior"];
            scoutCharm = ["Warpath Scout"];
            archerCharm = ["Warpath Archer"];
            cavalryCharm = ["Warpath Cavalry"];
            mageCharm = ["Warpath Mage"];
        }

        var population = document.getElementsByClassName("population");
        var mouseGroup;
        for (var i = 0; i < population.length; i++) {
            // Check for high streak
            if (streak > 6) {
                checkThenArm('best', 'weapon', bestPhysical);
                checkThenArm('best', 'base', bestPhysicalBase);
                checkThenArm('best', 'trinket', commanderCharm, 'disarm');
                checkThenArm(null, 'bait', 'SUPER', 'Gouda');
                break;
            }

            //checkThenArm(null, 'bait', 'Gouda');
            // Finds first non 0 mouse group
            if (parseInt(population[i].textContent) > 0) {
                mouseGroup = population[i].id;
                if (mouseGroup.indexOf("warrior") > -1) {
                    checkThenArm('best', 'trinket', warriorCharm, 'disarm');
                    checkThenArm('best', 'weapon', bestPhysical);
                    checkThenArm('best', 'base', bestPhysicalBase);
                } else if (mouseGroup.indexOf("scout") > -1) {
                    checkThenArm('best', 'trinket', scoutCharm, 'disarm');
                    checkThenArm('best', 'weapon', bestPhysical);
                    checkThenArm('best', 'base', bestPhysicalBase);
                } else if (mouseGroup.indexOf("archer") > -1) {
                    checkThenArm('best', 'trinket', archerCharm, 'disarm');
                    checkThenArm('best', 'weapon', bestPhysical);
                    checkThenArm('best', 'base', bestPhysicalBase);
                } else if (mouseGroup.indexOf("cavalry") > -1) {
                    checkThenArm('best', 'trinket', cavalryCharm, 'disarm');
                    checkThenArm('best', 'weapon', bestTactical);
                    checkThenArm('best', 'base', bestPowerBase);
                } else if (mouseGroup.indexOf("mage") > -1) {
                    checkThenArm('best', 'trinket', mageCharm, 'disarm');
                    checkThenArm('best', 'weapon', bestHydro);
                    checkThenArm('best', 'base', bestPowerBase);
                } else if (mouseGroup.indexOf('artillery') > -1) {
                    checkThenArm('best', 'trinket', wasteCharm);
                    checkThenArm('best', 'weapon', bestArcane);
                    checkThenArm('best', 'base', bestPowerBase);
                } else if (mouseGroup.indexOf("elite_gaurd") > -1) {
                    // wardens: desert_elite_gaurd
                    checkThenArm('best', 'weapon', wave4PhysicalTrap);
                    checkThenArm('best', 'base', bestPhysicalBase);
                    checkThenArm('best', 'trinket', wardenCharm, wasteCharm);
                } else if (mouseGroup.indexOf("boss") > -1) {
                    // warmonger: desert_boss
                    checkThenArm('best', 'weapon', wave4PhysicalTrap);
                    checkThenArm('best', 'base', bestPhysicalBase);
                    checkThenArm('best', 'trinket', bossCharm, 'disarm');
                } else {
                    checkThenArm('best', 'weapon', bestPhysical);
                    checkThenArm('best', 'base', bestPhysicalBase);
                    disarmTrap('trinket');
                }
                break;
            }
        }

        streak = null;
        wave = null;
    }
    currentLocation = null;
}

// Warpath V2
function fw() {
    if (GetCurrentLocation().indexOf("Fiery Warpath") < 0)
        return;

    var wave = getPageVariable('user.viewing_atts.desert_warpath.wave');
    wave = parseInt(wave);
    var objDefaultFWAll = {
        wave1: JSON.parse(JSON.stringify(objDefaultFW)),
        wave2: JSON.parse(JSON.stringify(objDefaultFW)),
        wave3: JSON.parse(JSON.stringify(objDefaultFW)),
        wave4: JSON.parse(JSON.stringify(objDefaultFW)),
    };
    var objFWAll = getStorageToObject('FW', objDefaultFWAll);
    var temp = false;
    for (var prop in objFWAll) {
        if (objFWAll.hasOwnProperty(prop)) {
            if (assignMissingDefault(objFWAll[prop], objDefaultFW))
                temp = true;
        }
    }
    if (temp)
        setStorage('FW', JSON.stringify(objFWAll));
    var objFW = objFWAll['wave' + wave];
    if (wave == 4) {
        var nWardenLeft = parseInt(document.getElementsByClassName('warpathHUD-wave wave_4')[0].getElementsByClassName('warpathHUD-wave-mouse-population')[0].textContent);
        console.plog('Wave:', wave, 'Warden Left:', nWardenLeft);
        if (Number.isNaN(nWardenLeft))
            nWardenLeft = 12;
        temp = (nWardenLeft <= 0) ? "after" : "before";
        checkThenArm(null, 'weapon', objFW.warden[temp].weapon);
        checkThenArm(null, 'base', objFW.warden[temp].base);
        checkThenArm(null, 'trinket', objFW.warden[temp].trinket);
        checkThenArm(null, 'bait', objFW.warden[temp].bait);
        return;
    }

    checkThenArm(null, 'base', objFW.base);
    objFW.streak = parseInt(document.getElementsByClassName('warpathHUD-streak-quantity')[0].innerText);
    console.plog('Wave:', wave, 'Streak:', objFW.streak);
    if (Number.isNaN(objFW.streak) || objFW.streak < 0 || objFW.streak >= g_fwStreakLength)
        return;

    if (isNullOrUndefined(objFW.cheese[objFW.streak]))
        objFW.cheese[objFW.streak] = 'Gouda';
    if (isNullOrUndefined(objFW.charmType[objFW.streak]))
        objFW.charmType[objFW.streak] = 'Warpath';
    if (isNullOrUndefined(objFW.special[objFW.streak]))
        objFW.special[objFW.streak] = 'None';

    objFW.streakMouse = getPageVariable('user.viewing_atts.desert_warpath.streak_type');
    if (objFW.streakMouse.indexOf('desert_') > -1)
        objFW.streakMouse = capitalizeFirstLetter(objFW.streakMouse.split('_')[1]);

    console.plog('Current streak mouse type:', objFW.streakMouse);
    var population = document.getElementsByClassName('warpathHUD-wave wave_' + wave.toString())[0].getElementsByClassName('warpathHUD-wave-mouse-population');
    objFW.population = {
        all: [],
        normal: [],
        special: [],
        active: []
    };
    objFW.soldierActive = false;
    var charmName;
    for (var i = 0; i < population.length; i++) {
        temp = parseInt(population[i].innerText);
        if (Number.isNaN(temp))
            temp = 0;
        objFW.population.all.push(temp);
        if (temp > 0)
            objFW.population.active.push(1);
        else
            objFW.population.active.push(0);
        if (i == objPopulation.WARRIOR || i == objPopulation.SCOUT || i == objPopulation.ARCHER) {
            objFW.population.normal.push(temp);
            objFW.soldierActive |= (temp > 0);
        }
        else {
            objFW.population.special.push(temp);
        }
    }

    if (!objFW.soldierActive && objFW.focusType == 'NORMAL')
        objFW.focusType = 'SPECIAL';

    console.plog(objFW);
    var index = -1;
    var charmArmed = getPageVariable('user.trinket_name');
    var nSum;
    if (wave == 3 && !objFW.includeArtillery) {
        var arrTemp = objFW.population.active.slice();
        arrTemp[objPopulation.ARTILLERY] = 0;
        nSum = sumData(arrTemp);
        if (nSum < 1)
            nSum = 1;
    }
    else
        nSum = sumData(objFW.population.active);
    if (nSum == 1) { // only one soldier type left
        if (objFW.lastSoldierConfig == 'CONFIG_STREAK')
            objFW.priorities = 'HIGHEST';
        else if (objFW.lastSoldierConfig == 'CONFIG_UNCHANGED')
            return;
        else if (objFW.lastSoldierConfig == 'CONFIG_GOUDA' || objFW.lastSoldierConfig == 'NO_WARPATH') {
            index = objFW.population.active.indexOf(1);
            if (index == objPopulation.CAVALRY)
                checkThenArm('best', 'weapon', objBestTrap.weapon.tactical);
            else if (index == objPopulation.MAGE)
                checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
            else if (index == objPopulation.ARTILLERY)
                checkThenArm('best', 'weapon', objBestTrap.weapon.arcane);
            else
                checkThenArm(null, 'weapon', objFW.weapon);
            if (charmArmed.indexOf('Warpath') > -1)
                disarmTrap('trinket');
            if (objFW.lastSoldierConfig == 'CONFIG_GOUDA')
                checkThenArm(null, 'bait', 'Gouda');
            return;
        }
    }
    if (objFW.special[objFW.streak] == 'COMMANDER') {
        checkThenArm(null, 'weapon', objFW.weapon);
        if (objFW.charmType[objFW.streak].indexOf('Super') > -1)
            charmName = ["Super Warpath Commander's Charm", "Warpath Commander's Charm"];
        else
            charmName = "Warpath Commander's Charm";
    }
    else if (objFW.special[objFW.streak].indexOf('GARGANTUA') === 0) {
        checkThenArm('best', 'weapon', objBestTrap.weapon.draconic);
        if (objFW.special[objFW.streak] == 'GARGANTUA_GGC' && objFW.streak >= 7)
            charmName = 'Gargantua Guarantee Charm';
        else
            charmName = (charmArmed.indexOf('Warpath') > -1) ? 'None' : undefined;
    }
    else {
        var bCurrentStreakZeroPopulation = false;
        var bWrongSoldierTypeStreak = false;
        var indexMinMax;
        objFW.focusType = objFW.focusType.toLowerCase();
        if (objFW.priorities == 'HIGHEST')
            indexMinMax = maxIndex(objFW.population[objFW.focusType]);
        else {
            for (var i = 0; i < objFW.population[objFW.focusType].length; i++) {
                if (objFW.population[objFW.focusType][i] < 1)
                    objFW.population[objFW.focusType][i] = Number.MAX_SAFE_INTEGER;
            }
            indexMinMax = minIndex(objFW.population[objFW.focusType]);
        }
        index = objPopulation.name.indexOf(objFW.streakMouse);
        if (index > -1) {
            bCurrentStreakZeroPopulation = (objFW.population.all[index] < 1);
            if (objFW.soldierActive && index >= 3 && objFW.focusType.toUpperCase() == 'NORMAL') {
                bWrongSoldierTypeStreak = !(objFW.streak == 2 || objFW.streak >= 5);
            }
            else if (!objFW.soldierActive && objFW.focusType.toUpperCase() == 'SPECIAL') {
                bWrongSoldierTypeStreak = (index != (indexMinMax + 3) && objFW.streak < 2);
            }
        }

        if (objFW.streak === 0 || bCurrentStreakZeroPopulation || bWrongSoldierTypeStreak) {
            objFW.streak = 0;
            temp = objFW.population[objFW.focusType][indexMinMax];
            if (objFW.focusType.toUpperCase() == 'NORMAL') {
                checkThenArm(null, 'weapon', objFW.weapon);
                var count = countArrayElement(temp, objFW.population[objFW.focusType]);
                if (count > 1) {
                    if (objFW.population[objFW.focusType][objPopulation.SCOUT] == temp)
                        charmName = objFW.charmType[0] + ' Scout';
                    else if (objFW.population[objFW.focusType][objPopulation.ARCHER] == temp)
                        charmName = objFW.charmType[0] + ' Archer';
                    else if (objFW.population[objFW.focusType][objPopulation.WARRIOR] == temp)
                        charmName = objFW.charmType[0] + ' Warrior';
                }
                else {
                    charmName = objFW.charmType[0] + ' ' + objPopulation.name[indexMinMax];
                }
            }
            else {
                if ((indexMinMax + 3) == objPopulation.ARTILLERY && nSum != 1) {
                    temp = objFW.population.special.slice();
                    temp.splice(indexMinMax, 1);
                    if (objFW.priorities == 'HIGHEST')
                        indexMinMax = maxIndex(temp);
                    else
                        indexMinMax = minIndex(temp);
                }
                indexMinMax += 3;
                if (indexMinMax == objPopulation.CAVALRY) {
                    checkThenArm('best', 'weapon', objBestTrap.weapon.tactical);
                    charmName = objFW.charmType[0] + ' Cavalry';
                }
                else if (indexMinMax == objPopulation.MAGE) {
                    checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
                    charmName = objFW.charmType[0] + ' Mage';
                }
                else if (indexMinMax == objPopulation.ARTILLERY) {
                    checkThenArm('best', 'weapon', objBestTrap.weapon.arcane);
                    if (charmArmed.indexOf('Warpath') > -1)
                        charmName = 'None';
                    else
                        charmName = undefined;
                }
            }
        }
        else { // streak 1 and above
            if (index == objPopulation.ARTILLERY && charmArmed.indexOf('Warpath') > -1)
                charmName = 'None';
            else {
                if (objFW.charmType[objFW.streak].indexOf('Super') > -1)
                    charmName = [objFW.charmType[objFW.streak] + ' ' + objPopulation.name[index], 'Warpath ' + objPopulation.name[index]];
                else
                    charmName = objFW.charmType[objFW.streak] + ' ' + objPopulation.name[index];
            }

            if (index == objPopulation.CAVALRY)
                checkThenArm('best', 'weapon', objBestTrap.weapon.tactical);
            else if (index == objPopulation.MAGE)
                checkThenArm('best', 'weapon', objBestTrap.weapon.hydro);
            else if (index == objPopulation.ARTILLERY)
                checkThenArm('best', 'weapon', objBestTrap.weapon.arcane);
            else
                checkThenArm(null, 'weapon', objFW.weapon);
        }
    }
    checkThenArm(null, 'bait', objFW.cheese[objFW.streak]);
    if (objFW.disarmAfterSupportRetreat && sumData(objFW.population.all) <= g_arrFWSupportRetreat[wave]) {
        if (charmArmed.indexOf('Warpath') > -1)
            disarmTrap('trinket');
    }
    else
        checkThenArm('best', 'trinket', charmName);
}

function fRift() {
    if (GetCurrentLocation().indexOf('Furoma Rift') < 0)
        return;

    var objDefaultFR = {
        enter: 0,
        retreat: 0,
        weapon: new Array(11).fill(''),
        base: new Array(11).fill(''),
        trinket: new Array(11).fill(''),
        bait: new Array(11).fill(''),
        masterOrder: new Array(11).fill('Glutter=>Combat=>Susheese')
    };
    var objFR = getStorageToObject('FRift', objDefaultFR);
    objFR.enter = parseInt(objFR.enter);
    objFR.retreat = parseInt(objFR.retreat);
    var objUserFRift = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestRiftFuroma)'));
    console.plog(objUserFRift.view_state);
    var bInPagoda = (objUserFRift.view_state == 'pagoda' || objUserFRift.view_state == 'pagoda knows_all');
    var i;
    if (bInPagoda) {
        var nCurBatteryLevel = 0;
        var nRemainingEnergy = parseInt(getPageVariable('user.quests.QuestRiftFuroma.droid.remaining_energy').replace(/,/g, ''));
        if (Number.isNaN(nRemainingEnergy)) {
            console.plog('Remaining Energy:', nRemainingEnergy);
            return;
        }
        for (i = objFRBattery.cumulative.length - 1; i >= 0; i--) {
            if (nRemainingEnergy <= objFRBattery.cumulative[i])
                nCurBatteryLevel = i + 1;
            else
                break;
        }
        console.plog('In Pagoda, Current Battery Level:', nCurBatteryLevel, 'Remaining Energy:', nRemainingEnergy);
        if (nCurBatteryLevel <= objFR.retreat) {
            fRiftArmTrap(objFR, 0);
            if (nCurBatteryLevel !== 0) {
                // retreat
                fireEvent(document.getElementsByClassName('riftFuromaHUD-leavePagoda')[0], 'click');
                window.setTimeout(function () {
                    fireEvent(document.getElementsByClassName('mousehuntActionButton confirm')[0], 'click');
                }, 1500);
            }
        }
        else {
            fRiftArmTrap(objFR, nCurBatteryLevel);
        }
    }
    else {
        var nFullBatteryLevel = 0;
        var classBattery = document.getElementsByClassName('riftFuromaHUD-battery');
        var nStoredEnerchi = parseInt(document.getElementsByClassName('total_energy')[0].children[1].innerText.replace(/,/g, ''));
        if (classBattery.length < 1 || Number.isNaN(nStoredEnerchi)) {
            console.plog('Stored Enerchi:', nStoredEnerchi);
            return;
        }
        for (i = 0; i < objFRBattery.cumulative.length; i++) {
            if (nStoredEnerchi >= objFRBattery.cumulative[i])
                nFullBatteryLevel = i + 1;
            else
                break;
        }
        console.plog('In Training Ground, Fully Charged Battery Level:', nFullBatteryLevel, 'Stored Enerchi:', nStoredEnerchi);
        if (Number.isInteger(objFR.enter) && nFullBatteryLevel >= objFR.enter) {
            fRiftArmTrap(objFR, objFR.enter);
            // enter
            fireEvent(classBattery[objFR.enter - 1], 'click');
            window.setTimeout(function () {
                fireEvent(document.getElementsByClassName('mousehuntActionButton confirm')[0], 'click');
            }, 1500);
        }
        else {
            fRiftArmTrap(objFR, 0);
        }
    }
}

function fRiftArmTrap(obj, nIndex, bReadJournal) {
    if (isNullOrUndefined(bReadJournal))
        bReadJournal = true;
    checkThenArm(null, 'weapon', obj.weapon[nIndex]);
    checkThenArm(null, 'base', obj.base[nIndex]);
    checkThenArm(null, 'trinket', obj.trinket[nIndex]);
    if (obj.bait[nIndex] == 'ANY_MASTER')
        checkThenArm('any', 'bait', 'ANY_MASTER');
    else if (obj.bait[nIndex] == 'ORDER_MASTER') {
        var arr = obj.masterOrder[nIndex].split("=>");
        arr = arr.map(function (e) {
            return 'Rift ' + e;
        });
        checkThenArm('best', 'bait', arr);
    }
    else if (obj.bait[nIndex] == 'BALANCE_MASTER') {
        if (g_arrHeirloom.length === 0) {
            var nRetry = 4;
            var bFirst = true;
            var intervalFRAT = setInterval(function () {
                if (document.getElementsByClassName('riftFuromaHUD-craftingPopup-tabContent pinnacle').length > 0) {
                    fireEvent(document.getElementsByClassName('riftFuromaHUD-craftingPopup-tabHeader')[3], 'click'); // close
                    var classPinnacle = document.getElementsByClassName('riftFuromaHUD-craftingPopup-tabContent pinnacle');
                    var i, temp;
                    for (i = 0; i < 3; i++) {
                        temp = classPinnacle[0].getElementsByClassName('riftFuromaHUD-craftingPopup-recipe-part')[i];
                        g_arrHeirloom.push(parseInt(temp.getAttribute('data-part-owned')));
                        if (Number.isNaN(g_arrHeirloom[i])) {
                            console.plog('Invalid Heirloom:', g_arrHeirloom);
                            checkThenArm('any', 'bait', 'ANY_MASTER');
                            return;
                        }
                    }
                    if (g_arrHeirloom.length != 3) {
                        console.plog('Invalid length:', g_arrHeirloom);
                        checkThenArm('any', 'bait', 'ANY_MASTER');
                        return;
                    }
                    setStorage('LastRecordedJournalFRift', document.getElementsByClassName('journaltext')[0].parentNode.textContent);
                    fRiftArmTrap(obj, nIndex, false);
                    clearInterval(intervalFRAT);
                    intervalFRAT = null;
                }
                else {
                    fireEvent(document.getElementsByClassName('riftFuromaHUD-itemGroup-craftButton')[3], 'click');
                    --nRetry;
                    if (nRetry <= 0) {
                        console.plog('Max Retry, arm any Rift Master Cheese');
                        checkThenArm('any', 'bait', 'ANY_MASTER');
                        clearInterval(intervalFRAT);
                        intervalFRAT = null;
                    }
                }
            }, 1000);
        }
        else {
            if (bReadJournal === true)
                getJournalDetailFRift();
            console.plog('Heirloom:', g_arrHeirloom);
            var arrBait = g_objConstTrap.bait.ANY_MASTER.name;
            var nMin = min(g_arrHeirloom);
            var fAvg = average(g_arrHeirloom);
            if (fAvg == nMin) {
                checkThenArm('any', 'bait', 'ANY_MASTER');
            }
            else {
                temp = minIndex(g_arrHeirloom);
                if (temp > -1) {
                    var arrBaitNew = [];
                    var objSort = sortWithIndices(g_arrHeirloom);
                    for (i = 0; i < objSort.index.length; i++) {
                        arrBaitNew[i] = arrBait[objSort.index[i]];
                    }
                    console.plog('New Bait List:', arrBaitNew);
                    checkThenArm('best', 'bait', arrBaitNew);
                }
                else {
                    console.plog('Invalid index:', temp);
                    checkThenArm('any', 'bait', 'ANY_MASTER');
                }
            }
        }
    }
    else
        checkThenArm(null, 'bait', obj.bait[nIndex]);
}

function retrieveMouseList() {
    fireEvent(document.getElementById('effectiveness'), 'click');
    var sec = secWait;
    var intervalRML = setInterval(
        function () {
            if (document.getElementsByClassName('thumb').length > 0) {
                mouseList = [];
                var y = document.getElementsByClassName('thumb');
                for (var i = 0; i < y.length; ++i) {
                    mouseList.push(y[i].getAttribute('title'));
                }
                fireEvent(document.getElementById('trapSelectorBrowserClose'), 'click');
                clearInterval(intervalRML);
                intervalRML = null;
                return;
            } else {
                --sec;
                if (sec <= 0) {
                    fireEvent(document.getElementById('effectiveness'), 'click');
                    sec = secWait;
                }
            }
        }, 1000);
    return;
}

function checkMouse(mouseName) {
    for (var i = 0; i < mouseList.length; ++i) {
        if (mouseList[i].indexOf(mouseName) > -1) {
            return true;
        }
        return false;
    }
}

// GWH
function Winter2015() {
    var currentLocation = getPageVariable("user.location");
    console.debug(currentLocation);
    if (currentLocation.indexOf("Extreme Toboggan Challenge") > -1) {
        var inRun = (document.getElementById('hudLocationContent').firstChild.className.indexOf("on_course") > -1);
        if (inRun) {
            checkThenArm('best', 'bait', ["Arctic Asiago", "Gingerbread"]);
        } else {
            checkThenArm(null, 'bait', 'Gouda', 'disarm');
        }
    }
}

function gwh() {
    if (GetCurrentLocation().indexOf("Great Winter Hunt") < 0)
        return;

    var userVariable = JSON.parse(getPageVariable('JSON.stringify(user.quests.QuestWinterHunt2016)'));
    var objDefaultGWH2016 = {
        zone: ['ORDER1', 'ORDER2', 'NONORDER1', 'NONORDER2', 'WINTER_WASTELAND', 'SNOWBALL_STORM', 'FLYING', 'NEW_YEAR\'S_PARTY'],
        weapon: new Array(8).fill(''),
        base: new Array(8).fill(''),
        trinket: new Array(8).fill(''),
        bait: new Array(8).fill(''),
        boost: new Array(8).fill(false),
        turbo: false,
        minAAToFly: 20,
        minFireworkToFly: 20,
        landAfterFireworkRunOut: false
    };
    var objGWH = getStorageToObject('GWH2016R', objDefaultGWH2016);
    var i, j, nLimit, strTemp, nIndex, nIndexTemp;
    var bCanFly = false;
    var nAAQuantity = parseInt(document.getElementsByClassName('winterHunt2016HUD-featuredItem-quantity')[0].textContent);
    var nFireworkQuantity = parseInt(document.getElementsByClassName('winterHunt2016HUD-fireworks-quantity')[0].textContent);
    if (userVariable.order_progress >= 10) { // can fly
        bCanFly = true;
        console.plog('Order Progress:', userVariable.order_progress, 'AA Quantity:', nAAQuantity, 'Firework Quantity:', nFireworkQuantity);
        if (nAAQuantity >= objGWH.minAAToFly && nFireworkQuantity >= objGWH.minFireworkToFly) {
            fireEvent(document.getElementsByClassName('winterHunt2016HUD-flightButton')[0], 'click');
            userVariable.status = 'flying';
        }
    }
    if (userVariable.status == 'flying') {
        if (nFireworkQuantity < 1 && objGWH.landAfterFireworkRunOut === true) {
            console.plog('Landing');
            fireEvent(document.getElementsByClassName('winterHunt2016HUD-landButton mousehuntTooltipParent mousehuntActionButton tiny')[0], 'click');
            window.setTimeout(function () {
                fireEvent(document.getElementsByClassName('mousehuntActionButton small winterHunt2016HUD-help-action-land active')[0], 'click');
            }, 1500);
            window.setTimeout(function () {
                eventLocationCheck('gwh');
            }, 5000);
            return;
        }
        console.plog('Flying');
        nIndex = objGWH.zone.indexOf('FLYING');
        checkThenArm(null, 'weapon', objGWH.weapon[nIndex]);
        checkThenArm(null, 'base', objGWH.base[nIndex]);
        checkThenArm(null, 'trinket', objGWH.trinket[nIndex]);
        if (objGWH.bait[nIndex].indexOf('ANY') > -1 && nAAQuantity > 0)
            checkThenArm(null, 'bait', 'Arctic Asiago');
        else
            checkThenArm(null, 'bait', objGWH.bait[nIndex]);
        if (objGWH.boost[nIndex] === true) {
            var nNitroQuantity = parseInt(document.getElementsByClassName('winterHunt2016HUD-sledDetail')[2].textContent);
            console.plog('Nitro Quantity:', nNitroQuantity);
            if (Number.isNaN(nNitroQuantity) || nNitroQuantity < 1)
                return;
            if (objGWH.turbo && nNitroQuantity >= 3)
                fireEvent(document.getElementsByClassName('winterHunt2016HUD-nitroButton-boundingBox')[3], 'click');
            else
                fireEvent(document.getElementsByClassName('winterHunt2016HUD-nitroButton-boundingBox')[2], 'click');
        }
        else {
            if (userVariable.speed > 800) { // disable nitro when flying
                console.plog('Disable nitro, Current Speed:', userVariable.speed);
                fireEvent(document.getElementsByClassName('winterHunt2016HUD-nitroButton-boundingBox')[1], 'click');
            }
        }
        return;
    }
    var objOrderTemplate = {
        type: "none",
        tier: 1,
        progress: 0
    };
    var arrOrder = [];
    var arrType = ["decoration", "ski", "toy"];
    for (i = 0; i < userVariable.orders.length; i++) {
        arrOrder.push(JSON.parse(JSON.stringify(objOrderTemplate)));
        for (j = 0; j < arrType.length; j++) {
            if (userVariable.orders[i].item_type.indexOf(arrType[j]) > -1) {
                arrOrder[i].type = arrType[j];
                break;
            }
        }
        if (userVariable.orders[i].item_type.indexOf("_one_") > -1)
            arrOrder[i].tier = 1;
        else
            arrOrder[i].tier = 2;
        arrOrder[i].progress = userVariable.orders[i].progress;
        if (arrOrder[i].progress >= 100 && !bCanFly) {
            console.plog('Order No:', i, 'Type:', arrOrder[i].type, 'Tier:', arrOrder[i].tier, 'Progress:', arrOrder[i].progress);
            fireEvent(document.getElementsByClassName('winterHunt2016HUD-order-action')[i], 'click');
            window.setTimeout(function () {
                eventLocationCheck('gwh');
            }, 5000);
            return;
        }
    }
    console.plog(arrOrder);

    var objZoneTemplate = {
        name: "",
        depth: 0,
        isOrderZone: false,
        type: "none",
        tier: 1,
        codename: ""
    };
    var arrZone = [];
    var nIndexActive = -1;
    for (i = userVariable.sprites.length - 1; i >= 0; i--) {
        if (userVariable.sprites[i].css_class.indexOf('active') > -1) { // current zone
            nIndexActive = i;
            break;
        }
    }
    if (nIndexActive < 0)
        return;
    nLimit = nIndexActive + 2;
    if (nLimit >= userVariable.sprites.length)
        nLimit = userVariable.sprites.length - 1;
    for (i = nIndexActive; i <= nLimit; i++) {
        nIndex = i - nIndexActive;
        arrZone.push(JSON.parse(JSON.stringify(objZoneTemplate)));
        nIndexTemp = userVariable.sprites[i].name.indexOf("(");
        arrZone[nIndex].name = userVariable.sprites[i].name.substr(0, nIndexTemp - 1);
        if (arrZone[nIndex].name == 'Toy Lot' || arrZone[nIndex].name == 'Toy Emporium')
            arrZone[nIndex].type = "toy";
        else if (arrZone[nIndex].name == 'Decorative Oasis' || arrZone[nIndex].name == 'Tinsel Forest')
            arrZone[nIndex].type = "decoration";
        else if (arrZone[nIndex].name == 'Bunny Hills' || arrZone[nIndex].name == 'Frosty Mountains')
            arrZone[nIndex].type = "ski";
        arrZone[nIndex].tier = (userVariable.sprites[i].css_class.indexOf('tier_two') > -1) ? 2 : 1;
        for (j = 0; j < arrOrder.length; j++) {
            if (arrOrder[j].type == arrZone[nIndex].type && arrOrder[j].tier <= arrZone[nIndex].tier) {
                arrZone[nIndex].isOrderZone = true;
                break;
            }
        }
        if (arrZone[nIndex].type == "none") {
            arrZone[nIndex].codename = arrZone[nIndex].name.toUpperCase().replace(/ /g, '_');
        }
        else {
            if (arrZone[nIndex].isOrderZone)
                arrZone[nIndex].codename = "ORDER" + arrZone[nIndex].tier;
            else
                arrZone[nIndex].codename = "NONORDER" + arrZone[nIndex].tier;
        }
        arrZone[nIndex].depth = parseInt(userVariable.sprites[i].name.substr(nIndexTemp + 1, 5));
    }
    console.plog(arrZone);

    var nIndexZone = objGWH.zone.indexOf(arrZone[0].codename);
    if (nIndexZone < 0)
        return;
    checkThenArm(null, 'weapon', objGWH.weapon[nIndexZone]);
    checkThenArm(null, 'base', objGWH.base[nIndexZone]);
    checkThenArm(null, 'trinket', objGWH.trinket[nIndexZone]);
    if (objGWH.bait[nIndexZone].indexOf('ANY') > -1 && nAAQuantity > 0)
        checkThenArm(null, 'bait', 'Arctic Asiago');
    else
        checkThenArm(null, 'bait', objGWH.bait[nIndexZone]);
    if (objGWH.boost[nIndexZone] === true) {
        var nNitroQuantity = parseInt(document.getElementsByClassName('winterHunt2016HUD-sledDetail')[2].textContent);
        console.plog('Nitro Quantity:', nNitroQuantity);
        if (Number.isNaN(nNitroQuantity) || nNitroQuantity < 1)
            return;
        var nTotalMetersRemaining = parseInt(userVariable.meters_remaining);
        for (i = 1; i < arrZone.length; i++) {
            nIndexZone = objGWH.zone.indexOf(arrZone[i].codename);
            if (nIndexZone < 0)
                continue;
            if (objGWH.boost[nIndexZone] === true)
                nTotalMetersRemaining += arrZone[i].depth;
            else
                break;
        }
        console.plog('Boost Distance:', nTotalMetersRemaining, 'Turbo:', objGWH.turbo);
        var fTemp = nTotalMetersRemaining / 250;
        var nLevel = Math.floor(fTemp);
        if ((nLevel - fTemp) >= 0.92) // because 230/250 = 0.92
            nLevel++;
        if (nLevel == 1) { // normal boost
            fireEvent(document.getElementsByClassName('winterHunt2016HUD-nitroButton-boundingBox')[2], 'click');
        }
        else if (nLevel > 1) {
            if (objGWH.turbo && nNitroQuantity >= 3)
                fireEvent(document.getElementsByClassName('winterHunt2016HUD-nitroButton-boundingBox')[3], 'click');
            else
                fireEvent(document.getElementsByClassName('winterHunt2016HUD-nitroButton-boundingBox')[2], 'click');
        }
        else if (nLevel < 1 && userVariable.speed > 30) {
            console.plog('Disable nitro, Current Speed:', userVariable.speed);
            fireEvent(document.getElementsByClassName('winterHunt2016HUD-nitroButton-boundingBox')[1], 'click');
        }
    }
    else {
        if (userVariable.speed > 30) { // disable nitro in order zone
            console.plog('Disable nitro, Current Speed:', userVariable.speed);
            fireEvent(document.getElementsByClassName('winterHunt2016HUD-nitroButton-boundingBox')[1], 'click');
        }
    }
}

// For easter event
function checkCharge2016(stopDischargeAt) {
    try {
        var charge = parseInt(document.getElementsByClassName('springHuntHUD-charge-quantity')[0].innerText);
        var isDischarge = (getStorage("discharge") == "true");
        console.plog('Current Charge:', charge, 'Discharging:', isDischarge, 'Stop Discharge At:', stopDischargeAt);
        var charmContainer = document.getElementsByClassName('springHuntHUD-charmContainer')[0];
        var eggstra = {};
        eggstra.quantity = parseInt(charmContainer.children[0].children[0].innerText);
        eggstra.link = charmContainer.children[0].children[1];
        eggstra.isArmed = (eggstra.link.getAttribute('class').indexOf('active') > 0);
        eggstra.canArm = (eggstra.quantity > 0 && !eggstra.isArmed);
        var eggstraCharge = {};
        eggstraCharge.quantity = parseInt(charmContainer.children[1].children[0].innerText);
        eggstraCharge.link = charmContainer.children[1].children[1];
        eggstraCharge.isArmed = (eggstraCharge.link.getAttribute('class').indexOf('active') > 0);
        eggstraCharge.canArm = (eggstraCharge.quantity > 0 && !eggstraCharge.isArmed);
        var eggscavator = {};
        eggscavator.quantity = parseInt(charmContainer.children[2].children[0].innerText);
        eggscavator.link = charmContainer.children[2].children[1];
        eggscavator.isArmed = (eggscavator.link.getAttribute('class').indexOf('active') > 0);
        eggscavator.canArm = (eggscavator.quantity > 0 && !eggscavator.isArmed);

        if (charge == 20) {
            setStorage("discharge", "true");
            if (eggstra.canArm) fireEvent(eggstra.link, 'click');
        }
        else if (charge < 20 && charge > stopDischargeAt) {
            if (isDischarge) {
                if (eggstra.canArm) fireEvent(eggstra.link, 'click');
            }
            else {
                if (charge >= chargeHigh) {
                    if (eggstraCharge.quantity > 0) {
                        if (!eggstraCharge.isArmed) fireEvent(eggstraCharge.link, 'click');
                    }
                    else {
                        if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
                    }
                }
                else {
                    if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
                }
            }
        }
        else if (charge <= stopDischargeAt) {
            if (charge >= chargeHigh) {
                if (eggstraCharge.quantity > 0) {
                    if (!eggstraCharge.isArmed) fireEvent(eggstraCharge.link, 'click');
                }
                else {
                    if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
                }
            }
            else {
                if (eggscavator.canArm) fireEvent(eggscavator.link, 'click');
            }
            setStorage("discharge", "false");
        }
    }
    catch (e) {
        console.perror('checkCharge2016', e.message);
    }
}

function checkCharge(stopDischargeAt) {
    try {
        var charge = parseInt(document.getElementsByClassName("chargeQuantity")[0].innerText);
        console.plog('Current Charge:', charge);
        if (charge == 20) {
            setStorage("discharge", true.toString());
            checkThenArm(null, "trinket", "Eggstra Charm");
        }

        else if (charge < 20 && charge > stopDischargeAt) {
            if (getStorage("discharge") == "true") {
                checkThenArm(null, "trinket", "Eggstra Charm");
            }
            else {
                if (stopDischargeAt == 17) {
                    checkThenArm('best', "trinket", chargeCharm);
                }
                else {
                    checkThenArm(null, "trinket", "Eggscavator");
                }
            }
        }
        else if (charge == stopDischargeAt) {
            if (stopDischargeAt == 17) {
                checkThenArm('best', "trinket", chargeCharm);
            }
            else {
                checkThenArm(null, "trinket", "Eggscavator");
            }
            setStorage("discharge", false.toString());
        }
        else if (charge < stopDischargeAt) {
            setStorage("discharge", false.toString());
            checkThenArm(null, "trinket", "Eggscavator");
        }
        return;
    }
    catch (e) {
        console.perror('checkCharge', e.message);
    }
}

function buildTrapList(afterBuilding, failedBuilding) {
    if (debug) console.log("running buildTrapList()");
    var returning;
    //clickTrapSelector(category);
    try {
        var userHash = getPageVariable("user.unique_hash");

        nobAjaxPost('/managers/ajax/users/gettrapcomponents.php', {
            uh: userHash
        }, function (data) {
            NOBtraps = data.components;
            if (debug) console.log(NOBtraps);
            nobStore(NOBtraps, 'traps');
            returning = true;
            afterBuilding();
        }, function (error) {
            console.log("BuildTrapList ajax error: " + error);
            returning = false;
            failedBuilding();
        });
    } catch (e) {
        console.log("BuildTrapList try error: " + e);
    } finally {
        //clickTrapSelector(category);
        return returning;
    }
}

function getTrapList(category) {
    var temp = "";
    var arrObjList;
    if (category === null || category === undefined)
        arrObjList = Object.keys(objTrapList);
    else
        arrObjList = [category];

    for (var i = 0; i < arrObjList.length; i++) {
        temp = getStorageToVariableStr("TrapList" + capitalizeFirstLetter(arrObjList[i]), "");
        if (temp === "") {
            objTrapList[arrObjList[i]] = [];
        }
        else {
            try {
                objTrapList[arrObjList[i]] = temp.split(",");
            }
            catch (e) {
                objTrapList[arrObjList[i]] = [];
            }
        }
    }
}

function clearTrapList(category) {
    var arrObjList;
    if (category === null || category === undefined)
        arrObjList = Object.keys(objTrapList);
    else
        arrObjList = [category];

    for (var i = 0; i < arrObjList.length; i++) {
        removeStorage("TrapList" + capitalizeFirstLetter(arrObjList[i]));
        objTrapList[arrObjList[i]] = [];
    }
}

function capitalizeFirstLetter(strIn) {
    return strIn.charAt(0).toUpperCase() + strIn.slice(1);
}

function getTrapListFromTrapSelector(sort, category, name, isForcedRetry) {
    clickTrapSelector(category);
    objTrapList[category] = [];
    var sec = secWait;
    var retry = armTrapRetry;
    var i, j, tagGroupElement, tagElement, nameElement, itemEle;
    var intervalGTLFTS = setInterval(
        function () {
            if (isNewUI)
                itemEle = document.getElementsByClassName('campPage-trap-itemBrowser-item');
            else
                tagGroupElement = document.getElementsByClassName('tagGroup');

            if (isNewUI && itemEle.length > 0) {
                for (i = 0; i < itemEle.length; i++) {
                    nameElement = itemEle[i].getElementsByClassName('campPage-trap-itemBrowser-item-name')[0].textContent;
                    objTrapList[category].push(nameElement);
                }
                setStorage("TrapList" + capitalizeFirstLetter(category), objTrapList[category].join(","));
                clearInterval(intervalGTLFTS);
                arming = false;
                intervalGTLFTS = null;
                checkThenArm(sort, category, name, isForcedRetry);
                return;
            }
            else if (!isNewUI && tagGroupElement.length > 0) {
                for (i = 0; i < tagGroupElement.length; ++i) {
                    tagElement = tagGroupElement[i].getElementsByTagName('a');
                    for (j = 0; j < tagElement.length; ++j) {
                        nameElement = tagElement[j].getElementsByClassName('name')[0].innerText;
                        objTrapList[category].push(nameElement);
                    }
                }
                setStorage("TrapList" + capitalizeFirstLetter(category), objTrapList[category].join(","));
                clearInterval(intervalGTLFTS);
                arming = false;
                intervalGTLFTS = null;
                checkThenArm(sort, category, name, isForcedRetry);
                return;
            }
            else {
                --sec;
                if (sec <= 0) {
                    clickTrapSelector(category);
                    sec = secWait;
                    --retry;
                    if (retry <= 0) {
                        clearInterval(intervalGTLFTS);
                        arming = false;
                        intervalGTLFTS = null;
                        return;
                    }
                }
            }
        }, 1000);
    return;
}

function getBestTrap() {
    var obj = getStorage("BestTrap");
    if (!isNullOrUndefined(obj)) {
        obj = JSON.parse(obj);
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && objBestTrap.hasOwnProperty(prop)) {
                for (var prop1 in obj[prop]) {
                    if (obj[prop].hasOwnProperty(prop1) && objBestTrap[prop].hasOwnProperty(prop1)) {
                        objBestTrap[prop][prop1] = arrayConcatUnique([obj[prop][prop1]], objBestTrap[prop][prop1]);
                    }
                }
            }
        }
    }
}

function checkThenArm(sort, category, name, isForcedRetry)   //category = weapon/base/charm/trinket/bait
{
    if (isNullOrUndefined(name) || name === '')
        return;

    if (category == "charm")
        category = "trinket";

    if (!(Array.isArray(name))) {
        var obj = getConstToRealValue(sort, category, name);
        if (obj.changed) {
            sort = obj.sort;
            name = obj.name;
        }
    }

    if (Array.isArray(name)) {
        if (!(sort == 'best' || sort == 'any'))
            sort = 'best';
        if (name.length == 1) {
            sort = null;
            name = name[0];
        }
    }
    else {
        if (name.toUpperCase().indexOf('NONE') === 0) {
            disarmTrap(category);
            return;
        }
        sort = null;
    }

    if (isNullOrUndefined(isForcedRetry))
        isForcedRetry = true;

    var trapArmed = undefined;
    var userVariable = getPageVariable("user." + category + "_name");
    if (sort == 'best') {
        getTrapList(category);
        if (objTrapList[category].length === 0) {
            var intervalCTA1 = setInterval(
                function () {
                    if (!arming) {
                        getTrapListFromTrapSelector(sort, category, name, isForcedRetry);
                        clearInterval(intervalCTA1);
                        intervalCTA1 = null;
                        return;
                    }
                }, 1000);
            return;
        }
        else {
            var nIndex = -1;
            for (var i = 0; i < name.length; i++) {
                for (var j = 0; j < objTrapList[category].length; j++) {
                    nIndex = objTrapList[category][j].indexOf("...");
                    if (nIndex > -1)
                        name[i] = name[i].substr(0, nIndex);
                    if (objTrapList[category][j].indexOf(name[i]) === 0) {
                        console.plog('Best', category, 'found:', name[i], 'Currently Armed:', userVariable);
                        if (userVariable.indexOf(name[i]) === 0) {
                            trapArmed = true;
                            arming = false;
                            closeTrapSelector(category);
                            return;
                        }
                        else {
                            trapArmed = false;
                            break;
                        }
                    }
                }
                if (trapArmed === false)
                    break;
            }
        }
    }
    else if (sort == 'any') {
        trapArmed = false;
        for (var i = 0; i < name.length; i++) {
            if (userVariable.indexOf(name[i]) === 0) {
                trapArmed = true;
                break;
            }
        }
    }
    else {
        trapArmed = (userVariable.indexOf(name) === 0);
    }

    if (trapArmed === undefined && isForcedRetry) {
        console.plog(name.join("/"), "not found in TrapList" + capitalizeFirstLetter(category));
        clearTrapList(category);
        checkThenArm(sort, category, name, false);
    }
    else if (trapArmed === false) {
        addArmingIntoList(category);
        var intervalCTA = setInterval(
            function () {
                if (arming === false) {
                    clickThenArmTrapInterval(sort, category, name);
                    clearInterval(intervalCTA);
                    intervalCTA = null;
                    return;
                }
            }, 1000);
    }
}

function getConstToRealValue(sort, category, name) {
    var objRet = {
        changed: false,
        sort: sort,
        name: name
    };
    if (g_objConstTrap.hasOwnProperty(category)) {
        var arrKeys = Object.keys(g_objConstTrap[category]);
        var nIndex = arrKeys.indexOf(name);
        if (nIndex > -1) {
            var keyName = arrKeys[nIndex];
            objRet.sort = g_objConstTrap[category][keyName].sort;
            objRet.name = g_objConstTrap[category][keyName].name.slice();
            objRet.changed = true;
        }
    }
    return objRet;
}

function addArmingIntoList(category) {
    g_arrArmingList.push(category);
}

function deleteArmingFromList(category) {
    var nIndex = g_arrArmingList.indexOf(category);
    if (nIndex > -1)
        g_arrArmingList.splice(nIndex, 1);
}

function isArmingInList() {
    return (g_arrArmingList.length > 0);
}

function clickThenArmTrapInterval(sort, trap, name) { //sort = power/luck/attraction
    clickTrapSelector(trap);
    var sec = secWait;
    var armStatus = LOADING;
    var retry = armTrapRetry;
    var intervalCTATI = setInterval(
        function () {
            armStatus = armTrap(sort, trap, name);
            if (armStatus != LOADING) {
                deleteArmingFromList(trap);
                if (isNewUI && !isArmingInList())
                    closeTrapSelector(trap);
                clearInterval(intervalCTATI);
                arming = false;
                intervalCTATI = null;
                if (armStatus == NOT_FOUND) {
                    //clearTrapList(trap);
                    if (trap == 'trinket')
                        disarmTrap('trinket');
                    else
                        closeTrapSelector(trap);
                }
                return;
            }
            else {
                --sec;
                if (sec <= 0) {
                    if (isNewUI)
                        closeTrapSelector(trap);
                    clickTrapSelector(trap, true);
                    sec = secWait;
                    --retry;
                    if (retry <= 0) {
                        deleteArmingFromList(trap);
                        if (isNewUI && !isArmingInList())
                            closeTrapSelector(trap);
                        clearInterval(intervalCTATI);
                        arming = false;
                        intervalCTATI = null;
                        return;
                    }
                }
            }
        }, 1000);
    return;
}

// name = Brie/Gouda/Swiss (brie = wrong)
function armTrap(sort, trap, name) {
    return (isNewUI) ? armTrapNewUI(sort, trap, name) : armTrapClassicUI(sort, trap, name);
}

function armTrapClassicUI(sort, trap, name) {
    var tagGroupElement = document.getElementsByClassName('tagGroup');
    var tagElement;
    var nameElement;
    var nIndex = -1;
    var arrName = (Array.isArray(name)) ? name.slice() : [name];

    if (sort == 'best' || sort == 'any')
        name = name[0];

    if (tagGroupElement.length > 0) {
        console.plog('Try to arm', name);
        for (var i = 0; i < tagGroupElement.length; ++i) {
            tagElement = tagGroupElement[i].getElementsByTagName('a');
            for (var j = 0; j < tagElement.length; ++j) {
                nameElement = tagElement[j].getElementsByClassName('name')[0].innerText;
                nIndex = nameElement.indexOf("...");
                if (nIndex > -1)
                    name = name.substr(0, nIndex);
                if (nameElement.indexOf(name) === 0) {
                    if (tagElement[j].getAttribute('class').indexOf('selected') < 0)	// only click when not arming
                        fireEvent(tagElement[j], 'click');
                    else
                        closeTrapSelector(trap);

                    if (objTrapList[trap].indexOf(nameElement) < 0) {
                        objTrapList[trap].unshift(nameElement);
                        setStorage("TrapList" + capitalizeFirstLetter(trap), objTrapList[trap].join(","));
                    }
                    console.plog(name, 'armed');
                    return ARMED;
                }
            }
        }
        console.plog(name, 'not found');
        for (var i = 0; i < objTrapList[trap].length; i++) {
            if (objTrapList[trap][i].indexOf(name) === 0) {
                objTrapList[trap].splice(i, 1);
                setStorage("TrapList" + capitalizeFirstLetter(trap), objTrapList[trap].join(","));
                break;
            }
        }
        if (sort == 'best' || sort == 'any') {
            arrName.shift();
            if (arrName.length > 0)
                return armTrapClassicUI(sort, trap, arrName);
            else
                return NOT_FOUND;
        }
        else
            return NOT_FOUND;
    }
    else
        return LOADING;
}

function armTrapNewUI(sort, trap, name) {
    var itemEle = document.getElementsByClassName('campPage-trap-itemBrowser-item');
    var nameElement;
    var arrName = (Array.isArray(name)) ? name.slice() : [name];

    if (sort == 'best' || sort == 'any')
        name = name[0];

    if (itemEle.length > 0) {
        console.plog('Trying to arm ' + name);
        for (var i = 0; i < itemEle.length; i++) {
            nameElement = itemEle[i].getElementsByClassName('campPage-trap-itemBrowser-item-name')[0].textContent;
            if (nameElement.indexOf(name) === 0) {
                if (itemEle[i].getAttribute('class').indexOf('canArm') > -1)
                    fireEvent(itemEle[i].getElementsByClassName('campPage-trap-itemBrowser-item-armButton')[0], 'click');
                else
                    closeTrapSelector(trap);
                if (objTrapList[trap].indexOf(nameElement) < 0) {
                    objTrapList[trap].unshift(nameElement);
                    setStorage("TrapList" + capitalizeFirstLetter(trap), objTrapList[trap].join(","));
                }
                console.plog(name + ' armed');
                return ARMED;
            }
        }

        console.plog(name, 'not found');
        for (var i = 0; i < objTrapList[trap].length; i++) {
            if (objTrapList[trap][i].indexOf(name) === 0) {
                objTrapList[trap].splice(i, 1);
                setStorage("TrapList" + capitalizeFirstLetter(trap), objTrapList[trap].join(","));
                break;
            }
        }
        if (sort == 'best' || sort == 'any') {
            arrName.shift();
            if (arrName.length > 0)
                return armTrapNewUI(sort, trap, arrName);
            else
                return NOT_FOUND;
        }
        else
            return NOT_FOUND;
    }
    else
        return LOADING;
}

function clickTrapSelector(strSelect, bForceClick) { //strSelect = weapon/base/charm/trinket/bait
    if (isNullOrUndefined(bForceClick))
        bForceClick = false;
    if (isNewUI) {
        var armedItem = document.getElementsByClassName('campPage-trap-armedItem ' + strSelect)[0];
        var arrTemp = armedItem.getAttribute('class').split(" ");
        if (bForceClick !== true && arrTemp[arrTemp.length - 1] == 'active') { // trap selector opened
            arming = true;
            return (console.plog('Trap selector', strSelect, 'opened'));
        }
        fireEvent(armedItem, 'click');
    }
    else {
        if (bForceClick !== true && document.getElementsByClassName("showComponents " + strSelect).length > 0) { // trap selector opened
            arming = true;
            return (console.plog('Trap selector', strSelect, 'opened'));
        }
        if (strSelect == "base")
            fireEvent(document.getElementsByClassName('trapControlThumb')[0], 'click');
        else if (strSelect == "weapon")
            fireEvent(document.getElementsByClassName('trapControlThumb')[1], 'click');
        else if (strSelect == "charm" || strSelect == "trinket")
            fireEvent(document.getElementsByClassName('trapControlThumb')[2], 'click');
        else if (strSelect == "bait")
            fireEvent(document.getElementsByClassName('trapControlThumb')[3], 'click');
        else
            return (console.plog("Invalid trapSelector"));
    }
    arming = true;
    console.plog("Trap selector", strSelect, "clicked");
}

function closeTrapSelector(category) {
    if (isNewUI) {
        var armedItem = document.getElementsByClassName('campPage-trap-armedItem ' + category)[0];
        if (!isNullOrUndefined(armedItem) && armedItem.getAttribute('class').indexOf('active') > -1) { // trap selector opened
            fireEvent(armedItem, 'click');
            console.plog("Trap selector", category, "closed");
        }
    }
    else {
        if (document.getElementsByClassName("showComponents " + category).length > 0) {
            fireEvent(document.getElementById('trapSelectorBrowserClose'), 'click');
            console.plog("Trap selector", category, "closed");
        }
    }
}

/*var retryCheckThenArm = true;

function checkThenArmV1(sort, category, item, fail) {  //category = weapon/base/charm/trinket/bait
    // TODO: catch failed check then arm (ie, trap not found) (minor issue)
    // returns 'armed' if already armed
    // fail = [] If trap not found pass in array, to do a secondary arm

    if (item == 'disarm') {
        return disarmTrap(category);
    }

    if (item.constructor === Array) {
        sort = 'best';
    } else if (typeof item == "string") {
        sort = null;
    }

    if (category == "charm") {
        category = "trinket";
    }

    if (debug) console.log('RUN checkThenArm(' + item + ')');

    var i, j;
    var trapArmed;
    var tempName;
    var userVariable = getPageVariable("user." + category + "_name");
    if (userVariable === null || userVariable == undefined) userVariable = "";
    if (debug) console.log('Currently armed in userVar: ' + userVariable);
    var trapArmedOverride = false; // Stops trying to find whether trap has been armed. Assumes trap is not armed.

    if (sort == 'best') {
        for (i = 0; i < item.length; i++) {
            if (userVariable.indexOf(item[i]) == 0) {
                trapArmed = true;
                break;
            }
        }

        if (NOBtraps.length == 0) {
            if (debug) console.log("NOBtraps not built yet, trying to build now.");
            buildTrapList(function () {
                return checkThenArm(sort, category, item, fail);
            }, function () {
                if (debug) console.log("Failed to build trap list, giving up arming: " + item);
                return;
            });
        } else {
            if (debug) console.log("Running double check if better one is in inv. Finding ");
            if (debug) console.log(item);

            // Chunk of code try finds if a better trap is in inventory, if so sets trapArmed to false
            for (j = 0; j < item.length; j++) {
                for (i = 0; i < NOBtraps.length; i++) {
                    if (NOBtraps[i].classification == category && NOBtraps[i].name.indexOf(item[j]) == 0 && userVariable.indexOf(NOBtraps[i].name) != -1) {
                        // Case 1: The loop rolled back to the curr armed and double checked that it is the same as userVar
                        if (debug) console.log("No better traps were found.");
                        trapArmed = true;

                        i = NOBtraps.length + 1;
                        j = item.length + 1;
                    } else if (NOBtraps[i].classification == category && NOBtraps[i].name.indexOf(item[j]) == 0) {
                        // Case 2: The loop rolled onto an earlier (better) in the item array
                        if (debug) console.log("Found a better trap: " + NOBtraps[i].name + " as compared to " + item[j]);
                        trapArmed = false;
                        trapArmedOverride = true;

                        // breaking out of loops
                        i = NOBtraps.length + 1;
                        j = item.length + 1;
                    } else {
                        //if (debug) console.log('Comparing: ' + NOBtraps[i].name + ' with ' + item[j]);
                    }
                }
            }

            if (trapArmed != true && trapArmed != false) {
                // Case 3: Rolled through whole array and 0 found.
                if (retryCheckThenArm) {
                    console.log("Error occured when finding a better trap in NOBtrap, giving up arming. User does not own the current trap armed? Retrying to fetch trap list.");
                    buildTrapList(function () {
                        retryCheckThenArm = false;
                        return checkThenArm(sort, category, item, fail);
                    }, function () {
                        console.log('Retry failed. Giving up now.');
                    });
                } else {
                    console.log('Retried, but failed again :(');
                }
                return 'failed';
            }

            if (debug) console.log("Double check done. Results: trapArmed=" + trapArmed + ", trapArmedOverride=" + trapArmedOverride);
        }
    } else {
        trapArmed = (userVariable.indexOf(item) == 0);
    }

    if (debug) console.log(item + " armed?: " + trapArmed);

    // TODO: Needs redo for beta UI (major issue)
    if (!nobTestBetaUI()) {
        var retryPageVariable = document.getElementById('hud_trapLabel').textContent;
        if (!trapArmedOverride && retryPageVariable == "Charm:" && category == "trinket") {
            var theCharmArmed = document.getElementById('hud_trapPower').textContent;
            if (sort == 'best') {
                for (i = 0; i < item.length; i++) {
                    if (item[i].length > 13) {
                        tempName = item[i].substring(0, 13);
                        tempName += "...";
                    } else {
                        tempName = item[i];
                    }

                    if (theCharmArmed == tempName) {
                        trapArmed = true;
                        break;
                    }
                }
            } else {
                //console.log(theCharmArmed + " + " + item);
                if (item.length > 13) {
                    tempName = item.substring(0, 13);
                    tempName += "...";
                } else {
                    tempName = item;
                }

                if (theCharmArmed == tempName) {
                    trapArmed = true;
                }
            }
            //trapArmed = true;
        } else if (!trapArmedOverride && (category == 'weapon' || category == 'base' || category == 'bait')) {
            var currBase = document.getElementById('hud_base').textContent;
            var currTrap = document.getElementById('hud_weapon').textContent;
            var currBait = document.getElementById('hud_baitName').textContent;

            if (sort == 'best') {
                for (i = 0; i < item.length; i++) {
                    //console.log(theCharmArmed + " + " + item[i]);

                    if (item[i].length > 13) {
                        tempName = item[i].substring(0, 13);
                        tempName += "...";
                    } else {
                        tempName = item[i];
                    }

                    switch (category) {
                        case 'weapon':
                            if (currTrap == tempName)
                                trapArmed = true;
                            break;
                        case 'base':
                            if (currBase == tempName)
                                trapArmed = true;
                            break;
                        case 'bait':
                            if (currBait == tempName)
                                trapArmed = true;
                            break;
                        default:
                            //traparmed = false;
                            break;
                    }
                }
            } else {
                if (item.length > 13) {
                    tempName = item.substring(0, 13);
                    tempName += "...";
                } else {
                    tempName = item;
                }


                switch (category) {
                    case 'weapon':
                        if (currTrap == tempName)
                            trapArmed = true;
                        break;
                    case 'base':
                        if (currBase == tempName)
                            trapArmed = true;
                        break;
                    case 'bait':
                        if (currBait == tempName)
                            trapArmed = true;
                        break;
                    default:
                        //traparmed = false;
                        break;
                }
            }
        }
    }
    trapArmedOverride = false;

    if (!trapArmed) {
        if (debug) console.log('Queueing ' + item + ' into armingQueue. (' + sort + category + trapArmed + ')');
        armingQueue.push([sort, category, item, trapArmed, fail]);
        if (!dequeueIntRunning) {
            var dequeueInterval = setInterval(function () {
                if (debug) console.log('In the queue(' + armingQueue.length + '): ');
                if (debug) console.log(armingQueue);

                if (!dequeueingCTA && armingQueue.length > 0) {
                    dequeueingCTA = true;
                    var tempQueueItem = armingQueue.pop();
                    dequeueCheckThenArm(tempQueueItem[0], tempQueueItem[1], tempQueueItem[2], tempQueueItem[3], tempQueueItem[4]);
                    tempQueueItem = [];
                } else if (armingQueue.length == 0) {
                    clearInterval(dequeueInterval);
                    dequeueIntRunning = false;
                }
            }, 2000);
        }
    } else {
        return 'armed';
    }
}

function dequeueCheckThenArm(sort, category, item, trapArmed, fail) {
    // Try to queue trap arming
    if (debug) console.log("Dequeuer: " + item + ", is armed? " + trapArmed);
    // Remove this item if its still in armingQueue array
    for (var i = 0; i < armingQueue.length; i++) {
        if (item == armingQueue[i]) {
            armingQueue.splice(i, 1);
        }
    }

    var intervalCTA = setInterval(function () {
        if (debug) console.log(item + " in CTA queue.");
        if (!arming) {
            console.debug("Queueing arming - " + item);
            clickThenArmTrapInterval(sort, category, item, fail);
            clearInterval(intervalCTA);
            intervalCTA = null;
            return;
        }
    }, 2000);
    return;
}

function clickThenArmTrapInterval(sort, trap, name, fail) //sort = power/luck/attraction
{
    if (debug) console.log("Pre processing queue item. Opening " + trap + " selector.");
    // Process trap arming queue
    setTimeout(function () {
        clickTrapSelector(trap);
        setTimeout(function () {
            var sec = 10;
            var intervalCTAGiveUp = 3;

            var intervalCTATI = setInterval(
                function () {
                    console.debug("Processing queue item: " + name);
                    var tryArming = armTrap(sort, name, trap);
                    if (tryArming == 'found') {
                        if (isNewUI)
                            clickTrapSelector(trap);
                        clearInterval(intervalCTATI);
                        arming = false;
                        dequeueingCTA = false;
                        intervalCTATI = null;
                        return;
                    } else if (tryArming == 'not found') {
                        clickTrapSelector(trap);
                        if (fail == 'disarm') {
                            disarmTrap(trap);
                        } else if (fail == null || fail == undefined) {
                            //Add something when failover was not built?
                            console.debug('Trap not found, and there were no failover for this setup for now.');
                        } else if (fail.length > 0) {
                            checkThenArm(sort, trap, fail);
                        }

                        clearInterval(intervalCTATI);
                        arming = false;
                        dequeueingCTA = false;
                        intervalCTATI = null;
                        return;
                    } else {
                        // Error when try arming bugs out, retry clickTrapSelector
                        if (debug) console.log("Try arming has bugged out.");
                        --sec;

                        if (sec <= 0) {
                            if (debug) console.log("Try arming has given up.");
                            clickTrapSelector(trap);
                            sec = 10;
                            intervalCTAGiveUp--;
                        }

                        if (intervalCTAGiveUp == 0) {
                            clearInterval(intervalCTATI);
                            arming = false;
                            dequeueingCTA = false;
                            intervalCTATI = null;
                            return;
                        }
                    }
                }, 1000);
        }, 2500);
    }, 500);
}

// name = Brie/Gouda/Swiss (brie = wrong)
function armTrap(sort, name, trap) {
    if (name == 'disarm')
        disarmTrap(trap);

    if (sort == 'best') {
        var nameArray = name;
        name = name[0];
    }

    var nameElement;
    if (isNewUI) {
        var allTraps = document.getElementsByClassName('campPage-trap-itemBrowser-item-content');

        if (allTraps.length > 0) {
            console.debug('Trying to arm ' + name);
            for (var i = 0; i < allTraps.length; i++) {
                nameElement = allTraps[i].getElementsByClassName('campPage-trap-itemBrowser-item-name')[0].textContent;
                if (nameElement.indexOf(name) == 0) {
                    fireEvent(allTraps[i].parentNode.getElementsByClassName('campPage-trap-itemBrowser-item-armButton')[0], 'click');
                    console.debug(name + ' armed');
                    return 'found';
                }
            }
            console.debug(name + " not found");
            if (sort == 'best') {
                nameArray.shift();
                if (nameArray[0] == 'disarm') {
                    disarmTrap(trap);
                } else if (nameArray.length > 0) {
                    if (debug) console.debug(nameArray);
                    return armTrap(sort, nameArray, trap);
                } else {
                    console.debug('No traps found');
                    return 'not found';
                }
            } else {
                return 'not found';
            }
        }
    } else {
        var tagGroupElement = document.getElementsByClassName('tagGroup');
        var tagElement;

        if (tagGroupElement.length > 0) {
            console.debug('Trying to arm ' + name);
            for (var i = 0; i < tagGroupElement.length; ++i) {
                tagElement = tagGroupElement[i].getElementsByTagName('a');
                for (var j = 0; j < tagElement.length; ++j) {
                    nameElement = tagElement[j].getElementsByClassName('name')[0].textContent;
                    if (nameElement.indexOf(name) == 0) {
                        fireEvent(tagElement[j], 'click');
                        console.debug(name + ' armed');
                        return 'found';
                    }
                }
            }
            console.debug(name + " not found");
            if (sort == 'best') {
                nameArray.shift();
                if (nameArray[0] == 'disarm') {
                    disarmTrap(trap);
                } else if (nameArray.length > 0) {
                    if (debug) console.debug(nameArray);
                    return armTrap(sort, nameArray, trap);
                } else {
                    console.debug('No traps found');
                    return 'not found';
                }
            } else {
                return 'not found';
            }
        }
    }
    return 'error';
}

function clickTrapSelector(strSelect) //strSelect = weapon/base/charm/trinket/bait
{
    if (strSelect == "charm") strSelect = "trinket";
    if (isNewUI) {
        fireEvent(document.getElementsByClassName('campPage-trap-armedItem ' + strSelect)[0], 'click');
    } else {
        if (strSelect == "base") {
            fireEvent(document.getElementsByClassName('trapControlThumb')[0], 'click');
        } else if (strSelect == "weapon") {
            fireEvent(document.getElementsByClassName('trapControlThumb')[1], 'click');
        } else if (strSelect == "charm" || strSelect == "trinket") {
            fireEvent(document.getElementsByClassName('trapControlThumb')[2], 'click');
        } else if (strSelect == "bait") {
            fireEvent(document.getElementsByClassName('trapControlThumb')[3], 'click');
        } else {
            return (console.debug("Invalid trapSelector"));
        }
    }
    arming = true;
    return (console.debug("Trap selector: " + strSelect + " clicked"));
}

function closeTrapSelector(category) {
    if (isNewUI) {
        var armedItem = document.getElementsByClassName('campPage-trap-armedItem ' + category)[0];
        if (!isNullOrUndefined(armedItem) && armedItem.getAttribute('class').indexOf('active') > -1) { // trap selector opened
            fireEvent(armedItem, 'click');
            console.plog("Trap selector", category, "closed");
        }
    } else {
        if (document.getElementsByClassName("showComponents " + category).length > 0) {
            fireEvent(document.getElementById('trapSelectorBrowserClose'), 'click');
            console.plog("Trap selector", category, "closed");
        }
    }
}*/

//// END EMBED

function retrieveDataFirst() {
    if (debug) console.log('RUN retrieveDataFirst()');
    try {
        var gotHornTime = false;
        var gotPuzzle = false;
        var gotBaitQuantity = false;
        var retrieveSuccess = false;

        var scriptElementList = document.getElementsByTagName('script');
        if (scriptElementList) {
            var i;
            for (i = 0; i < scriptElementList.length; ++i) {
                var scriptString = scriptElementList[i].innerHTML;

                // get next horn time
                var hornTimeStartIndex = scriptString.indexOf("next_activeturn_seconds");
                if (hornTimeStartIndex >= 0) {
                    var nextActiveTime = 900;
                    hornTimeStartIndex += 25;
                    var hornTimeEndIndex = scriptString.indexOf(",", hornTimeStartIndex);
                    var hornTimerString = scriptString.substring(hornTimeStartIndex, hornTimeEndIndex);
                    nextActiveTime = parseInt(hornTimerString);

                    hornTimeDelay = hornTimeDelayMin + Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));

                    if (!aggressiveMode) {
                        // calculation base on the js in Mousehunt
                        var additionalDelayTime = Math.ceil(nextActiveTime * 0.1);

                        // need to found out the mousehunt provided timer interval to determine the additional delay
                        var timerIntervalStartIndex = scriptString.indexOf("hud.timer_interval");
                        if (timerIntervalStartIndex >= 0) {
                            timerIntervalStartIndex += 21;
                            var timerIntervalEndIndex = scriptString.indexOf(";", timerIntervalStartIndex);
                            var timerIntervalString = scriptString.substring(timerIntervalStartIndex, timerIntervalEndIndex);
                            var timerInterval = parseInt(timerIntervalString);

                            // calculation base on the js in Mousehunt
                            if (timerInterval == 1) {
                                additionalDelayTime = 2;
                            }

                            timerIntervalStartIndex = undefined;
                            timerIntervalEndIndex = undefined;
                            timerIntervalString = undefined;
                            timerInterval = undefined;
                        }

                        // safety mode, include extra delay like time in horn image appear
                        //hornTime = nextActiveTime + additionalDelayTime + hornTimeDelay;
                        hornTime = nextActiveTime + hornTimeDelay;
                        lastDateRecorded = undefined;
                        lastDateRecorded = new Date();

                        additionalDelayTime = undefined;
                    } else {
                        // aggressive mode, no extra delay like time in horn image appear
                        hornTime = nextActiveTime;
                        lastDateRecorded = undefined;
                        lastDateRecorded = new Date();
                    }

                    gotHornTime = true;

                    hornTimeStartIndex = undefined;
                    hornTimeEndIndex = undefined;
                    hornTimerString = undefined;
                    nextActiveTime = undefined;
                }

                // get is king's reward or not
                var hasPuzzleStartIndex = scriptString.indexOf("has_puzzle");
                if (hasPuzzleStartIndex >= 0) {
                    hasPuzzleStartIndex += 12;
                    var hasPuzzleEndIndex = scriptString.indexOf(",", hasPuzzleStartIndex);
                    var hasPuzzleString = scriptString.substring(hasPuzzleStartIndex, hasPuzzleEndIndex);
                    console.plog('hasPuzzleString:', hasPuzzleString);
                    isKingReward = (hasPuzzleString != 'false');

                    gotPuzzle = true;

                    hasPuzzleStartIndex = undefined;
                    hasPuzzleEndIndex = undefined;
                    hasPuzzleString = undefined;
                }

                // get cheese quantity
                var baitQuantityStartIndex = scriptString.indexOf("bait_quantity");
                if (baitQuantityStartIndex >= 0) {
                    baitQuantityStartIndex += 15;
                    var baitQuantityEndIndex = scriptString.indexOf(",", baitQuantityStartIndex);
                    var baitQuantityString = scriptString.substring(baitQuantityStartIndex, baitQuantityEndIndex);
                    baitQuantity = parseInt(baitQuantityString);

                    gotBaitQuantity = true;

                    baitQuantityStartIndex = undefined;
                    baitQuantityEndIndex = undefined;
                    baitQuantityString = undefined;
                }

                var locationStartIndex;
                var locationEndIndex;
                locationStartIndex = scriptString.indexOf("location\":\"");
                if (locationStartIndex >= 0) {
                    locationStartIndex += 11;
                    locationEndIndex = scriptString.indexOf("\"", locationStartIndex);
                    var locationString = scriptString.substring(locationStartIndex, locationEndIndex);
                    currentLocation = locationString;

                    locationStartIndex = undefined;
                    locationEndIndex = undefined;
                    locationString = undefined;
                }

                scriptString = undefined;
            }
            i = undefined;
        }
        scriptElementList = undefined;

        if (gotHornTime && gotPuzzle && gotBaitQuantity) {
            // get trap check time
            CalculateNextTrapCheckInMinute();

            // get last location
            var huntLocationCookie = getStorage("huntLocation");
            if (isNullOrUndefined(huntLocationCookie)) {
                huntLocation = currentLocation;
                setStorage("huntLocation", currentLocation);
            } else {
                huntLocation = huntLocationCookie;
                setStorage("huntLocation", huntLocation);
            }
            huntLocationCookie = undefined;

            // get last king reward time
            var lastKingRewardDate = getStorage("lastKingRewardDate");
            if (isNullOrUndefined(lastKingRewardDate)) {
                lastKingRewardSumTime = -1;
            } else {
                var lastDate = new Date(lastKingRewardDate);
                lastKingRewardSumTime = parseInt((new Date() - lastDate) / 1000);
                lastDate = undefined;
            }
            lastKingRewardDate = undefined;

            retrieveSuccess = true;
        } else {
            retrieveSuccess = false;
        }

        // clean up
        gotHornTime = undefined;
        gotPuzzle = undefined;
        gotBaitQuantity = undefined;
        return (retrieveSuccess);
    }
    catch (e) {
        console.perror('retrieveDataFirst', e.message);
    }
}

function GetHornTime() {
    var huntTimerElement = document.getElementById('huntTimer');
    var totalSec = 900;
    if (huntTimerElement !== null) {
        huntTimerElement = huntTimerElement.textContent;
        if (huntTimerElement.toLowerCase().indexOf('ready') > -1)
            totalSec = 0;
        else if (isNewUI) {
            var arrTime = huntTimerElement.split(":");
            if (arrTime.length == 2) {
                for (var i = 0; i < arrTime.length; i++)
                    arrTime[i] = parseInt(arrTime[i]);
                totalSec = arrTime[0] * 60 + arrTime[1];
            }
        }
        else {
            var temp = parseInt(huntTimerElement);
            if (Number.isInteger(temp))
                totalSec = temp * 60;
        }
    }
    return totalSec;
}

function getKingRewardStatus() {
    var strValue = getPageVariable('user.has_puzzle');
    console.plog('user.has_puzzle:', strValue);
    return (strValue == 'true');
    var headerOrHud = (isNewUI) ? document.getElementById('mousehuntHud') : document.getElementById('header');
    if (headerOrHud !== null) {
        var textContentLowerCase = headerOrHud.textContent.toLowerCase();
        if (textContentLowerCase.indexOf("king reward") > -1 ||
            textContentLowerCase.indexOf("king's reward") > -1 ||
            textContentLowerCase.indexOf("kings reward") > -1) {
            return true;
        }
        else
            return (strValue == 'true');
    } else
        return false;
}

function getBaitQuantity() {
    var hudBaitQuantity = document.getElementById('hud_baitQuantity');
    if (hudBaitQuantity !== null) {
        return parseInt(hudBaitQuantity.textContent);
    } else {
        return 0;
    }
}

function getCurrentLocation() {
    var tempLocation;
    if (isNewUI) {
        tempLocation = document.getElementsByClassName('mousehuntHud-environmentName');
        if (tempLocation.length > 0)
            return tempLocation[0].textContent;
        else
            return "";
    } else {
        tempLocation = document.getElementById('hud_location');
        if (!isNullOrUndefined(tempLocation))
            return tempLocation.textContent;
        else
            return "";
    }
}

function retrieveData() {
    if (debug) console.log("Run retrieveData()");
    try {
        var browser = browserDetection();

        // get next horn time
        if (browser == "firefox") {
            nextActiveTime = unsafeWindow.user.next_activeturn_seconds;
            isKingReward = unsafeWindow.user.has_puzzle;
            baitQuantity = unsafeWindow.user.bait_quantity;
            currentLocation = unsafeWindow.user.location;
            NOBhasPuzzle = unsafeWindow.user.has_puzzle;
        } else if (browser == "opera") {
            nextActiveTime = user.next_activeturn_seconds;
            isKingReward = user.has_puzzle;
            baitQuantity = user.bait_quantity;
            currentLocation = user.location;
        } else if (browser == "chrome") {
            nextActiveTime = parseInt(getPageVariableForChrome("user.next_activeturn_seconds"));
            isKingReward = (getPageVariableForChrome("user.has_puzzle").toString() != "false");
            baitQuantity = parseInt(getPageVariableForChrome("user.bait_quantity"));
            currentLocation = getPageVariableForChrome("user.location");
            NOBhasPuzzle = user.has_puzzle;
        } else {
            window.setTimeout(function () {
                reloadWithMessage("Browser not supported. Reloading...", false);
            }, 60000);
        }

        browser = undefined;

        if (nextActiveTime == "" || isNaN(nextActiveTime)) {
            // fail to retrieve data, might be due to slow network

            // reload the page to see it fix the problem
            window.setTimeout(function () {
                reloadWithMessage("Fail to retrieve data. Reloading...", false);
            }, 5000);
        } else {
            // got the timer right!

            // calculate the delay
            hornTimeDelay = hornTimeDelayMin + Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));

            if (!aggressiveMode) {
                // calculation base on the js in Mousehunt
                var additionalDelayTime = Math.ceil(nextActiveTime * 0.1);
                if (timerInterval != "" && !isNaN(timerInterval) && timerInterval == 1) {
                    additionalDelayTime = 2;
                }

                // safety mode, include extra delay like time in horn image appear
                //hornTime = nextActiveTime + additionalDelayTime + hornTimeDelay;
                hornTime = nextActiveTime + hornTimeDelay;
                lastDateRecorded = undefined;
                lastDateRecorded = new Date();

                additionalDelayTime = undefined;
            } else {
                // aggressive mode, no extra delay like time in horn image appear
                hornTime = nextActiveTime;
                lastDateRecorded = undefined;
                lastDateRecorded = new Date();
            }
        }

        // get trap check time
        if (enableTrapCheck) {
            var today = new Date();
            checkTimeDelay = checkTimeDelayMin + Math.round(Math.random() * (checkTimeDelayMax - checkTimeDelayMin));
            checkTime = (today.getMinutes() >= trapCheckTimeDiff) ? 3600 + (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds()) : (trapCheckTimeDiff * 60) - (today.getMinutes() * 60 + today.getSeconds());
            checkTime += checkTimeDelay;
            today = undefined;
        }
    } catch (e) {
        console.log("retrieveData() ERROR - " + e);
    }
}

function checkJournalDate() {
    var reload = false;

    var journalDateDiv = document.getElementsByClassName('journaldate');
    if (journalDateDiv) {
        var journalDateStr = journalDateDiv[0].innerHTML.toString();
        var midIndex = journalDateStr.indexOf(":", 0);
        var spaceIndex = journalDateStr.indexOf(" ", midIndex);

        if (midIndex >= 1) {
            var hrStr = journalDateStr.substring(0, midIndex);
            var minStr = journalDateStr.substring(midIndex + 1, 2);
            var hourSysStr = journalDateStr.substring(spaceIndex + 1, 2);

            var nowDate = new Date();
            var lastHuntDate = new Date();
            if (hourSysStr == "am") {
                lastHuntDate.setHours(parseInt(hrStr), parseInt(minStr), 0, 0);
            } else {
                lastHuntDate.setHours(parseInt(hrStr) + 12, parseInt(minStr), 0, 0);
            }
            if (parseInt(nowDate - lastHuntDate) / 1000 > 900) {
                reload = true;
            }
            hrStr = undefined;
            minStr = undefined;
            nowDate = undefined;
            lastHuntDate = undefined;
        } else {
            reload = true;
        }

        journalDateStr = undefined;
        midIndex = undefined;
        spaceIndex = undefined;
    }
    journalDateDiv = undefined;

    if (reload) {
        reloadWithMessage("Timer error. Try reload to fix.", true);
    }

    try {
        return (reload);
    } finally {
        reload = undefined;
    }
}

function action() {
    if (debug) console.log("Run action()");
    try {
        if (isKingReward) {
            kingRewardAction();
            notifyMe('KR NOW - ' + getPageVariable('user.username'), 'http://3.bp.blogspot.com/_O2yZIhpq9E8/TBoAMw0fMNI/AAAAAAAAAxo/1ytaIxQQz4o/s1600/Subliminal+Message.JPG', "Kings Reward NOW");
        } else if (pauseAtInvalidLocation && (huntLocation != currentLocation)) {
            // update timer
            displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");

            if (fbPlatform) {
                if (secureConnection) {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                } else {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                }
            } else if (hiFivePlatform) {
                if (secureConnection) {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                } else {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                }
            } else if (mhPlatform) {
                if (secureConnection) {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                } else {
                    displayLocation("<span style='color: red; '>" + currentLocation + "</span> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
                }
            }

            displayKingRewardSumTime(null);

            // pause script
        } else if (baitQuantity == 0) {
            // update timer
            displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
            displayLocation(huntLocation);
            displayKingRewardSumTime(null);

            // Notify no more cheese
            noCheeseAction();

            // pause the script
        } else {
            // update location
            displayLocation(huntLocation);

            var isHornSounding = false;

            // check if the horn image is visible
            nobTestBetaUI();
            var headerElement = document.getElementById(header);
            if (headerElement) {
                if (isNewUI) {
                    headerElement = headerElement.firstChild;
                }
                var headerStatus = headerElement.getAttribute('class');
                if (headerStatus.indexOf(hornReady) != -1) {
                    // if the horn image is visible, why do we need to wait any more, sound the horn!
                    soundHorn();

                    // make sure the timer don't run twice!
                    isHornSounding = true;
                }
                headerStatus = undefined;
            }
            headerElement = undefined;

            if (isHornSounding == false) {
                // start timer
                window.setTimeout(function () {
                    countdownTimer()
                }, timerRefreshInterval * 1000);
            }

            isHornSounding = undefined;
        }
        if (!isKingReward) {
            window.setTimeout(function () {
                eventLocationCheck();
                runAddonCode();
            }, 1000);
        }
    } catch (e) {
        console.log("action() ERROR - " + e);
    }
}

function countdownTimer() {
    if (isKingReward) {
        // update timer
        displayTimer("King's Reward!", "King's Reward!", "King's Reward");
        displayKingRewardSumTime("Now");

        // record last king's reward time
        var nowDate = new Date();
        setStorage("lastKingRewardDate", nowDate.toString());
        nowDate = undefined;
        lastKingRewardSumTime = 0;

        // reload the page so that the sound can be play
        // simulate mouse click on the camp button
        fireEvent(document.getElementsByClassName(campButton)[0].firstChild, 'click');

        // reload the page if click on camp button fail
        window.setTimeout(function () {
            reloadWithMessage("Fail to click on camp button. Reloading...", false);
        }, 5000);
    } else if (pauseAtInvalidLocation && (huntLocation != currentLocation)) {
        // update timer
        displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");
        if (fbPlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            } else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        } else if (hiFivePlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            } else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        } else if (mhPlatform) {
            if (secureConnection) {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='https://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            } else {
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='http://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            }
        }
        displayKingRewardSumTime(null);

        // pause script
    } else if (baitQuantity == 0) {
        // update timer
        displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
        displayLocation(huntLocation);
        displayKingRewardSumTime(null);

        // pause the script
    } else {
        var dateNow = new Date();
        var intervalTime = timeElapsed(lastDateRecorded, dateNow);
        lastDateRecorded = undefined;
        lastDateRecorded = dateNow;
        dateNow = undefined;

        if (enableTrapCheck) {
            // update time
            hornTime -= intervalTime;
            checkTime -= intervalTime;
            if (lastKingRewardSumTime != -1) {
                lastKingRewardSumTime += intervalTime;
            }
        } else {
            // update time
            hornTime -= intervalTime;
            if (lastKingRewardSumTime != -1) {
                lastKingRewardSumTime += intervalTime;
            }
        }

        intervalTime = undefined;

        if (hornTime <= 0) {
            // blow the horn!
            soundHorn();
        } else if (enableTrapCheck && checkTime <= 0) {
            // trap check!
            trapCheck();
        } else {
            if (enableTrapCheck) {
                // update timer
                if (!aggressiveMode) {
                    displayTimer("Horn: " + timeformat(hornTime) + " | Check: " + timeformat(checkTime),
                        timeformat(hornTime) + "  <i>(included extra " + timeformat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
                        timeformat(checkTime) + "  <i>(included extra " + timeformat(checkTimeDelay) + " delay)</i>");
                } else {
                    displayTimer("Horn: " + timeformat(hornTime) + " | Check: " + timeformat(checkTime),
                        timeformat(hornTime) + "  <i>(lot faster than MouseHunt timer)</i>",
                        timeformat(checkTime) + "  <i>(included extra " + timeformat(checkTimeDelay) + " delay)</i>");
                }
            } else {
                // update timer
                if (!aggressiveMode) {
                    displayTimer("Horn: " + timeformat(hornTime),
                        timeformat(hornTime) + "  <i>(included extra " + timeformat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
                        "-");

                    // check if user manaually sounded the horn
                    var scriptNode = document.getElementById("scriptNode");
                    if (scriptNode) {
                        var isHornSounded = scriptNode.getAttribute("soundedHornAtt");
                        if (isHornSounded == "true") {
                            // sound horn function do the rest
                            soundHorn();

                            // stop loopping
                            return;
                        }
                        isHornSounded = undefined;
                    }
                    scriptNode = undefined;
                } else {
                    displayTimer("Horn: " + timeformat(hornTime),
                        timeformat(hornTime) + "  <i>(lot faster than MouseHunt timer)</i>",
                        "-");

                    // agressive mode should sound the horn whenever it is possible to do so.
                    var headerElement = document.getElementById(header);
                    if (headerElement) {
                        if (isNewUI)
                            headerElement = headerElement.firstChild;
                        // the horn image appear before the timer end
                        if (headerElement.getAttribute('class').indexOf(hornReady) != -1) {
                            // who care, blow the horn first!
                            soundHorn();

                            headerElement = undefined;

                            // skip all the code below
                            return;
                        }
                    }
                    headerElement = undefined;
                }
            }

            // set king reward sum time
            displayKingRewardSumTime(timeFormatLong(lastKingRewardSumTime));

            window.setTimeout(function () {
                (countdownTimer)()
            }, timerRefreshInterval * 1000);
        }
    }
}

function reloadPage(soundHorn) {
    // reload the page
    if (fbPlatform) {
        // for Facebook only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://www.mousehuntgame.com/canvas/turn.php";
            } else {
                window.location.href = "https://www.mousehuntgame.com/canvas/";
            }
        } else {
            if (soundHorn) {
                window.location.href = "http://www.mousehuntgame.com/canvas/turn.php";
            } else {
                window.location.href = "http://www.mousehuntgame.com/canvas/";
            }
        }
    } else if (hiFivePlatform) {
        // for Hi5 only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://mousehunt.hi5.hitgrab.com/turn.php";
            } else {
                window.location.href = "https://mousehunt.hi5.hitgrab.com/";
            }
        } else {
            if (soundHorn) {
                window.location.href = "http://mousehunt.hi5.hitgrab.com/turn.php";
            } else {
                window.location.href = "http://mousehunt.hi5.hitgrab.com/";
            }
        }
    } else if (mhPlatform) {
        // for mousehunt game only

        if (secureConnection) {
            if (soundHorn) {
                window.location.href = "https://www.mousehuntgame.com/turn.php";
            } else {
                window.location.href = "https://www.mousehuntgame.com/";
            }
        } else {
            if (soundHorn) {
                window.location.href = "http://www.mousehuntgame.com/turn.php";
            } else {
                window.location.href = "http://www.mousehuntgame.com/";
            }
        }
    }

    soundHorn = undefined;
}

function reloadWithMessage(msg, soundHorn) {
    // display the message
    displayTimer(msg, msg, msg, msg);

    // reload the page
    setTimeout(function () {
        reloadPage(soundHorn)
    }, 1000);

    msg = undefined;
    soundHorn = undefined;
}

// ################################################################################################
//   Timer Function - Start
// ################################################################################################

function embedTimer(targetPage) {
    try {
        if (showTimerInPage) {
            var headerElement;
            if (fbPlatform || hiFivePlatform || mhPlatform) {
                headerElement = document.getElementById('noscript');
            } else if (mhMobilePlatform) {
                headerElement = document.getElementById('mobileHorn');
            }

            if (headerElement) {
                var timerDivElement = document.createElement('div');

                //var hr1Element = document.createElement('hr');
                //timerDivElement.appendChild(hr1Element);
                //hr1Element = null;

                // show bot title and version
                var titleElement = document.createElement('div');
                titleElement.setAttribute('id', 'titleElement');
                if (targetPage && aggressiveMode) {
                    titleElement.innerHTML = "<b><a href=\"https://greasyfork.org/en/scripts/6514-mousehunt-autobot-enhanced-revamp\" target=\"_blank\">MouseHunt AutoBot ENHANCED + REVAMP (version " + scriptVersion + ")</a> + MouseHunt AutoBot Additional thing" + (isNewUI ? " ~ Beta UI" : "" ) + "</b> - <font color='red'>Aggressive Mode</font>";
                } else {
                    titleElement.innerHTML = "<b><a href=\"https://greasyfork.org/en/scripts/6514-mousehunt-autobot-enhanced-revamp\" target=\"_blank\">MouseHunt AutoBot ENHANCED + REVAMP (version " + scriptVersion + ")</a> + MouseHunt AutoBot Additional thing" + (isNewUI ? " ~ Beta UI" : "" ) + "</b>";
                }
                timerDivElement.appendChild(titleElement);
                titleElement = null;

                if (targetPage) {
                    var updateElement = document.createElement('div');
                    updateElement.setAttribute('id', 'updateElement');
                    timerDivElement.appendChild(updateElement);
                    updateElement = null;

                    var NOBmessage = document.createElement('div');
                    NOBmessage.setAttribute('id', 'NOBmessage');
                    timerDivElement.appendChild(NOBmessage);
                    NOBmessage = null;

                    nextHornTimeElement = document.createElement('div');
                    nextHornTimeElement.setAttribute('id', 'nextHornTimeElement');
                    nextHornTimeElement.innerHTML = "<b>Next Hunter Horn Time:</b> Loading...";
                    timerDivElement.appendChild(nextHornTimeElement);

                    checkTimeElement = document.createElement('div');
                    checkTimeElement.setAttribute('id', 'checkTimeElement');
                    checkTimeElement.innerHTML = "<b>Next Trap Check Time:</b> Loading...";
                    timerDivElement.appendChild(checkTimeElement);

                    if (pauseAtInvalidLocation) {
                        // location information only display when enable this feature
                        travelElement = document.createElement('div');
                        travelElement.setAttribute('id', 'travelElement');
                        travelElement.innerHTML = "<b>Target Hunt Location:</b> Loading...";
                        timerDivElement.appendChild(travelElement);
                    }

                    var lastKingRewardDate = getStorage("lastKingRewardDate");
                    var lastDateStr;
                    if (lastKingRewardDate == undefined || lastKingRewardDate == null) {
                        lastDateStr = "-";
                    } else {
                        var lastDate = new Date(lastKingRewardDate);
                        lastDateStr = lastDate.toDateString() + " " + lastDate.toTimeString().substring(0, 8);
                        lastDate = null;
                    }

                    kingTimeElement = document.createElement('div');
                    kingTimeElement.setAttribute('id', 'kingTimeElement');
                    kingTimeElement.innerHTML = "<b>Last King's Reward:</b> " + lastDateStr + " ";
                    timerDivElement.appendChild(kingTimeElement);

                    lastKingRewardSumTimeElement = document.createElement('font');
                    lastKingRewardSumTimeElement.setAttribute('id', 'lastKingRewardSumTimeElement');
                    lastKingRewardSumTimeElement.innerHTML = "(Loading...)";
                    kingTimeElement.appendChild(lastKingRewardSumTimeElement);

                    lastKingRewardDate = null;
                    lastDateStr = null;

                    if (showLastPageLoadTime) {
                        var nowDate = new Date();

                        // last page load time
                        var loadTimeElement = document.createElement('div');
                        loadTimeElement.setAttribute('id', 'loadTimeElement');
                        loadTimeElement.innerHTML = "<b>Last Page Load: </b>" + nowDate.toDateString() + " " + nowDate.toTimeString().substring(0, 8);
                        //timerDivElement.appendChild(loadTimeElement);

                        loadTimeElement = null;
                        nowDate = null;
                    }

                    var timersElementToggle = document.createElement('a');
                    var text = document.createTextNode('Toggle timers');
                    timersElementToggle.href = '#';
                    timersElementToggle.setAttribute('id', 'timersElementToggle');
                    timersElementToggle.appendChild(text);
                    timersElementToggle.onclick = function (e) {
                        var timersElementStyle = document.getElementById('loadTimersElement');
                        if (timersElementStyle.style.display == 'block' || timersElementStyle.style.display == '') {
                            timersElementStyle.style.display = 'none';
                        } else {
                            timersElementStyle.style.display = 'block';
                        }
                        timersElementStyle = null;
                    };
                    var holder = document.createElement('div');
                    holder.setAttribute('style', 'float: left;');
                    var temp = document.createElement('span');
                    temp.innerHTML = '&#160;&#126;&#160;';
                    holder.appendChild(timersElementToggle);
                    holder.appendChild(temp);
                    timerDivElement.appendChild(holder);
                    holder = null;
                    text = null;
                    temp = null;

                    var loadTimersElement = document.createElement('div');
                    loadTimersElement.setAttribute('id', 'loadTimersElement');
                    loadTimersElement.setAttribute('style', 'display: none;');
                    timerDivElement.appendChild(loadTimersElement);

                    //timerDivElement.appendChild(/*document.createElement('br')*/document.createTextNode(' &#126; '));

                    var loadLinkToUpdateDiv = document.createElement('div');
                    loadLinkToUpdateDiv.setAttribute('id', 'gDocArea');
                    loadLinkToUpdateDiv.setAttribute('style', 'float: left;');
                    var tempSpan2 = document.createElement('span');
                    var loadLinkToUpdate = document.createElement('a');
                    text = document.createTextNode('Submit to GDoc');
                    loadLinkToUpdate.href = '#';
                    loadLinkToUpdate.setAttribute('id', 'gDocLink');
                    loadLinkToUpdate.appendChild(text);
                    loadLinkToUpdate.addEventListener('click', nobScript, false);
                    text = null;
                    tempSpan2.appendChild(loadLinkToUpdate);
                    loadLinkToUpdateDiv.appendChild(tempSpan2);
                    timerDivElement.appendChild(loadLinkToUpdateDiv);

                    text = ' &#126; <a href="javascript:window.open(\'https://docs.google.com/spreadsheet/ccc?key=0Ag_KH_nuVUjbdGtldjJkWUJ4V1ZpUDVwd1FVM0RTM1E#gid=5\');" target=_blank>Go to GDoc</a>';
                    var tempDiv = document.createElement('span');
                    tempDiv.innerHTML = text;
                    text = ' &#126; <a id="nobRaffle" href="#" title="Sends back the raffle ticket in inventory.">Return raffle tickets</a>';
                    tempSpan2 = document.createElement('span');
                    tempSpan2.innerHTML = text;
                    var tempSpan3 = document.createElement('span');
                    tempSpan3.innerHTML = ' &#126; <a id="nobPresent" href="#" title="Sends back the presents in inventory.">Return presents</a>';
                    var tempSpan = document.createElement('span');
                    tempSpan.innerHTML = ' &#126; <a href="javascript:window.open(\'http://goo.gl/forms/ayRsnizwL1\');" target=_blank>Submit a bug report/feedback</a>';
                    loadLinkToUpdateDiv.appendChild(tempDiv);
                    loadLinkToUpdateDiv.appendChild(tempSpan2);
                    loadLinkToUpdateDiv.appendChild(tempSpan3);
                    loadLinkToUpdateDiv.appendChild(tempSpan);

                    text = null;
                    tempDiv = null;
                    tempSpan = null;
                    tempSpan2 = null;
                    tempSpan3 = null;
                    loadLinkToUpdateDiv = null;
                    timersElementToggle = null;
                    loadTimersElement = null;
                    loadLinkToUpdate = null;
                } else {
                    if (isNewUI || nobTestBetaUI()) {
                        // try check if ajax was called
                        if (doubleCheckLocation()) {
                            exeScript();
                            nobInit();
                            return;
                        } else {
                            var ajaxPageSwitchEvent = function (e) {
                                setTimeout(function () {
                                    document.getElementById('titleElement').parentNode.remove();
                                    exeScript();
                                    nobInit();
                                }, 3000);
                                $('.camp a')[0].removeEventListener('click', ajaxPageSwitchEvent);
                                ajaxPageSwitchEvent = null;
                            };
                            $('.camp a')[0].addEventListener('click', ajaxPageSwitchEvent);
                        }
                    }

                    // player currently navigating other page instead of hunter camp
                    var helpTextElement = document.createElement('div');
                    helpTextElement.setAttribute('id', 'helpTextElement');
                    if (fbPlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        }
                    } else if (hiFivePlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://mousehunt.hi5.hitgrab.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://mousehunt.hi5.hitgrab.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        }
                    } else if (mhPlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='https://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='http://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                        }
                    } else if (mhMobilePlatform) {
                        if (secureConnection) {
                            helpTextElement.innerHTML = "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='https://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
                        } else {
                            helpTextElement.innerHTML = "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='http://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
                        }
                    }
                    timerDivElement.appendChild(helpTextElement);

                    helpTextElement = null;
                }

                var showPreference = getStorage('showPreference');
                if (showPreference == undefined || showPreference == null) {
                    showPreference = false;
                    setStorage("showPreference", showPreference);
                }

                var showPreferenceLinkDiv = document.createElement('div');
                showPreferenceLinkDiv.setAttribute('id', 'showPreferenceLinkDiv');
                showPreferenceLinkDiv.setAttribute('style', 'text-align:right');
                timerDivElement.appendChild(showPreferenceLinkDiv);

                var showPreferenceSpan = document.createElement('span');
                var showPreferenceLinkStr = '<a id="showPreferenceLink" name="showPreferenceLink" onclick="if (document.getElementById(\'showPreferenceLink\').innerHTML == \'<b>[Hide Preference]</b>\') { document.getElementById(\'preferenceDiv\').style.display=\'none\';  document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Show Preference]</b>\'; } else { document.getElementById(\'preferenceDiv\').style.display=\'block\'; document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Hide Preference]</b>\'; }">';
                if (showPreference == true)
                    showPreferenceLinkStr += '<b>[Hide Preference]</b>';
                else
                    showPreferenceLinkStr += '<b>[Show Preference]</b>';
                showPreferenceLinkStr += '</a>';
                showPreferenceLinkStr += '&nbsp;&nbsp;&nbsp;';
                showPreferenceSpan.innerHTML = showPreferenceLinkStr;
                showPreferenceLinkDiv.appendChild(showPreferenceSpan);
                showPreferenceLinkStr = null;
                showPreferenceSpan = null;
                showPreferenceLinkDiv = null;

                var hr2Element = document.createElement('hr');
                timerDivElement.appendChild(hr2Element);
                hr2Element = null;

                var preferenceHTMLStr = '<table border="0" width="100%">';
                if (aggressiveMode) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Bot aggressively by ignore all safety measure such as check horn image visible before sounding it">';
                    preferenceHTMLStr += '<b>Aggressive Mode</b>';
                    preferenceHTMLStr += '</a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputTrue" name="AggressiveModeInput" value="true" onchange="if (document.getElementById(\'AggressiveModeInputTrue\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'disabled\';}" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputFalse" name="AggressiveModeInput" value="false" onchange="if (document.getElementById(\'AggressiveModeInputFalse\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'\';}"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time before sounding the horn (in seconds)">';
                    preferenceHTMLStr += '<b>Horn Time Delay</b>';
                    preferenceHTMLStr += '</a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMinInput" name="HornTimeDelayMinInput" disabled="disabled" value="' + hornTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMaxInput" name="HornTimeDelayMaxInput" disabled="disabled" value="' + hornTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Bot aggressively by ignore all safety measure such as check horn image visible before sounding it">';
                    preferenceHTMLStr += '<b>Aggressive Mode</b>';
                    preferenceHTMLStr += '</a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputTrue" name="AggressiveModeInput" value="true" onchange="if (document.getElementById(\'AggressiveModeInputTrue\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'disabled\';}"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="AggressiveModeInputFalse" name="AggressiveModeInput" value="false" onchange="if (document.getElementById(\'AggressiveModeInputFalse\').checked == true) { document.getElementById(\'HornTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'HornTimeDelayMaxInput\').disabled=\'\';}" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time before sounding the horn (in seconds)">';
                    preferenceHTMLStr += '<b>Horn Time Delay</b>';
                    preferenceHTMLStr += '</a>&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMinInput" name="HornTimeDelayMinInput" value="' + hornTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="HornTimeDelayMaxInput" name="HornTimeDelayMaxInput" value="' + hornTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (enableTrapCheck) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Enable trap check once an hour"><b>Trap Check</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputTrue" name="TrapCheckInput" value="true" onchange="if (document.getElementById(\'TrapCheckInputTrue\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'\';}" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputFalse" name="TrapCheckInput" value="false" onchange="if (document.getElementById(\'TrapCheckInputFalse\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'disabled\';}"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Trap check time different value (00 minutes - 45 minutes)"><b>Trap Check Time Offset</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeOffsetInput" name="TrapCheckTimeOffsetInput" value="' + trapCheckTimeDiff.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time to trap check (in seconds)"><b>Trap Check Time Delay</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMinInput" name="TrapCheckTimeDelayMinInput" value="' + checkTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMaxInput" name="TrapCheckTimeDelayMaxInput" value="' + checkTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Enable trap check once an hour"><b>Trap Check</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputTrue" name="TrapCheckInput" value="true" onchange="if (document.getElementById(\'TrapCheckInputTrue\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'\';}"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="TrapCheckInputFalse" name="TrapCheckInput" value="false" onchange="if (document.getElementById(\'TrapCheckInputFalse\').checked == true) { document.getElementById(\'TrapCheckTimeOffsetInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=\'disabled\';}" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Trap check time different value (00 minutes - 45 minutes)"><b>Trap Check Time Offset</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeOffsetInput" name="TrapCheckTimeOffsetInput" disabled="disabled" value="' + trapCheckTimeDiff.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Extra delay time to trap check (in seconds)"><b>Trap Check Time Delay</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMinInput" name="TrapCheckTimeDelayMinInput" disabled="disabled" value="' + checkTimeDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="TrapCheckTimeDelayMaxInput" name="TrapCheckTimeDelayMaxInput" disabled="disabled" value="' + checkTimeDelayMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (isKingWarningSound) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Play sound when encounter king\'s reward"><b>Play King Reward Sound</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputTrue" name="PlayKingRewardSoundInput" value="true" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputFalse" name="PlayKingRewardSoundInput" value="false" /> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Play sound when encounter king\'s reward"><b>Play King Reward Sound</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputTrue" name="PlayKingRewardSoundInput" value="true" /> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PlayKingRewardSoundInputFalse" name="PlayKingRewardSoundInput" value="false" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Solve King Reward automatically"><b>Auto Solve King Reward</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px">';
                if (isAutoSolve) {
                    preferenceHTMLStr += '<input type="radio" id="AutoSolveKRInputTrue" name="AutoSolveKRInput" value="true" onchange="if (document.getElementById(\'AutoSolveKRInputTrue\').checked == true) { document.getElementById(\'AutoSolveKRDelayMinInput\').disabled=\'\'; document.getElementById(\'AutoSolveKRDelayMaxInput\').disabled=\'\';}" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="AutoSolveKRInputFalse" name="AutoSolveKRInput" value="false" onchange="if (document.getElementById(\'AutoSolveKRInputFalse\').checked == true) { document.getElementById(\'AutoSolveKRDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'AutoSolveKRDelayMaxInput\').disabled=\'disabled\';}"/> False';
                }
                else {
                    preferenceHTMLStr += '<input type="radio" id="AutoSolveKRInputTrue" name="AutoSolveKRInput" value="true" onchange="if (document.getElementById(\'AutoSolveKRInputTrue\').checked == true) { document.getElementById(\'AutoSolveKRDelayMinInput\').disabled=\'\'; document.getElementById(\'AutoSolveKRDelayMaxInput\').disabled=\'\';}"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="AutoSolveKRInputFalse" name="AutoSolveKRInput" value="false" onchange="if (document.getElementById(\'AutoSolveKRInputFalse\').checked == true) { document.getElementById(\'AutoSolveKRDelayMinInput\').disabled=\'disabled\'; document.getElementById(\'AutoSolveKRDelayMaxInput\').disabled=\'disabled\';}" checked="checked"/> False';
                }
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';
                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Extra delay time to solve King Reward (in seconds)"><b>Auto Solve King Reward Delay</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px">';
                if (isAutoSolve) {
                    preferenceHTMLStr += '<input type="text" id="AutoSolveKRDelayMinInput" name="AutoSolveKRDelayMinInput" value="' + krDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="AutoSolveKRDelayMaxInput" name="AutoSolveKRDelayMaxInput" value="' + krDelayMax.toString() + '"/> seconds';
                }
                else {
                    preferenceHTMLStr += '<input type="text" id="AutoSolveKRDelayMinInput" name="AutoSolveKRDelayMinInput" disabled="disabled" value="' + krDelayMin.toString() + '"/> seconds';
                    preferenceHTMLStr += ' ~ ';
                    preferenceHTMLStr += '<input type="text" id="AutoSolveKRDelayMaxInput" name="AutoSolveKRDelayMaxInput" disabled="disabled" value="' + krDelayMax.toString() + '"/> seconds';
                }
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Play which sound when encountering king\'s reward"><b>King Reward Sound</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px;">';
                preferenceHTMLStr += '<input type="text" id="KingRewardSoundInput" name="KingRewardSoundInput" value="' + kingWarningSound + '" />';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Which email to send king\'s reward to"><b>Email to send King Reward</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px;">';
                preferenceHTMLStr += '<input type="text" id="KingRewardEmail" name="KingRewardEmail" value="' + kingRewardEmail + '" />';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                /*preferenceHTMLStr += '<tr>';
                 preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                 preferenceHTMLStr += '<a title="Which phone number to send king\'s reward to"><b>SMS number to send King Reward</b></a>';
                 preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                 preferenceHTMLStr += '</td>';
                 preferenceHTMLStr += '<td style="height:24px;">';
                 preferenceHTMLStr += '<input type="text" id="KingRewardPhoneNumber" name="KingRewardPhoneNumber" value="' + kingRewardPhone + '" />';
                 preferenceHTMLStr += '</td>';
                 preferenceHTMLStr += '</tr>';

                 preferenceHTMLStr += '<tr>';
                 preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                 preferenceHTMLStr += '<a title="What was the verification key sent to this number?"><b>Verification key from SMS</b></a>';
                 preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                 preferenceHTMLStr += '</td>';
                 preferenceHTMLStr += '<td style="height:24px;">';
                 preferenceHTMLStr += '<input type="text" id="KingRewardPhoneNumberVerify" name="KingRewardPhoneNumberVerify" value="' + kingRewardPhoneVerify + '" />';
                 preferenceHTMLStr += '</td>';
                 preferenceHTMLStr += '</tr>';*/

                if (reloadKingReward) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Reload the the page according to King Reward Resume Time when encount King Reward"><b>King Reward Resume</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputTrue" name="KingRewardResumeInput" value="true" onchange="if (document.getElementById(\'KingRewardResumeInputTrue\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'\'; }" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputFalse" name="KingRewardResumeInput" value="false" onchange="if (document.getElementById(\'KingRewardResumeInputFalse\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'disabled\'; }"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Duration of pausing the script before reload the King\'s Reward page (in seconds)"><b>King Reward Resume Time</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="KingRewardResumeTimeInput" name="KingRewardResumeTimeInput" value="' + kingPauseTimeMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Reload the the page according to King Reward Resume Time when encounter King Reward"><b>King Reward Resume</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputTrue" name="KingRewardResumeInput" value="true" onchange="if (document.getElementById(\'KingRewardResumeInputTrue\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'\'; }"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="KingRewardResumeInputFalse" name="KingRewardResumeInput" value="false" onchange="if (document.getElementById(\'KingRewardResumeInputFalse\').checked == true) { document.getElementById(\'KingRewardResumeTimeInput\').disabled=\'disabled\'; }" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Duration of pausing the script before reload the King\'s Reward page (in seconds)"><b>King Reward Resume Time</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="text" id="KingRewardResumeTimeInput" name="KingRewardResumeTimeInput" disabled="disabled" value="' + kingPauseTimeMax.toString() + '"/> seconds';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (pauseAtInvalidLocation) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="The script will pause if player at different location that hunt location set before"><b>Remember Location</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputTrue" name="PauseLocationInput" value="true" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputFalse" name="PauseLocationInput" value="false" /> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="The script will pause if player at different location that hunt location set before"><b>Remember Location</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputTrue" name="PauseLocationInput" value="true"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="PauseLocationInputFalse" name="PauseLocationInput" value="false" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }
                if (autoPopupKR) {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Auto Popup on KR"><b>Auto KR Popup</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrTrue" name="autopopkrInput" value="true" checked="checked"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrFalse" name="autopopkrInput" value="false" /> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                } else {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Auto Popup on KR"><b>Auto KR Popup</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrTrue" name="autopopkrInput" value="true"/> True';
                    preferenceHTMLStr += '   ';
                    preferenceHTMLStr += '<input type="radio" id="autopopkrFalse" name="autopopkrInput" value="false" checked="checked"/> False';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="Select the script algorithm based on certain event / location"><b>Event or Location</b></a>';
                preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td style="height:24px">';
                preferenceHTMLStr += '<select name="eventAlgo" onChange="window.localStorage.setItem(\'eventLocation\', value); document.getElementById(\'event\').value=window.localStorage.getItem(\'eventLocation\');">';
                preferenceHTMLStr += '<option value=""> </option>';
                preferenceHTMLStr += '<option value="None" selected>None</option>';
                preferenceHTMLStr += '<option value="Hunt For">Hunt for ' + NOBhuntsLeft + ' hunts</option>';
                preferenceHTMLStr += '<option value="" disabled>--==Normal Bots==--</option>';
                preferenceHTMLStr += '<option value="FG/AR">FG => AR</option>';
                preferenceHTMLStr += '<option value="Zugzwang\'s Tower">Zugzwang\'s Tower</option>';
                preferenceHTMLStr += '<option value="BC/JOD">BC => JOD</option>';
                preferenceHTMLStr += '<option value="Fiery Warpath">Fiery Warpath</option>';
                preferenceHTMLStr += '<option value="Fiery Warpath Super">Fiery Warpath (Super charms)</option>';
                preferenceHTMLStr += '<option value="Iceberg (Wax)">Iceberg (Wax)</option>';
                preferenceHTMLStr += '<option value="Iceberg (Sticky)">Iceberg (Sticky)</option>';
                preferenceHTMLStr += '<option value="All LG Area">All LG Area</option>';
                preferenceHTMLStr += '<option value="Gnawnian Express(Empty)">Gnawnian Express(Empty)</option>';
                preferenceHTMLStr += '<option value="Gnawnian Express(Full)">Gnawnian Express(Full)</option>';
                preferenceHTMLStr += '<option value="Bristle Woods Rift">Bristle Woods Rift</option>';
                preferenceHTMLStr += '<option value="Burroughs Rift(Yellow)">Burroughs Rift(Yellow)</option>';
                preferenceHTMLStr += '<option value="Burroughs Rift(Green)">Burroughs Rift(Green)</option>';
                preferenceHTMLStr += '<option value="Burroughs Rift(Red)">Burroughs Rift(Red)</option>';
                preferenceHTMLStr += '<option value="WWRift">Whisker Woods Rift</option>';
                preferenceHTMLStr += '<option value="Furoma Rift">Furoma Rift</option>';
                preferenceHTMLStr += '<option value="Sunken City">Sunken City</option>';
                preferenceHTMLStr += '<option value="Labyrinth">Labyrinth</option>';
                preferenceHTMLStr += '<option value="Zokor">Zokor</option>';
                preferenceHTMLStr += '<option value="Fort Rox">Fort Rox</option>';
                //preferenceHTMLStr += '<option value="Labyrinth">Labyrinth</option>';
                preferenceHTMLStr += '<option value="" disabled>--==Event Bots==--</option>';
                preferenceHTMLStr += '<option value="Charge Egg 2016">Charge Egg 2016</option>';
                preferenceHTMLStr += '<option value="Charge Egg 2016(17)">Charge Egg 2016(17)</option>';
                preferenceHTMLStr += '<option value="Charge Egg 2014">Charge Egg 2014</option>';
                preferenceHTMLStr += '<option value="Charge Egg 2014(17)">Charge Egg 2014(17)</option>';
                preferenceHTMLStr += '<option value="Halloween 2014">Halloween 2014</option>';
                preferenceHTMLStr += '<option value="Halloween 2015">Halloween 2015</option>';
                preferenceHTMLStr += '<option value="Winter 2015">Winter 2015</option>';
                preferenceHTMLStr += '</select> Current Selection : ';
                preferenceHTMLStr += '<input type="text" id="event" name="event" value="' + eventLocation + '"/>';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                if (eventLocation == "Hunt For") {
                    preferenceHTMLStr += '<tr>';
                    preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                    preferenceHTMLStr += '<a title="Type in how many hunts you want to hunt for"><b>How many hunts?</b></a>';
                    preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '<td style="height:24px">';
                    preferenceHTMLStr += '<input type="number" id="nobHuntsLeftInput" name="nobHuntsLeftInput" value="' + NOBhuntsLeft + '" />';
                    preferenceHTMLStr += '</td>';
                    preferenceHTMLStr += '</tr>';
                }

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
                preferenceHTMLStr += '<a title="FOR DEVS ONLY" onclick="if(confirm(\'Are you sure you want to inject code?\'))$(\'#addonCode\').toggle();"><b>Click here if you would like to inject code.</b></a>';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '<td>';
                preferenceHTMLStr += '<textarea id="addonCode" name="addonCode" style="display:none;">';
                preferenceHTMLStr += addonCode;
                preferenceHTMLStr += '</textarea>';
                preferenceHTMLStr += '</td>';
                preferenceHTMLStr += '</tr>';

                preferenceHTMLStr += '<tr>';
                preferenceHTMLStr += '<td style="height:24px; text-align:right;" colspan="2">';
                preferenceHTMLStr += '(Changes only take place after user save the preference) ';
                preferenceHTMLStr += '<input type="button" id="PreferenceSaveInput" value="Save" onclick="	\
if (document.getElementById(\'AggressiveModeInputTrue\').checked == true) { window.localStorage.setItem(\'AggressiveMode\', \'true\'); } else { window.localStorage.setItem(\'AggressiveMode\', \'false\'); }	\
window.localStorage.setItem(\'HornTimeDelayMin\', document.getElementById(\'HornTimeDelayMinInput\').value); window.localStorage.setItem(\'HornTimeDelayMax\', document.getElementById(\'HornTimeDelayMaxInput\').value);	\
if (document.getElementById(\'TrapCheckInputTrue\').checked == true) { window.localStorage.setItem(\'TrapCheck\', \'true\'); } else { window.localStorage.setItem(\'TrapCheck\', \'false\'); }	\
window.localStorage.setItem(\'TrapCheckTimeOffset\', document.getElementById(\'TrapCheckTimeOffsetInput\').value);	\
window.localStorage.setItem(\'TrapCheckTimeDelayMin\', document.getElementById(\'TrapCheckTimeDelayMinInput\').value); window.localStorage.setItem(\'TrapCheckTimeDelayMax\', document.getElementById(\'TrapCheckTimeDelayMaxInput\').value);	\
if (document.getElementById(\'PlayKingRewardSoundInputTrue\').checked == true) { window.localStorage.setItem(\'PlayKingRewardSound\', \'true\'); } else { window.localStorage.setItem(\'PlayKingRewardSound\', \'false\'); }	\
if (document.getElementById(\'AutoSolveKRInputTrue\').checked == true) { window.localStorage.setItem(\'AutoSolveKR\', \'true\'); } else { window.localStorage.setItem(\'AutoSolveKR\', \'false\'); }	\
				window.localStorage.setItem(\'AutoSolveKRDelayMin\', document.getElementById(\'AutoSolveKRDelayMinInput\').value); window.localStorage.setItem(\'AutoSolveKRDelayMax\', document.getElementById(\'AutoSolveKRDelayMaxInput\').value);	\
window.localStorage.setItem(\'KingRewardSoundInput\', document.getElementById(\'KingRewardSoundInput\').value);	\
window.localStorage.setItem(\'KingRewardEmail\', document.getElementById(\'KingRewardEmail\').value);	\
if (document.getElementById(\'KingRewardResumeInputTrue\').checked == true) { window.localStorage.setItem(\'KingRewardResume\', \'true\'); } else { window.localStorage.setItem(\'KingRewardResume\', \'false\'); }	\
window.localStorage.setItem(\'KingRewardResumeTime\', document.getElementById(\'KingRewardResumeTimeInput\').value);	\
if (document.getElementById(\'PauseLocationInputTrue\').checked == true) { window.localStorage.setItem(\'PauseLocation\', \'true\'); } else { window.localStorage.setItem(\'PauseLocation\', \'false\'); }	\
if (document.getElementById(\'autopopkrTrue\').checked == true) { window.localStorage.setItem(\'autoPopupKR\', \'true\'); } else { window.localStorage.setItem(\'autoPopupKR\', \'false\'); }	\
if (document.getElementById(\'nobHuntsLeftInput\')) { window.localStorage.setItem(\'NOB-huntsLeft\', document.getElementById(\'nobHuntsLeftInput\').value); } \
window.localStorage.setItem(\'addonCode\', document.getElementById(\'addonCode\').value);\
';
                if (fbPlatform) {
                    if (secureConnection)
                        preferenceHTMLStr += 'window.location.href=\'https://www.mousehuntgame.com/canvas/\';"/>';
                    else
                        preferenceHTMLStr += 'window.location.href=\'http://www.mousehuntgame.com/canvas/\';"/>';
                } else if (hiFivePlatform) {
                    if (secureConnection)
                        preferenceHTMLStr += 'window.location.href=\'https://mousehunt.hi5.hitgrab.com/\';"/>';
                    else
                        preferenceHTMLStr += 'window.location.href=\'http://mousehunt.hi5.hitgrab.com/\';"/>';
                } else if (mhPlatform) {
                    if (secureConnection)
                        preferenceHTMLStr += 'window.location.href=\'https://www.mousehuntgame.com/\';"/>';
                    else
                        preferenceHTMLStr += 'window.location.href=\'http://www.mousehuntgame.com/\';"/>';
                }
                preferenceHTMLStr += '&nbsp;&nbsp;&nbsp;</td>';
                preferenceHTMLStr += '</tr>';
                preferenceHTMLStr += '</table>';

                var NOBspecialMessageDiv = document.createElement('div');
                NOBspecialMessageDiv.setAttribute('id', 'nobSpecialMessage');
                NOBspecialMessageDiv.setAttribute('style', 'display: block; position: fixed; bottom: 0; z-index: 999; text-align: center; width: 760px;');

                //var nobWhatsNewDiv = document.createElement('div');
                //nobWhatsNewDiv.setAttribute('id', 'nobWhatsNew');
                //nobWhatsNewDiv.setAttribute('style', 'display: block; position: fixed; bottom: 0; left: 0; z-index: 999; text-align: left; width: 200px; height: 100px; padding: 10px 0 10px 10px;');

                var nobWhatsNewDiv = document.createElement('div');
                nobWhatsNewDiv.innerHTML = "<style>" +
                    "@-webkit-keyframes colorRotate {" +
                    "from {color: rgb(255, 0, 0);}" +
                    "16.6% {color: rgb(255, 0, 255);}" +
                    "33.3% {color: rgb(0, 0, 255);}" +
                    "50% {color: rgb(0, 255, 255);}" +
                    "66.6% {color: rgb(0, 255, 0);}" +
                    "83.3% {color: rgb(255, 255, 0);}" +
                    "to {color: rgb(255, 0, 0);}" +

                    "@-moz-keyframes colorRotate {" +
                    "from {color: rgb(255, 0, 0);}" +
                    "16.6% {color: rgb(255, 0, 255);}" +
                    "33.3% {color: rgb(0, 0, 255);}" +
                    "50% {color: rgb(0, 255, 255);}" +
                    "66.6% {color: rgb(0, 255, 0);}" +
                    "83.3% {color: rgb(255, 255, 0);}" +
                    "to {color: rgb(255, 0, 0);}" +

                    "@-o-keyframes colorRotate {" +
                    "from {color: rgb(255, 0, 0);}" +
                    "16.6% {color: rgb(255, 0, 255);}" +
                    "33.3% {color: rgb(0, 0, 255);}" +
                    "50% {color: rgb(0, 255, 255);}" +
                    "66.6% {color: rgb(0, 255, 0);}" +
                    "83.3% {color: rgb(255, 255, 0);}" +
                    "to {color: rgb(255, 0, 0);}" +

                    "@keyframes colorRotate {" +
                    "from {color: rgb(255, 0, 0);}" +
                    "16.6% {color: rgb(255, 0, 255);}" +
                    "33.3% {color: rgb(0, 0, 255);}" +
                    "50% {color: rgb(0, 255, 255);}" +
                    "66.6% {color: rgb(0, 255, 0);}" +
                    "83.3% {color: rgb(255, 255, 0);}" +
                    "to {color: rgb(255, 0, 0);}" +
                    "</style>";

                var preferenceDiv = document.createElement('div');
                preferenceDiv.setAttribute('id', 'preferenceDiv');
                if (showPreference == true)
                    preferenceDiv.setAttribute('style', 'display: block');
                else
                    preferenceDiv.setAttribute('style', 'display: none');
                preferenceDiv.innerHTML = preferenceHTMLStr;
                timerDivElement.appendChild(preferenceDiv);
                timerDivElement.appendChild(NOBspecialMessageDiv);
                timerDivElement.appendChild(nobWhatsNewDiv);
                preferenceHTMLStr = null;
                showPreference = null;

                var hr3Element = document.createElement('hr');
                preferenceDiv.appendChild(hr3Element);
                hr3Element = null;
                preferenceDiv = null;
                NOBspecialMessageDiv = null;
                nobWhatsNewDiv = null;

                // embed all msg to the page
                headerElement.parentNode.insertBefore(timerDivElement, headerElement);
                timerDivElement = null;
            }
            headerElement = null;
        }

        targetPage = null;
    } catch (e) {
        if (debug) console.log('embedTimer error - ' + e)
    }
}

function loadPreferenceSettingFromStorage() {
    var aggressiveModeTemp = getStorage("AggressiveMode");
    if (aggressiveModeTemp == undefined || aggressiveModeTemp == null) {
        setStorage("AggressiveMode", aggressiveMode.toString());
    } else if (aggressiveModeTemp == true || aggressiveModeTemp.toLowerCase() == "true") {
        aggressiveMode = true;
    } else {
        aggressiveMode = false;
    }
    aggressiveModeTemp = undefined;

    var hornTimeDelayMinTemp = getStorage("HornTimeDelayMin");
    var hornTimeDelayMaxTemp = getStorage("HornTimeDelayMax");
    if (hornTimeDelayMinTemp == undefined || hornTimeDelayMinTemp == null || hornTimeDelayMaxTemp == undefined || hornTimeDelayMaxTemp == null) {
        setStorage("HornTimeDelayMin", hornTimeDelayMin);
        setStorage("HornTimeDelayMax", hornTimeDelayMax);
    } else {
        hornTimeDelayMin = parseInt(hornTimeDelayMinTemp);
        hornTimeDelayMax = parseInt(hornTimeDelayMaxTemp);
    }
    hornTimeDelayMinTemp = undefined;
    hornTimeDelayMaxTemp = undefined;

    var trapCheckTemp = getStorage("TrapCheck");
    if (trapCheckTemp == undefined || trapCheckTemp == null) {
        setStorage("TrapCheck", enableTrapCheck.toString());
    } else if (trapCheckTemp == true || trapCheckTemp.toLowerCase() == "true") {
        enableTrapCheck = true;
    } else {
        enableTrapCheck = false;
    }
    trapCheckTemp = undefined;

    var trapCheckTimeOffsetTemp = getStorage("TrapCheckTimeOffset");
    if (trapCheckTimeOffsetTemp == undefined || trapCheckTimeOffsetTemp == null) {
        setStorage("TrapCheckTimeOffset", trapCheckTimeDiff);
    } else {
        trapCheckTimeDiff = parseInt(trapCheckTimeOffsetTemp);
    }
    trapCheckTimeOffsetTemp = undefined;

    var trapCheckTimeDelayMinTemp = getStorage("TrapCheckTimeDelayMin");
    var trapCheckTimeDelayMaxTemp = getStorage("TrapCheckTimeDelayMax");
    if (trapCheckTimeDelayMinTemp == undefined || trapCheckTimeDelayMinTemp == null || trapCheckTimeDelayMaxTemp == undefined || trapCheckTimeDelayMaxTemp == null) {
        setStorage("TrapCheckTimeDelayMin", checkTimeDelayMin);
        setStorage("TrapCheckTimeDelayMax", checkTimeDelayMax);
    } else {
        checkTimeDelayMin = parseInt(trapCheckTimeDelayMinTemp);
        checkTimeDelayMax = parseInt(trapCheckTimeDelayMaxTemp);
    }
    trapCheckTimeDelayMinTemp = undefined;
    trapCheckTimeDelayMaxTemp = undefined;

    var playKingRewardSoundTemp = getStorage("PlayKingRewardSound");
    if (playKingRewardSoundTemp == undefined || playKingRewardSoundTemp == null) {
        setStorage("PlayKingRewardSound", isKingWarningSound.toString());
    } else if (playKingRewardSoundTemp == true || playKingRewardSoundTemp.toLowerCase() == "true") {
        isKingWarningSound = true;
    } else {
        isKingWarningSound = false;
    }
    playKingRewardSoundTemp = undefined;

    var kingRewardSoundTemp = getStorage('KingRewardSoundInput');
    if (kingRewardSoundTemp == undefined || kingRewardSoundTemp == null || kingRewardSoundTemp == "") {
        kingRewardSoundTemp = 'https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/horn.mp3';
        setStorage('KingRewardSoundInput', kingWarningSound);
    } else {
        kingWarningSound = kingRewardSoundTemp;
    }
    kingRewardSoundTemp = undefined;

    var kingRewardEmailTemp = getStorage('KingRewardEmail');
    if (kingRewardEmailTemp == undefined || kingRewardEmailTemp == null || kingRewardEmailTemp == "") {
        kingRewardEmailTemp = '';
        setStorage('KingRewardEmail', '');
    } else {
        kingRewardEmail = kingRewardEmailTemp;
    }
    kingRewardEmailTemp = undefined;

    var kingRewardResumeTemp = getStorage("KingRewardResume");
    if (kingRewardResumeTemp == undefined || kingRewardResumeTemp == null) {
        setStorage("KingRewardResume", reloadKingReward.toString());
    } else if (kingRewardResumeTemp == true || kingRewardResumeTemp.toLowerCase() == "true") {
        reloadKingReward = true;
    } else {
        reloadKingReward = false;
    }
    kingRewardResumeTemp = undefined;

    var kingRewardResumeTimeTemp = getStorage("KingRewardResumeTime");
    if (kingRewardResumeTimeTemp == undefined || kingRewardResumeTimeTemp == null) {
        setStorage("KingRewardResumeTime", kingPauseTimeMax);
    } else {
        kingPauseTimeMax = parseInt(kingRewardResumeTimeTemp);
    }
    kingRewardResumeTimeTemp = undefined;

    var pauseLocationTemp = getStorage("PauseLocation");
    if (pauseLocationTemp == undefined || pauseLocationTemp == null) {
        setStorage("PauseLocation", pauseAtInvalidLocation.toString());
    } else if (pauseLocationTemp == true || pauseLocationTemp.toLowerCase() == "true") {
        pauseAtInvalidLocation = true;
    } else {
        pauseAtInvalidLocation = false;
    }
    pauseLocationTemp = undefined;

    var autopopkrTemp = getStorage("autoPopupKR");
    if (autopopkrTemp == undefined || autopopkrTemp == null) {
        setStorage("autoPopupKR", autoPopupKR.toString());
    } else if (autopopkrTemp == true || autopopkrTemp.toLowerCase() == "true") {
        autoPopupKR = true;
    } else {
        autoPopupKR = false;
    }
    autopopkrTemp = undefined;

    var addonCodeTemp = getStorage("addonCode");
    if (addonCodeTemp == undefined || addonCodeTemp === null || addonCodeTemp == "" || addonCodeTemp == "null") {
        setStorage('addonCode', "");
    }
    addonCode = addonCodeTemp;

    addonCodeTemp = undefined;

    // nobTrapCounter to only refetch all traps when counter hits 0
    var nobTrapsTemp = nobGet('traps');
    var nobTrapsTempCounter = getStorage('nobTrapsCounter');
    if (nobTrapsTempCounter == undefined || nobTrapsTempCounter === null) {
        nobTrapsTempCounter = 1000;
    }
    if (nobTrapsTempCounter > 0 && nobTrapsTempCounter < 501) {
        if (!(nobTrapsTemp == undefined || nobTrapsTemp === null)) {
            NOBtraps = JSON.parse(nobTrapsTemp);
        }

        setStorage('nobTrapsCounter', nobTrapsTempCounter - 1);
    } else {
        NOBtraps = [];
        setStorage('nobTrapsCounter', 500);
    }
    nobTrapsTemp = undefined;
    nobTrapsTempCounter = undefined;

    var nobHuntsLeft = parseInt(nobGet('huntsLeft'));
    if (nobHuntsLeft > NOBhuntsLeft)
        NOBhuntsLeft = nobHuntsLeft;
    nobHuntsLeft = undefined;

    var dischargeTemp = getStorage("discharge");
    if (dischargeTemp == undefined || dischargeTemp == null) {
        setStorage("discharge", true.toString());
    } else if (dischargeTemp == true || dischargeTemp.toLowerCase() == "true") {
        discharge = true;
    } else {
        discharge = false;
    }
    dischargeTemp = undefined;

    var eventTemp = getStorage('eventLocation');
    if (eventTemp == undefined || eventTemp == null) {
        setStorage('eventLocation', 'None');
        eventTemp = getStorage('eventLocation');
    }
    eventLocation = eventTemp;
    eventTemp = undefined;

    isAutoSolve = getStorageToVariableBool("AutoSolveKR", isAutoSolve);
    krDelayMin = getStorageToVariableInt("AutoSolveKRDelayMin", krDelayMin);
    krDelayMax = getStorageToVariableInt("AutoSolveKRDelayMax", krDelayMax);
    kingsRewardRetry = getStorageToVariableInt("KingsRewardRetry", kingsRewardRetry);
}

function getStorageToVariableInt(storageName, defaultInt) {
    var temp = getStorage(storageName);
    var tempInt = defaultInt;
    if (temp == undefined || temp == null) {
        setStorage(storageName, defaultInt);
    } else {
        tempInt = parseInt(temp);
    }
    return tempInt;
}

function getStorageToVariableBool(storageName, defaultBool) {
    var temp = getStorage(storageName);
    if (temp == undefined || temp == null) {
        setStorage(storageName, defaultBool.toString());
        return defaultBool;
    } else if (temp == true || temp.toLowerCase() == "true") {
        return true;
    } else {
        return false;
    }
}

function displayTimer(title, nextHornTime, checkTime) {
    if (showTimerInTitle) {
        document.title = title;
    }

    if (showTimerInPage) {
        nextHornTimeElement.innerHTML = "<b>Next Hunter Horn Time:</b> " + nextHornTime;
        checkTimeElement.innerHTML = "<b>Next Trap Check Time:</b> " + checkTime;
    }

    title = null;
    nextHornTime = null;
    checkTime = null;
}

function displayLocation(locStr) {
    if (showTimerInPage && pauseAtInvalidLocation) {
        travelElement.innerHTML = "<b>Hunt Location:</b> " + locStr;
    }

    locStr = null;
}

function displayKingRewardSumTime(timeStr) {
    if (showTimerInPage) {
        if (timeStr) {
            lastKingRewardSumTimeElement.innerHTML = "(" + timeStr + ")";
        } else {
            lastKingRewardSumTimeElement.innerHTML = "";
        }
    }

    timeStr = null;
}

function doubleCheckLocation() { //return true if location is camp page (this is to combat ajax loads)
    if (!isNewUI) {
        return true;
    }

    var thePage = $('#mousehuntContainer')[0];
    if (thePage) {
        return (thePage.className == "PageCamp");
    } else {
        return false;
    }
}

// ################################################################################################
//   Timer Function - End
// ################################################################################################

// ################################################################################################
//   Ad Function - Start
// ################################################################################################

function addGoogleAd() {
    // search for existing ad element and remove it
    try {
        if (debug) console.log('Trying to get rid of ad iFrame');
        var adFrame = document.getElementsByClassName('googleAd')[0];
        var allowAds = getStorage('allowAds');
        if (allowAds != null && allowAds != undefined && allowAds != "" && allowAds != "false" && allowAds != false) {
            allowAds = true;
        } else {
            allowAds = false;
            setStorage('allowAds', 'false');
        }

        if (!NOBadFree) {
            NOBadFree = nobGet('adFree');
            NOBadFree = (NOBadFree == true || NOBadFree == "true");
        }

        if (debug) console.log('addGoogleAd' + NOBadFree + allowAds);
        if (adFrame) {
            adFrame.removeChild(adFrame.firstChild);
            if (!NOBadFree && allowAds) {
                /*var newAd = document.createElement('script');
                 newAd.type = 'text/javascript';
                 newAd.src = '//eclkmpbn.com/adServe/banners?tid=58849_91032_3';
                 adFrame.appendChild(document.createElement('center'));
                 adFrame.firstChild.appendChild(newAd);*/

                var newAd = document.createElement('div');
                newAd.style.height = "560px";
                adFrame.appendChild(document.createElement('center'));
                adFrame.firstChild.appendChild(newAd);
                var newAdScript = document.createElement('script');
                newAdScript.src = "//pagead2.google" + "syndication.com/" + "pagead/js/adsbygoogle" + ".js";
                newAd.innerHTML = "<ins class=\"adsbygoogle\" " +
                    "style=\"display:block\" " +
                    "data-" + "ad" + "-client=\"ca-pub-" + "3255634416502948\" " +
                    "data-" + "ad-" + "slot=\"2618509310\" data-" + "ad" + "-format=\"auto\"></ins>";
                newAd.appendChild(newAdScript);
                (adsbygoogle = window.adsbygoogle || []).push({});

                var removeAdButton = document.createElement('a');
                removeAdButton.id = 'removeAdLink';
                removeAdButton.href = 'https://www.mousehuntgame.com/index.php';
                removeAdButton.innerHTML = 'Click here to remove ads :*(';
                adFrame.firstChild.appendChild(removeAdButton);

                removeAdButton = null;
                newAd = null;
            } else if (!NOBadFree) {
                adFrame.innerHTML = "<a id=\"addAdLink\" href=\"#\" style=\"-webkit-animation: colorRotate 6s linear 0s infinite; -moz-animation: colorRotate 6s linear 0s infinite; -o-animation: colorRotate 6s linear 0s infinite; animation: colorRotate 6s linear 0s infinite; font-weight: bolder; text-align: center;\">Click here to show ads to support the development of this bot :)</a>";
            } else {
                console.debug("Thanks for donating ^.^");
                adFrame.innerHTML = "";
            }
        }
        adFrame = null;
        allowAds = null;
    } catch (e) {
        console.log('Remove ad error: ' + e);
    }
}

// ################################################################################################
//   Ad Function - End
// ################################################################################################

// ################################################################################################
//   Horn Function - Start
// ################################################################################################

function soundHorn() {
    if (!isNewUI || doubleCheckLocation()) {
        // update timer
        displayTimer("Ready to Blow The Horn...", "Ready to Blow The Horn...", "Ready to Blow The Horn...");

        var hornElement;
        var scriptNode = document.getElementById("scriptNode");
        if (scriptNode) {
            scriptNode.setAttribute("soundedHornAtt", "false");
        }
        scriptNode = null;

        if (!aggressiveMode) {
            // safety mode, check the horn image is there or not before sound the horn
            var headerElement = document.getElementById(header);

            if (headerElement) {
                if (isNewUI)
                    headerElement = headerElement.firstChild;
                // need to make sure that the horn image is ready before we can click on it
                var headerStatus = headerElement.getAttribute('class');
                if (headerStatus.indexOf(hornReady) != -1) {
                    // found the horn image, let's sound the horn!

                    // update timer
                    displayTimer("Blowing The Horn...", "Blowing The Horn...", "Blowing The Horn...");

                    // simulate mouse click on the horn
                    hornElement = document.getElementsByClassName(hornButton)[0].firstChild;
                    fireEvent(hornElement, 'click');
                    hornElement = null;

                    // NOB hunt until
                    NOBhuntsLeft--;
                    nobStore(NOBhuntsLeft, 'huntsLeft');

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // double check if the horn was already sounded
                    window.setTimeout(function () {
                        afterSoundingHorn()
                    }, 5000);
                } else if (headerStatus.indexOf("hornsounding") != -1 || headerStatus.indexOf("hornsounded") != -1) {
                    // some one just sound the horn...

                    // update timer
                    displayTimer("Synchronizing Data...", "Someone had just sound the horn. Synchronizing data...", "Someone had just sound the horn. Synchronizing data...");

                    // NOB hunt until
                    NOBhuntsLeft--;
                    nobStore(NOBhuntsLeft, 'huntsLeft');

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // load the new data
                    window.setTimeout(function () {
                        afterSoundingHorn()
                    }, 5000);
                } else if (headerStatus.indexOf("hornwaiting") != -1) {
                    // the horn is not appearing, let check the time again

                    // update timer
                    displayTimer("Synchronizing Data...", "Hunter horn is not ready yet. Synchronizing data...", "Hunter horn is not ready yet. Synchronizing data...");

                    // sync the time again, maybe user already click the horn
                    retrieveData();

                    checkJournalDate();

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // loop again
                    window.setTimeout(function () {
                        countdownTimer()
                    }, timerRefreshInterval * 1000);
                } else {
                    // some one steal the horn!

                    // update timer
                    displayTimer("Synchronizing Data...", "Hunter horn is missing. Synchronizing data...", "Hunter horn is missing. Synchronizing data...");

                    // try to click on the horn
                    hornElement = document.getElementsByClassName(hornButton)[0].firstChild;
                    fireEvent(hornElement, 'click');
                    hornElement = null;

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // double check if the horn was already sounded
                    window.setTimeout(function () {
                        afterSoundingHorn()
                    }, 5000);
                }
            } else {
                // something wrong, can't even found the header...

                // clean up
                headerElement = null;

                // reload the page see if thing get fixed
                reloadWithMessage("Fail to find the horn header. Reloading...", false);
            }

        } else {
            // aggressive mode, ignore whatever horn image is there or not, just sound the horn!

            // simulate mouse click on the horn
            fireEvent(document.getElementsByClassName(hornButton)[0].firstChild, 'click');

            // double check if the horn was already sounded
            window.setTimeout(function () {
                afterSoundingHorn()
            }, 3000);
        }
    } else {
        document.getElementById('titleElement').parentNode.remove();
        embedTimer(false);
    }
}

function afterSoundingHorn() {
    if (debug) console.log("Run afterSoundingHorn()");
    var scriptNode = document.getElementById("scriptNode");
    if (scriptNode) {
        scriptNode.setAttribute("soundedHornAtt", "false");
    }
    scriptNode = null;

    var headerElement = document.getElementById(header);
    if (headerElement) {
        if (isNewUI)
            headerElement = headerElement.firstChild;
        // double check if the horn image is still visible after the script already sound it
        var headerStatus = headerElement.getAttribute('class');
        if (headerStatus.indexOf(hornReady) != -1) {
            // seen like the horn is not functioning well

            // update timer
            displayTimer("Blowing The Horn Again...", "Blowing The Horn Again...", "Blowing The Horn Again...");

            // simulate mouse click on the horn
            var hornElement = document.getElementsByClassName(hornButton)[0].firstChild;
            fireEvent(hornElement, 'click');
            hornElement = null;

            // clean up
            headerElement = null;
            headerStatus = null;

            // increase the horn retry counter and check if the script is caught in loop
            ++hornRetry;
            if (hornRetry > hornRetryMax) {
                // reload the page see if thing get fixed
                reloadWithMessage("Detected script caught in loop. Reloading...", true);

                // reset the horn retry counter
                hornRetry = 0;
            } else {
                // check again later
                window.setTimeout(function () {
                    afterSoundingHorn()
                }, 1000);
            }
        } else if (headerStatus.indexOf("hornsounding") != -1) {
            // the horn is already sound, but the network seen to slow on fetching the data

            // update timer
            displayTimer("The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...", "The horn sounding taken extra longer than normal...");

            // clean up
            headerElement = null;
            headerStatus = null;

            // increase the horn retry counter and check if the script is caugh in loop
            ++hornRetry;
            if (hornRetry > hornRetryMax) {
                // reload the page see if thing get fixed
                reloadWithMessage("Detected script caught in loop. Reloading...", true);

                // reset the horn retry counter
                hornRetry = 0;
            } else {
                // check again later
                window.setTimeout(function () {
                    afterSoundingHorn()
                }, 3000);
            }
        } else {
            // everything look ok

            // update timer
            displayTimer("Horn sounded. Synchronizing Data...", "Horn sounded. Synchronizing data...", "Horn sounded. Synchronizing data...");

            // reload data
            retrieveData();

            // clean up
            headerElement = null;
            headerStatus = null;

            // script continue as normal
            window.setTimeout(function () {
                countdownTimer()
            }, timerRefreshInterval * 1000);

            // reset the horn retry counter
            hornRetry = 0;
        }
    }
    eventLocationCheck();
}

function embedScript() {
    // create a javascript to detect if user click on the horn manually
    var scriptNode = document.createElement('script');
    scriptNode.setAttribute('id', 'scriptNode');
    scriptNode.setAttribute('type', 'text/javascript');
    scriptNode.setAttribute('soundedHornAtt', 'false');
    scriptNode.innerHTML = 'function soundedHorn() {\
    var scriptNode = document.getElementById("scriptNode");\
    if (scriptNode) {\
    	scriptNode.setAttribute("soundedHornAtt", "true");\
    }\
    scriptNode = null;\
    }';

    // find the head node and insert the script into it
    var headerElement;
    if (fbPlatform || hiFivePlatform || mhPlatform) {
        headerElement = document.getElementById('noscript');
    } else if (mhMobilePlatform) {
        headerElement = document.getElementById('mobileHorn');
    }
    headerElement.parentNode.insertBefore(scriptNode, headerElement);
    scriptNode = null;
    headerElement = null;

    nobTestBetaUI();

    // change the function call of horn
    var hornButtonLink = document.getElementsByClassName(hornButton)[0].firstChild;
    var oriStr = hornButtonLink.getAttribute('onclick').toString();
    var index = oriStr.indexOf('return false;');
    var modStr = oriStr.substring(0, index) + 'soundedHorn();' + oriStr.substring(index);
    hornButtonLink.setAttribute('onclick', modStr);

    hornButtonLink = null;
    oriStr = null;
    index = null;
    modStr = null;
}

function nobTestBetaUI() { // Return true if beta UI
    header = 'header';
    var testNewUI = document.getElementById(header);
    if (testNewUI != null) {
        // old UI
        hornButton = 'hornbutton';
        campButton = 'campbutton';
        header = 'header';
        hornReady = 'hornready';
        isNewUI = false;
        return false;
    } else {
        // new UI
        hornButton = 'mousehuntHud-huntersHorn-container';
        campButton = 'camp';
        header = 'mousehuntHud';
        hornReady = 'hornReady';
        isNewUI = true;
        return true;
    }
    testNewUI = null;
}

// ################################################################################################
//   Horn Function - End
// ################################################################################################

// ################################################################################################
//   No Cheese Function - Start
// ################################################################################################
function noCheeseAction() {
    notifyMe("No more cheese!!!", 'https://raw.githubusercontent.com/nobodyrandom/mhAutobot/master/resource/cheese.png', getPageVariable('user.username') + ' has no more cheese.');

    playNoCheeseSound();
}

function playNoCheeseSound() {
    if (isNoCheeseSound) {
        unsafeWindow.hornAudio = new Audio(kingWarningSound);
        unsafeWindow.hornAudio.loop = true;
        unsafeWindow.hornAudio.play();
        var targetArea = document.getElementsByTagName('body');
        var child = document.createElement('button');
        child.setAttribute('id', "stopAudio");
        child.setAttribute('style', 'position: fixed; bottom: 0;');
        child.setAttribute('onclick', 'hornAudio.pause();');
        child.innerHTML = "CLICK ME TO STOP THIS ANNOYING MUSIC";
        targetArea[0].appendChild(child);
        targetArea = null;
        child = null;
        snippet = null;
    }
}

// ################################################################################################
//   No Cheese Function - End
// ################################################################################################

// ################################################################################################
//   King's Reward Function - Start
// ################################################################################################

/*function kingRewardAction() {
 // update timer
 displayTimer("King's Reward!", "King's Reward", "King's Reward!");
 displayLocation("-");

 // play music if needed
 playKingRewardSound();

 window.setTimeout(function () {
 // Autopop KR if needed
 if (autoPopupKR) {
 alert("King's Reward NOW");
 }

 // email the captcha away if needed
 emailCaptcha();
 }, 2000);

 // focus on the answer input
 var inputElementList = document.getElementsByTagName('input');
 if (inputElementList) {
 var i;
 for (i = 0; i < inputElementList.length; ++i) {
 // check if it is a resume button
 if (inputElementList[i].getAttribute('name') == "puzzle_answer") {
 inputElementList[i].focus();
 break;
 }
 }
 i = null;
 }
 inputElementList = null;

 // record last king's reward time
 var nowDate = new Date();
 setStorage("lastKingRewardDate", nowDate.toString());
 nowDate = null;

 if (kingPauseTimeMax <= 0) {
 kingPauseTimeMax = 1;
 }

 kingPauseTime = kingPauseTimeMax;
 kingRewardCountdownTimer();
 }*/

function kingRewardAction() {
    // update timer
    displayTimer("King's Reward!", "King's Reward", "King's Reward!");
    displayLocation("-");

    // play music if needed
    playKingRewardSound();

    window.setTimeout(function () {
        // Autopop KR if needed
        if (autoPopupKR) {
            alert("King's Reward NOW");
        }

        // email the captcha away if needed
        emailCaptcha();
    }, 2000);

    // focus on the answer input
    var inputElementList = document.getElementsByTagName('input');
    if (inputElementList) {
        var i;
        for (i = 0; i < inputElementList.length; ++i) {
            // check if it is a resume button
            if (inputElementList[i].getAttribute('name') == "puzzle_answer") {
                inputElementList[i].focus();
                break;
            }
        }
        i = null;
    }
    inputElementList = null;

    // record last king's reward time
    var nowDate = new Date();
    setStorage("lastKingRewardDate", nowDate.toString());

    if (!isAutoSolve)
        return;

    var krDelaySec = krDelayMin + Math.floor(Math.random() * (krDelayMax - krDelayMin));
    var krStopHourNormalized = krStopHour;
    var krStartHourNormalized = krStartHour;
    if (krStopHour > krStartHour) { // e.g. Stop to Start => 22 to 06
        var offset = 24 - krStopHour;
        krStartHourNormalized = krStartHour + offset;
        krStopHourNormalized = 0;
        nowDate.setHours(nowDate.getHours() + offset);
    }

    if (nowDate.getHours() >= krStopHourNormalized && nowDate.getHours() < krStartHourNormalized) {
        var krDelayMinute = krStartHourDelayMin + Math.floor(Math.random() * (krStartHourDelayMax - krStartHourDelayMin));
        krDelaySec += krStartHour * 3600 - (nowDate.getHours() * 3600 + nowDate.getMinutes() * 60 + nowDate.getSeconds());
        krDelaySec += krDelayMinute * 60;
        var timeNow = new Date();
        setStorage("Time to start delay", timeNow.toString());
        setStorage("Delay time", timeformat(krDelaySec))
        kingRewardCountdownTimer(krDelaySec, true);
    } else {
        if (kingsRewardRetry > kingsRewardRetryMax)
            krDelaySec /= (kingsRewardRetry * 2);
        kingRewardCountdownTimer(krDelaySec, false);
    }
}

function emailCaptcha() {
    if (kingRewardEmail != null && kingRewardEmail != undefined && kingRewardEmail != "") {
        if (debug) console.log('Attempting to email captcha via Parse now.');
        var un = getPageVariable('user.username');
        if (un == undefined) un = "";

        Parse.initialize("mh-autobot", "unused");
        Parse.serverURL = 'https://mh-autobot.herokuapp.com/parse';

        Parse.Cloud.run('sendKRemail', {
            theEmail: kingRewardEmail,
            user: un
        }, {
            success: function (data) {
                if (debug) console.log(data);
            }, error: function (error) {
                if (debug) console.log(error);
            }
        });
    }
}

function notifyMe(notice, icon, body) {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        var notification = new Notification(notice, {'icon': icon, 'body': body});

        notification.onclick = function () {
            window.open("https://www.mousehuntgame.com/");
            notification.close();
        }

        notification.onshow = function () {
            setTimeout(function () {
                notification.close();
            }, 5000);
        }
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // Whatever the user answers, we make sure we store the information
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }

            // If the user is okay, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(notice, {'icon': icon, 'body': body});

                notification.onclick = function () {
                    window.open("https://www.mousehuntgame.com/");
                    notification.close();
                }

                notification.onshow = function () {
                    setTimeout(function () {
                        notification.close();
                    }, 5000);
                }
            }
        });
    }
}

function playKingRewardSound() {
    if (isKingWarningSound) {
        unsafeWindow.hornAudio = new Audio(kingWarningSound);
        unsafeWindow.hornAudio.loop = true;
        unsafeWindow.hornAudio.play();
        var targetArea = document.getElementsByTagName('body');
        var child = document.createElement('button');
        child.setAttribute('id', "stopAudio");
        child.setAttribute('style', 'position: fixed; bottom: 0;');
        child.setAttribute('onclick', 'hornAudio.pause();');
        child.innerHTML = "CLICK ME TO STOP THIS ANNOYING MUSIC";
        targetArea[0].appendChild(child);
        targetArea = null;
        child = null;
        snippet = null;
    }
}

/*function kingRewardCountdownTimer() {
 var dateNow = new Date();
 var intervalTime = timeElapsed(lastDateRecorded, dateNow);
 lastDateRecorded = null;
 lastDateRecorded = dateNow;
 dateNow = null;

 if (reloadKingReward) {
 kingPauseTime -= intervalTime;
 }

 if (lastKingRewardSumTime != -1) {
 lastKingRewardSumTime += intervalTime;
 }

 intervalTime = null;

 if (kingPauseTime <= 0) {
 // update timer
 displayTimer("King's Reward - Reloading...", "Reloading...", "Reloading...");

 // simulate mouse click on the camp button
 var campElement = document.getElementsByClassName(campButton)[0].firstChild;
 fireEvent(campElement, 'click');
 campElement = null;

 // reload the page if click on the camp button fail
 window.setTimeout(function () {
 reloadWithMessage("Fail to click on camp button. Reloading...", false);
 }, 5000);
 } else {
 if (reloadKingReward) {
 // update timer
 displayTimer("King's Reward - Reload in " + timeformat(kingPauseTime),
 "Reloading in " + timeformat(kingPauseTime),
 "Reloading in " + timeformat(kingPauseTime));
 }

 // set king reward sum time
 displayKingRewardSumTime(timeFormatLong(lastKingRewardSumTime));

 if (!checkResumeButton()) {
 window.setTimeout(function () {
 (kingRewardCountdownTimer)()
 }, timerRefreshInterval * 1000);
 }
 }
 }*/

function kingRewardCountdownTimer(interval, isReloadToSolve) {
    var strTemp = (isReloadToSolve) ? "Reload to solve KR in " : "Solve KR in (extra few sec delay) ";
    strTemp = strTemp + timeformat(interval);
    displayTimer(strTemp, strTemp, strTemp);
    strTemp = null;
    interval -= timerRefreshInterval;
    if (interval < 0) {
        if (isReloadToSolve) {
            // simulate mouse click on the camp button
            var campElement = document.getElementsByClassName(strCampButton)[0].firstChild;
            fireEvent(campElement, 'click');
            campElement = null;

            // reload the page if click on the camp button fail
            window.setTimeout(function () {
                reloadWithMessage("Fail to click on camp button. Reloading...", false);
            }, 5000);
        } else {
            var intervalCRB = setInterval(
                function () {
                    if (checkResumeButton()) {
                        clearInterval(intervalCRB);
                        intervalCRB = null;
                        return;
                    }
                }, 1000);
            CallKRSolver();
        }
    } else {
        if (!checkResumeButton()) {
            window.setTimeout(function () {
                kingRewardCountdownTimer(interval, isReloadToSolve);
            }, timerRefreshInterval * 1000);
        }
    }
}

function checkResumeButton() {
    var found = false;
    var resumeElement;

    if (isNewUI) {
        var krFormClass = document.getElementsByTagName('form')[0].className;
        if (krFormClass.indexOf("noPuzzle") > -1) {
            // found resume button

            // simulate mouse click on the resume button
            resumeElement = document.getElementsByClassName('mousehuntPage-puzzle-form-complete-button')[0];
            fireEvent(resumeElement, 'click');
            resumeElement = null;

            // reload url if click fail
            window.setTimeout(function () {
                reloadWithMessage("Fail to click on resume button. Reloading...", false);
            }, 6000);

            // recheck if the resume button is click because some time even the url reload also fail
            window.setTimeout(function () {
                checkResumeButton();
            }, 10000);

            found = true;
        }
        krFormClass = null;
    } else {
        var linkElementList = document.getElementsByTagName('img');
        if (linkElementList) {
            var i;
            for (i = 0; i < linkElementList.length; ++i) {
                // check if it is a resume button
                if (linkElementList[i].getAttribute('src').indexOf("resume_hunting_blue.gif") != -1) {
                    // found resume button

                    // simulate mouse click on the horn
                    resumeElement = linkElementList[i].parentNode;
                    fireEvent(resumeElement, 'click');
                    resumeElement = null;

                    // reload url if click fail
                    window.setTimeout(function () {
                        reloadWithMessage("Fail to click on resume button. Reloading...", false);
                    }, 6000);

                    // recheck if the resume button is click because some time even the url reload also fail
                    window.setTimeout(function () {
                        checkResumeButton();
                    }, 10000);

                    found = true;
                    break;
                }
            }
            i = null;
        }
    }

    linkElementList = null;

    try {
        return (found);
    } finally {
        found = null;
    }
}

// ################################################################################################
//   King's Reward Function - End
// ################################################################################################

// ################################################################################################
//   Trap Check Function - Start
// ################################################################################################

function trapCheck() {
    // update timer
    displayTimer("Checking The Trap...", "Checking trap now...", "Checking trap now...");

    // simulate mouse click on the camp button
    /*var campElement = document.getElementsByClassName('campbutton')[0].firstChild;
     fireEvent(campElement, 'click');
     campElement = null;*/

    reloadWithMessage("Reloading page for trap check...", false);
    // reload the page if click on camp button fail
    /*window.setTimeout(function() {
     reloadWithMessage("Fail to click on camp button. Reloading...", false);
     }, 5000);*/
}

function CalculateNextTrapCheckInMinute() {
    if (enableTrapCheck) {
        var now = (g_nTimeOffset === 0) ? new Date() : new Date(Date.now() + g_nTimeOffset * 1000);
        var temp = (trapCheckTimeDiff * 60) - (now.getMinutes() * 60 + now.getSeconds());
        checkTimeDelay = checkTimeDelayMin + Math.round(Math.random() * (checkTimeDelayMax - checkTimeDelayMin));
        checkTime = (now.getMinutes() >= trapCheckTimeDiff) ? 3600 + temp : temp;
        checkTime += checkTimeDelay;
        now = undefined;
        temp = undefined;
    }
}

// ################################################################################################
//   Trap Check Function - End
// ################################################################################################

// ################################################################################################
//   General Function - Start
// ################################################################################################

function ajaxPost(postURL, objData, callback, throwerror) {
    try {
        jQuery.ajax({
            type: 'POST',
            url: postURL,
            data: objData,
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            xhrFields: {
                withCredentials: false
            },
            success: callback,
            error: throwerror,
        });
    }
    catch (e) {
        throwerror(e);
    }
}

function isNullOrUndefined(obj) {
    return (obj === null || obj === undefined || obj === 'null' || obj === 'undefined');
}

function getAllIndices(arr, val) {
    var indices = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val)
            indices.push(i);
    }
    return indices;
}

function range(value, min, max) {
    if (value > max)
        value = max;
    else if (value < min)
        value = min;
    else if (Number.isNaN(value))
        value = min + Math.floor(Math.random() * (max - min));

    return value;
}

function min(data) {
    var value = Number.MAX_SAFE_INTEGER;
    for (var i = 0; i < data.length; i++) {
        if (data[i] < value)
            value = data[i];
    }
    return value;
}

function minIndex(data) {
    var value = Number.MAX_SAFE_INTEGER;
    var index = -1;
    for (var i = 0; i < data.length; i++) {
        if (data[i] < value) {
            value = data[i];
            index = i;
        }
    }
    return index;
}

function max(data) {
    var value = Number.MIN_SAFE_INTEGER;
    for (var i = 0; i < data.length; i++) {
        if (data[i] > value)
            value = data[i];
    }
    return value;
}

function maxIndex(data) {
    var value = Number.MIN_SAFE_INTEGER;
    var index = -1;
    for (var i = 0; i < data.length; i++) {
        if (data[i] > value) {
            value = data[i];
            index = i;
        }
    }
    return index;
}

function arrayConcatUnique(arrOriginal, arrConcat) {
    if (!Array.isArray(arrOriginal))
        arrOriginal = [arrOriginal];
    if (!Array.isArray(arrConcat))
        arrConcat = [arrConcat];

    var nIndex = -1;
    var arrTemp = arrConcat.slice();
    for (var i = 0; i < arrOriginal.length; i++) {
        nIndex = arrTemp.indexOf(arrOriginal[i]);
        if (nIndex > -1)
            arrTemp.splice(nIndex, 1);
    }
    arrTemp = arrOriginal.concat(arrTemp);
    return arrTemp;
}

function countUnique(arrIn) {
    var objCount = {
        value: [],
        count: [],
    };

    arrIn.forEach(function (i) {
        var index = objCount.value.indexOf(i);
        if (index < 0) {
            objCount.value.push(i);
            objCount.count.push(1);
        }
        else {
            objCount.count[index]++;
        }
    });

    return objCount;
}

function hasDuplicate(arrIn) {
    var obj = countUnique(arrIn);
    for (var i = 0; i < obj.count.length; i++) {
        if (obj.count[i] > 1)
            return true;
    }
    return false;
}

function countArrayElement(value, arrIn) {
    var count = 0;
    for (var i = 0; i < arrIn.length; i++) {
        if (arrIn[i] == value)
            count++;
    }
    return count;
}

function sortWithIndices(toSort, sortType) {
    var arr = toSort.slice();
    var objSorted = {
        value: [],
        index: []
    };
    for (var i = 0; i < arr.length; i++) {
        arr[i] = [arr[i], i];
    }

    if (sortType == "descend") {
        arr.sort(function (left, right) {
            return left[0] > right[0] ? -1 : 1;
        });
    } else {
        arr.sort(function (left, right) {
            return left[0] < right[0] ? -1 : 1;
        });
    }

    for (var j = 0; j < arr.length; j++) {
        objSorted.value.push(arr[j][0]);
        objSorted.index.push(arr[j][1]);
    }
    return objSorted;
}

function standardDeviation(values) {
    var avg = average(values);
    var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);
    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function sumData(data) {
    var sum = data.reduce(function (sum, value) {
        return sum + value;
    }, 0);

    return sum;
}

function average(data) {
    var avg = sumData(data) / data.length;
    return avg;
}

function moveArrayElement(arr, fromIndex, toIndex) {
    arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
}

function functionToHTMLString(func) {
    var str = func.toString();
    str = str.substring(str.indexOf("{") + 1, str.lastIndexOf("}"));
    str = replaceAll(str, '"', '\'');
    return str;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

function browserDetection() {
    var browserName = "unknown";
    var userAgentStr = navigator.userAgent.toString().toLowerCase();
    if (userAgentStr.indexOf("firefox") >= 0)
        browserName = "firefox";
    else if (userAgentStr.indexOf("opera") >= 0 || userAgentStr.indexOf("opr/") >= 0)
        browserName = "opera";
    else if (userAgentStr.indexOf("chrome") >= 0)
        browserName = "chrome";
    setStorage('Browser', browserName);
    setStorage('UserAgent', userAgentStr);
    return browserName;
}

function setSessionStorage(name, value) {
    // check if the web browser support HTML5 storage
    if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
        window.sessionStorage.setItem(name, value);
    }

    name = undefined;
    value = undefined;
}

function removeSessionStorage(name) {
    // check if the web browser support HTML5 storage
    if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
        window.sessionStorage.removeItem(name);
    }
    name = undefined;
}

function getSessionStorage(name) {
    // check if the web browser support HTML5 storage
    if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage)) {
        return (window.sessionStorage.getItem(name));
    }
    name = undefined;
}

function clearSessionStorage() {
    // check if the web browser support HTML5 storage
    if ('sessionStorage' in window && !isNullOrUndefined(window.sessionStorage))
        window.sessionStorage.clear();
}

function setStorage(name, value) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && !isNullOrUndefined(window.localStorage)) {
        window.localStorage.setItem(name, value);
    }

    name = undefined;
    value = undefined;
}

function removeStorage(name) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && !isNullOrUndefined(window.localStorage)) {
        window.localStorage.removeItem(name);
    }
    name = undefined;
}

function getStorage(name) {
    // check if the web browser support HTML5 storage
    if ('localStorage' in window && !isNullOrUndefined(window.localStorage)) {
        return (window.localStorage.getItem(name));
    }
    name = undefined;
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }

            var cookieString = unescape(document.cookie.substring(c_start, c_end));

            // clean up
            c_name = null;
            c_start = null;
            c_end = null;

            try {
                return cookieString;
            } finally {
                cookieString = null;
            }
        }
        c_start = null;
    }
    c_name = null;
    return null;
}

function getStorageToVariableInt(storageName, defaultInt) {
    var temp = getStorage(storageName);
    var tempInt = defaultInt;
    if (isNullOrUndefined(temp)) {
        setStorage(storageName, defaultInt);
    } else {
        tempInt = parseInt(temp);
        if (Number.isNaN(tempInt))
            tempInt = defaultInt;
    }
    return tempInt;
}

function getStorageToVariableStr(storageName, defaultStr) {
    var temp = getStorage(storageName);
    if (isNullOrUndefined(temp)) {
        setStorage(storageName, defaultStr);
        temp = defaultStr;
    }
    return temp;
}

function getStorageToVariableBool(storageName, defaultBool) {
    var temp = getStorage(storageName);
    if (isNullOrUndefined(temp)) {
        setStorage(storageName, defaultBool.toString());
        return defaultBool;
    } else if (temp === true || temp.toLowerCase() == "true") {
        return true;
    } else {
        return false;
    }
}

function getStorageToObject(keyName, objDefault) {
    var obj = getStorage(keyName);
    var bCheckNewProp = true;
    if (isNullOrUndefined(obj)) {
        obj = JSON.stringify(objDefault);
        setStorage(keyName, obj);
        bCheckNewProp = false;
    }
    obj = JSON.parse(obj);
    if (bCheckNewProp) {
        if (assignMissingDefault(obj, objDefault)) {
            setStorage(keyName, JSON.stringify(obj));
        }
    }

    return obj;
}

function disarmTrap(trapSelector) {
    if (trapSelector == 'weapon' || trapSelector == 'base')
        return;

    var nQuantity = parseInt(getPageVariable("user." + trapSelector + "_quantity"));
    if (nQuantity === 0) {
        deleteArmingFromList(trapSelector);
        if (isNewUI && !isArmingInList())
            closeTrapSelector(trapSelector);
        arming = false;
        return;
    }
    var x;
    var strTemp = "";
    var intervalDisarm = setInterval(
        function () {
            if (arming === false) {
                addArmingIntoList(trapSelector);
                clickTrapSelector(trapSelector);
                var intervalDT = setInterval(
                    function () {
                        if (isNewUI) {
                            x = document.getElementsByClassName('campPage-trap-itemBrowser-item-disarmButton');
                            if (x.length > 0) {
                                fireEvent(x[0], 'click');
                                console.plog('Disarmed');
                                deleteArmingFromList(trapSelector);
                                if (isNewUI && !isArmingInList())
                                    closeTrapSelector(trapSelector);
                                arming = false;
                                //window.setTimeout(function () { closeTrapSelector(trapSelector); }, 1000);
                                clearInterval(intervalDT);
                                intervalDT = null;
                                return;
                            }
                        }
                        else {
                            x = document.getElementsByClassName(trapSelector + ' canDisarm');
                            if (x.length > 0) {
                                for (var i = 0; i < x.length; ++i) {
                                    strTemp = x[i].getAttribute('title');
                                    if (strTemp.indexOf('Click to disarm') > -1) {
                                        fireEvent(x[i], 'click');
                                        console.plog('Disarmed');
                                        deleteArmingFromList(trapSelector);
                                        arming = false;
                                        clearInterval(intervalDT);
                                        intervalDT = null;
                                        return;
                                    }
                                }
                            }
                        }
                    }, 1000);
                clearInterval(intervalDisarm);
                intervalDisarm = null;
            }
        }, 1000);
    return;
}

function assignMissingDefault(obj, objDefault) {
    var bResave = false;
    for (var prop in objDefault) {
        if (objDefault.hasOwnProperty(prop) && !obj.hasOwnProperty(prop)) {
            obj[prop] = objDefault[prop];
            bResave = true;
        }
    }

    return bResave;
}

function fireEvent(element, event) {
    var evt;
    if (document.createEventObject) {
        // dispatch for IE
        evt = document.createEventObject();

        try {
            return element.fireEvent('on' + event, evt);
        } finally {
            element = null;
            event = null;
            evt = null;
        }
    } else {
        // dispatch for firefox + others
        evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable

        try {
            return !element.dispatchEvent(evt);
        } finally {
            element = null;
            event = null;
            evt = null;
        }
    }
}

function getPageVariable(name) {
    if (debug) console.log('RUN GPV(' + name + ')');
    try {
        var browser = browserDetection();

        if (browser == 'chrome') {
            if (name == "user.unique_hash") {
                return user.unique_hash;
            } else {
                return getPageVariableForChrome(name);
            }
        } else if (browser == 'firefox') {
            if (name == "user.next_activeturn_seconds") {
                return unsafeWindow.user.next_activeturn_seconds;
            } else if (name == "user.unique_hash") {
                return unsafeWindow.user.unique_hash;
            } else if (name == "user.has_puzzle") {
                return unsafeWindow.user.has_puzzle;
            } else if (name == "user.bait_quantity") {
                return unsafeWindow.user.bait_quantity;
            } else if (name == "user.location") {
                return unsafeWindow.user.location;
            } else if (name == "user.trinket_name") {
                return unsafeWindow.user.trinket_name;
            } else if (name == "user.weapon_name") {
                return unsafeWindow.user.weapon_name;
            } else if (name == "user.quests.QuestTrainStation.on_train") {
                return unsafeWindow.user.quests.QuestTrainStation.on_train;
            } else {
                if (debug) console.log('GPV firefox: ' + name + ' not found.');
            }
        } else {
            if (debug) console.log('GPV other: ' + name + 'not found.');
        }

        return 'ERROR';
    } catch (e) {
        if (debug) console.log('GPV ALL try block error: ' + e);
    } finally {
        name = undefined;
    }
}

function getPageVariableForChrome(variableName) {
    if (debug) console.log('RUN GPVchrome(' + variableName + ')');
    // google chrome only
    var scriptElement = document.createElement("script");
    scriptElement.setAttribute('id', "scriptElement");
    scriptElement.setAttribute('type', "text/javascript");
    scriptElement.innerHTML = "document.getElementById('scriptElement').innerText=" + variableName + ";";
    document.body.appendChild(scriptElement);

    var value = scriptElement.innerHTML;
    document.body.removeChild(scriptElement);
    scriptElement = null;
    variableName = null;

    try {
        return (value);
    } finally {
        value = null;
    }
}

function timeElapsed(dateA, dateB) {
    var elapsed = 0;

    var secondA = Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate(), dateA.getHours(), dateA.getMinutes(), dateA.getSeconds());
    var secondB = Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate(), dateB.getHours(), dateB.getMinutes(), dateB.getSeconds());
    elapsed = (secondB - secondA) / 1000;

    secondA = null;
    secondB = null;
    dateA = null;
    dateB = null;

    try {
        return (elapsed);
    } finally {
        elapsed = null;
    }
}

function timeformat(time) {
    var timeString;
    var hr = Math.floor(time / 3600);
    var min = Math.floor((time % 3600) / 60);
    var sec = (time % 3600 % 60) % 60;

    if (hr > 0) {
        timeString = hr.toString() + " hr " + min.toString() + " min " + sec.toString() + " sec";
    } else if (min > 0) {
        timeString = min.toString() + " min " + sec.toString() + " sec";
    } else {
        timeString = sec.toString() + " sec";
    }

    time = null;
    hr = null;
    min = null;
    sec = null;

    try {
        return (timeString);
    } finally {
        timeString = null;
    }
}

function timeFormatLong(time) {
    var timeString;

    if (time != -1) {
        var day = Math.floor(time / 86400);
        var hr = Math.floor((time % 86400) / 3600);
        var min = Math.floor((time % 3600) / 60);

        if (day > 0) {
            timeString = day.toString() + " day " + hr.toString() + " hr " + min.toString() + " min ago";
        } else if (hr > 0) {
            timeString = hr.toString() + " hr " + min.toString() + " min ago";
        } else if (min > 0) {
            timeString = min.toString() + " min ago";
        }

        day = null;
        hr = null;
        min = null;
    } else {
        timeString = null;
    }

    time = null;

    try {
        return (timeString);
    } finally {
        timeString = null;
    }
}

// ################################################################################################
//   General Function - End
// ################################################################################################

// ################################################################################################
//   NOB Additional thing - Start
// ################################################################################################
// INIT AJAX CALLS AND INIT CALLS - Function calls after page LOAD

window.addEventListener("load", function () {
    if (window.frames['name'] != 'aswift_0') {
        if (debug) console.log('Running nobInit in ' + window.frames['name'] + ' frame.');
        nobInit();
    }
}, false);

function nobInit() {
    if (debug) console.log('RUN nobInit()');
    try {
        if (!NOBhasPuzzle) {
            if (debug) console.log("RUN nobInit()");
            if (window.location.href == 'http://www.mousehuntgame.com/' ||
                window.location.href == 'http://www.mousehuntgame.com/#' ||
                window.location.href == 'http://www.mousehuntgame.com/?switch_to=standard' ||
                window.location.href == 'https://www.mousehuntgame.com/' ||
                window.location.href == 'https://www.mousehuntgame.com/#' ||
                window.location.href == 'https://www.mousehuntgame.com/?switch_to=standard' ||
                window.location.href.indexOf('mousehuntgame.com/turn.php') != -1 ||
                window.location.href.indexOf('mousehuntgame.com/index.php') != -1 ||
                window.location.href == 'http://www.mousehuntgame.com/canvas/' ||
                window.location.href == 'http://www.mousehuntgame.com/canvas/#' ||
                window.location.href == 'https://www.mousehuntgame.com/canvas/' ||
                window.location.href == 'https://www.mousehuntgame.com/canvas/#' ||
                window.location.href.indexOf('mousehuntgame.com/canvas/index.php') != -1 ||
                window.location.href.indexOf('mousehuntgame.com/canvas/turn.php') != -1 ||
                window.location.href.indexOf('mousehuntgame.com/canvas/?') != -1) {
                NOBpage = true;
            }
            addGoogleAd();

            if (NOBpage) {
                nobHTMLFetch();
                createClockArea();
                clockTick();
                fetchGDocStuff();
                setTimeout(function () {
                    nobInjectFFfunctions();
                }, 1000);
                setTimeout(function () {
                    pingServer();
                }, 30000);
                // Hide message after 2H :)
                hideNOBMessage(7200000);
            }
        }
    } catch (e) {
        console.log("nobInit() ERROR - " + e);
    }
}

function nobAjaxGet(url, callback, throwError) {
    if (!NOBhasPuzzle) {
        jQuery.ajax({
            url: url,
            type: "GET",
            timeout: 5000,
            statusCode: {
                200: function () {
                    console.log("Success get - " + url);
                    //Success Message
                }
            },
            success: callback,
            error: throwError
        });
    }
}

function nobAjaxPost(url, data, callback, throwError, dataType) {
    if (!NOBhasPuzzle) {
        if (dataType == null || dataType == undefined) dataType = 'json';

        jQuery.ajax({
            type: "POST",
            url: url,
            data: data,
            contentType: 'text/plain',
            dataType: dataType,
            xhrFields: {
                withCredentials: false
            },
            timeout: 10000,
            statusCode: {
                200: function () {
                    console.log("Success post - " + url);
                    //Success Message
                }
            },
            success: callback,
            error: throwError
        });
    }
}

function updateTimer(timeleft, inhours) {
    //if (debug) console.log('updateTimer(' + timeleft + ')');
    var ReturnValue = "";

    var FirstPart, SecondPart, Size;

    if (timeleft > 0) {
        if (inhours != null && inhours == true && timeleft > 3600) {
            FirstPart = Math.floor(timeleft / (60 * 60));
            SecondPart = Math.floor(timeleft / 60) % 60;
            Size = 'hrs';
        } else {
            FirstPart = Math.floor(timeleft / 60);
            SecondPart = timeleft % 60;
            Size = 'mins';
        }

        if (SecondPart < 10) {
            SecondPart = '0' + SecondPart;
        }

        ReturnValue = FirstPart + ':' + SecondPart + ' ' + Size;
    } else {
        ReturnValue = 'Soon...';
    }

    return ReturnValue;
}

function nobGDoc(items, type) {
    var dataSend = JSON.parse(items);
    dataSend.type = type;
    var dataSendString = JSON.stringify(dataSend);
    var sheet = "https://script.google.com/macros/s/AKfycbyry10E0moilr-4pzWpuY9H0iNlHKzITb1QoqD69ZhyWhzapfA/exec";

    nobAjaxPost(sheet, dataSendString, function (data) {
        if (debug) console.log(data);
    }, function (a, b, c) {
        console.log("nobGDoc error (" + b + "): " + c);
    });
}

function nobHTMLFetch() {
    var value = document.documentElement.innerHTML;
    if (value != null) {
        if (typeof value == "string") {

            var StartPos = value.indexOf('user = ');
            var EndPos = value.indexOf('};', StartPos);

            if (StartPos != -1) {
                var FullObjectText = value.substring(StartPos + 7, EndPos + 1);
                nobStore(JSON.parse(FullObjectText), "data");
            }
        } else if (typeof value == "object") {
            nobStore(value, "data");
        }
    }
    value = undefined;
}

function nobStore(data, type) {
    data = JSON.stringify(data);
    var name = "NOB-" + type;
    localStorage.setItem(name, data);
}

function nobGet(type) {
    return localStorage.getItem('NOB-' + type);
}

function nobMapRequest(handleData) {
    var url = "https://www.mousehuntgame.com/managers/ajax/users/relichunter.php";
    var dataSend = {
        'action': 'info',
        'uh': getPageVariable('user.unique_hash'),
        'viewas': null
    };
    jQuery.ajax({
        url: url,
        data: dataSend,
        type: "POST",
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            // console.log(data);
            handleData(data);
        },
        error: function (error) {
            console.log("Map Request Failed");
            handleData(error);
        }
    });

    url = null;
    dataSend = null;
}

function nobLoading(location, name) {
    var element = document.getElementById(location);
    element.innerHTML = "<style type=\"text/css\">" +
        /* Universal styling */
        "    [class^=\"shaft-load\"] {" +
        "    margin: 5px auto;" +
        "    width: 60px;" +
        "    height: 15px;" +
        "}" +
        "[class^=\"shaft-load\"] > div {" +
        "    float: left;" +
        "    background: #B96CFF;" +
        "    height: 100%;" +
        "    width: 5px;" +
        "    margin-right: 1px;" +
        "    display: inline-block;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft1 {" +
        "    -webkit-animation-delay: 0.05s;" +
        "    -moz-animation-delay: 0.05s;" +
        "    -o-animation-delay: 0.05s;" +
        "    animation-delay: 0.05s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft2 {" +
        "    -webkit-animation-delay: 0.1s;" +
        "    -moz-animation-delay: 0.1s;" +
        "    -o-animation-delay: 0.1s;" +
        "    animation-delay: 0.1s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft3 {" +
        "    -webkit-animation-delay: 0.15s;" +
        "    -moz-animation-delay: 0.15s;" +
        "    -o-animation-delay: 0.15s;" +
        "    animation-delay: 0.15s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft4 {" +
        "    -webkit-animation-delay: 0.2s;" +
        "    -moz-animation-delay: 0.2s;" +
        "    -o-animation-delay: 0.2s;" +
        "    animation-delay: 0.2s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft5 {" +
        "    -webkit-animation-delay: 0.25s;" +
        "    -moz-animation-delay: 0.25s;" +
        "    -o-animation-delay: 0.25s;" +
        "    animation-delay: 0.25s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft6 {" +
        "    -webkit-animation-delay: 0.3s;" +
        "    -moz-animation-delay: 0.3s;" +
        "    -o-animation-delay: 0.3s;" +
        "    animation-delay: 0.3s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft7 {" +
        "    -webkit-animation-delay: 0.35s;" +
        "    -moz-animation-delay: 0.35s;" +
        "    -o-animation-delay: 0.35s;" +
        "    animation-delay: 0.35s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft8 {" +
        "    -webkit-animation-delay: 0.4s;" +
        "    -moz-animation-delay: 0.4s;" +
        "    -o-animation-delay: 0.4s;" +
        "    animation-delay: 0.4s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft9 {" +
        "    -webkit-animation-delay: 0.45s;" +
        "    -moz-animation-delay: 0.45s;" +
        "    -o-animation-delay: 0.45s;" +
        "    animation-delay: 0.45s;" +
        "}" +
        "[class^=\"shaft-load\"] .shaft10 {" +
        "    -webkit-animation-delay: 0.5s;" +
        "    -moz-animation-delay: 0.5s;" +
        "    -o-animation-delay: 0.5s;" +
        "    animation-delay: 0.5s;" +
        "}" +

        /* Shaft 1 */
        ".shaft-load > div {" +
        "    -webkit-animation: loading 1.5s infinite ease-in-out;" +
        "    -moz-animation: loading 1.5s infinite ease-in-out;" +
        "    -o-animation: loading 1.5s infinite ease-in-out;" +
        "    animation: loading 1.5s infinite ease-in-out;" +
        "    -webkit-transform: scaleY(0.05) translateX(-10px);" +
        "    -moz-transform: scaleY(0.05) translateX(-10px);" +
        "    -ms-transform: scaleY(0.05) translateX(-10px);" +
        "    -o-transform: scaleY(0.05) translateX(-10px);" +
        "    transform: scaleY(0.05) translateX(-10px);" +
        "}" +

        "@-webkit-keyframes loading {" +
        "    50% {" +
        "    -webkit-transform: scaleY(1.2) translateX(10px);" +
        "    -moz-transform: scaleY(1.2) translateX(10px);" +
        "    -ms-transform: scaleY(1.2) translateX(10px);" +
        "    -o-transform: scaleY(1.2) translateX(10px);" +
        "    transform: scaleY(1.2) translateX(10px);" +
        "    background: #56D7C6;" +
        "}" +
        "}" +
        "@-moz-keyframes loading {" +
        "50% {" +
        "-webkit-transform: scaleY(1.2) translateX(10px);" +
        "-moz-transform: scaleY(1.2) translateX(10px);" +
        "-ms-transform: scaleY(1.2) translateX(10px);" +
        "-o-transform: scaleY(1.2) translateX(10px);" +
        "transform: scaleY(1.2) translateX(10px);" +
        "background: #56D7C6;" +
        "}" +
        "}" +
        "@-o-keyframes loading {" +
        "50% {" +
        "-webkit-transform: scaleY(1.2) translateX(10px);" +
        "-moz-transform: scaleY(1.2) translateX(10px);" +
        "-ms-transform: scaleY(1.2) translateX(10px);" +
        "-o-transform: scaleY(1.2) translateX(10px);" +
        "transform: scaleY(1.2) translateX(10px);" +
        "background: #56D7C6;" +
        "}" +
        "}" +
        "@keyframes loading {" +
        "50% {" +
        "-webkit-transform: scaleY(1.2) translateX(10px);" +
        "-moz-transform: scaleY(1.2) translateX(10px);" +
        "-ms-transform: scaleY(1.2) translateX(10px);" +
        "-o-transform: scaleY(1.2) translateX(10px);" +
        "transform: scaleY(1.2) translateX(10px);" +
        "background: #56D7C6;" +
        "}" +
        "}" +
        "</style>" +
        "<div class=\"shaft-load\">" +
        "<div class=\"shaft1\"></div>" +
        "<div class=\"shaft2\"></div>" +
        "<div class=\"shaft3\"></div>" +
        "<div class=\"shaft4\"></div>" +
        "<div class=\"shaft5\"></div>" +
        "<div class=\"shaft6\"></div>" +
        "<div class=\"shaft7\"></div>" +
        "<div class=\"shaft8\"></div>" +
        "<div class=\"shaft9\"></div>" +
        "<div class=\"shaft10\"></div>" +
        "</div>";

    element = null;
}

function nobStopLoading(location) {
    var element = document.getElementById(location);
    //element.innerHTML = null;
    element = null;
}

// VARS DONE ******************************* COMMENCE CODE
function nobScript(qqEvent) {
    if (NOBpage) {
        if (debug) console.log("RUN nobScript()");
        var mapThere;
        try {
            var NOBdata = nobGet('data');
            mapThere = document.getElementsByClassName('treasureMap')[0];
            if (mapThere.textContent.indexOf("remaining") == -1) {
                mapThere = false;
                if (debug) console.log("No map, using HTML data now");
            } else {
                mapThere = true;
            }

            if (NOBdata != null || NOBdata != undefined) {
                if (!mapRequestFailed && mapThere) {
                    nobMapRequest(function (output) {
                        if (debug) console.log("RUN nobMapRequest()");
                        if (debug) console.log(output);
                        if (output.status == 200 || output.status == undefined) {
                            nobStore(output, "data");
                            nobGDoc(JSON.stringify(output), "map");
                        } else {
                            console.log("Map request failed: " + output);
                            mapRequestFailed = true;
                            nobHTMLFetch();
                            output = nobGet('data');
                            nobGDoc(output, "user");
                        }
                    });
                } else {
                    console.log("Map fetch failed, using USER data from html (" + mapRequestFailed + ", " + mapThere + ")");
                    nobHTMLFetch();
                    var output = nobGet('data');
                    nobGDoc(output, "user");
                }
            } else {
                console.log("Data is not found, doing HTML fetch now.");
                nobHTMLFetch();
            }
        } catch (e) {
            if (debug) console.log('nobScript error: ' + e);
        } finally {
            mapThere = null;
        }
    }
}

function nobTravel(location) {
    if (NOBpage) {
        var url = "https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php";
        var data = {
            "origin": self.getCurrentUserEnvironmentType(),
            "destination": location,
            'uh': getPageVariable('user.unique_hash')
        };
        nobAjaxPost(url, data, function (r) {
            console.log(r);
        }, function (a, b, c) {
            console.log(b, c);
        });
    }
}

// Update + message fetch
function fetchGDocStuff() {
    if (NOBpage) {
        var currVer = scriptVersion;
        var checkVer;

        document.getElementById('NOBmessage').innerHTML = "Loading";
        nobLoading('NOBmessage');

        var theData = JSON.parse(nobGet('data'));
        if (theData.user) {
            theData = theData.user;
        }
        var userID = theData.sn_user_id;

        Parse.initialize("mh-autobot", "unused");
        Parse.serverURL = 'https://mh-autobot.herokuapp.com/parse';
        Parse.Cloud.run('nobMessage', {'user': userID}, {
            success: function (data) {
                nobStopLoading();
                data = JSON.parse(data);

                // Ad Free (returns bool)
                NOBadFree = data.adFree;
                nobStore(NOBadFree, 'adFree');

                // MESSAGE PLACING
                message = data.message;
                var NOBmessage = document.getElementById('NOBmessage');
                NOBmessage.innerHTML = message;

                // UPDATE CHECK
                checkVer = data.version;
                if (debug) console.log('Current MH AutoBot version: ' + currVer + ' / Server MH AutoBot version: ' + checkVer);
                if (checkVer > currVer) {
                    var updateElement = document.getElementById('updateElement');
                    updateElement.innerHTML = "<a href=\"https://greasyfork.org/scripts/32971-mousehunt-autobot-enhanced-revamp/code/MouseHunt%20AutoBot%20ENHANCED%20+%20REVAMP.user.js\" target='_blank'><font color='red'>YOUR SCRIPT IS OUT OF DATE, PLEASE CLICK HERE TO UPDATE IMMEDIATELY</font></a>";
                }

                // SPECIAL MESSAGE
                if (data.specialMessage != "" || data.specialMessage != undefined) {
                    var NOBspecialMessage = document.getElementById('nobSpecialMessage');
                    NOBspecialMessage.innerHTML = '<span style="background: chartreuse; font-size: 1.5em;">' + data.specialMessage + '</span>';
                }
            }, error: function (error) {
                setTimeout(function () {
                    fetchGDocStuff();
                }, 300000);
                console.log(JSON.parse(error) + ' error - Parse is now not working qq... Retrying in 5 minutes');
            }
        }).then(function (a) {

        }, function (error) {

        });
    }
}

function pingServer() {
    if (NOBpage) {
        if (debug) console.log("Running pingServer()");
        var theData = JSON.parse(nobGet('data'));
        if (theData.user) {
            theData = theData.user;
        }
        var theUsername = theData.username;
        var thePassword = theData.sn_user_id;

        Parse.initialize("mh-autobot", "unused");
        Parse.serverURL = 'https://mh-autobot.herokuapp.com/parse';
        Parse.User.logIn(theUsername, thePassword).then(function (user) {
            //console.log("Success parse login");
            return Parse.Promise.as("Login success");
        }, function (user, error) {
            if (debug) console.log("Parse login failed, attempting to create new user now.");

            var createUser = new Parse.User();
            createUser.set("username", theUsername);
            createUser.set("password", thePassword);
            createUser.set("email", thePassword + "@mh.com");

            var usrACL = new Parse.ACL();
            usrACL.setPublicReadAccess(false);
            usrACL.setPublicWriteAccess(false);
            usrACL.setRoleReadAccess("Administrator", true);
            usrACL.setRoleWriteAccess("Administrator", true);
            createUser.setACL(usrACL);

            createUser.signUp(null, {
                success: function (newUser) {
                    if (debug) console.log(newUser);
                    pingServer();
                    return Parse.Promise.error("Creating new user, trying to login now.");
                },
                error: function (newUser, signupError) {
                    // Show the error message somewhere and let the user try again.
                    if (debug) console.log("Parse Error: " + signupError.code + " " + signupError.message);
                    return Parse.Promise.error("Error in signup, giving up serverPing now.");
                }
            });
            return Parse.Promise.error("Failed login, attempted signup, rerunning code");
        }).then(function (success) {
            var UserData = Parse.Object.extend("UserData");

            var findOld = new Parse.Query(UserData);
            findOld.containedIn("user_id", [theData.sn_user_id, JSON.stringify(theData.sn_user_id)]);
            return findOld.find();
        }).then(function (returnObj) {
            var results = returnObj;
            var promises = [];
            for (var i = 0; i < results.length; i++) {
                promises.push(results[i].destroy());
            }
            //console.log("Done parse delete");
            return Parse.Promise.when(promises);
        }).then(function (UserData) {
            UserData = Parse.Object.extend("UserData");
            var userData = new UserData();

            userData.set("user_id", theData.sn_user_id);
            userData.set("name", theData.username);
            userData.set("script_ver", scriptVersion);
            userData.set("browser", browserDetection());
            userData.set("betaUI", isNewUI);
            userData.set("data", JSON.stringify(theData));
            userData.set("addonCode", addonCode);
            var dataACL = new Parse.ACL(Parse.User.current());
            dataACL.setRoleReadAccess("Administrator", true);
            dataACL.setRoleWriteAccess("Administrator", true);
            userData.setACL(dataACL);

            return userData.save();
        }).then(function (results) {
            if (debug) console.log("Success Parse");
        }).then(function (message) {
            if (message != undefined || message != null)
                console.log("Parse message: " + message);
            if (Parse.User.current() != null) {
                Parse.User.logOut();
                //console.log("Parse logout");
            }
        }, function (error) {
            if (error != undefined || error != null) {
                if (debug) console.log("Parse error: " + error);
            }
        });
    }
}

function hideNOBMessage(time) {
    window.setTimeout(function () {
        var element = document.getElementById('NOBmessage');
        element.style.display = 'none';
    }, time);
}

function showNOBMessage() {
    document.getElementById('NOBmessage').style.display = 'block'
}

function nobInjectFFfunctions() {
    var browser = browserDetection();
    var raffleDiv = document.getElementById('nobRaffle');
    var presentDiv = document.getElementById('nobPresent');
    var addAdDiv = document.getElementById('addAdLink');
    var removeAdDiv = document.getElementById('removeAdLink');

    if (browser == 'firefox') {
        unsafeWindow.nobRaffle = exportFunction(nobRaffle, unsafeWindow);
        unsafeWindow.nobPresent = exportFunction(nobPresent, unsafeWindow);
        unsafeWindow.addGoogleAd = exportFunction(addGoogleAd, unsafeWindow);

        raffleDiv.addEventListener('click', function () {
            unsafeWindow.nobRaffle();
            return false;
        });
        presentDiv.addEventListener('click', function () {
            unsafeWindow.nobPresent();
            return false;
        });
        if (addAdDiv) {
            addAdDiv.addEventListener('click', function () {
                localStorage.setItem('allowAds', 'true');
                unsafeWindow.addGoogleAd();
            });
        }
        if (removeAdDiv) {
            removeAdDiv.addEventListener('click', function () {
                localStorage.setItem('allowAds', 'false');
                unsafeWindow.addGoogleAd();
            });
        }
    } else {
        // chrome and all other
        raffleDiv.addEventListener('click', function () {
            nobRaffle();
            return false;
        });
        presentDiv.addEventListener('click', function () {
            nobPresent();
            return false;
        });
        if (addAdDiv) {
            addAdDiv.addEventListener('click', function () {
                localStorage.setItem('allowAds', 'true');
                addGoogleAd();
            });
        }
        if (removeAdDiv) {
            removeAdDiv.addEventListener('click', function () {
                localStorage.setItem('allowAds', 'false');
                addGoogleAd();
            });
        }
    }
    raffleDiv = undefined;
    presentDiv = undefined;
    addAdDiv = undefined;
    removeAdDiv = undefined;
}

function nobRaffle() {
    var i;
    var intState = 0;
    var nobRafGiveUp = 10;
    var nobRafInt = window.setInterval(function () {
        try {
            if (intState == 0 && !($('.tabs a:eq(1)').length > 0)) {
                $('#hgbar_messages').click();
                intState = 1;
                return;
            } else if ($('a.active.tab')[0].dataset.tab != 'daily_draw') {
                var tabs = $('a.tab');
                var theTab = "";
                for (i = 0; i < tabs.length; i++) {
                    if (tabs[i].dataset.tab == 'daily_draw') {
                        tabs[i].click();
                        return;
                    }
                }

                // If there are no raffles
                intState = 0;
                $("a.messengerUINotificationClose")[0].click();
                console.log("No raffles found.");
                window.clearInterval(nobRafInt);

                nobRafInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState != 2 && $('a.active.tab')[0].dataset.tab == 'daily_draw') {
                var ballot = $(".notificationMessageList input.sendBallot");
                for (i = ballot.length - 1; i >= 0; i--) {
                    ballot[i].click();
                }
                intState = 2;
                return;
            } else if ($('a.active.tab')[0].dataset.tab == 'daily_draw') {
                intState = 3;
            } else {
                intState = -1;
            }
        } catch (e) {
            console.log("Raffle interval error: " + e + ", retrying in 2 seconds. Giving up in " + (nobRafGiveUp * 2) + " seconds.");
            if (nobRafGiveUp < 1) {
                intState = -1;
            } else {
                nobRafGiveUp--;
            }
        } finally {
            if (intState == 3) {
                $("a.messengerUINotificationClose")[0].click();
                window.clearInterval(nobRafInt);

                nobRafInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState == -1) {
                console.log("Present error, user pls resolve yourself");
                window.clearInterval(nobRafInt);

                nobRafInt = null;
                intState = null;
                i = null;
                return;
            }
        }
    }, 2000);
};

function nobPresent() {
    var intState = 0;
    var i;
    var nobPresGiveUp = 10;
    var nobPresInt = window.setInterval(function () {
        try {
            if (intState == 0 && !($('.tabs a:eq(1)').length > 0)) {
                $('#hgbar_messages').click();
                intState = 1;
                return;
            } else if ($('a.active.tab')[0].dataset.tab != 'gifts') {
                var tabs = $('a.tab');
                for (i = 0; i < tabs.length; i++) {
                    if (tabs[i].dataset.tab == 'gifts') {
                        tabs[i].click();
                        return;
                    }
                }

                // If there are no gifts
                intState = 0;
                $("a.messengerUINotificationClose")[0].click();
                console.log("No gifts found.");
                window.clearInterval(nobPresInt);

                nobPresInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState != 2 && $('a.active.tab')[0].dataset.tab == 'gifts') {
                var presents = $('input.acceptAndSend');
                for (i = presents.length - 1; i >= 0; i--) {
                    presents[i].click();
                }
                intState = 2;
                return;
            } else if ($('a.active.tab')[0].dataset.tab == 'gifts') {
                intState = 3;
            } else {
                intState = -1;
            }
        } catch (e) {
            console.log("Present interval error: " + e + ", retrying in 2 seconds. Giving up in " + (nobPresGiveUp * 2) + " seconds.");
            if (nobPresGiveUp < 1) {
                intState = -1;
            } else {
                nobPresGiveUp--;
            }
        } finally {
            if (intState == 3) {
                $("a.messengerUINotificationClose")[0].click();
                window.clearInterval(nobPresInt);

                nobPresInt = null;
                intState = null;
                i = null;
                return;
            } else if (intState == -1) {
                console.log("Present error, user pls resolve yourself");
                window.clearInterval(nobPresInt);

                nobPresInt = null;
                intState = null;
                i = null;
                return;
            }
        }
    }, 2000);
};

// CALCULATE TIMER *******************************
function currentTimeStamp() {
    return parseInt(new Date().getTime().toString().substring(0, 10), 10);
}

function createClockArea() {
    try {
        var parent = document.getElementById('loadTimersElement');
        var child = [];
        var text;

        for (i = 0; i < LOCATION_TIMERS.length; i++) {
            child[i] = document.createElement('div');
            child[i].setAttribute("id", "NOB" + LOCATION_TIMERS[i][0]);
            text = '<span id="text_' + LOCATION_TIMERS[i][0] + '">';
            child[i].innerHTML = text;
        }

        for (i = 0; i < LOCATION_TIMERS.length; i++)
            parent.insertBefore(child[i], parent.firstChild);

        parent.insertBefore(document.createElement('br'), parent.firstChild);
    } catch (e) {
        console.log("createClockArea() ERROR: " + e);
    }
}

function clockTick() {
    if (debug) console.log("RUN clockTick()");
    var temp = document.getElementById('NOBrelic');
    if (clockNeedOn && !clockTicking && temp) {
        // Clock needs to be on, but is not ticking
        updateTime();
    } else if (clockTicking && clockNeedOn && temp) {
        // Clock needs to be on and is already ticking
    } else {
        // Clock does not need to be on
        nobCalculateTime();
    }
    NOBtickerInterval = window.setTimeout(function () {
        clockTick();
    }, 15 * 60 * 1000);
}

function updateTime() {
    if (debug) console.log("RUN updateTime()");
    try {
        var timeLeft = JSON.parse(nobGet('relic'));
        if (timeLeft > 0) {
            timeLeft--;
            var element = document.getElementById('NOBrelic');
            element.innerHTML = updateTimer(timeLeft, true);
            nobStore(timeLeft, 'relic');
            nobCalculateOfflineTimers();
            clockTicking = true;

            NOBtickerTimout = window.setTimeout(function () {
                updateTime();
            }, 1000);
        } else {
            clockTicking = false;
            clockNeedOn = false;
        }
    } catch (e) {
        if (debug) console.log("UpdateTime error: " + e);
        clearTimeout(NOBtickerTimout);
        clearTimeout(NOBtickerInterval);
    }
}

function nobCalculateTime(runOnly) {
    if (debug) console.log("Running nobCalculateTime(" + runOnly + ")");
    var child;
    if (runOnly != 'relic' && runOnly != 'toxic' && runOnly != 'none')
        runOnly = 'all';

    try {
        Parse.initialize("mh-autobot", "unused");
        Parse.serverURL = 'https://mh-autobot.herokuapp.com/parse';
        if ((runOnly == 'relic' || runOnly == 'all') && (typeof LOCATION_TIMERS[3][1].url != 'undefined' || LOCATION_TIMERS[3][1].url != 'undefined')) {
            /*Parse.Cloud.run('nobRelic', {}, {
                success: function (data) {
                    data = JSON.parse(data);

                    if (data.result == "error") {
                        child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                        child.innerHTML = "<font color='red'>" + data.error + "</font>";
                    } else {
                        child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                        child.innerHTML = "Relic hunter now in: <font color='green'>" + data.location + "</font> \~ Next move time: <span id='NOBrelic'>" + updateTimer(data.next_move, true);
                        if (data.next_move > 0) {
                            clockTicking = true;
                            nobStore(data.next_move, 'relic');
                            updateTime();
                            clockNeedOn = true;
                        } else {
                            clockTicking = false;
                            clockNeedOn = false;
                        }
                    }
                }, error: function (error) {
                    error = JSON.parse(error);

                    var child = document.getElementById('NOB' + LOCATION_TIMERS[3][0]);
                    child.innerHTML = "<font color='red'>" + error + " error, probably hornTracker, google, or my scripts broke. Please wait awhile, if not just contact me.</font>";
                }
            });*/
            if (debug) console.log("relic hunter will be back :)");
        }

        /*if ((runOnly == 'toxic' || runOnly == 'all') && (typeof LOCATION_TIMERS[4][1].url != 'undefined' || LOCATION_TIMERS[4][1].url != 'undefined')) {
            Parse.Cloud.run('nobToxic', {}, {
                success: function (data) {
                    data = JSON.parse(data);

                        if (data.result == "error") {
                            child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                            child.innerHTML = "<font color='red'>" + data.error + "</font>";
                        } else {
                            child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                            if (data.level == 'Closed') {
                                data.level = {
                                    color: 'red',
                                    state: data.level
                                };
                            } else {
                                data.level = {
                                    color: 'green',
                                    state: data.level
                                };
                            }
                            if (data.percent < 0) {
                                data.percent = '';
                            } else {
                                data.percent = ' &#126; ' + (100 - data.percent) + '% left';
                            }
                            child.innerHTML = 'Toxic spill is now - <font color="' + data.level.color + '">' + data.level.state + '</font>' + data.percent;
                        }
                    }, error: function (error) {
                        error = JSON.parse(error);

                        child = document.getElementById('NOB' + LOCATION_TIMERS[4][0]);
                        child.innerHTML = "<font color='red'>" + error + " error, probably hornTracker, google, or my scripts broke. Please wait awhile, if not just contact me.</font>";
                    }
                });
            }*/

        if (runOnly == 'all')
            nobCalculateOfflineTimers();
    } catch (e) {
        if (debug) console.log("updateTime ERR - " + e);
    }
}

function nobCalculateOfflineTimers(runOnly) {
    //if (debug) console.log('nobCalculateOfflineTimers(' + runOnly + ')');
    if (runOnly != 'seasonal' && runOnly != 'balack' && runOnly != 'fg')
        runOnly = 'all';

    var CurrentTime = currentTimeStamp();
    var CurrentName = -1;
    var CurrentBreakdown = 0;
    var TotalBreakdown = 0;
    var iCount2;

    if (runOnly == 'seasonal') {
        for (iCount2 = 0; iCount2 < LOCATION_TIMERS[0][1].breakdown.length; iCount2++)
            TotalBreakdown += LOCATION_TIMERS[0][1].breakdown[iCount2];

        var CurrentValue = Math.floor((CurrentTime - LOCATION_TIMERS[0][1].first) / LOCATION_TIMERS[0][1].length) % TotalBreakdown;

        for (iCount2 = 0; iCount2 < LOCATION_TIMERS[0][1].breakdown.length && CurrentName == -1; iCount2++) {
            CurrentBreakdown += LOCATION_TIMERS[0][1].breakdown[iCount2];

            if (CurrentValue < CurrentBreakdown) {
                CurrentName = iCount2;
            }
        }

        var SeasonLength = (LOCATION_TIMERS[0][1].length * LOCATION_TIMERS[0][1].breakdown[CurrentName]);
        var CurrentTimer = (CurrentTime - LOCATION_TIMERS[0][1].first);
        var SeasonRemaining = 0;

        while (CurrentTimer > 0) {
            for (iCount2 = 0; iCount2 < LOCATION_TIMERS[0][1].breakdown.length && CurrentTimer > 0; iCount2++) {
                SeasonRemaining = CurrentTimer;
                CurrentTimer -= (LOCATION_TIMERS[0][1].length * LOCATION_TIMERS[0][1].breakdown[iCount2]);
            }
        }

        SeasonRemaining = SeasonLength - SeasonRemaining;

        return LOCATION_TIMERS[0][1].name[CurrentName];
    } else if (runOnly == 'all') {
        for (i = 0; i < 4; i++) {
            // Reset var
            CurrentTime = currentTimeStamp();
            CurrentName = -1;
            CurrentBreakdown = 0;
            TotalBreakdown = 0;

            for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length; iCount2++)
                TotalBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

            var CurrentValue = Math.floor((CurrentTime - LOCATION_TIMERS[i][1].first) / LOCATION_TIMERS[i][1].length) % TotalBreakdown;

            for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentName == -1; iCount2++) {
                CurrentBreakdown += LOCATION_TIMERS[i][1].breakdown[iCount2];

                if (CurrentValue < CurrentBreakdown) {
                    CurrentName = iCount2;
                }
            }

            var SeasonLength = (LOCATION_TIMERS[i][1].length * LOCATION_TIMERS[i][1].breakdown[CurrentName]);
            var CurrentTimer = (CurrentTime - LOCATION_TIMERS[i][1].first);
            var SeasonRemaining = 0;

            while (CurrentTimer > 0) {
                for (iCount2 = 0; iCount2 < LOCATION_TIMERS[i][1].breakdown.length && CurrentTimer > 0; iCount2++) {
                    SeasonRemaining = CurrentTimer;
                    CurrentTimer -= (LOCATION_TIMERS[i][1].length * LOCATION_TIMERS[i][1].breakdown[iCount2]);
                }
            }

            SeasonRemaining = SeasonLength - SeasonRemaining;

            var seasonalDiv = document.getElementById('NOB' + LOCATION_TIMERS[i][0]);
            var content = "";
            content += LOCATION_TIMERS[i][0] + ': <font color="' + LOCATION_TIMERS[i][1].color[CurrentName] + '">' + LOCATION_TIMERS[i][1].name[CurrentName] + '</font>';
            if (LOCATION_TIMERS[i][1].effective != null) {
                content += ' (' + LOCATION_TIMERS[i][1].effective[CurrentName] + ')';
            }

            content += ' &#126; For ' + updateTimer(SeasonRemaining, true);
            seasonalDiv.innerHTML = content;
        }
        return;
    }
}

// Attempt to inject addonCode made by user
function runAddonCode() {
    if (!NOBhasPuzzle && addonCode != "") {
        console.log("%cRUNNING ADDON CODE, SCRIPT IS NOW NOT SAFE DEPENDING ON WHAT YOU DID.", "color: yellow; background: red; font-size: 50pt;");
        eval(addonCode);
    }
}
