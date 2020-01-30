// ==UserScript==
// @name        MouseHunt AutoBot Enhanced Edition
// @author      Ooi Keng Siang, CnN
// @version    	1.37.9
// @namespace   http://ooiks.com/blog/mousehunt-autobot, https://devcnn.wordpress.com/
// @description Ooiks: An advance user script to automate sounding the hunter horn in MouseHunt application in Facebook with MouseHunt version 3.0 (Longtail) supported and many other features. CnN: An enhanced version to sound horn based on selected algorithm of event or location.
// @require		https://code.jquery.com/jquery-2.2.2.min.js
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @grant		unsafeWindow
// @grant		GM_info
// ==/UserScript==

// == Basic User Preference Setting (Begin) ==
// // The variable in this section contain basic option will normally edit by most user to suit their own preference
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Extra delay time before sounding the horn. (in seconds)
// // Default: 5 - 180
var hornTimeDelayMin = 10;
var hornTimeDelayMax = 30;

// // Bot aggressively by ignore all safety measure such as check horn image visible before sounding it. (true/false)
// // Note: Highly recommended to turn off because it increase the chances of getting caught in botting.
// // Note: It will ignore the hornTimeDelayMin and hornTimeDelayMax.
// // Note: It may take a little bit extra of CPU processing power.
var aggressiveMode = false;

// // Enable trap check once an hour. (true/false)
var enableTrapCheck = true;

// // Trap check time different value (00 minutes - 45 minutes)
// // Note: Every player had different trap check time, set your trap check time here. It only take effect if enableTrapCheck = true;
// // Example: If you have XX:00 trap check time then set 00. If you have XX:45 trap check time, then set 45.
var trapCheckTimeDiff = 0;

// // Extra delay time to trap check. (in seconds)
// // Note: It only take effect if enableTrapCheck = true;
var checkTimeDelayMin = 5;
var checkTimeDelayMax = 10;

// // Play sound when encounter king's reward (true/false)
var isKingWarningSound = false;

// // Auto solve KR
var isAutoSolve = false;

// // Extra delay time before solving KR. (in seconds)
// // Default: 10 - 30
var krDelayMin = 10;
var krDelayMax = 30;

// // Time to start and stop solving KR. (in hours, 24-hour format)
// // Example: Script would not auto solve KR between 00:00 - 6:00 when krStopHour = 0 & krStartHour = 6;
// // To disable this feature, set both to the same value.
var krStopHour = 0;
var krStartHour = 6;

// // Extra delay time to start solving KR after krStartHour. (in minutes)
var krStartHourDelayMin = 10;
var krStartHourDelayMax = 30;

// // Time offset (in seconds) between client time and internet time
// // -ve - Client time ahead of internet time
// // +ve - Internet time ahead of client time
var g_nTimeOffset = 0;

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

// == Basic User Preference Setting (End) ==


// == Advance User Preference Setting (Begin) ==
// // The variable in this section contain some advance option that will change the script behavior.
// // Edit this variable only if you know what you are doing
// // Reload MouseHunt page manually if edit this script while running it for immediate effect.

// // Display timer and message in page title. (true/false)
var showTimerInTitle = false;

// // Embed a timer in page to show next hunter horn timer, highly recommanded to turn on. (true/false)
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
var redSpongeCharm = ['Red Double', 'Red Sponge'];
var yellowSpongeCharm = ['Yellow Double', 'Yellow Sponge'];
var spongeCharm = ['Double Sponge', 'Sponge'];

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

// == Advance User Preference Setting (End) ==


// WARNING - Do not modify the code below unless you know how to read and write the script.

// All global variable declaration and default value
var g_strVersion = "";
var g_strScriptHandler = "";
var fbPlatform = false;
var hiFivePlatform = false;
var mhPlatform = false;
var mhMobilePlatform = false;
var g_strHTTP = 'http';
var lastDateRecorded = new Date();
var hornTime = 900;
var hornTimeDelay = 0;
var checkTimeDelay = 0;
var isKingReward = false;
var lastKingRewardSumTime;
var g_nBaitQuantity = -1;
var huntLocation;
var currentLocation;
var today = new Date();
var checkTime;
var hornRetryMax = 10;
var hornRetry = 0;
var nextActiveTime = 900;
var timerInterval = 2;
var checkMouseResult = null;
var mouseList = [];
var discharge = false;
var arming = false;
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
var strHornButton = 'hornbutton';
var strCampButton = 'campbutton';
var isNewUI = false;
var debugKR = false;

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

function FinalizePuzzleImageAnswer(answer) {
    var myFrame;
    if (answer.length != 5) {
        //Get a new puzzle
        if (kingsRewardRetry >= kingsRewardRetryMax) {
            kingsRewardRetry = 0;
            setStorage("KingsRewardRetry", kingsRewardRetry);
            var strTemp = 'Max ' + kingsRewardRetryMax + 'retries. Pls solve it manually ASAP.';
            alert(strTemp);
            displayTimer(strTemp, strTemp, strTemp);
            console.perror(strTemp);
            return;
        }
        else {
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
    }
    else {
        //Submit answer
        var puzzleAns = document.getElementById("puzzle_answer");
        if (isNewUI) puzzleAns = document.getElementsByClassName("mousehuntPage-puzzle-form-code")[0];
        if (!puzzleAns) {
            console.plog("puzzleAns:", puzzleAns);
            return;
        }
        puzzleAns.value = "";
        puzzleAns.value = answer.toLowerCase();
        var puzzleSubmit = document.getElementById("puzzle_submit");
        if (isNewUI) puzzleSubmit = document.getElementsByClassName("mousehuntPage-puzzle-form-code-button")[0];
        if (!puzzleSubmit) {
            console.plog("puzzleSubmit:", puzzleSubmit);
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
    if (!debugKR && !isAutoSolve)
        return;

    console.plog("Event origin:", event.origin);
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
        }
        else if (event.data.indexOf("#") > -1) {
            var value = event.data.substring(1, event.data.length);
            setStorage("krCallBack", value);
        }
        else if (event.data.indexOf('Log_') > -1)
            console.plog(event.data.split('_')[1]);
        else if (event.data.indexOf('MHAKRS_') > -1) {
            var temp = event.data.split('_');
            console.plog(temp[0], temp[1]);
            setStorage(temp[0], temp[1]);
        }
    }
}

window.addEventListener("message", receiveMessage, false);
if (debugKR)
    CallKRSolver();

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
    }
    else {
        g_strScriptHandler = GM_info.scriptHandler + " " + GM_info.version;
        g_strVersion = GM_info.script.version;
    }
}
catch (e) {
    console.perror('Before exeScript', e.message);
    getMapPort = undefined;
    g_strVersion = undefined;
    g_strScriptHandler = undefined;
}

exeScript();

function exeScript() {
    console.plog("exeScript() Start");
    browser = browserDetection();
    if (!(browser == 'opera' || browser == 'chrome')) {
        console.plog(browser + " not supported.");
        console.plog("exeScript() End");
        return;
    }
    setStorage('MHAB', g_strVersion);
    setStorage('ScriptHandler', g_strScriptHandler);
    // check the trap check setting first
    trapCheckTimeDiff = GetTrapCheckTime();

    if (trapCheckTimeDiff == 60)
        trapCheckTimeDiff = 0;
    else if (trapCheckTimeDiff < 0 || trapCheckTimeDiff > 60) {
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
        }
        else if (window.location.href.indexOf("hi5.com/friend/games/MouseHunt") != -1) {
            contentElement = document.getElementById('apps-canvas-body');
            if (contentElement) {
                breakFrameDivElement = document.createElement('div');
                breakFrameDivElement.setAttribute('id', 'breakFrameDivElement');
                breakFrameDivElement.innerHTML = "Timer cannot show on title page. You can <a href='http://mousehunt.hi5.hitgrab.com/'>run MouseHunt without iFrame (Hi5)</a> to enable timer on title page";
                contentElement.parentNode.insertBefore(breakFrameDivElement, contentElement);
            }
            contentElement = undefined;
        }
    }

    // check user running this script from where
    if (window.location.href.indexOf("mousehuntgame.com/canvas/") != -1) {
        // from facebook
        fbPlatform = true;
        setStorage('Platform', 'FB');
    }
    else if (window.location.href.indexOf("mousehuntgame.com") != -1) {
        // need to check if it is running in mobile version
        var version = getCookie("switch_to");
        if (version !== null && version == "mobile") {
            // from mousehunt game mobile version
            mhMobilePlatform = true;
            setStorage('Platform', 'MHMobile');
        }
        else {
            // from mousehunt game standard version
            mhPlatform = true;
            setStorage('Platform', 'MH');
        }
        version = undefined;
    }
    else if (window.location.href.indexOf("mousehunt.hi5.hitgrab.com") != -1) {
        // from hi5
        hiFivePlatform = true;
        setStorage('Platform', 'Hi5');
    }

    // check if user running in https secure connection
    var bSecureConnection = (window.location.href.indexOf("https://") > -1);
    g_strHTTP = (bSecureConnection) ? 'https' : 'http';
    setStorage('HTTPS', bSecureConnection);

    if (fbPlatform) {
        // alert("This script doesnt work under Facebook MH at this moment");
        // return;
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
            }
            else {
                // fail to retrieve data, display error msg and reload the page
                document.title = "Fail to retrieve data from page. Reloading in " + timeFormat(errorReloadTime);
                window.setTimeout(function () {
                    reloadPage(false);
                }, errorReloadTime * 1000);
            }
        }
        else {
            // not in huntcamp, just show the title of autobot version
            embedTimer(false);
        }
    }
    else if (mhPlatform) {
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
            }
            else {
                // fail to retrieve data, display error msg and reload the page
                document.title = "Fail to retrieve data from page. Reloading in " + timeFormat(errorReloadTime);
                window.setTimeout(function () {
                    reloadPage(false);
                }, errorReloadTime * 1000);
            }
        }
        else {
            // not in huntcamp, just show the title of autobot version
            embedTimer(false);
        }
    }
    else if (mhMobilePlatform) {
        // execute at all page of mobile version
        // page to execute the script!

        // make sure all the preference already loaded
        loadPreferenceSettingFromStorage();

        // embed a place where timer show
        embedTimer(false);
    }
    else if (hiFivePlatform) {
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
            }
            else {
                // fail to retrieve data, display error msg and reload the page
                document.title = "Fail to retrieve data from page. Reloading in " + timeFormat(errorReloadTime);
                window.setTimeout(function () {
                    reloadPage(false);
                }, errorReloadTime * 1000);
            }
        }
        else {
            // not in huntcamp, just show the title of autobot version
            embedTimer(false);
        }
    }
    console.plog("exeScript() End");
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
    var gotIntroContainerDiv = false;

    var introContainerDiv = document.getElementById('introContainer');
    if (introContainerDiv) {
        introContainerDiv = undefined;
        gotIntroContainerDiv = true;
    }
    else {
        gotIntroContainerDiv = false;
    }

    try {
        return (gotIntroContainerDiv);
    }
    finally {
        gotIntroContainerDiv = undefined;
    }
}

function notifyMe(notice, icon, body) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check if the user is okay to get some notification
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(notice, {'icon': icon, 'body': body});
    }
    // Otherwise, we need to ask the user for permission
    // Note, Chrome does not implement the permission static property
    // So we have to check for NOT 'denied' instead of 'default'
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // Whatever the user answers, we make sure we store the information
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }

            // If the user is okay, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(notice, {'icon': icon, 'body': body});
            }
        });
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

function specialFeature(caller) {
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
}

function eventLocationCheck(caller) {
    var selAlgo = getStorageToVariableStr("eventLocation", "None");
    var temp = "";
    switch (selAlgo) {
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
        case 'Iceberg':
            iceberg();
            break;
        case 'WWRift':
            wwrift();
            break;
        case 'GES':
            ges();
            break;
        case 'GWH2016R':
            gwh();
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
            LGGeneral(temp);
            break;
        case 'SG':
            seasonalGarden();
            break;
        case 'ZT':
            zugzwangTower();
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
        case 'Labyrinth':
            labyrinth();
            break;
        case 'Zokor':
            zokor();
            break;
        case 'Fiery Warpath':
            fw();
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
        case 'Test':
            checkThenArm('any', 'bait', ['Gouda', 'Brie']);
            break;
        default:
            break;
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
    }
    else {
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
    }
    else {
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
    }
    else if (strChamberName == 'RIFT')
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
    }
    else if (strChamberName == 'GUARD') {
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
    }
    else {
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
    }
    else if (objUser.current_phase == 'night') {
        nIndex = objFRox.stage.indexOf(objUser.current_stage);
        console.plog('In Night, Current Stage:', objUser.current_stage);
    }
    else if (objUser.current_phase == 'day') {
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
    }
    else {
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
    }
    else {
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
        }
        else {
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

function iceberg() {
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

function LGGeneral(objLG) {
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

function labyrinth() {
    if (GetCurrentLocation().indexOf("Labyrinth") < 0)
        return;

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
            }
            else {
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

function retrieveDataFirst() {
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
                    hornTimeStartIndex += 25;
                    var hornTimeEndIndex = scriptString.indexOf(",", hornTimeStartIndex);
                    var hornTimerString = scriptString.substring(hornTimeStartIndex, hornTimeEndIndex);
                    nextActiveTime = parseInt(hornTimerString);

                    hornTimeDelay = hornTimeDelayMin + Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));
                    //console.plog('Horn Time:', nextActiveTime, 'Delay:', hornTimeDelay);
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
                    }
                    else {
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
                    g_nBaitQuantity = parseInt(baitQuantityString);

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
            }
            else {
                huntLocation = huntLocationCookie;
                setStorage("huntLocation", huntLocation);
            }
            huntLocationCookie = undefined;

            // get last king reward time
            var lastKingRewardDate = getStorage("lastKingRewardDate");
            if (isNullOrUndefined(lastKingRewardDate)) {
                lastKingRewardSumTime = -1;
            }
            else {
                var lastDate = new Date(lastKingRewardDate);
                lastKingRewardSumTime = parseInt((new Date() - lastDate) / 1000);
                lastDate = undefined;
            }
            lastKingRewardDate = undefined;

            retrieveSuccess = true;
        }
        else {
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
    }
    else
        return false;
}

function getBaitQuantity() {
    var hudBaitQuantity = document.getElementsByClassName('hud_baitQuantity');
    if (hudBaitQuantity !== null) {
        return parseInt(hudBaitQuantity.textContent);
    }
    else {
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
    }
    else {
        tempLocation = document.getElementById('hud_location');
        if (!isNullOrUndefined(tempLocation))
            return tempLocation.textContent;
        else
            return "";
    }
}

function retrieveData() {
    try {
        // get next horn time
        currentLocation = getCurrentLocation();
        isKingReward = getKingRewardStatus();
        g_nBaitQuantity = getBaitQuantity();
        nextActiveTime = GetHornTime();
        if (nextActiveTime === "" || isNaN(nextActiveTime)) {
            // fail to retrieve data, might be due to slow network

            // reload the page to see it fix the problem
            window.setTimeout(function () {
                reloadWithMessage("Fail to retrieve data. Reloading...", false);
            }, 5000);
        }
        else {
            // got the timer right!
            if (nextActiveTime === 0)
                hornTimeDelay = 0;
            else {
                // calculate the delay
                hornTimeDelay = hornTimeDelayMin + Math.round(Math.random() * (hornTimeDelayMax - hornTimeDelayMin));
            }
            console.plog('Horn Time:', nextActiveTime, 'Delay:', hornTimeDelay);
            if (!aggressiveMode) {
                // safety mode, include extra delay like time in horn image appear
                hornTime = nextActiveTime + hornTimeDelay;
            }
            else {
                // aggressive mode, no extra delay like time in horn image appear
                hornTime = nextActiveTime;
            }
            lastDateRecorded = new Date();
        }

        // get trap check time
        CalculateNextTrapCheckInMinute();
        getJournalDetail();
        eventLocationCheck('retrieveData()');
        specialFeature('retrieveData()');
        mapHunting();
    }
    catch (e) {
        console.perror('retrieveData', e.message);
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
            var minStr = journalDateStr.substr(midIndex + 1, 2);
            var hourSysStr = journalDateStr.substr(spaceIndex + 1, 2);

            var nowDate = new Date();
            var lastHuntDate = new Date();
            if (hourSysStr == "am") {
                lastHuntDate.setHours(parseInt(hrStr), parseInt(minStr), 0, 0);
            }
            else {
                lastHuntDate.setHours(parseInt(hrStr) + 12, parseInt(minStr), 0, 0);
            }
            if (parseInt(nowDate - lastHuntDate) / 1000 > 900) {
                reload = true;
            }
            hrStr = undefined;
            minStr = undefined;
            nowDate = undefined;
            lastHuntDate = undefined;
        }
        else {
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
    }
    finally {
        reload = undefined;
    }
}

function action() {
    if (isKingReward) {
        kingRewardAction();
    }
    else if (pauseAtInvalidLocation && (huntLocation != currentLocation)) {
        // update timer
        displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");
        if (fbPlatform)
            displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='" + g_strHTTP + "://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
        else if (hiFivePlatform)
            displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='" + g_strHTTP + "://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
        else if (mhPlatform)
            displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='" + g_strHTTP + "://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
        displayKingRewardSumTime(null);
        // pause script
    }
    else if (g_nBaitQuantity === 0) {
        // update timer
        displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
        displayLocation(huntLocation);
        displayKingRewardSumTime(null);

        // pause the script
    }
    else {
        // update location
        displayLocation(huntLocation);

        var isHornSounding = false;

        // check if the horn image is visible
        var headerElement = (isNewUI) ? document.getElementById('mousehuntHud').firstChild : document.getElementById('header');
        if (headerElement) {
            var headerStatus = headerElement.getAttribute('class');
            headerStatus = headerStatus.toLowerCase();
            if (headerStatus.indexOf("hornready") != -1) {
                // if the horn image is visible, why do we need to wait any more, sound the horn!
                soundHorn();

                // make sure the timer don't run twice!
                isHornSounding = true;
            }
            headerStatus = undefined;
        }
        headerElement = undefined;

        if (isHornSounding === false) {
            // start timer
            window.setTimeout(function () {
                countdownTimer();
            }, timerRefreshInterval * 1000);
        }

        isHornSounding = undefined;
        try {
            getJournalDetail();
            eventLocationCheck('action()');
            specialFeature('action()');
            mapHunting();
        }
        catch (e) {
            console.perror('action:', e.message);
        }
    }
}

function countdownTimer() {
    try {
        if (isKingReward) {
            // update timer
            displayTimer("King's Reward!", "King's Reward!", "King's Reward!");
            displayKingRewardSumTime("Now");
            lastKingRewardSumTime = 0;
            if (isNewUI) {
                reloadPage(false);
            }
            else {
                // reload the page so that the sound can be play
                // simulate mouse click on the camp button
                fireEvent(document.getElementsByClassName(strCampButton)[0].firstChild, 'click');
            }

            // reload the page if click on the camp button fail
            window.setTimeout(function () {
                reloadWithMessage("Fail to click on camp button. Reloading...", false);
            }, 5000);
        }
        else if (pauseAtInvalidLocation && (huntLocation != currentLocation)) {
            // update timer
            displayTimer("Out of pre-defined hunting location...", "Out of pre-defined hunting location...", "Out of pre-defined hunting location...");
            if (fbPlatform)
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='" + g_strHTTP + "://www.mousehuntgame.com/canvas/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            else if (hiFivePlatform)
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='" + g_strHTTP + "://mousehunt.hi5.hitgrab.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            else if (mhPlatform)
                displayLocation("<font color='red'>" + currentLocation + "</font> [<a onclick='window.localStorage.removeItem(\"huntLocation\");' href='" + g_strHTTP + "://www.mousehuntgame.com/\'>Hunt Here</a>] - <i>Script pause because you had move to a different location recently, click hunt here to continue hunt at this location.</i>");
            displayKingRewardSumTime(null);

            // pause script
        }
        else {
            var dateNow = new Date();
            var intervalTime = timeElapsed(lastDateRecorded, dateNow);
            lastDateRecorded = undefined;
            lastDateRecorded = dateNow;
            dateNow = undefined;

            if (enableTrapCheck) checkTime -= intervalTime;

            // update time
            hornTime -= intervalTime;
            if (lastKingRewardSumTime != -1) {
                lastKingRewardSumTime += intervalTime;
            }

            intervalTime = undefined;

            if (hornTime <= 0) {
                // blow the horn!
                hornTime = 0;
                if (getBaitQuantity() > 0)
                    soundHorn();
                else {
                    displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
                    displayLocation(huntLocation);
                    displayKingRewardSumTime(null);
                }
            }
            else if (enableTrapCheck && checkTime <= 0) {
                // trap check!
                if (getBaitQuantity() > 0)
                    trapCheck();
                else {
                    displayTimer("No more cheese!", "Cannot hunt without the cheese...", "Cannot hunt without the cheese...");
                    displayLocation(huntLocation);
                    displayKingRewardSumTime(null);
                }
            }
            else {
                if (enableTrapCheck) {
                    // update timer
                    if (!aggressiveMode) {
                        displayTimer("Horn: " + timeFormat(hornTime) + " | Check: " + timeFormat(checkTime),
                            timeFormat(hornTime) + "  <i>(included extra " + timeFormat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
                            timeFormat(checkTime) + "  <i>(included extra " + timeFormat(checkTimeDelay) + " delay)</i>");
                    }
                    else {
                        displayTimer("Horn: " + timeFormat(hornTime) + " | Check: " + timeFormat(checkTime),
                            timeFormat(hornTime) + "  <i>(lot faster than MouseHunt timer)</i>",
                            timeFormat(checkTime) + "  <i>(included extra " + timeFormat(checkTimeDelay) + " delay)</i>");
                    }
                }
                else {
                    // update timer
                    if (!aggressiveMode) {
                        displayTimer("Horn: " + timeFormat(hornTime),
                            timeFormat(hornTime) + "  <i>(included extra " + timeFormat(hornTimeDelay) + " delay & +/- 5 seconds different from MouseHunt timer)</i>",
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
                    }
                    else {
                        displayTimer("Horn: " + timeFormat(hornTime),
                            timeFormat(hornTime) + "  <i>(lot faster than MouseHunt timer)</i>",
                            "-");

                        // agressive mode should sound the horn whenever it is possible to do so.
                        var headerElement = (isNewUI) ? document.getElementById('mousehuntHud').firstChild : document.getElementById('header');
                        if (headerElement) {
                            var headerStatus = headerElement.getAttribute('class');
                            headerStatus = headerStatus.toLowerCase();
                            // the horn image appear before the timer end
                            if (headerStatus.indexOf("hornready") != -1) {
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
                    (countdownTimer)();
                }, timerRefreshInterval * 1000);
            }
        }
    }
    catch (e) {
        console.perror('countdownTimer', e.message);
    }
}

function reloadPage(soundHorn) {
    // reload the page
    var strTurn = (soundHorn) ? "turn.php" : "";
    if (fbPlatform) {
        // for Facebook only
        window.location.href = g_strHTTP + "://www.mousehuntgame.com/canvas/" + strTurn;
    }
    else if (hiFivePlatform) {
        // for Hi5 only
        window.location.href = g_strHTTP + "://mousehunt.hi5.hitgrab.com/" + strTurn;
    }
    else if (mhPlatform) {
        // for mousehunt game only
        window.location.href = g_strHTTP + "://www.mousehuntgame.com/" + strTurn;
    }
}

function reloadWithMessage(msg, soundHorn) {
    // display the message
    displayTimer(msg, msg, msg, msg);

    // reload the page
    reloadPage(soundHorn);

    msg = undefined;
    soundHorn = undefined;
}

// ################################################################################################
//   Timer Function - Start
// ################################################################################################

function embedTimer(targetPage) {
    if (showTimerInPage) {
        var headerElement;
        if (fbPlatform || hiFivePlatform || mhPlatform)
            headerElement = document.getElementById('noscript');
        else if (mhMobilePlatform)
            headerElement = document.getElementById('mobileHorn');

        if (headerElement) {
            var timerDivElement = document.createElement('div');

            var hr1Element = document.createElement('hr');
            timerDivElement.appendChild(hr1Element);
            hr1Element = null;

            // show bot title and version
            var titleElement = document.createElement('div');
            titleElement.setAttribute('id', 'titleElement');
            if (targetPage && aggressiveMode)
                titleElement.innerHTML = "<a href=\"http://devcnn.wordpress.com\" target=\"_blank\"><b>MouseHunt AutoBot (version " + g_strVersion + " Enhanced Edition)</b></a> - <font color='red'>Aggressive Mode</font>";
            else if (targetPage && browser != 'chrome' && browser != 'opera')
                titleElement.innerHTML = "<a href=\"http://devcnn.wordpress.com\" target=\"_blank\"><b>MouseHunt AutoBot (version " + g_strVersion + " Enhanced Edition)</b></a> - <font color='red'><b>Pls use Chrome browser for fully working features</b></font>";
            else
                titleElement.innerHTML = "<a href=\"http://devcnn.wordpress.com\" target=\"_blank\"><b>MouseHunt AutoBot (version " + g_strVersion + " Enhanced Edition)</b></a>";
            timerDivElement.appendChild(titleElement);
            titleElement = null;

            if (targetPage) {
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
                if (isNullOrUndefined(lastKingRewardDate)) {
                    lastDateStr = "-";
                }
                else {
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
                    timerDivElement.appendChild(loadTimeElement);

                    loadTimeElement = null;
                    nowDate = null;
                }
            }
            else {
                // player currently navigating other page instead of hunter camp
                var helpTextElement = document.createElement('div');
                helpTextElement.setAttribute('id', 'helpTextElement');
                if (fbPlatform)
                    helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='" + g_strHTTP + "://www.mousehuntgame.com/canvas/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                else if (hiFivePlatform)
                    helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='" + g_strHTTP + "://mousehunt.hi5.hitgrab.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                else if (mhPlatform)
                    helpTextElement.innerHTML = "<b>Note:</b> MouseHunt AutoBot will only run at <a href='" + g_strHTTP + "://www.mousehuntgame.com/'>Hunter Camp</a>. This is to prevent the bot from interfering user's activity.";
                else if (mhMobilePlatform)
                    helpTextElement.innerHTML = "<b>Note:</b> Mobile version of Mousehunt is not supported currently. Please use the <a href='" + g_strHTTP + "://www.mousehuntgame.com/?switch_to=standard'>standard version of MouseHunt</a>.";
                timerDivElement.appendChild(helpTextElement);

                helpTextElement = null;
            }

            var showPreference = getStorage('showPreference');
            if (isNullOrUndefined(showPreference)) {
                showPreference = false;
                setStorage("showPreference", showPreference);
            }

            var showPreferenceLinkDiv = document.createElement('div');
            showPreferenceLinkDiv.setAttribute('id', 'showPreferenceLinkDiv');
            showPreferenceLinkDiv.setAttribute('style', 'text-align:right');
            timerDivElement.appendChild(showPreferenceLinkDiv);

            var showPreferenceSpan = document.createElement('span');
            var showPreferenceLinkStr = '<a id="showPreferenceLink" style="display:none" name="showPreferenceLink" onclick="\
				if (document.getElementById(\'showPreferenceLink\').innerHTML == \'<b>[Hide Preference]</b>\'){\
					document.getElementById(\'preferenceDiv\').style.display=\'none\';\
					document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Show Preference]</b>\';\
				}\
				else{\
					setLocalToSession();\
					var selectedAlgo = window.sessionStorage.getItem(\'eventLocation\');\
					showOrHideTr(selectedAlgo);\
					document.getElementById(\'preferenceDiv\').style.display=\'block\';\
					document.getElementById(\'showPreferenceLink\').innerHTML=\'<b>[Hide Preference]</b>\';\
					document.getElementById(\'eventAlgo\').value = selectedAlgo;\
					initControlsBestTrap();\
				}\
				">';
            if (showPreference === true)
                showPreferenceLinkStr += '<b>[Hide Preference]</b>';
            else
                showPreferenceLinkStr += '<b>[Show Preference]</b>';
            showPreferenceLinkStr += '</a>';
            showPreferenceLinkStr += '&nbsp;&nbsp;&nbsp;';

            var restorePreferenceStr = '<input type="file" id="inputFiles" name="files" style="display:none;" onchange="handleFiles(this.files)"/>';
            restorePreferenceStr += '<a id="idRestore" style="display:none" name="Restore" title="Click to restore preference" onclick="onIdRestoreClicked();">';
            if (getSessionStorage('bRestart') != 'true')
                restorePreferenceStr += '<b>[Restore]</b>';
            else
                restorePreferenceStr += '<b>Restart browser is required!</b>';
            restorePreferenceStr += '</a>&nbsp;&nbsp;&nbsp;';
            var getLogPreferenceStr = '<a id="idGetLogAndPreference" style="display:none" name="GetLogAndPreference" title="Click to get saved log & preference" onclick="onIdGetLogPreferenceClicked();">';
            getLogPreferenceStr += '<b>[Get Log & Preference / Backup]</b></a>&nbsp;&nbsp;&nbsp;';
            var clearTrapListStr = '<a id="clearTrapList" style="display:none" name="clearTrapList" title="Click to clear trap list from localStorage and trap list will be updated on the next arming by script" onclick="\
				window.localStorage.removeItem(\'TrapListWeapon\');\
				window.localStorage.removeItem(\'TrapListBase\');\
				window.localStorage.removeItem(\'TrapListTrinket\');\
				window.localStorage.removeItem(\'TrapListBait\');\
				window.localStorage.removeItem(\'LastRecordedJournal\');\
				document.getElementById(\'clearTrapList\').getElementsByTagName(\'b\')[0].innerHTML = \'[Done!]\';\
				window.setTimeout(function () { document.getElementById(\'clearTrapList\').getElementsByTagName(\'b\')[0].innerHTML = \'[Clear Trap List]\'; }, 1000);\
				">';
            clearTrapListStr += '<b>[Clear Trap List]</b></a>&nbsp;&nbsp;&nbsp;';
            showPreferenceSpan.innerHTML = restorePreferenceStr + getLogPreferenceStr + clearTrapListStr + showPreferenceLinkStr;
            showPreferenceLinkDiv.appendChild(showPreferenceSpan);
            showPreferenceLinkStr = null;
            showPreferenceSpan = null;
            showPreferenceLinkDiv = null;

            var hr2Element = document.createElement('hr');
            timerDivElement.appendChild(hr2Element);
            hr2Element = null;

            var temp = "";
            var i;
            var preferenceHTMLStr = '<table border="0" width="100%">';
            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Bot aggressively by ignore all safety measure such as check horn image visible before sounding it"><b>Aggressive Mode</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="AggressiveModeInput" onchange="var isDisable = (value == \'true\') ? \'disabled\' : \'\'; document.getElementById(\'HornTimeDelayMinInput\').disabled=isDisable; document.getElementById(\'HornTimeDelayMaxInput\').disabled=isDisable;">';
            if (aggressiveMode) {
                preferenceHTMLStr += '<option value="false">False</option>';
                preferenceHTMLStr += '<option value="true" selected>True</option>';
                temp = 'disabled';
            }
            else {
                preferenceHTMLStr += '<option value="false" selected>False</option>';
                preferenceHTMLStr += '<option value="true">True</option>';
                temp = '';
            }
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Extra delay time before sounding the horn (in seconds)"><b>Delay:</b></a>&emsp;';
            preferenceHTMLStr += '<input type="number" id="HornTimeDelayMinInput" min="0" max="360" size="5" value="' + hornTimeDelayMin.toString() + '" ' + temp + '> seconds ~ ';
            preferenceHTMLStr += '<input type="number" id="HornTimeDelayMaxInput" min="1" max="361" size="5" value="' + hornTimeDelayMax.toString() + '" ' + temp + '> seconds';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Enable trap check once an hour"><b>Trap Check</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="TrapCheckInput" onchange="var isDisable = (value == \'false\') ? \'disabled\' : \'\'; document.getElementById(\'TrapCheckTimeDelayMinInput\').disabled=isDisable; document.getElementById(\'TrapCheckTimeDelayMaxInput\').disabled=isDisable;">';
            if (enableTrapCheck) {
                preferenceHTMLStr += '<option value="false">False</option>';
                preferenceHTMLStr += '<option value="true" selected>True</option>';
                temp = '';
            }
            else {
                preferenceHTMLStr += '<option value="false" selected>False</option>';
                preferenceHTMLStr += '<option value="true">True</option>';
                temp = 'disabled';
            }
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Extra delay time to trap check (in seconds)"><b>Delay:</b></a>&emsp;';
            preferenceHTMLStr += '<input type="number" id="TrapCheckTimeDelayMinInput" min="0" max="360" size="5" value="' + checkTimeDelayMin.toString() + '" ' + temp + '> seconds ~ ';
            preferenceHTMLStr += '<input type="number" id="TrapCheckTimeDelayMaxInput" min="1" max="361" size="5" value="' + checkTimeDelayMax.toString() + '" ' + temp + '> seconds';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Play sound when encounter king\'s reward"><b>Play King Reward Sound</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="PlayKingRewardSoundInput" >';
            if (isKingWarningSound) {
                preferenceHTMLStr += '<option value="false">False</option>';
                preferenceHTMLStr += '<option value="true" selected>True</option>';
            }
            else {
                preferenceHTMLStr += '<option value="false" selected>False</option>';
                preferenceHTMLStr += '<option value="true">True</option>';
            }
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Solve King Reward automatically"><b>Auto Solve King Reward</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="AutoSolveKRInput" onchange="var isDisable = (value == \'false\') ? \'disabled\' : \'\'; document.getElementById(\'AutoSolveKRDelayMinInput\').disabled=isDisable; document.getElementById(\'AutoSolveKRDelayMaxInput\').disabled=isDisable;">';
            if (isAutoSolve) {
                preferenceHTMLStr += '<option value="false">False</option>';
                preferenceHTMLStr += '<option value="true" selected>True</option>';
                temp = '';
            }
            else {
                preferenceHTMLStr += '<option value="false" selected>False</option>';
                preferenceHTMLStr += '<option value="true">True</option>';
                temp = 'disabled';
            }
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Extra delay time to solve King Reward (in seconds)"><b>Delay:</b></a>&emsp;';
            preferenceHTMLStr += '<input type="number" id="AutoSolveKRDelayMinInput" min="0" max="360" size="5" value="' + krDelayMin.toString() + '" ' + temp + '> seconds ~ ';
            preferenceHTMLStr += '<input type="number" id="AutoSolveKRDelayMaxInput" min="1" max="361" size="5" value="' + krDelayMax.toString() + '" ' + temp + '> seconds';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Save King Reward image into localStorage"><b>Save King Reward Image</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="SaveKRImageInput" >';
            if (saveKRImage) {
                preferenceHTMLStr += '<option value="false">False</option>';
                preferenceHTMLStr += '<option value="true" selected>True</option>';
            }
            else {
                preferenceHTMLStr += '<option value="false" selected>False</option>';
                preferenceHTMLStr += '<option value="true">True</option>';
            }
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="View Saved King Reward Image from localStorage"><b>View King Reward Image</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="viewKR">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<input type="button" id="buttonViewKR" value="View" onclick="var keyValue = document.getElementById(\'viewKR\').value;var value = window.localStorage.getItem(keyValue);if(value.indexOf(\'data:image/png;base64,\') > -1){var pom = document.createElement(\'a\');pom.setAttribute(\'href\', value);pom.setAttribute(\'download\', keyValue.split(\'~\')[2]+\'.png\');if(document.createEvent){var event = document.createEvent(\'MouseEvents\');event.initEvent(\'click\', true, true);pom.dispatchEvent(event);}else pom.click();}else if(value.indexOf(\'i.imgur.com\') > -1){var win = window.open(value, \'_blank\');if(win)win.focus();else alert(\'Please allow popups for this site\');}">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="The script will pause if player at different location that hunt location set before"><b>Remember Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="PauseLocationInput" >';
            if (pauseAtInvalidLocation) {
                preferenceHTMLStr += '<option value="false">False</option>';
                preferenceHTMLStr += '<option value="true" selected>True</option>';
            }
            else {
                preferenceHTMLStr += '<option value="false" selected>False</option>';
                preferenceHTMLStr += '<option value="true">True</option>';
            }
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Best Weapon for </b></a>';
            preferenceHTMLStr += '<select id="selectBestTrapPowerType" style="width:75px;" onchange="initControlsBestTrap();">';
            preferenceHTMLStr += '<option value="arcane">Arcane</option>';
            preferenceHTMLStr += '<option value="draconic">Draconic</option>';
            preferenceHTMLStr += '<option value="forgotten">Forgotten</option>';
            preferenceHTMLStr += '<option value="hydro">Hydro</option>';
            preferenceHTMLStr += '<option value="law">Law</option>';
            preferenceHTMLStr += '<option value="physical">Physical</option>';
            preferenceHTMLStr += '<option value="rift">Rift</option>';
            preferenceHTMLStr += '<option value="shadow">Shadow</option>';
            preferenceHTMLStr += '<option value="tactical">Tactical</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBestTrapWeapon" style="width: 300px" onchange="saveBestTrap();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Best Base for </b></a>';
            preferenceHTMLStr += '<select id="selectBestTrapBaseType" style="width:75px;" onchange="initControlsBestTrap();">';
            preferenceHTMLStr += '<option value="luck">Luck</option>';
            preferenceHTMLStr += '<option value="power">Power</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBestTrapBase" onchange="saveBestTrap();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Support Me</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<input type="button" id="inputShowAds" value="Click to Show Ads" onclick="onIdAdsClicked()">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;" colspan="2">';
            preferenceHTMLStr += '(Changes above this line only take place after user save the preference) ';
            preferenceHTMLStr += '<input type="button" id="PreferenceSaveInput" value="Save" onclick="\
				window.localStorage.setItem(\'AggressiveMode\', 		document.getElementById(\'AggressiveModeInput\').value);\
				window.localStorage.setItem(\'HornTimeDelayMin\', 		document.getElementById(\'HornTimeDelayMinInput\').value);\
				window.localStorage.setItem(\'HornTimeDelayMax\', 		document.getElementById(\'HornTimeDelayMaxInput\').value);\
				window.localStorage.setItem(\'TrapCheck\', 				document.getElementById(\'TrapCheckInput\').value);\
				window.localStorage.setItem(\'TrapCheckTimeDelayMin\',	document.getElementById(\'TrapCheckTimeDelayMinInput\').value);\
				window.localStorage.setItem(\'TrapCheckTimeDelayMax\', 	document.getElementById(\'TrapCheckTimeDelayMaxInput\').value);\
				window.localStorage.setItem(\'PlayKingRewardSound\', 	document.getElementById(\'PlayKingRewardSoundInput\').value);\
				window.localStorage.setItem(\'AutoSolveKR\', 			document.getElementById(\'AutoSolveKRInput\').value);\
				window.localStorage.setItem(\'AutoSolveKRDelayMin\', 	document.getElementById(\'AutoSolveKRDelayMinInput\').value);\
				window.localStorage.setItem(\'AutoSolveKRDelayMax\', 	document.getElementById(\'AutoSolveKRDelayMaxInput\').value);\
				window.localStorage.setItem(\'SaveKRImage\', 			document.getElementById(\'SaveKRImageInput\').value);\
				window.localStorage.setItem(\'PauseLocation\', 			document.getElementById(\'PauseLocationInput\').value);\
				setSessionToLocal();\
				for(var i=0;i<window.sessionStorage.length;i++){\
					window.sessionStorage.removeItem(window.sessionStorage.key(i));\
				}\
				';
            if (fbPlatform)
                temp = 'window.location.href=\'' + g_strHTTP + '://www.mousehuntgame.com/canvas/\';';
            else if (hiFivePlatform)
                temp = 'window.location.href=\'' + g_strHTTP + '://www.mousehunt.hi5.hitgrab.com/\';';
            else if (mhPlatform)
                temp = 'window.location.href=\'' + g_strHTTP + '://www.mousehuntgame.com/\';';

            preferenceHTMLStr += temp + '"/>&nbsp;&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px" colspan="2">';
            preferenceHTMLStr += '<div style="width: 100%; height: 1px; background: #000000; overflow: hidden;">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trSpecialFeature" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select special feature"><b>Special Feature</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectSpecialFeature" onchange="onSelectSpecialFeature();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="PILLOWCASE">Open Magical Pillowcase</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Turn on/off Map Hunting feature"><b>Season 4 Map Hunting</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectMapHunting" onChange="onSelectMapHuntingChanged();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trUncaughtMouse" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Click button Get to retrieve all uncaught mouse"><b>Uncaught Mouse</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectMouseList"></select>';
            preferenceHTMLStr += '<input type="button" id="inputSelectMouse" title="Click to select the mouse from the left dropdown list" value="Select This Mouse" onclick="onInputSelectMouse();" disabled>&nbsp;&nbsp;';
            preferenceHTMLStr += '<input type="button" id="inputGetMouse" title="Click to Get all uncaught mouse from treasure map" value="Refresh Uncaught Mouse List" onclick="onInputGetMouse();">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trSelectedUncaughtMouse" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select desired uncaught mouse"><b>Selected Mouse</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<input type="text" id="inputUncaughtMouse" value="" disabled>&nbsp;&nbsp;';
            preferenceHTMLStr += '<input type="button" id="inputClearUncaughtMouse" title="Click to clear the selected mouse" value="Clear" onclick="onInputClearUncaughtMouse();">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trCatchLogic" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select desired catch logic"><b>Catch Logic</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectCatchLogic" onchange="saveMapHunting();">';
            preferenceHTMLStr += '<option value="OR">When either one of the Selected Mouse was caught</option>';
            preferenceHTMLStr += '<option value="AND">When all of the Selected Mouse were caught</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trMapHuntingTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select trap setup after catch logic is fulfilled"><b>After Caught</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectWeapon" style="width: 75px" onchange="saveMapHunting();">';
            preferenceHTMLStr += '<option value="Remain">Remain</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBase" style="width: 75px" onchange="saveMapHunting();">';
            preferenceHTMLStr += '<option value="Remain">Remain</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectTrinket" style="width: 75px" onchange="saveMapHunting();">';
            preferenceHTMLStr += '<option value="Remain">Remain</option>';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBait" style="width: 75px" onchange="saveMapHunting();">';
            preferenceHTMLStr += '<option value="Remain">Remain</option>';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trMapHuntingLeave" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to leave map after catch logic is fulfilled"><b>Leave Map After Caught</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectLeaveMap" onchange="saveMapHunting();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px" colspan="2">';
            preferenceHTMLStr += '<div style="width: 100%; height: 1px; background: #FFFFFF; overflow: hidden;">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select the script algorithm based on certain event / location"><b>Event or Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="eventAlgo" style="width:150px" onChange="window.sessionStorage.setItem(\'eventLocation\', value); showOrHideTr(value);">';
            preferenceHTMLStr += '<option value="None" selected>None</option>';
            preferenceHTMLStr += '<option value="All LG Area">All LG Area</option>';
            preferenceHTMLStr += '<option value="BC/JOD">BC => JOD</option>';
            preferenceHTMLStr += '<option value="Bristle Woods Rift">Bristle Woods Rift</option>';
            preferenceHTMLStr += '<option value="Burroughs Rift(Red)">Burroughs Rift(Red)</option>';
            preferenceHTMLStr += '<option value="Burroughs Rift(Green)">Burroughs Rift(Green)</option>';
            preferenceHTMLStr += '<option value="Burroughs Rift(Yellow)">Burroughs Rift(Yellow)</option>';
            preferenceHTMLStr += '<option value="Burroughs Rift Custom">Burroughs Rift Custom</option>';
            preferenceHTMLStr += '<option value="Charge Egg 2016 Medium + High">Charge Egg 2016 Medium + High</option>';
            preferenceHTMLStr += '<option value="Charge Egg 2016 High">Charge Egg 2016 High</option>';
            preferenceHTMLStr += '<option value="FG/AR">FG => AR</option>';
            preferenceHTMLStr += '<option value="Fiery Warpath">Fiery Warpath</option>';
            preferenceHTMLStr += '<option value="Fort Rox">Fort Rox</option>';
            preferenceHTMLStr += '<option value="Furoma Rift">Furoma Rift</option>';
            preferenceHTMLStr += '<option value="GES">Gnawnian Express Station</option>';
            //preferenceHTMLStr += '<option value="GWH2016R">GWH 2016</option>';
            preferenceHTMLStr += '<option value="Halloween 2016">Halloween 2016</option>';
            preferenceHTMLStr += '<option value="Iceberg">Iceberg</option>';
            preferenceHTMLStr += '<option value="Labyrinth">Labyrinth</option>';
            preferenceHTMLStr += '<option value="SG">Seasonal Garden</option>';
            preferenceHTMLStr += '<option value="Sunken City">Sunken City</option>';
            preferenceHTMLStr += '<option value="Sunken City Custom">Sunken City Custom</option>';
            preferenceHTMLStr += '<option value="Test">Test</option>';
            preferenceHTMLStr += '<option value="WWRift">WWRift</option>';
            preferenceHTMLStr += '<option value="Zokor">Zokor</option>';
            preferenceHTMLStr += '<option value="ZT">Zugzwang\'s Tower</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<input type="button" id="inputResetReload" title="Reset setting of current selected algo" value="Reset & Reload" onclick="onInputResetReload();' + temp + '">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBCJODSubLocation" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Sub-Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBCJODSublocation" onchange="initControlsBCJOD();">';
            preferenceHTMLStr += '<option value="JOD">Jungle of Dread</option>';
            preferenceHTMLStr += '<option value="LOW">BC Low Tide</option>';
            preferenceHTMLStr += '<option value="MID">BC Mid Tide</option>';
            preferenceHTMLStr += '<option value="HIGH">BC High Tide</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBCJODTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup based on current sub-location"><b>Trap Setup </b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBCJODWeapon" style="width: 75px;" onchange="saveBCJOD();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBCJODBase" style="width: 75px;" onchange="saveBCJOD();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBCJODTrinket" style="width: 75px;" onchange="saveBCJOD();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBCJODBait" style="width: 75px;" onchange="saveBCJOD();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Vanilla Stilton Cheese">Vanilla Stilton Cheese</option>';
            preferenceHTMLStr += '<option value="Vengeful Vanilla Stilton Cheese">Vengeful Vanilla Stilton Cheese</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFGARSubLocation" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Sub-Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFGARSublocation" onchange="initControlsFGAR();">';
            preferenceHTMLStr += '<option value="FG">Forbidden Grove</option>';
            preferenceHTMLStr += '<option value="AR">Acolyte Realm</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFGARTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup based on current sub-location"><b>Trap Setup </b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFGARWeapon" style="width: 75px;" onchange="saveFGAR();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFGARBase" style="width: 75px;" onchange="saveFGAR();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFGARTrinket" style="width: 75px;" onchange="saveFGAR();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFGARBait" style="width: 75px;" onchange="saveFGAR();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Runic Cheese">Runic Cheese</option>';
            preferenceHTMLStr += '<option value="Ancient Cheese">Ancient Cheese</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftAutoChoosePortal" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Choose portal automatically"><b>Auto Choose Portal</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftChoosePortal" style="width: 75px;" onchange="onSelectBWRiftChoosePortal();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftChoosePortalAfterCC" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Choose portal after Chamber Cleaver has been caught"><b>Choose Portal</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftChoosePortalAfterCC" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;After Chamber Cleaver Caught';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftPortalPriority" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select portal priority"><b>Portal Priority </b></a>';
            preferenceHTMLStr += '<select id="selectBWRiftPriority" style="width: 75px;" onchange="initControlsBWRift();">';
            for (i = 1; i <= 13; i++) {
                if (i == 1)
                    preferenceHTMLStr += '<option value="' + i + '">' + i + ' (Highest)</option>';
                else if (i == 13)
                    preferenceHTMLStr += '<option value="' + i + '">' + i + ' (Lowest)</option>';
                else
                    preferenceHTMLStr += '<option value="' + i + '">' + i + '</option>';
            }
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftPortal" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="GEARWORKS">Gearworks</option>';
            preferenceHTMLStr += '<option value="ANCIENT">Ancient Lab</option>';
            preferenceHTMLStr += '<option value="RUNIC">Runic Laboratory</option>';
            preferenceHTMLStr += '<option value="AL/RL_MSC">AL/RL (MSC)</option>';
            preferenceHTMLStr += '<option value="AL/RL_BSC">AL/RL (BSC)</option>';
            preferenceHTMLStr += '<option value="TIMEWARP">Timewarp Chamber</option>';
            preferenceHTMLStr += '<option value="LUCKY">Lucky Tower</option>';
            preferenceHTMLStr += '<option value="HIDDEN">Hidden Treasury</option>';
            preferenceHTMLStr += '<option value="GUARD">Guard Barracks</option>';
            preferenceHTMLStr += '<option value="SECURITY">Security Chamber</option>';
            preferenceHTMLStr += '<option value="FROZEN">Frozen Alcove</option>';
            preferenceHTMLStr += '<option value="FURNACE">Furnace Room</option>';
            preferenceHTMLStr += '<option value="INGRESS">Ingress Chamber</option>';
            preferenceHTMLStr += '<option value="PURSUER">Pursuer Mousoleum</option>';
            preferenceHTMLStr += '<option value="ACOLYTE">Acolyte Chamber</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftPortalPriorityCursed" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select portal priority when get cursed"><b>Portal Priority - Cursed </b></a>';
            preferenceHTMLStr += '<select id="selectBWRiftPriorityCursed" style="width: 75px;" onchange="initControlsBWRift();">';
            for (i = 1; i <= 13; i++) {
                if (i == 1)
                    preferenceHTMLStr += '<option value="' + i + '">' + i + ' (Highest)</option>';
                else if (i == 13)
                    preferenceHTMLStr += '<option value="' + i + '">' + i + ' (Lowest)</option>';
                else
                    preferenceHTMLStr += '<option value="' + i + '">' + i + '</option>';
            }
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftPortalCursed" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="GEARWORKS">Gearworks</option>';
            preferenceHTMLStr += '<option value="ANCIENT">Ancient Lab</option>';
            preferenceHTMLStr += '<option value="RUNIC">Runic Laboratory</option>';
            preferenceHTMLStr += '<option value="AL/RL_MSC">AL/RL (MSC)</option>';
            preferenceHTMLStr += '<option value="AL/RL_BSC">AL/RL (BSC)</option>';
            preferenceHTMLStr += '<option value="TIMEWARP">Timewarp Chamber</option>';
            preferenceHTMLStr += '<option value="LUCKY">Lucky Tower</option>';
            preferenceHTMLStr += '<option value="HIDDEN">Hidden Treasury</option>';
            preferenceHTMLStr += '<option value="GUARD">Guard Barracks</option>';
            preferenceHTMLStr += '<option value="SECURITY">Security Chamber</option>';
            preferenceHTMLStr += '<option value="FROZEN">Frozen Alcove</option>';
            preferenceHTMLStr += '<option value="FURNACE">Furnace Room</option>';
            preferenceHTMLStr += '<option value="INGRESS">Ingress Chamber</option>';
            preferenceHTMLStr += '<option value="PURSUER">Pursuer Mousoleum</option>';
            preferenceHTMLStr += '<option value="ACOLYTE">Acolyte Chamber</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftMinTimeSand" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select minimum time sand before entering Acolyte Chamber (AC)"><b>Min Time Sand </b></a>';
            preferenceHTMLStr += '<select id="selectBWRiftBuffCurse" style="width: 75px;" onchange="initControlsBWRift();">';
            preferenceHTMLStr += '<option value="0">No Buff & No Curse</option>';
            preferenceHTMLStr += '<option value="1">Fourth Portal & No Curse</option>';
            preferenceHTMLStr += '<option value="2">Acolyte Influence & No Curse</option>';
            preferenceHTMLStr += '<option value="3">Acolyte Influence + Fourth Portal & No Curse</option>';
            preferenceHTMLStr += '<option value="4">Paladin\'s Bane & No Curse</option>';
            preferenceHTMLStr += '<option value="5">Paladin\'s Bane + Fourth Portal & No Curse</option>';
            preferenceHTMLStr += '<option value="6">Paladin\'s Bane + Acolyte Influence & No Curse</option>';
            preferenceHTMLStr += '<option value="7">All Buffs & No Curse</option>';
            preferenceHTMLStr += '<option value="8">Buff(s) & Curse(s)</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<input type="number" id="inputMinTimeSand" min="0" max="99999" style="width:75px" value="50" onchange="onInputMinTimeSandChanged(this);">&nbsp;&nbsp;Before Enter AC';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftMinRSC" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select minimum Runic String Cheese before entering Acolyte Chamber (AC)&#13;Note 1: Total RSC = 2*RSC Pot + RSC"><b>Min Runic String Cheese</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftMinRSCType" style="width: 75px;" onchange="onSelectBWRiftMinRSCType();">';
            preferenceHTMLStr += '<option value="NUMBER">Number</option>';
            preferenceHTMLStr += '<option value="GEQ">Greater or Equal to Min Time Sand</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<input type="number" id="inputMinRSC" min="0" max="99999" style="width:75px" value="50" onchange="onInputMinRSCChanged(this);">&nbsp;&nbsp;Before Enter AC';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftEnterMinigame" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to enter minigame with curse(s)"><b>Enter Minigame with Curse(s)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftEnterWCurse" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftSubLocation" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Chamber in Bristle Woods Rift"><b>Sub-Location</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftChamber" onchange="initControlsBWRift();">';
            preferenceHTMLStr += '<option value="NONE">Non-Chamber</option>';
            preferenceHTMLStr += '<option value="GEARWORKS">Gearworks</option>';
            preferenceHTMLStr += '<option value="ANCIENT">Ancient Lab</option>';
            preferenceHTMLStr += '<option value="RUNIC">Runic Laboratory</option>';
            preferenceHTMLStr += '<option value="TIMEWARP">Timewarp Chamber</option>';
            preferenceHTMLStr += '<option value="LUCKY">Lucky Tower</option>';
            preferenceHTMLStr += '<option value="HIDDEN">Hidden Treasury</option>';
            preferenceHTMLStr += '<option value="GUARD">Guard Barracks</option>';
            preferenceHTMLStr += '<option value="SECURITY">Security Chamber</option>';
            preferenceHTMLStr += '<option value="FROZEN">Frozen Alcove</option>';
            preferenceHTMLStr += '<option value="FURNACE">Furnace Room</option>';
            preferenceHTMLStr += '<option value="INGRESS">Ingress Chamber</option>';
            preferenceHTMLStr += '<option value="PURSUER">Pursuer Mousoleum</option>';
            preferenceHTMLStr += '<option value="ACOLYTE_CHARGING">Acolyte Chamber Charging</option>';
            preferenceHTMLStr += '<option value="ACOLYTE_DRAINING">Acolyte Chamber Draining</option>';
            preferenceHTMLStr += '<option value="ACOLYTE_DRAINED">Acolyte Chamber Drained</option>';
            preferenceHTMLStr += '<option value="SEPARATOR" disabled>========= Separator =========</option>';
            preferenceHTMLStr += '<option value="NONE_CURSED">Non-Chamber Cursed</option>';
            preferenceHTMLStr += '<option value="GEARWORKS_CURSED">Gearworks Cursed</option>';
            preferenceHTMLStr += '<option value="ANCIENT_CURSED">Ancient Lab Cursed</option>';
            preferenceHTMLStr += '<option value="RUNIC_CURSED">Runic Laboratory Cursed</option>';
            preferenceHTMLStr += '<option value="TIMEWARP_CURSED">Timewarp Chamber Cursed</option>';
            preferenceHTMLStr += '<option value="LUCKY_CURSED">Lucky Tower Cursed</option>';
            preferenceHTMLStr += '<option value="HIDDEN_CURSED">Hidden Treasury Cursed</option>';
            preferenceHTMLStr += '<option value="GUARD_CURSED">Guard Barracks Cursed</option>';
            preferenceHTMLStr += '<option value="SECURITY_CURSED">Security Chamber Cursed</option>';
            preferenceHTMLStr += '<option value="FROZEN_CURSED">Frozen Alcove Cursed</option>';
            preferenceHTMLStr += '<option value="FURNACE_CURSED">Furnace Room Cursed</option>';
            preferenceHTMLStr += '<option value="INGRESS_CURSED">Ingress Chamber Cursed</option>';
            preferenceHTMLStr += '<option value="PURSUER_CURSED">Pursuer Mousoleum Cursed</option>';
            preferenceHTMLStr += '<option value="ACOLYTE_CHARGING_CURSED">Acolyte Chamber Charging Cursed</option>';
            preferenceHTMLStr += '<option value="ACOLYTE_DRAINING_CURSED">Acolyte Chamber Draining Cursed</option>';
            preferenceHTMLStr += '<option value="ACOLYTE_DRAINED_CURSED">Acolyte Chamber Drained Cursed</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftMasterTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup based on current chamber"><b>Master Trap Setup</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftWeapon" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="Timesplit Dissonance Weapon">TDW</option>';
            preferenceHTMLStr += '<option value="Mysteriously unYielding">MYNORCA</option>';
            preferenceHTMLStr += '<option value="Focused Crystal Laser">FCL</option>';
            preferenceHTMLStr += '<option value="Multi-Crystal Laser">MCL</option>';
            preferenceHTMLStr += '<option value="Biomolecular Re-atomizer Trap">BRT</option>';
            preferenceHTMLStr += '<option value="Crystal Tower">CT</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftBase" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="Clockwork Base">Clockwork</option>';
            preferenceHTMLStr += '<option value="Fissure Base">Fissure</option>';
            preferenceHTMLStr += '<option value="Rift Base">Rift</option>';
            preferenceHTMLStr += '<option value="Fracture Base">Fracture</option>';
            preferenceHTMLStr += '<option value="Enerchi Induction Base">Enerchi</option>';
            preferenceHTMLStr += '<option value="Attuned Enerchi Induction Base">A. Enerchi</option>';
            preferenceHTMLStr += '<option value="Minotaur Base">Minotaur</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftTrinket" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftBait" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Runic String">Runic</option>';
            preferenceHTMLStr += '<option value="Ancient String">Ancient</option>';
            preferenceHTMLStr += '<option value="Runic/Ancient">Runic/Ancient</option>';
            preferenceHTMLStr += '<option value="Runic=>Ancient">Runic=>Ancient</option>';
            preferenceHTMLStr += '<option value="Magical String">Magical</option>';
            preferenceHTMLStr += '<option value="Brie String">Brie</option>';
            preferenceHTMLStr += '<option value="Swiss String">Swiss</option>';
            preferenceHTMLStr += '<option value="Marble String">Marble</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftActivatePocketWatch" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="false">Deactivate Quantum Pocketwatch</option>';
            preferenceHTMLStr += '<option value="true">Activate Quantum Pocketwatch</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftTrapSetupSpecial" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup based on current chamber"><b>Conditional Trap Setup </b></a>';
            preferenceHTMLStr += '<select id="selectBWRiftCleaverStatus" style="width:75px;display:none" onchange="initControlsBWRift();">';
            preferenceHTMLStr += '<option value="0">Cleaver Not Available</option>';
            preferenceHTMLStr += '<option value="1">Cleaver Available</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftAlertLvl" style="width:75px;display:none" onchange="initControlsBWRift();">';
            for (i = 0; i <= 6; i++)
                preferenceHTMLStr += '<option value="' + i + '">Alert Lvl ' + i + '</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftFTC" style="width:75px;display:none" onchange="initControlsBWRift();">';
            for (i = 0; i <= 3; i++)
                preferenceHTMLStr += '<option value="' + i + '">FTC ' + i + '</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftHunt" style="width:75px;display:none" onchange="initControlsBWRift();">';
            for (i = 0; i <= 15; i++)
                preferenceHTMLStr += '<option value="' + i + '">Hunt ' + i + '</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftWeaponSpecial" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="MASTER">Master</option>';
            preferenceHTMLStr += '<option value="Timesplit Dissonance Weapon">TDW</option>';
            preferenceHTMLStr += '<option value="Mysteriously unYielding">MYNORCA</option>';
            preferenceHTMLStr += '<option value="Focused Crystal Laser">FCL</option>';
            preferenceHTMLStr += '<option value="Multi-Crystal Laser">MCL</option>';
            preferenceHTMLStr += '<option value="Biomolecular Re-atomizer Trap">BRT</option>';
            preferenceHTMLStr += '<option value="Crystal Tower">CT</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftBaseSpecial" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="MASTER">Master</option>';
            preferenceHTMLStr += '<option value="Clockwork Base">Clockwork</option>';
            preferenceHTMLStr += '<option value="Fissure Base">Fissure</option>';
            preferenceHTMLStr += '<option value="Rift Base">Rift</option>';
            preferenceHTMLStr += '<option value="Fracture Base">Fracture</option>';
            preferenceHTMLStr += '<option value="Enerchi Induction Base">Enerchi</option>';
            preferenceHTMLStr += '<option value="Attuned Enerchi Induction Base">A. Enerchi</option>';
            preferenceHTMLStr += '<option value="Minotaur Base">Minotaur</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftTrinketSpecial" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="MASTER">Master</option>';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftBaitSpecial" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="MASTER">Master</option>';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Runic String">Runic</option>';
            preferenceHTMLStr += '<option value="Ancient String">Ancient</option>';
            preferenceHTMLStr += '<option value="Runic/Ancient">Runic/Ancient</option>';
            preferenceHTMLStr += '<option value="Runic=>Ancient">Runic=>Ancient</option>';
            preferenceHTMLStr += '<option value="Magical String">Magical</option>';
            preferenceHTMLStr += '<option value="Brie String">Brie</option>';
            preferenceHTMLStr += '<option value="Swiss String">Swiss</option>';
            preferenceHTMLStr += '<option value="Marble String">Marble</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBWRiftActivatePocketWatchSpecial" style="width: 75px;" onchange="saveBWRift();">';
            preferenceHTMLStr += '<option value="MASTER">Master</option>';
            preferenceHTMLStr += '<option value="false">Deactivate Quantum Pocketwatch</option>';
            preferenceHTMLStr += '<option value="true">Activate Quantum Pocketwatch</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftActivatePocketWatch" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Activate Quantum Pocketwatch forcibly"><b>Force Activate Quantum</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftForceActiveQuantum" style="width: 75px;" onchange="onSelectBWRiftForceActiveQuantum();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;If Remaining Loot/Obelisk Charge &le;&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '<input type="number" id="inputRemainingLootA" min="1" max="100" size="5" value="1" onchange="onInputRemaininigLootAChanged(this);">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBWRiftDeactivatePocketWatch" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Deactivate Quantum Pocketwatch forcibly"><b>Force Deactivate Quantum</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectBWRiftForceDeactiveQuantum" style="width: 75px;" onchange="onSelectBWRiftForceDeactiveQuantum();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;If Remaining Loot/Obelisk Charge &le;&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '<input type="number" id="inputRemainingLootD" min="1" max="100" size="5" value="1" onchange="onInputRemaininigLootDChanged(this);">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFRoxTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup based on current stage"><b>Trap Setup for </b></a>';
            preferenceHTMLStr += '<select id="selectFRoxStage" onchange="initControlsFRox();">';
            preferenceHTMLStr += '<option value="DAY">Day</option>';
            preferenceHTMLStr += '<option value="TWILIGHT">Twilight</option>';
            preferenceHTMLStr += '<option value="MIDNIGHT">Midnight</option>';
            preferenceHTMLStr += '<option value="PITCH">Pitch</option>';
            preferenceHTMLStr += '<option value="UTTER">Utter Darkness</option>';
            preferenceHTMLStr += '<option value="FIRST">First Light</option>';
            preferenceHTMLStr += '<option value="DAWN">Dawn</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFRoxWeapon" style="width: 75px;" onchange="saveFRox();"></select>';
            preferenceHTMLStr += '<select id="selectFRoxBase" style="width: 75px;" onchange="saveFRox();"></select>';
            preferenceHTMLStr += '<select id="selectFRoxTrinket" style="width: 75px;" onchange="saveFRox();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFRoxBait" style="width: 75px;" onchange="saveFRox();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Crescent">Crescent</option>';
            preferenceHTMLStr += '<option value="Moon">Moon</option>';
            preferenceHTMLStr += '<option value="ANY_LUNAR">Moon/Crescent</option>';
            preferenceHTMLStr += '<option value="Moon=>Crescent">Moon=>Crescent</option>';
            preferenceHTMLStr += '<option value="Crescent=>Moon">Crescent=>Moon</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFRoxActivateTower" style="width: 75px;" onchange="saveFRox();">';
            preferenceHTMLStr += '<option value="false">Deactivate Tower</option>';
            preferenceHTMLStr += '<option value="true">Activate Tower</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFRoxDeactiveTower" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to deactivate tower when full HP"><b>Deactivate Tower When HP Full</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFRoxFullHPDeactivate" onchange="saveFRox();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trGESTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Trap Setup at </b></a>';
            preferenceHTMLStr += '<select id="selectGESStage" style="width: 75px;" onchange="initControlsGES();">';
            preferenceHTMLStr += '<option value="SD_BEFORE">Supply Depot (No Supply Rush)</option>';
            preferenceHTMLStr += '<option value="SD_AFTER">Supply Depot (Supply Rush)</option>';
            preferenceHTMLStr += '<option value="RR">Raider River</option>';
            preferenceHTMLStr += '<option value="DC">Daredevil Canyon</option>';
            preferenceHTMLStr += '<option value="WAITING">Waiting</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectGESTrapWeapon" style="width: 75px;" onchange="saveGES();">';
            preferenceHTMLStr += '<option value="S.L.A.C.">S.L.A.C.</option>';
            preferenceHTMLStr += '<option value="S.L.A.C. II">S.L.A.C. II</option>';
            preferenceHTMLStr += '<option value="Supply Grabber">Supply Grabber</option>';
            preferenceHTMLStr += '<option value="Bandit Deflector">Bandit Deflector</option>';
            preferenceHTMLStr += '<option value="Engine Doubler">Engine Doubler</option>';
            preferenceHTMLStr += '<option value="The Law Draw">The Law Draw</option>';
            preferenceHTMLStr += '<option value="Law Laser Trap">Law Laser Trap</option>';
            preferenceHTMLStr += '<option value="Meteor Prison Core Trap">Meteor Prison Core Trap</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectGESTrapBase" style="width: 75px" onchange="saveGES();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectGESTrapTrinket" style="width: 75px;" onchange="saveGES();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectGESRRTrapTrinket" style="width: 75px;display:none" onchange="saveGES();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="AUTO">Roof Rack/Door Guard/Greasy Glob</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectGESDCTrapTrinket" style="width: 75px;display:none" onchange="saveGES();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="AUTO">Magmatic Crystal/Black Powder/Dusty Coal</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectGESTrapBait" style="width: 75px" onchange="saveGES();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trGESSDLoadCrate" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Load Crate</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectGESSDLoadCrate" onchange="onSelectGESSDLoadCrate();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a><b>When Crate &ge; :</b></a>&nbsp;';
            preferenceHTMLStr += '<input type="number" id="inputMinCrate" min="1" max="50" size="5" value="11" onchange="saveGES(this);">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trGESRRRepellent" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Use Repellent</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectGESRRRepellent" onchange="onSelectGESRRRepellent();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a><b>When Repellent &ge; :</b></a>&nbsp;';
            preferenceHTMLStr += '<input type="number" id="inputMinRepellent" min="1" max="50" size="5" value="11" onchange="saveGES(this);">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trGESDCStokeEngine" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Stoke Engine</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectGESDCStokeEngine" onchange="onSelectGESDCStokeEngine();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a><b>When Fuel Nuggests &ge;:</b></a>&nbsp;';
            preferenceHTMLStr += '<input type="number" id="inputMinFuelNugget" min="1" max="20" size="5" value="20" onchange="saveGES(this);">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trWWRiftFactionFocus" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select a faction to focus on"><b>Faction to Focus</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectWWRiftFaction" onchange="onSelectWWRiftFaction();">';
            preferenceHTMLStr += '<option value="CC">Crazed Clearing</option>';
            preferenceHTMLStr += '<option value="GGT">Gigantic Gnarled Tree</option>';
            preferenceHTMLStr += '<option value="DL">Deep Lagoon</option>';
            preferenceHTMLStr += '<option value="MBW_40_44">MBW 40 &le; Rage &le; 44</option>';
            preferenceHTMLStr += '<option value="MBW_45_48">MBW 45 &le; Rage &le; 48</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trWWRiftFactionFocusNext" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select next faction to focus on"><b>Next Faction to Focus</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectWWRiftFactionNext" onchange="saveWWRift();">';
            preferenceHTMLStr += '<option value="Remain">Remain</option>';
            preferenceHTMLStr += '<option value="CC">Crazed Clearing</option>';
            preferenceHTMLStr += '<option value="GGT">Gigantic Gnarled Tree</option>';
            preferenceHTMLStr += '<option value="DL">Deep Lagoon</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trWWRiftTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to trap setup based on certain range of rage"><b>Trap Setup for Rage</b></a>';
            preferenceHTMLStr += '<select id="selectWWRiftRage" onchange="initControlsWWRift();">';
            preferenceHTMLStr += '<option value="0">0-24</option>';
            preferenceHTMLStr += '<option value="25">25-49</option>';
            preferenceHTMLStr += '<option value="50">50</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectWWRiftTrapWeapon" onchange="saveWWRift();">';
            preferenceHTMLStr += '<option value="Timesplit Dissonance Weapon">TDW</option>';
            preferenceHTMLStr += '<option value="Mysteriously unYielding">MYNORCA</option>';
            preferenceHTMLStr += '<option value="Focused Crystal Laser">FCL</option>';
            preferenceHTMLStr += '<option value="Multi-Crystal Laser">MCL</option>';
            preferenceHTMLStr += '<option value="Biomolecular Re-atomizer Trap">BRT</option>';
            preferenceHTMLStr += '<option value="Crystal Tower">CT</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectWWRiftTrapBase" style="width: 75px" onchange="saveWWRift();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectWWRiftTrapTrinket" style="width: 75px" onchange="saveWWRift();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="FSC">Faction Specific Charm</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectWWRiftTrapBait" onchange="saveWWRift();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Magical String">Magical</option>';
            preferenceHTMLStr += '<option value="Brie String">Brie</option>';
            preferenceHTMLStr += '<option value="Swiss String">Swiss</option>';
            preferenceHTMLStr += '<option value="Marble String">Marble</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trWWRiftMBWMinRage" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select minimum rage to hunt MBW"><b>Min Rage to Hunt MBW</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<input type="number" id="inputMinRage" min="40" max="48" size="5" value="40" onchange="onInputMinRageChanged(this);">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trWWRiftMBWTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Trap Setup When </b></a>';
            preferenceHTMLStr += '<select id="selectWWRiftMBWBar4044" style="width: 75px; display:none" onchange="initControlsWWRift();">';
            preferenceHTMLStr += '<option value="25_0">0 Bar &ge; 25 Rage</option>';
            preferenceHTMLStr += '<option value="25_1">1 Bar &ge; 25 Rage</option>';
            preferenceHTMLStr += '<option value="25_2">2 Bars &ge; 25 Rage</option>';
            preferenceHTMLStr += '<option value="MIN_RAGE_0">3 Bars &ge; 25 Rage / 0 Bar &ge; Min Rage to Hunt MBW</option>';
            preferenceHTMLStr += '<option value="MIN_RAGE_1">1 Bar &ge; Min Rage to Hunt MBW</option>';
            preferenceHTMLStr += '<option value="MIN_RAGE_2">2 Bars &ge; Min Rage to Hunt MBW</option>';
            preferenceHTMLStr += '<option value="MIN_RAGE_3">3 Bars &ge; Min Rage to Hunt MBW</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectWWRiftMBWBar4548" style="width: 75px; display:none" onchange="initControlsWWRift();">';
            preferenceHTMLStr += '<option value="25_0">0 Bar &ge; 25 Rage</option>';
            preferenceHTMLStr += '<option value="25_1">1 Bar &ge; 25 Rage</option>';
            preferenceHTMLStr += '<option value="25_2">2 Bars &ge; 25 Rage</option>';
            preferenceHTMLStr += '<option value="44_0">3 Bars &ge; 25 Rage / 0 Bar &ge; 44 Rage</option>';
            preferenceHTMLStr += '<option value="44_1">1 Bar &ge; 44 Rage</option>';
            preferenceHTMLStr += '<option value="44_2">2 Bars &ge; 44 Rage</option>';
            preferenceHTMLStr += '<option value="44_3">3 Bars &ge; 44 Rage / 0 Bar &ge; Min Rage to Hunt MBW</option>';
            preferenceHTMLStr += '<option value="MIN_RAGE_1">1 Bar &ge; Min Rage to Hunt MBW</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectWWRiftMBWTrapWeapon" onchange="saveWWRift();">';
            preferenceHTMLStr += '<option value="Timesplit Dissonance Weapon">TDW</option>';
            preferenceHTMLStr += '<option value="Mysteriously unYielding">MYNORCA</option>';
            preferenceHTMLStr += '<option value="Focused Crystal Laser">FCL</option>';
            preferenceHTMLStr += '<option value="Multi-Crystal Laser">MCL</option>';
            preferenceHTMLStr += '<option value="Biomolecular Re-atomizer Trap">BRT</option>';
            preferenceHTMLStr += '<option value="Crystal Tower">CT</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectWWRiftMBWTrapBase" style="width: 75px" onchange="saveWWRift();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectWWRiftMBWTrapTrinket" style="width: 75px" onchange="saveWWRift();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="FSCLR">Faction Specific Charm (Lowest Rage)</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectWWRiftMBWTrapBait" onchange="saveWWRift();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Lactrodectus Lancashire">LLC</option>';
            preferenceHTMLStr += '<option value="Magical String">Magical</option>';
            preferenceHTMLStr += '<option value="Brie String">Brie</option>';
            preferenceHTMLStr += '<option value="Swiss String">Swiss</option>';
            preferenceHTMLStr += '<option value="Marble String">Marble</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFREnterBattery" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select which battery level to enter Pagoda"><b>Enter at Battery</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectEnterAtBattery" onchange="saveFR();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            for (i = 1; i <= 10; i++)
                preferenceHTMLStr += '<option value="' + i + '">' + i + '</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFRRetreatBattery" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select which battery level to retreat from  Pagoda"><b>Retreat at Battery</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectRetreatAtBattery" onchange="saveFR();">';
            for (i = 0; i <= 10; i++)
                preferenceHTMLStr += '<option value="' + i + '">' + i + '</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFRTrapSetupAtBattery" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup for each battery"><b>Trap Setup at Battery</b></a>&nbsp;&nbsp;';
            preferenceHTMLStr += '<select id="selectTrapSetupAtBattery" onchange="initControlsFR();">';
            for (i = 0; i <= 10; i++)
                preferenceHTMLStr += '<option value="' + i + '">' + i + '</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFRTrapWeapon" onchange="saveFR();">';
            preferenceHTMLStr += '<option value="Timesplit Dissonance Weapon">TDW</option>';
            preferenceHTMLStr += '<option value="Mysteriously unYielding">MYNORCA</option>';
            preferenceHTMLStr += '<option value="Focused Crystal Laser">FCL</option>';
            preferenceHTMLStr += '<option value="Multi-Crystal Laser">MCL</option>';
            preferenceHTMLStr += '<option value="Biomolecular Re-atomizer Trap">BRT</option>';
            preferenceHTMLStr += '<option value="Crystal Tower">CT</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFRTrapBase" onchange="saveFR();">';
            preferenceHTMLStr += '<option value="Clockwork Base">Clockwork</option>';
            preferenceHTMLStr += '<option value="Fissure Base">Fissure</option>';
            preferenceHTMLStr += '<option value="Rift Base">Rift</option>';
            preferenceHTMLStr += '<option value="Fracture Base">Fracture</option>';
            preferenceHTMLStr += '<option value="Enerchi Induction Base">Enerchi</option>';
            preferenceHTMLStr += '<option value="Attuned Enerchi Induction Base">A. Enerchi</option>';
            preferenceHTMLStr += '<option value="Minotaur Base">Minotaur</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFRTrapTrinket" style="width: 75px" onchange="saveFR();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFRTrapBait" style="width: 75px" onchange="onSelectFRTrapBait();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Ascended">Ascended</option>';
            preferenceHTMLStr += '<option value="Null Onyx Gorgonzola">Null Onyx Gorgonzola</option>';
            preferenceHTMLStr += '<option value="Rift Rumble">Rift Rumble</option>';
            preferenceHTMLStr += '<option value="Rift Glutter">Rift Glutter</option>';
            preferenceHTMLStr += '<option value="Rift Susheese">Rift Susheese</option>';
            preferenceHTMLStr += '<option value="Rift Combat">Rift Combat</option>';
            preferenceHTMLStr += '<option value="ANY_MASTER">Glutter/Combat/Susheese</option>';
            preferenceHTMLStr += '<option value="BALANCE_MASTER">Balance Heirloom</option>';
            preferenceHTMLStr += '<option value="ORDER_MASTER">Master Cheese in Order</option>';
            preferenceHTMLStr += '<option value="Master Fusion">Master Fusion</option>';
            preferenceHTMLStr += '<option value="Maki String">Maki</option>';
            preferenceHTMLStr += '<option value="Magical String">Magical</option>';
            preferenceHTMLStr += '<option value="Brie String">Brie</option>';
            preferenceHTMLStr += '<option value="Swiss String">Swiss</option>';
            preferenceHTMLStr += '<option value="Marble String">Marble</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFRTrapBaitMasterOrder" style="width: 75px;display:none" onchange="saveFR();">';
            preferenceHTMLStr += '<option value="Glutter=>Combat=>Susheese">Glutter=>Combat=>Susheese</option>';
            preferenceHTMLStr += '<option value="Glutter=>Susheese=>Combat">Glutter=>Susheese=>Combat</option>';
            preferenceHTMLStr += '<option value="Combat=>Glutter=>Susheese">Combat=>Glutter=>Susheese</option>';
            preferenceHTMLStr += '<option value="Combat=>Susheese=>Glutter">Combat=>Susheese=>Glutter</option>';
            preferenceHTMLStr += '<option value="Susheese=>Glutter=>Combat">Susheese=>Glutter=>Combat</option>';
            preferenceHTMLStr += '<option value="Susheese=>Combat=>Glutter">Susheese=>Combat=>Glutter</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trIceberg" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to trap setup based on current phase"><b>Trap Setup for</b></a>';
            preferenceHTMLStr += '<select id="selectIcebergPhase" style="width: 75px" onchange="initControlsIceberg();">';
            preferenceHTMLStr += '<option value="GENERAL">Iceberg General</option>';
            preferenceHTMLStr += '<option value="TREACHEROUS">Treacherous Tunnels</option>';
            preferenceHTMLStr += '<option value="BRUTAL">Brutal Bulwark</option>';
            preferenceHTMLStr += '<option value="BOMBING">Bombing Run</option>';
            preferenceHTMLStr += '<option value="MAD">Mad Depths</option>';
            preferenceHTMLStr += '<option value="ICEWING">Icewing\'s Lair</option>';
            preferenceHTMLStr += '<option value="HIDDEN">Hidden Depths</option>';
            preferenceHTMLStr += '<option value="DEEP">The Deep Lair</option>';
            preferenceHTMLStr += '<option value="SLUSHY">Slushy Shoreline</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectIcebergBase" style="width: 75px" onchange="saveIceberg();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectIcebergTrinket" style="width: 75px" onchange="saveIceberg();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectIcebergBait" style="width: 75px" onchange="saveIceberg();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trZTFocus" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to chesspiece side to focus"><b>Side to Focus</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectZTFocus" onchange="saveZT();">';
            preferenceHTMLStr += '<option value="MYSTIC">Mystic Only</option>';
            preferenceHTMLStr += '<option value="TECHNIC">Technic Only</option>';
            preferenceHTMLStr += '<option value="MYSTIC=>TECHNIC">Mystic First Technic Second</option>';
            preferenceHTMLStr += '<option value="TECHNIC=>MYSTIC">Technic First Mystic Second</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '<tr id="trZTTrapSetup1st" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup based on first focus-side chesspiece order"><b>First Side Trap Setup for </b></a>';
            preferenceHTMLStr += '<select id="selectZTMouseOrder1st" onchange="initControlsZT();">';
            preferenceHTMLStr += '<option value="PAWN">Pawn</option>';
            preferenceHTMLStr += '<option value="KNIGHT">Knight</option>';
            preferenceHTMLStr += '<option value="BISHOP">Bishop</option>';
            preferenceHTMLStr += '<option value="ROOK">Rook</option>';
            preferenceHTMLStr += '<option value="QUEEN">Queen</option>';
            preferenceHTMLStr += '<option value="KING">King</option>';
            preferenceHTMLStr += '<option value="CHESSMASTER">Chessmaster</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectZTWeapon1st" style="width: 75px" onchange="saveZT();">';
            preferenceHTMLStr += '<option value="MPP/TPP">Focused-Side Pawn Pincher</option>';
            preferenceHTMLStr += '<option value="BPT/OAT">Focused-Side Trap BPT/OAT</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectZTBase1st" style="width: 75px" onchange="saveZT();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectZTTrinket1st" style="width: 75px" onchange="saveZT();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectZTBait1st" style="width: 75px" onchange="saveZT();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '<option value="Checkmate">Checkmate</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '<tr id="trZTTrapSetup2nd" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup based on second focus-side chesspiece order"><b>Second Side Trap Setup for </b></a>';
            preferenceHTMLStr += '<select id="selectZTMouseOrder2nd" onchange="initControlsZT();">';
            preferenceHTMLStr += '<option value="PAWN">Pawn</option>';
            preferenceHTMLStr += '<option value="KNIGHT">Knight</option>';
            preferenceHTMLStr += '<option value="BISHOP">Bishop</option>';
            preferenceHTMLStr += '<option value="ROOK">Rook</option>';
            preferenceHTMLStr += '<option value="QUEEN">Queen</option>';
            preferenceHTMLStr += '<option value="KING">King</option>';
            preferenceHTMLStr += '<option value="CHESSMASTER">Chessmaster</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectZTWeapon2nd" style="width: 75px" onchange="saveZT();">';
            preferenceHTMLStr += '<option value="MPP/TPP">Focused-Side Pawn Pincher</option>';
            preferenceHTMLStr += '<option value="BPT/OAT">Focused-Side Trap BPT/OAT</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectZTBase2nd" style="width: 75px" onchange="saveZT();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectZTTrinket2nd" style="width: 75px" onchange="saveZT();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectZTBait2nd" style="width: 75px" onchange="saveZT();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '<option value="Checkmate">Checkmate</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trSGTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to trap setup based on certain season"><b>Trap Setup For </b></a>';
            preferenceHTMLStr += '<select id="selectSGSeason" onchange="initControlsSG();">';
            preferenceHTMLStr += '<option value="SPRING">Spring</option>';
            preferenceHTMLStr += '<option value="SUMMER">Summer</option>';
            preferenceHTMLStr += '<option value="FALL">Fall</option>';
            preferenceHTMLStr += '<option value="WINTER">Winter</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectSGTrapWeapon" style="width: 75px" onchange="saveSG();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectSGTrapBase" style="width: 75px" onchange="saveSG();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectSGTrapTrinket" style="width: 75px" onchange="saveSG();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectSGTrapBait" style="width: 75px" onchange="saveSG();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trSGDisarmBait" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to disarm bait when amplifier is fully charged"><b>Disarm Bait</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectSGDisarmBait" onchange="saveSG();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;After Amplifier Fully Charged';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trLGTGAutoFill" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Auto Fill in </b></a>';
            preferenceHTMLStr += '<select id="selectLGTGAutoFillSide" onchange="initControlsLG();">';
            preferenceHTMLStr += '<option value="LG">Living Garden</option>';
            preferenceHTMLStr += '<option value="TG">Twisted Garden</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectLGTGAutoFillState" onchange="saveLG();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '<tr id="trLGTGAutoPour" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Auto Pour in </b></a>';
            preferenceHTMLStr += '<select id="selectLGTGAutoPourSide" onchange="initControlsLG();">';
            preferenceHTMLStr += '<option value="LG">Living Garden</option>';
            preferenceHTMLStr += '<option value="TG">Twisted Garden</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectLGTGAutoPourState" onchange="saveLG();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '<tr id="trPourTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>After Poured in </b></a>';
            preferenceHTMLStr += '<select id="selectLGTGSide" onchange="initControlsLG();">';
            preferenceHTMLStr += '<option value="LG">Living Garden</option>';
            preferenceHTMLStr += '<option value="TG">Twisted Garden</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectLGTGBase" style="width: 75px" onchange="saveLG();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectLGTGTrinket" style="width: 75px" onchange="saveLG();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectLGTGBait" style="width: 75px" onchange="saveLG();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Duskshade Camembert">Duskshade Camembert</option>';
            preferenceHTMLStr += '<option value="Lunaria Camembert">Lunaria Camembert</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '<tr id="trCurseLiftedTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>After Curse Lifted in </b></a>';
            preferenceHTMLStr += '<select id="selectLCCCSide" onchange="initControlsLG();">';
            preferenceHTMLStr += '<option value="LC">Lost City</option>';
            preferenceHTMLStr += '<option value="CC">Cursed City</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectLCCCBase" style="width: 75px" onchange="saveLG();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectLCCCTrinket" style="width: 75px" onchange="saveLG();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '<tr id="trSaltedTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Trap Setup </b></a>';
            preferenceHTMLStr += '<select id="selectSaltedStatus" onchange="initControlsLG();">';
            preferenceHTMLStr += '<option value="before">During</option>';
            preferenceHTMLStr += '<option value="after">After</option>';
            preferenceHTMLStr += '</select><a><b> Salt Charging</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectSCBase" style="width: 75px" onchange="saveLG();">';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Max number of salt before hunting King Grub"><b>Salt Charge : </b></a>';
            preferenceHTMLStr += '<input type="number" id="inputKGSalt" min="1" max="50" size="5" value="25" onchange="saveLG();">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trGWHTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup based on anchor/boost status"><b>Trap Setup When </b></a>';
            preferenceHTMLStr += '<select id="selectGWHZone" style="width: 75px" onchange="initControlsGWH2016();">';
            preferenceHTMLStr += '<option value="ORDER1">Simple Zone With Order</option>';
            preferenceHTMLStr += '<option value="ORDER2">Deluxe Zone With Order</option>';
            preferenceHTMLStr += '<option value="NONORDER1">Simple Zone W/O Order</option>';
            preferenceHTMLStr += '<option value="NONORDER2">Deluxe Zone W/O Order</option>';
            preferenceHTMLStr += '<option value="WINTER_WASTELAND">Winter Wasteland</option>';
            preferenceHTMLStr += '<option value="SNOWBALL_STORM">Snowball Storm</option>';
            preferenceHTMLStr += '<option value="FLYING">Flying</option>';
            preferenceHTMLStr += '<option value="NEW_YEAR\'S_PARTY">New Year\'s Party</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectGWHWeapon" style="width: 75px" onchange="saveGWH2016();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectGWHBase" style="width: 75px" onchange="saveGWH2016();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectGWHTrinket" style="width: 75px;" onchange="onSelectGWHTrinketChanged();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="ANCHOR_FAC/EAC">FAC/EAC</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectGWHBait" style="width: 75px" onchange="saveGWH2016();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="ANY_FESTIVE_BRIE">AA/Festive Cheese/Brie</option>';
            preferenceHTMLStr += '<option value="ANY_FESTIVE_GOUDA">AA/Festive Cheese/Gouda</option>';
            preferenceHTMLStr += '<option value="ANY_FESTIVE_SB">AA/Festive Cheese/SUPER|brie+</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectGWHBoost" style="width: 75px" onchange="saveGWH2016();">';
            preferenceHTMLStr += '<option value="false">Not Boost</option>';
            preferenceHTMLStr += '<option value="true">Boost</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '<tr id="trGWHTurboBoost" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to always Turbo boost (500m)"><b>Always Turbo Boost</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectGWHUseTurboBoost" onchange="saveGWH2016();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '<tr id="trGWHFlying" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select minimum AA to take flight"><b>Min AA to Fly (&ge;)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<input type="number" id="inputMinAA" min="0" max="9007199254740991" style="width:50px" value="20" onchange="onInputMinAAChanged(this);">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '<tr id="trGWHFlyingFirework" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select minimum firework to take flight"><b>Min Firework to Fly (&ge;)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<input type="number" id="inputMinFirework" min="0" max="9007199254740991" style="width:50px" value="20" onchange="onInputMinWorkChanged(this);">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '<tr id="trGWHFlyingLand" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select whether land after firework run out"><b>Land after Firework Run Out</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectGWHLandAfterRunOutFirework" onchange="saveGWH2016();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trSCCustom" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select custom algorithm"><b>SC Custom Algorithm</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectSCHuntZone" style="width:75px" onChange="initControlsSCCustom();">';
            preferenceHTMLStr += '<option value="ZONE_NOT_DIVE">Surface</option>';
            preferenceHTMLStr += '<option value="ZONE_DEFAULT">Default</option>';
            preferenceHTMLStr += '<option value="ZONE_CORAL">Coral</option>';
            preferenceHTMLStr += '<option value="ZONE_SCALE">Scale</option>';
            preferenceHTMLStr += '<option value="ZONE_BARNACLE">Barnacle</option>';
            preferenceHTMLStr += '<option value="ZONE_TREASURE">Treasure</option>';
            preferenceHTMLStr += '<option value="ZONE_DANGER">Danger</option>';
            preferenceHTMLStr += '<option value="ZONE_DANGER_PP">Danger PP MT</option>';
            preferenceHTMLStr += '<option value="ZONE_DANGER_PP_LOTA">Danger PP LOTA</option>';
            preferenceHTMLStr += '<option value="ZONE_OXYGEN">Oxygen</option>';
            preferenceHTMLStr += '<option value="ZONE_BONUS">Bonus</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectSCHuntZoneEnable" style="width:75px;display:none" onChange="saveSCCustomAlgo();">';
            preferenceHTMLStr += '<option value="true">Hunt</option>';
            preferenceHTMLStr += '<option value="false">Jet Through</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectSCHuntBait" style="width: 75px" onchange="saveSCCustomAlgo();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '<option value="Fishy Fromage">Fishy Fromage</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectSCHuntTrinket" style="width: 75px" onchange="saveSCCustomAlgo();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Empowered Anchor">EAC</option>';
            preferenceHTMLStr += '<option value="GAC_EAC">GAC, EAC</option>';
            preferenceHTMLStr += '<option value="SAC_EAC">SAC, EAC</option>';
            preferenceHTMLStr += '<option value="UAC_EAC">UAC, EAC</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trSCCustomUseSmartJet" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to always use Smart Water Jet Charm"><b>Use Smart Jet</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectSCUseSmartJet" onchange="saveSCCustomAlgo();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trLabyrinth" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select a district to focus on"><b>District to Focus</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectLabyrinthDistrict" onChange="onSelectLabyrinthDistrict();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="FEALTY">Fealty</option>';
            preferenceHTMLStr += '<option value="TECH">Tech</option>';
            preferenceHTMLStr += '<option value="SCHOLAR">Scholar</option>';
            preferenceHTMLStr += '<option value="TREASURY">Treasury</option>';
            preferenceHTMLStr += '<option value="FARMING">Farming</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trLabyrinthDisarm" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select to disarm cheese at X last hunt in hallway when total clues near 100"><b>Security Disarm</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectLabyrinthDisarm" onChange="onSelectLabyrinthDisarm();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;At Last&nbsp;';
            preferenceHTMLStr += '<input type="number" id="inputLabyrinthLastHunt" min="2" max="10" style="width:40px" value="2" onchange="onInputLabyrinthLastHuntChanged(this);">&nbsp;Hunt(s) in Hallway Near 100 Total Clues';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trLabyrinthArmOtherBase" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select to arm other base if Compass Magnet Charm is currently armed"><b>Arm Other Base</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectLabyrinthOtherBase" style="width: 75px" onchange="saveLaby();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;If Compass Magnet Charm is armed';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trLabyrinthDisarmCompass" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a><b>Disarm Compass Magnet</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectLabyrinthDisarmCompass" onchange="onSelectLabyrinthDisarmCompass();">';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;If Dead End Clue &le; :&nbsp;';
            preferenceHTMLStr += '<input type="number" id="inputLabyrinthDEC" min="0" max="20" style="width:40px" value="0" onchange="onInputLabyrinthDECChanged(this);">';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trPriorities15" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select hallway priorities when focus-district clues less than 15"><b>Priorities (Focus-District Clues < 15)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectHallway15Plain" onChange="saveLaby();">';
            preferenceHTMLStr += '<option value="lp">Long Plain Hallway First</option>';
            preferenceHTMLStr += '<option value="sp">Short Plain Hallway First</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trPriorities1560" style="display:table-row;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select hallway priorities when focus-district clues within 15 and 60"><b>Priorities (15 < Focus-District Clues < 60)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectHallway1560Superior" onchange="saveLaby();">';
            preferenceHTMLStr += '<option value="ls">Long Superior Hallway First</option>';
            preferenceHTMLStr += '<option value="ss">Short Superior Hallway First</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectHallway1560Plain" onchange="saveLaby();">';
            preferenceHTMLStr += '<option value="lp">Long Plain Hallway First</option>';
            preferenceHTMLStr += '<option value="sp">Short Plain Hallway First</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trPriorities60" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select hallway priorities when focus-district clues more than 60"><b>Priorities (Focus-District Clues > 60)</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectHallway60Epic" onchange="saveLaby();">';
            preferenceHTMLStr += '<option value="le">Long Epic Hallway First</option>';
            preferenceHTMLStr += '<option value="se">Short Epic Hallway First</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectHallway60Superior" onchange="saveLaby();">';
            preferenceHTMLStr += '<option value="ls">Long Superior Hallway First</option>';
            preferenceHTMLStr += '<option value="ss">Short Superior Hallway First</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectHallway60Plain" onchange="saveLaby();">';
            preferenceHTMLStr += '<option value="lp">Long Plain Hallway First</option>';
            preferenceHTMLStr += '<option value="sp">Short Plain Hallway First</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trLabyrinthOtherHallway" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Choose doors other than focused door when there is no available focused door to be choosen"><b>Open Non-Focus Door</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="chooseOtherDoors" onChange="\
				saveLaby();\
				document.getElementById(\'typeOtherDoors\').disabled = (value == \'false\') ? \'disabled\' : \'\'; ">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Select a choosing type for non-focused doors"><b>Choosing Type:</b></a>&emsp;';
            preferenceHTMLStr += '<select id="typeOtherDoors" onChange="saveLaby();">';
            preferenceHTMLStr += '<option value="SHORTEST_ONLY">Shortest Length Only</option>';
            preferenceHTMLStr += '<option value="FEWEST_ONLY">Fewest Clue Only</option>';
            preferenceHTMLStr += '<option value="SHORTEST_FEWEST">Shortest Length => Fewest Clue</option>';
            preferenceHTMLStr += '<option value="FEWEST_SHORTEST">Fewest Clue => Shortest Length </option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trLabyrinthWeaponFarming" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select weapon type in farming hallways"><b>Weapon Type in Farming</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectLabyrinthWeaponType" onchange="saveLaby();">';
            preferenceHTMLStr += '<option value="Forgotten">Forgotten</option>';
            preferenceHTMLStr += '<option value="Arcane">Arcane</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trZokorTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select trap setup under different boss status"><b>Trap Setup When</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectZokorBossStatus" onChange="initControlsZokor();">';
            preferenceHTMLStr += '<option value="INCOMING">Boss Incoming</option>';
            preferenceHTMLStr += '<option value="ACTIVE">Boss Active</option>';
            preferenceHTMLStr += '<option value="DEFEATED">Boss Defeated</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;';
            preferenceHTMLStr += '<select id="selectZokorBait" style="width: 75px" onChange="saveZokor();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '<option value="Glowing Gruyere">GG</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;';
            preferenceHTMLStr += '<select id="selectZokorTrinket" style="width: 75px" onChange="saveZokor();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFWWave" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select FW wave"><b>Wave</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFWWave" onChange="initControlsFW();">';
            preferenceHTMLStr += '<option value="1">1</option>';
            preferenceHTMLStr += '<option value="2">2</option>';
            preferenceHTMLStr += '<option value="3">3</option>';
            preferenceHTMLStr += '<option value="4">4</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFWTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup based on certain FW wave"><b>Physical Trap Setup</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFWTrapSetupWeapon" style="width: 75px" onchange="saveFW();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFWTrapSetupBase" style="width: 75px" onchange="saveFW();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFW4TrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select trap setup based on warden status"><b>Trap Setup </b></a>';
            preferenceHTMLStr += '<select id="selectFW4WardenStatus" onchange="initControlsFW();">';
            preferenceHTMLStr += '<option value="before">Before</option>';
            preferenceHTMLStr += '<option value="after">After</option>';
            preferenceHTMLStr += '</select><a><b> Clear Warden</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFW4TrapSetupWeapon" style="width: 75px" onchange="saveFW();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFW4TrapSetupBase" style="width: 75px" onchange="saveFW();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFW4TrapSetupTrinket" style="width: 75px" onchange="saveFW();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFW4TrapSetupBait" style="width: 75px" onchange="saveFW();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFWFocusType" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select either Normal (Warrior, Scout, Archer) or Special (Cavalry, Mage)"><b>Soldier Type to Focus</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFWFocusType" onChange="saveFW();">';
            preferenceHTMLStr += '<option value="NORMAL">Normal</option>';
            preferenceHTMLStr += '<option value="SPECIAL">Special</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Select which soldier type comes first based on population"><b>Priorities:</b></a>&emsp;';
            preferenceHTMLStr += '<select id="selectFWPriorities" onChange="saveFW();">';
            preferenceHTMLStr += '<option value="HIGHEST">Highest Population First</option>';
            preferenceHTMLStr += '<option value="LOWEST">Lowest Population First</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFWStreak" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select streak"><b>Streak</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFWStreak" onChange="initControlsFW();">';
            preferenceHTMLStr += '<option value="0">0</option>';
            preferenceHTMLStr += '<option value="1">1</option>';
            preferenceHTMLStr += '<option value="2">2</option>';
            preferenceHTMLStr += '<option value="3">3</option>';
            preferenceHTMLStr += '<option value="4">4</option>';
            preferenceHTMLStr += '<option value="5">5</option>';
            preferenceHTMLStr += '<option value="6">6</option>';
            preferenceHTMLStr += '<option value="7">7</option>';
            preferenceHTMLStr += '<option value="8">8</option>';
            preferenceHTMLStr += '<option value="9">9</option>';
            preferenceHTMLStr += '<option value="10">10</option>';
            preferenceHTMLStr += '<option value="11">11</option>';
            preferenceHTMLStr += '<option value="12">12</option>';
            preferenceHTMLStr += '<option value="13">13</option>';
            preferenceHTMLStr += '<option value="14">14</option>';
            preferenceHTMLStr += '<option value="15">15</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFWCheese" style="width: 75px" onChange="saveFW();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Brie Cheese">Brie</option>';
            preferenceHTMLStr += '<option value="Toxic Brie">Toxic Brie</option>';
            preferenceHTMLStr += '<option value="Gouda">Gouda</option>';
            preferenceHTMLStr += '<option value="SUPER">SB+</option>';
            preferenceHTMLStr += '<option value="Toxic SUPER">Toxic SB+</option>';
            preferenceHTMLStr += '<option value="Ghoulgonzola">Ghoulgonzola</option>';
            preferenceHTMLStr += '<option value="Candy Corn">Candy Corn</option>';
            preferenceHTMLStr += '<option value="ANY_HALLOWEEN">Ghoulgonzola/Candy Corn</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFWCharmType" style="width: 75px" onChange="saveFW();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Warpath">Warpath</option>';
            preferenceHTMLStr += '<option value="Super Warpath">Super Warpath</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectFWSpecial" style="width: 75px" onChange="saveFW();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="COMMANDER">Commander</option>';
            preferenceHTMLStr += '<option value="GARGANTUA">Gargantua</option>';
            preferenceHTMLStr += '<option value="GARGANTUA_GGC" disabled="disabled">Gargantua GGC</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFWLastType" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select config when there is only one soldier type left"><b>Last Soldier Type</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px;">';
            preferenceHTMLStr += '<select id="selectFWLastTypeConfig" onChange="saveFW();">';
            preferenceHTMLStr += '<option value="CONFIG_STREAK">Follow Streak Config</option>';
            preferenceHTMLStr += '<option value="CONFIG_GOUDA">Gouda & No Warpath Charm</option>';
            preferenceHTMLStr += '<option value="NO_WARPATH">No Warpath Charm Only</option>';
            preferenceHTMLStr += '<option value="CONFIG_UNCHANGED">Trap Setup Unchanged</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;<a title="Select whether to include Artillery in checking of Last Soldier"><b>Include Artillery:</b></a>&emsp;';
            preferenceHTMLStr += '<select id="selectFWLastTypeConfigIncludeArtillery" onchange="saveFW();">';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trFWSupportConfig" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;"><a title="Select whether to disarm any Warpath Charm when supports are gone"><b>Disarm Warpath Charm</b></a>&nbsp;&nbsp;:&nbsp;&nbsp;</td>';
            preferenceHTMLStr += '<td style="height:24px">';
            preferenceHTMLStr += '<select id="selectFWSupportConfig" onchange="saveFW();">';
            preferenceHTMLStr += '<option value="false">False</option>';
            preferenceHTMLStr += '<option value="true">True</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;When Support Retreated';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBRConfig" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select the mist tier to hunt"><b>Hunt At</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px;">';
            preferenceHTMLStr += '<select id="selectBRHuntMistTier" onChange="onSelectBRHuntMistTierChanged();">';
            preferenceHTMLStr += '<option value="Red">Red</option>';
            preferenceHTMLStr += '<option value="Green">Green</option>';
            preferenceHTMLStr += '<option value="Yellow">Yellow</option>';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>&nbsp;&nbsp;Mist Tier';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBRToggle" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select the amount of hunt to toggle canister"><b>Toggle Canister Every</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px;">';
            preferenceHTMLStr += '<input type="number" id="inputToggleCanister" min="1" max="999" value="1" onchange="onInputToggleCanisterChanged(this);">&nbsp;&nbsp;Hunt(s)';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr id="trBRTrapSetup" style="display:none;">';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;">';
            preferenceHTMLStr += '<a title="Select trap setup combination for respective mist tier"><b>Trap Setup</b></a>';
            preferenceHTMLStr += '&nbsp;&nbsp;:&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '<td style="height:24px;">';
            preferenceHTMLStr += '<select id="selectBRTrapWeapon" onchange="saveBR();">';
            preferenceHTMLStr += '<option value="Timesplit Dissonance Weapon">TDW</option>';
            preferenceHTMLStr += '<option value="Mysteriously unYielding">MYNORCA</option>';
            preferenceHTMLStr += '<option value="Focused Crystal Laser">FCL</option>';
            preferenceHTMLStr += '<option value="Multi-Crystal Laser">MCL</option>';
            preferenceHTMLStr += '<option value="Biomolecular Re-atomizer Trap">BRT</option>';
            preferenceHTMLStr += '<option value="Crystal Tower">CT</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBRTrapBase" style="width: 75px" onchange="saveBR();">';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBRTrapTrinket" style="width: 75px" onchange="saveBR();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '<select id="selectBRTrapBait" onchange="saveBR();">';
            preferenceHTMLStr += '<option value="None">None</option>';
            preferenceHTMLStr += '<option value="Polluted Parmesan">PP</option>';
            preferenceHTMLStr += '<option value="Terre Ricotta">Terre</option>';
            preferenceHTMLStr += '<option value="Magical String">Magical</option>';
            preferenceHTMLStr += '<option value="Brie String">Brie</option>';
            preferenceHTMLStr += '<option value="Swiss String">Swiss</option>';
            preferenceHTMLStr += '<option value="Marble String">Marble</option>';
            preferenceHTMLStr += '<option value="Undead String Emmental">USE</option>';
            preferenceHTMLStr += '</select>';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';

            preferenceHTMLStr += '<tr>';
            preferenceHTMLStr += '<td style="height:24px; text-align:right;" colspan="2">';
            preferenceHTMLStr += '<input type="button" id="AlgoConfigSaveInput" title="Save changes of Event or Location without reload, take effect after current hunt" value="Apply" onclick="setSessionToLocal();">&nbsp;&nbsp;&nbsp;';
            preferenceHTMLStr += '<input type="button" id="AlgoConfigSaveReloadInput" title="Save changes of Event or Location with reload, take effect immediately" value="Apply & Reload" onclick="setSessionToLocal();' + temp + '">&nbsp;&nbsp;&nbsp;';
            preferenceHTMLStr += '</td>';
            preferenceHTMLStr += '</tr>';
            preferenceHTMLStr += '</table>';

            var preferenceDiv = document.createElement('div');
            preferenceDiv.setAttribute('id', 'preferenceDiv');
            if (showPreference === true)
                preferenceDiv.setAttribute('style', 'display: block');
            else
                preferenceDiv.setAttribute('style', 'display: none');
            preferenceDiv.innerHTML = preferenceHTMLStr;
            timerDivElement.appendChild(preferenceDiv);
            preferenceHTMLStr = null;
            showPreference = null;

            var hr3Element = document.createElement('hr');
            preferenceDiv.appendChild(hr3Element);
            hr3Element = null;
            preferenceDiv = null;

            // embed all msg to the page
            headerElement.parentNode.insertBefore(timerDivElement, headerElement);

            timerDivElement = null;

            var scriptElement = document.createElement("script");
            scriptElement.setAttribute('type', "text/javascript");
            scriptElement.setAttribute('id', "scriptUIFunction");
            scriptElement.innerHTML = functionToHTMLString(bodyJS);
            headerElement.parentNode.insertBefore(scriptElement, headerElement);
            scriptElement = null;

            addKREntries();
            setKREntriesColor();

            // insert trap list
            var objSelectStr = {
                weapon: ['selectWeapon', 'selectZTWeapon1st', 'selectZTWeapon2nd', 'selectBestTrapWeapon', 'selectFWTrapSetupWeapon', 'selectFW4TrapSetupWeapon', 'selectSGTrapWeapon', 'selectFRoxWeapon', 'selectGWHWeapon', 'selectBCJODWeapon', 'selectFGARWeapon'],
                base: ['selectBase', 'selectLabyrinthOtherBase', 'selectZTBase1st', 'selectZTBase2nd', 'selectBestTrapBase', 'selectFWTrapSetupBase', 'selectFW4TrapSetupBase', 'selectLGTGBase', 'selectLCCCBase', 'selectSCBase', 'selectIcebergBase', 'selectGESTrapBase', 'selectSGTrapBase', 'selectFRoxBase', 'selectGWHBase', 'selectBRTrapBase', 'selectWWRiftTrapBase', 'selectWWRiftMBWTrapBase', 'selectBCJODBase', 'selectFGARBase'],
                trinket: ['selectZokorTrinket', 'selectTrinket', 'selectZTTrinket1st', 'selectZTTrinket2nd', 'selectFRTrapTrinket', 'selectBRTrapTrinket', 'selectLGTGTrinket', 'selectLCCCTrinket', 'selectIcebergTrinket', 'selectWWRiftTrapTrinket', 'selectWWRiftMBWTrapTrinket', 'selectGESTrapTrinket', 'selectGESRRTrapTrinket', 'selectGESDCTrapTrinket', 'selectFW4TrapSetupTrinket', 'selectSGTrapTrinket', 'selectSCHuntTrinket', 'selectFRoxTrinket', 'selectGWHTrinket', 'selectGESTrapTrinket', 'selectBWRiftTrinket', 'selectBWRiftTrinketSpecial', 'selectBCJODTrinket', 'selectFGARTrinket'],
                bait: ['selectBait', 'selectGWHBait']
            };
            var temp;
            var optionEle;
            for (var prop in objTrapCollection) {
                if (objTrapCollection.hasOwnProperty(prop)) {
                    objTrapCollection[prop] = objTrapCollection[prop].sort();
                    for (i = 0; i < objTrapCollection[prop].length; i++) {
                        optionEle = document.createElement("option");
                        optionEle.setAttribute('value', objTrapCollection[prop][i]);
                        optionEle.innerText = objTrapCollection[prop][i];
                        if (objSelectStr.hasOwnProperty(prop)) {
                            for (var j = 0; j < objSelectStr[prop].length; j++) {
                                temp = document.getElementById(objSelectStr[prop][j]);
                                if (!isNullOrUndefined(temp))
                                    temp.appendChild(optionEle.cloneNode(true));
                            }
                        }
                    }
                }
            }
            document.getElementById('idRestore').style.display = (targetPage) ? 'table-row' : 'none';
            document.getElementById('idGetLogAndPreference').style.display = (targetPage) ? 'table-row' : 'none';
            document.getElementById('clearTrapList').style.display = (targetPage) ? 'table-row' : 'none';
            document.getElementById('showPreferenceLink').style.display = (targetPage) ? 'table-row' : 'none';
        }
        headerElement = null;
    }
    targetPage = null;
}

function addKREntries() {
    var i, temp, maxLen, keyName;
    var replaced = "";
    var nTimezoneOffset = -(new Date().getTimezoneOffset()) * 60000;
    var count = 1;
    var strInnerHTML = '';
    var selectViewKR = document.getElementById('viewKR');
    if (selectViewKR.options.length > 0) {
        // append keyKR for new KR entries under new UI
        for (i = 0; i < window.localStorage.length; i++) {
            keyName = window.localStorage.key(i);
            if (keyName.indexOf("KR" + separator) > -1 && keyKR.indexOf(keyName) < 0)
                keyKR.push(keyName);
        }
    }
    maxLen = keyKR.length.toString().length;
    for (i = 0; i < keyKR.length; i++) {
        if (keyKR[i].indexOf("KR" + separator) > -1) {
            temp = keyKR[i].split(separator);
            temp.splice(0, 1);
            temp[0] = parseInt(temp[0]);
            if (Number.isNaN(temp[0]))
                temp[0] = 0;

            temp[0] += nTimezoneOffset;
            temp[0] = (new Date(temp[0])).toISOString();
            replaced = temp.join("&nbsp;&nbsp;");
            temp = count.toString();
            while (temp.length < maxLen) {
                temp = '0' + temp;
            }
            replaced = temp + '. ' + replaced;
            strInnerHTML += '<option value="' + keyKR[i] + '"' + ((i == keyKR.length - 1) ? ' selected' : '') + '>' + replaced + '</option>';
            count++;
        }
    }
    if (strInnerHTML !== '')
        selectViewKR.innerHTML = strInnerHTML;
}

function setKREntriesColor() {
    // set KR entries color
    var i, nCurrent, nNext, strCurrent;
    var selectViewKR = document.getElementById('viewKR');
    for (i = 0; i < selectViewKR.children.length; i++) {
        if (i < selectViewKR.children.length - 1) {
            nCurrent = parseInt(selectViewKR.children[i].value.split('~')[1]);
            nNext = parseInt(selectViewKR.children[i + 1].value.split('~')[1]);
            if (Math.round((nNext - nCurrent) / 60000) < 2)
                selectViewKR.children[i].style = 'color:red';
        }
        strCurrent = selectViewKR.children[i].value.split('~')[2];
        if (strCurrent == strCurrent.toUpperCase() && selectViewKR.children[i].style.color != 'red') {
            selectViewKR.children[i].style = 'color:magenta';
        }
    }
}

function loadPreferenceSettingFromStorage() {
    aggressiveMode = getStorageToVariableBool("AggressiveMode", aggressiveMode);
    hornTimeDelayMin = getStorageToVariableInt("HornTimeDelayMin", hornTimeDelayMin);
    hornTimeDelayMax = getStorageToVariableInt("HornTimeDelayMax", hornTimeDelayMax);
    enableTrapCheck = getStorageToVariableBool("TrapCheck", enableTrapCheck);
    checkTimeDelayMin = getStorageToVariableInt("TrapCheckTimeDelayMin", checkTimeDelayMin);
    checkTimeDelayMax = getStorageToVariableInt("TrapCheckTimeDelayMax", checkTimeDelayMax);
    isKingWarningSound = getStorageToVariableBool("PlayKingRewardSound", isKingWarningSound);
    isAutoSolve = getStorageToVariableBool("AutoSolveKR", isAutoSolve);
    krDelayMin = getStorageToVariableInt("AutoSolveKRDelayMin", krDelayMin);
    krDelayMax = getStorageToVariableInt("AutoSolveKRDelayMax", krDelayMax);
    kingsRewardRetry = getStorageToVariableInt("KingsRewardRetry", kingsRewardRetry);
    pauseAtInvalidLocation = getStorageToVariableBool("PauseLocation", pauseAtInvalidLocation);
    saveKRImage = getStorageToVariableBool("SaveKRImage", saveKRImage);
    g_nTimeOffset = getStorageToVariableInt("TimeOffset", g_nTimeOffset);
    discharge = getStorageToVariableBool("discharge", discharge);
    try {
        keyKR = [];
        var keyName = "";
        var keyRemove = [];
        var i, j, value, objTest;
        for (i = 0; i < window.localStorage.length; i++) {
            keyName = window.localStorage.key(i);
            if (keyName.indexOf("KR-") > -1) { // remove old KR entries
                keyRemove.push(keyName);
            }
            else if (keyName.indexOf("KR" + separator) > -1) {
                keyKR.push(keyName);
            }
            value = getStorage(keyName); // remove entries of duplicate JSON.stringify
            if (value.indexOf("{") > -1) {
                try {
                    objTest = JSON.parse(value);
                    if (typeof objTest == 'string') {
                        setStorage(keyName, objTest);
                        setSessionStorage(keyName, objTest);
                    }
                }
                catch (e) {
                    console.perror(keyName, e.message);
                }
            }
        }

        for (i = 0; i < keyRemove.length; i++) {
            removeStorage(keyRemove[i]);
        }

        if (keyKR.length > maxSaveKRImage) {
            keyKR = keyKR.sort();
            var count = Math.floor(maxSaveKRImage / 2);
            for (i = 0; i < count; i++)
                removeStorage(keyKR[i]);
        }

        // Backward compatibility of SCCustom
        var temp = "";
        var keyValue = "";
        var obj = {};
        var bResave = false;
        var objSCCustomBackward = {
            zone: ['ZONE_NOT_DIVE'],
            zoneID: [0],
            isHunt: [true],
            bait: ['Gouda'],
            trinket: ['None'],
            useSmartJet: false
        };
        for (var prop in objSCZone) {
            if (objSCZone.hasOwnProperty(prop)) {
                keyName = "SCCustom_" + prop;
                keyValue = window.localStorage.getItem(keyName);
                if (!isNullOrUndefined(keyValue)) {
                    keyValue = keyValue.split(',');
                    objSCCustomBackward.zone[objSCZone[prop]] = prop;
                    objSCCustomBackward.zoneID[objSCZone[prop]] = objSCZone[prop];
                    objSCCustomBackward.isHunt[objSCZone[prop]] = (keyValue[0] === 'true' || keyValue[0] === true);
                    objSCCustomBackward.bait[objSCZone[prop]] = keyValue[1];
                    objSCCustomBackward.trinket[objSCZone[prop]] = keyValue[2];
                    removeStorage(keyName);
                }
            }
        }
        if (objSCCustomBackward.zone.length > 1) {
            setStorage('SCCustom', JSON.stringify(objSCCustomBackward));
            setSessionStorage('SCCustom', JSON.stringify(objSCCustomBackward));
        }

        keyValue = getStorage("SCCustom");
        if (!isNullOrUndefined(keyValue)) {
            obj = JSON.parse(keyValue);
            bResave = false;
            var arrTempOri = ['NoSC', 'TT', 'EAC', 'scAnchorTreasure', 'scAnchorDanger', 'scAnchorUlti'];
            var arrTempNew = ['None', 'Treasure Trawling Charm', 'Empowered Anchor Charm', 'GAC_EAC', 'SAC_EAC', 'UAC_EAC'];
            var nIndex = -1;
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop) && prop == 'trinket') {
                    for (i = 0; i < obj[prop].length; i++) {
                        nIndex = arrTempOri.indexOf(obj[prop][i]);
                        if (nIndex > -1) {
                            obj[prop][i] = arrTempNew[nIndex];
                            bResave = true;
                        }
                    }
                }
            }
            if (obj.zone.indexOf('ZONE_DANGER_PP_LOTA') < 0) {
                obj.zone = ['ZONE_NOT_DIVE', 'ZONE_DEFAULT', 'ZONE_CORAL', 'ZONE_SCALE', 'ZONE_BARNACLE', 'ZONE_TREASURE', 'ZONE_DANGER', 'ZONE_DANGER_PP', 'ZONE_OXYGEN', 'ZONE_BONUS', 'ZONE_DANGER_PP_LOTA'];
                obj.zoneID = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                nIndex = obj.zone.indexOf('ZONE_DANGER_PP');
                obj.isHunt[10] = obj.isHunt[nIndex];
                obj.bait[10] = obj.bait[nIndex];
                obj.trinket[10] = obj.trinket[nIndex];
                bResave = true;
            }
            if (bResave) {
                setStorage("SCCustom", JSON.stringify(obj));
                setSessionStorage("SCCustom", JSON.stringify(obj));
            }
        }

        // Backward compatibility of SGZT
        keyValue = getStorage("SGZT");
        if (!isNullOrUndefined(keyValue)) {
            setStorage("SGarden", keyValue);
            setSessionStorage("SGarden", keyValue);
            removeStorage("SGZT");
            removeSessionStorage("SGZT");
        }

        // Backward compatibility of ZTower
        keyValue = getStorage("ZTower");
        if (!isNullOrUndefined(keyValue)) {
            obj = JSON.parse(keyValue);
            bResave = false;
            var arrTemp = new Array(7).fill('');
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop) &&
                    (prop == 'weapon' || prop == 'base' || prop == 'trinket' || prop == 'bait')) {
                    if (obj[prop].length == 7) {
                        obj[prop] = obj[prop].concat(arrTemp);
                        bResave = true;
                    }
                    if (prop == 'bait') {
                        for (i = 0; i < obj[prop].length; i++) {
                            if (obj[prop][i] == 'Brie') {
                                obj[prop][i] = 'Brie Cheese';
                                bResave = true;
                            }
                        }
                    }
                }
            }
            if (bResave) {
                setStorage("ZTower", JSON.stringify(obj));
                setSessionStorage("ZTower", JSON.stringify(obj));
            }
        }

        // Backward compatibility of BRCustom
        keyValue = getStorage("BRCustom");
        if (!isNullOrUndefined(keyValue)) {
            obj = JSON.parse(keyValue);
            bResave = false;
            for (i = 0; i < obj.trinket.length; i++) {
                if (obj.trinket[i] == 'None' || obj.trinket[i] == 'NoAbove' || obj.trinket[i] === '' || isNullOrUndefined(obj.trinket[i]))
                    continue;
                if (obj.trinket[i].indexOf('Charm') < 0) {
                    obj.trinket[i] += ' Charm';
                    bResave = true;
                }
            }
            if (bResave) {
                setStorage("BRCustom", JSON.stringify(obj));
                setSessionStorage("BRCustom", JSON.stringify(obj));
            }
        }

        // Backward compatibility of FRift
        keyValue = getStorage("FRift");
        if (!isNullOrUndefined(keyValue)) {
            obj = JSON.parse(keyValue);
            bResave = false;
            for (i = 0; i < obj.trinket.length; i++) {
                if (obj.trinket[i] == 'None' || obj.trinket[i] == 'NoAbove' || obj.trinket[i] === '' || isNullOrUndefined(obj.trinket[i]))
                    continue;
                if (obj.trinket[i].indexOf('Charm') < 0) {
                    obj.trinket[i] += ' Charm';
                    bResave = true;
                }
            }
            if (bResave) {
                setStorage("FRift", JSON.stringify(obj));
                setSessionStorage("FRift", JSON.stringify(obj));
            }
        }

        // Remove old LG
        keyValue = getStorage("LGArea");
        if (!isNullOrUndefined(keyValue) && keyValue.split(",").length == 2) {
            removeStorage("LGArea");
            removeSessionStorage("LGArea");
        }

        // Backward compatibility of FW
        keyValue = getStorage('FW');
        if (isNullOrUndefined(keyValue)) {
            obj = {};
            for (i = 1; i <= 4; i++) {
                temp = 'FW_Wave' + i;
                keyValue = getStorage(temp);
                if (!isNullOrUndefined(keyValue)) {
                    obj['wave' + i] = JSON.parse(keyValue);
                    removeStorage(temp);
                    removeSessionStorage(temp);
                }
                else {
                    obj['wave' + i] = JSON.parse(JSON.stringify(objDefaultFW));
                }
            }
            setStorage('FW', JSON.stringify(obj));
        }
        else {
            obj = JSON.parse(keyValue);
            bResave = false;
            for (i = 1; i <= 4; i++) {
                temp = 'wave' + i;
                for (j = 0; j < obj[temp].cheese.length; j++) {
                    if (obj[temp].cheese[j] == 'Brie') {
                        obj[temp].cheese[j] = 'Brie Cheese';
                        bResave = true;
                    }
                }
            }
            if (bResave) {
                setStorage("FW", JSON.stringify(obj));
                setSessionStorage("FW", JSON.stringify(obj));
            }
        }

        // Backward compatibility of Labyrinth
        keyValue = getStorage('Labyrinth');
        if (isNullOrUndefined(keyValue)) {
            obj = {};
            temp = getStorage('Labyrinth_DistrictFocus');
            keyValue = getStorage('Labyrinth_HallwayPriorities');
            if (isNullOrUndefined(keyValue)) {
                obj = JSON.parse(JSON.stringify(objDefaultLaby));
            }
            else {
                obj = JSON.parse(keyValue);
                if (isNullOrUndefined(temp))
                    temp = 'None';
                obj.districtFocus = temp;
            }
            setStorage('Labyrinth', JSON.stringify(obj));
            temp = ['Labyrinth_DistrictFocus', 'Labyrinth_HallwayPriorities'];
            for (i = 0; i < temp.length; i++) {
                removeStorage(temp[i]);
                removeSessionStorage(temp[i]);
            }
        }

        // Backward compatibility of Zokor
        keyValue = getStorage('Zokor');
        if (!isNullOrUndefined(keyValue)) {
            obj = JSON.parse(keyValue);
            bResave = false;
            for (i = 0; i < obj.bait.length; i++) {
                if (obj.bait[i] == 'Brie') {
                    obj.bait[i] = 'Brie Cheese';
                    bResave = true;
                }
            }
            if (bResave) {
                setStorage('Zokor', JSON.stringify(obj));
                setSessionStorage('Zokor', JSON.stringify(obj));
            }
        }

        // Backward compatibility of GWH2016R
        keyValue = getStorage('GWH2016R');
        if (!isNullOrUndefined(keyValue)) {
            obj = JSON.parse(keyValue);
            bResave = false;
            if (obj.zone.indexOf("NEW_YEAR'S_PARTY") < 0) {
                obj.zone.push("NEW_YEAR'S_PARTY");
                obj.weapon.push('');
                obj.base.push('');
                obj.trinket.push('');
                obj.bait.push('');
                obj.boost.push(false);
                bResave = true;
            }
            if (bResave) {
                setStorage('GWH2016R', JSON.stringify(obj));
                setSessionStorage('GWH2016R', JSON.stringify(obj));
            }
        }

        // Disable GWH2016
        if (getStorageToVariableStr("eventLocation", "None").indexOf('GWH2016') > -1)
            setStorage("eventLocation", "None");

        // Backward compatibility of GES
        keyValue = getStorage('GES');
        if (!isNullOrUndefined(keyValue)) {
            obj = JSON.parse(keyValue);
            if (isNullOrUndefined(obj.SD_BEFORE)) {
                var objNew = {
                    bLoadCrate: obj.SD.bLoadCrate,
                    nMinCrate: obj.SD.nMinCrate,
                    bUseRepellent: obj.RR.bUseRepellent,
                    nMinRepellent: obj.RR.nMinRepellent,
                    bStokeEngine: obj.DC.bStokeEngine,
                    nMinFuelNugget: obj.DC.nMinFuelNugget,
                    SD_BEFORE: {
                        weapon: obj.SD.weapon,
                        base: obj.SD.base,
                        trinket: obj.SD.trinket.before,
                        bait: obj.SD.bait,
                    },
                    SD_AFTER: {
                        weapon: obj.SD.weapon,
                        base: obj.SD.base,
                        trinket: obj.SD.trinket.after,
                        bait: obj.SD.bait,
                    },
                    RR: {
                        weapon: obj.RR.weapon,
                        base: obj.RR.base,
                        trinket: obj.RR.trinket,
                        bait: obj.RR.bait,
                    },
                    DC: {
                        weapon: obj.DC.weapon,
                        base: obj.DC.base,
                        trinket: obj.DC.trinket,
                        bait: obj.DC.bait,
                    },
                    WAITING: {
                        weapon: '',
                        base: '',
                        trinket: '',
                        bait: ''
                    }
                };
                setStorage('GES', JSON.stringify(objNew));
                setSessionStorage('GES', JSON.stringify(objNew));
            }
        }

        // Backward compatibility of BWRift
        keyValue = getStorage('BWRift');
        if (!isNullOrUndefined(keyValue)) {
            obj = JSON.parse(keyValue);
            bResave = false;
            if (obj.order.length != 16) {
                obj.order = ['NONE', 'GEARWORKS', 'ANCIENT', 'RUNIC', 'TIMEWARP', 'GUARD', 'SECURITY', 'FROZEN', 'FURNACE', 'INGRESS', 'PURSUER', 'ACOLYTE_CHARGING', 'ACOLYTE_DRAINING', 'ACOLYTE_DRAINED', 'LUCKY', 'HIDDEN'];
                bResave = true;
            }
            if (obj.priorities.length != 13) {
                if (obj.priorities.length == 11) {
                    obj.priorities.push('LUCKY');
                    obj.priorities.push('HIDDEN');
                }
                else
                    obj.priorities = ['SECURITY', 'FURNACE', 'PURSUER', 'ACOLYTE', 'LUCKY', 'HIDDEN', 'TIMEWARP', 'RUNIC', 'ANCIENT', 'GEARWORKS', 'GEARWORKS', 'GEARWORKS', 'GEARWORKS'];
                bResave = true;
            }
            if (isNullOrUndefined(obj.specialActivate)) {
                obj.specialActivate = {
                    forceActivate: new Array(16).fill(false),
                    remainingLootActivate: new Array(16).fill(1),
                    forceDeactivate: new Array(16).fill(obj.forceDeactivate),
                    remainingLootDeactivate: new Array(16).fill(obj.remainingLootDeactivate)
                };
                delete obj.forceDeactivate;
                delete obj.remainingLootDeactivate;
                bResave = true;
            }
            if (obj.minTimeSand.length != 9) {
                var arrTemp = new Array(9);
                arrTemp[0] = obj.minTimeSand[0];
                arrTemp[8] = obj.minTimeSand[2];
                for (i = 1; i <= 7; i++)
                    arrTemp[i] = obj.minTimeSand[1];
                obj.minTimeSand = arrTemp;
                bResave = true;
            }
            var objTemp = {
                arrTemp: ['master', 'specialActivate', 'gw', 'al', 'rl', 'gb', 'ic', 'fa'],
                arrLength: [16, 16, 2, 2, 2, 7, 4, 16],
            };
            for (i = 0; i < objTemp.arrTemp.length; i++) {
                if (obj.hasOwnProperty(objTemp.arrTemp[i])) {
                    for (var prop in obj[objTemp.arrTemp[i]]) {
                        if (obj[objTemp.arrTemp[i]].hasOwnProperty(prop)) {
                            while (obj[objTemp.arrTemp[i]][prop].length < objTemp.arrLength[i]) {
                                obj[objTemp.arrTemp[i]][prop].push(obj[objTemp.arrTemp[i]][prop][0]);
                                bResave = true;
                            }
                            if (obj[objTemp.arrTemp[i]][prop].length < (objTemp.arrLength[i] * 2)) {
                                obj[objTemp.arrTemp[i]][prop] = obj[objTemp.arrTemp[i]][prop].concat(obj[objTemp.arrTemp[i]][prop]);
                                bResave = true;
                            }
                        }
                    }
                }
            }
            if (bResave) {
                setStorage('BWRift', JSON.stringify(obj));
                setSessionStorage('BWRift', JSON.stringify(obj));
            }
        }
    }
    catch (e) {
        console.perror('loadPreferenceSettingFromStorage', e.message);
    }
    getTrapList();
    getBestTrap();
    bestLGBase = arrayConcatUnique(bestLGBase, objBestTrap.base.luck);
    bestSCBase = arrayConcatUnique(bestSCBase, objBestTrap.base.luck);
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

function getStorageToVariableInt(storageName, defaultInt) {
    var temp = getStorage(storageName);
    var tempInt = defaultInt;
    if (isNullOrUndefined(temp)) {
        setStorage(storageName, defaultInt);
    }
    else {
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
    }
    else if (temp === true || temp.toLowerCase() == "true") {
        return true;
    }
    else {
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
        }
        else {
            lastKingRewardSumTimeElement.innerHTML = "";
        }
    }

    timeStr = null;
}

// ################################################################################################
//   Timer Function - End
// ################################################################################################

// ################################################################################################
//   Horn Function - Start
// ################################################################################################

function soundHorn() {
    var isAtCampPage = (isNewUI) ? (document.getElementById('journalContainer') !== null) : (document.getElementById('huntingTips') !== null);
    if (!isAtCampPage) {
        displayTimer("Not At Camp Page", "Not At Camp Page", "Not At Camp Page");
        window.setTimeout(function () {
            soundHorn();
        }, timerRefreshInterval * 1000);
        return;
    }

    // update timer
    displayTimer("Ready to Blow The Horn...", "Ready to Blow The Horn...", "Ready to Blow The Horn...");

    var scriptNode = document.getElementById("scriptNode");
    if (scriptNode) {
        scriptNode.setAttribute("soundedHornAtt", "false");
    }
    scriptNode = null;

    if (!aggressiveMode) {
        // safety mode, check the horn image is there or not before sound the horn
        var headerElement = (isNewUI) ? document.getElementById('mousehuntHud').firstChild : document.getElementById('header');
        if (headerElement) {
            // need to make sure that the horn image is ready before we can click on it
            var headerStatus = headerElement.getAttribute('class');
            headerStatus = headerStatus.toLowerCase();
            if (headerStatus.indexOf("hornready") != -1) {
                // found the horn image, let's sound the horn!

                // update timer
                displayTimer("Blowing The Horn...", "Blowing The Horn...", "Blowing The Horn...");

                // simulate mouse click on the horn
                var hornElement = document.getElementsByClassName(strHornButton)[0].firstChild;
                fireEvent(hornElement, 'click');
                hornElement = null;

                // clean up
                headerElement = null;
                headerStatus = null;

                // double check if the horn was already sounded
                window.setTimeout(function () {
                    afterSoundingHorn();
                }, 5000);
            }
            else if (headerStatus.indexOf("hornsounding") != -1 || headerStatus.indexOf("hornsounded") != -1) {
                // some one just sound the horn...

                // update timer
                displayTimer("Synchronizing Data...", "Someone had just sound the horn. Synchronizing data...", "Someone had just sound the horn. Synchronizing data...");

                // clean up
                headerElement = null;
                headerStatus = null;

                // load the new data
                window.setTimeout(function () {
                    afterSoundingHorn();
                }, 5000);
            }
            else if (headerStatus.indexOf("hornwaiting") != -1) {
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
                    countdownTimer();
                }, timerRefreshInterval * 1000);
            }
            else {
                // some one steal the horn!

                // update timer
                displayTimer("Synchronizing Data...", "Hunter horn is missing. Synchronizing data...", "Hunter horn is missing. Synchronizing data...");

                if (isNewUI) {
                    // sync the time again, maybe user already click the horn
                    retrieveData();

                    checkJournalDate();

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // loop again
                    window.setTimeout(function () {
                        countdownTimer();
                    }, timerRefreshInterval * 1000);
                }
                else {
                    // try to click on the horn
                    var hornElement = document.getElementsByClassName(strHornButton)[0].firstChild;
                    fireEvent(hornElement, 'click');
                    hornElement = null;

                    // clean up
                    headerElement = null;
                    headerStatus = null;

                    // double check if the horn was already sounded
                    window.setTimeout(function () {
                        afterSoundingHorn(true);
                    }, 5000);
                }
            }
        }
        else {
            // something wrong, can't even found the header...

            // clean up
            headerElement = null;

            // reload the page see if thing get fixed
            reloadWithMessage("Fail to find the horn header. Reloading...", false);
        }

    }
    else {
        // aggressive mode, ignore whatever horn image is there or not, just sound the horn!

        // simulate mouse click on the horn
        fireEvent(document.getElementsByClassName(strHornButton)[0].firstChild, 'click');

        // double check if the horn was already sounded
        window.setTimeout(function () {
            afterSoundingHorn();
        }, 3000);
    }
}

function afterSoundingHorn(bLog) {
    var scriptNode = document.getElementById("scriptNode");
    if (scriptNode) {
        scriptNode.setAttribute("soundedHornAtt", "false");
    }
    scriptNode = null;

    var headerElement = (isNewUI) ? document.getElementById('mousehuntHud').firstChild : document.getElementById('header');
    if (headerElement) {
        // double check if the horn image is still visible after the script already sound it
        var headerStatus = headerElement.getAttribute('class');
        headerStatus = headerStatus.toLowerCase();
        if (bLog === true) console.plog('headerStatus:', headerStatus);
        if (headerStatus.indexOf("hornready") != -1) {
            // seen like the horn is not functioning well

            // update timer
            displayTimer("Blowing The Horn Again...", "Blowing The Horn Again...", "Blowing The Horn Again...");

            // simulate mouse click on the horn
            var hornElement = document.getElementsByClassName(strHornButton)[0].firstChild;
            fireEvent(hornElement, 'click');
            hornElement = null;

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
            }
            else {
                // check again later
                window.setTimeout(function () {
                    afterSoundingHorn();
                }, 1000);
            }
        }
        else if (headerStatus.indexOf("hornsounding") != -1) {
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
            }
            else {
                // check again later
                window.setTimeout(function () {
                    afterSoundingHorn();
                }, 3000);
            }
        }
        else {
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
                countdownTimer();
            }, timerRefreshInterval * 1000);

            // reset the horn retry counter
            hornRetry = 0;
        }
    }
}

function embedScript() {
    // create a javascript to detect if user click on the horn manually
    var scriptNode = document.createElement('script');
    scriptNode.setAttribute('id', 'scriptNode');
    scriptNode.setAttribute('type', 'text/javascript');
    scriptNode.setAttribute('soundedHornAtt', 'false');
    scriptNode.innerHTML = '														\
		function soundedHorn(){														\
			var scriptNode = document.getElementById("scriptNode");					\
			if (scriptNode){														\
				scriptNode.setAttribute("soundedHornAtt", "true");					\
			}																		\
			scriptNode = null;														\
		}';

    // find the head node and insert the script into it
    var headerElement;
    if (fbPlatform || hiFivePlatform || mhPlatform) {
        headerElement = document.getElementById('noscript');
    }
    else if (mhMobilePlatform) {
        headerElement = document.getElementById('mobileHorn');
    }
    headerElement.parentNode.insertBefore(scriptNode, headerElement);
    scriptNode = null;
    headerElement = null;

    // change the function call of horn
    var testNewUI = document.getElementById('header');
    if (!isNullOrUndefined(testNewUI)) {
        // old UI
        isNewUI = false;
        strHornButton = 'hornbutton';
        strCampButton = 'campbutton';
    }
    else {
        // new UI
        isNewUI = true;
        strHornButton = 'mousehuntHud-huntersHorn-container';
        strCampButton = 'camp';
        //alert("New UI might not work properly with this script. Use at your own risk");
        document.getElementById('titleElement').innerHTML += " - <font color='red'><b>Pls use Classic UI (i.e. Non-FreshCoat Layout) for fully working features</b></font>";
    }
    setStorage('NewUI', isNewUI);

    var hornButtonLink = document.getElementsByClassName(strHornButton)[0].firstChild;
    var oriStr = hornButtonLink.getAttribute('onclick').toString();
    var index = oriStr.indexOf('return false;');
    var modStr = oriStr.substring(0, index) + 'soundedHorn();' + oriStr.substring(index);
    hornButtonLink.setAttribute('onclick', modStr);

    hornButtonLink = null;
    oriStr = null;
    index = null;
    modStr = null;
}

// ################################################################################################
//   Horn Function - End
// ################################################################################################


// ################################################################################################
//   King's Reward Function - Start
// ################################################################################################

function kingRewardAction() {
    // update timer
    displayTimer("King's Reward!", "King's Reward!", "King's Reward!");
    displayLocation("-");

    // play music if needed
    playKingRewardSound();

    // focus on the answer input
    var inputElementList = document.getElementsByTagName('input');
    if (inputElementList) {
        for (var i = 0; i < inputElementList.length; ++i) {
            // check if it is a resume button
            if (inputElementList[i].getAttribute('name') == "puzzle_answer") {
                inputElementList[i].focus();
                break;
            }
        }
    }
    inputElementList = null;

    // retrieve last king's reward time
    var lastDate = getStorage("lastKingRewardDate");
    lastDate = (isNullOrUndefined(lastDate)) ? new Date(0) : new Date(lastDate);

    // record last king's reward time
    var nowDate = new Date();
    setStorage("lastKingRewardDate", nowDate.toString());
    var nTimezoneOffset = -(nowDate.getTimezoneOffset()) * 60000;
    var nInterval = Math.abs(nowDate - lastDate) / 1000; // in second

    console.plog("Last KR:", new Date(Date.parse(lastDate) + nTimezoneOffset).toISOString(), "Current KR:", new Date(Date.parse(nowDate) + nTimezoneOffset).toISOString(), "Interval:", timeFormat(nInterval));
    if (!isAutoSolve) {
        var intervalCRB = setInterval(
            function () {
                if (checkResumeButton()) {
                    clearInterval(intervalCRB);
                    intervalCRB = null;
                    return;
                }
            }, 1000);
        return;
    }

    var krDelaySec = krDelayMax;
    if (kingsRewardRetry > 0) {
        var nMin = krDelayMin / (kingsRewardRetry * 2);
        var nMax = krDelayMax / (kingsRewardRetry * 2);
        krDelaySec = nMin + Math.floor(Math.random() * (nMax - nMin));
    }
    else
        krDelaySec = krDelayMin + Math.floor(Math.random() * (krDelayMax - krDelayMin));

    var krStopHourNormalized = krStopHour;
    var krStartHourNormalized = krStartHour;
    if (krStopHour > krStartHour) { // e.g. Stop to Start => 22 to 06
        var offset = 24 - krStopHour;
        krStartHourNormalized = krStartHour + offset;
        krStopHourNormalized = 0;
        nowDate.setHours(nowDate.getHours() + offset);
    }

    if (nowDate.getHours() >= krStopHourNormalized && nowDate.getHours() < krStartHourNormalized && nInterval > (5 * 60)) {
        var krDelayMinute = krStartHourDelayMin + Math.floor(Math.random() * (krStartHourDelayMax - krStartHourDelayMin));
        krDelaySec += krStartHour * 3600 - (nowDate.getHours() * 3600 + nowDate.getMinutes() * 60 + nowDate.getSeconds());
        krDelaySec += krDelayMinute * 60;
        kingRewardCountdownTimer(krDelaySec, true);
    }
    else {
        kingRewardCountdownTimer(krDelaySec, false);
    }
}

function playKingRewardSound() {
    if (isKingWarningSound) {
        unsafeWindow.hornAudio = new Audio('https://raw.githubusercontent.com/devcnn88/MHAutoBotEnhanced/master/resources/Girtab.mp3');
        hornAudio.loop = true;
        hornAudio.play();
    }
}

function kingRewardCountdownTimer(interval, isReloadToSolve) {
    var strTemp = (isReloadToSolve) ? "Reload to solve KR in " : "Solve KR in (extra few sec delay) ";
    strTemp = strTemp + timeFormat(interval);
    displayTimer(strTemp, strTemp, strTemp);
    interval -= timerRefreshInterval;
    if (interval < 0) {
        if (isReloadToSolve) {
            strTemp = "Reloading...";
            displayTimer(strTemp, strTemp, strTemp);
            if (isNewUI) {
                reloadPage(false);
            }
            else {
                // simulate mouse click on the camp button
                var campElement = document.getElementsByClassName(strCampButton)[0].firstChild;
                fireEvent(campElement, 'click');
                campElement = null;
            }

            // reload the page if click on the camp button fail
            window.setTimeout(function () {
                reloadWithMessage("Fail to click on camp button. Reloading...", false);
            }, 5000);
        }
        else {
            strTemp = "Solving...";
            displayTimer(strTemp, strTemp, strTemp);
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
    }
    else {
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
            var nowDate = new Date();
            var nTimezoneOffset = -(nowDate.getTimezoneOffset()) * 60000;
            console.plog('Click Resume button at:', new Date(Date.parse(nowDate) + nTimezoneOffset).toISOString());
            fireEvent(resumeElement, 'click');
            resumeElement = null;

            var nRetry = 5;
            var intervalCRB1 = setInterval(function () {
                if (isNullOrUndefined(document.getElementById('journalContainer'))) {
                    // not at camp page
                    --nRetry;
                    if (nRetry <= 0) {
                        // reload url if click fail
                        reloadWithMessage("Fail to click on resume button. Reloading...", false);
                        clearInterval(intervalCRB1);
                    }
                }
                else {
                    var lastKingRewardDate = getStorage("lastKingRewardDate");
                    var lastDateStr;
                    if (isNullOrUndefined(lastKingRewardDate)) {
                        lastDateStr = "-";
                        lastKingRewardSumTime = -1;
                    }
                    else {
                        var lastDate = new Date(lastKingRewardDate);
                        lastDateStr = lastDate.toDateString() + " " + lastDate.toTimeString().substring(0, 8);
                        lastKingRewardSumTime = parseInt((new Date() - lastDate) / 1000);
                    }
                    kingTimeElement.innerHTML = "<b>Last King's Reward:</b> " + lastDateStr + " ";
                    kingTimeElement.appendChild(lastKingRewardSumTimeElement);
                    retrieveData(true);
                    countdownTimer();
                    addKREntries();
                    setKREntriesColor();
                    clearInterval(intervalCRB1);
                }
            }, 1000);
            found = true;
        }
        krFormClass = null;
    }
    else {
        var linkElementList = document.getElementsByTagName('img');
        if (linkElementList) {
            var i;
            for (i = 0; i < linkElementList.length; ++i) {
                // check if it is a resume button
                if (linkElementList[i].getAttribute('src').indexOf("resume_hunting_blue.gif") != -1) {
                    // found resume button

                    // simulate mouse click on the horn
                    resumeElement = linkElementList[i].parentNode;
                    var nowDate = new Date();
                    var nTimezoneOffset = -(nowDate.getTimezoneOffset()) * 60000;
                    console.plog('Click Resume button at:', new Date(Date.parse(nowDate) + nTimezoneOffset).toISOString());
                    fireEvent(resumeElement, 'click');
                    resumeElement = null;

                    // reload url if click fail
                    window.setTimeout(function () {
                        console.perror('Fail to click on resume button:', new Date());
                        reloadWithMessage("Fail to click on resume button. Reloading...", false);
                    }, 6000);

                    // recheck if the resume button is click because some time even the url reload also fail

                    window.setTimeout(function () {
                        console.perror('Recheck resume button:', new Date());
                        checkResumeButton();
                    }, 10000);

                    found = true;
                    break;
                }
            }
            i = null;
        }
        linkElementList = null;
    }

    try {
        return (found);
    }
    finally {
        found = null;
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
    }
    else {
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
    }
    else {
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
    var campElement = document.getElementsByClassName(strCampButton)[0].firstChild;
    fireEvent(campElement, 'click');
    campElement = null;

    // reload the page if click on camp button fail
    // window.setTimeout(function () { reloadWithMessage("Fail to click on camp button. Reloading...", false); }, 5000);
    var nDelay = 5000;
    window.setTimeout(function () {
        retrieveData();
    }, nDelay);
    window.setTimeout(function () {
        countdownTimer();
    }, nDelay + timerRefreshInterval * 1000);
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
    }
    else {
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
            }
            finally {
                cookieString = null;
            }
        }
        c_start = null;
    }
    c_name = null;
    return null;
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

function fireEvent(element, event) {
    if (element === null || element === undefined)
        return;
    var evt;
    if (document.createEventObject) {
        // dispatch for IE
        evt = document.createEventObject();

        try {
            return element.fireEvent('on' + event, evt);
        }
        finally {
            element = null;
            event = null;
            evt = null;
        }
    }
    else {
        // dispatch for firefox + others
        evt = new MouseEvent(event, {
            "bubbles": true,
            "cancelable": true
        });

        try {
            return !element.dispatchEvent(evt);
        }
        finally {
            element = null;
            event = null;
            evt = null;
        }
    }
}

function getPageVariable(variableName) {
    var value = "";
    try {
        if (browser == 'chrome' || browser == 'opera') {
            // google chrome & opera only
            var scriptElement = document.createElement("script");
            scriptElement.setAttribute('id', "scriptElement");
            scriptElement.setAttribute('type', "text/javascript");
            scriptElement.innerHTML = "document.getElementById('scriptElement').innerText=" + variableName + ";";
            document.body.appendChild(scriptElement);

            value = scriptElement.innerHTML;
            document.body.removeChild(scriptElement);
            scriptElement = null;
            variableName = null;
        }
    }
    catch (e) {
        console.perror('getPageVariable', e.message);
    }
    return value;
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
    }
    finally {
        elapsed = null;
    }
}

function timeFormat(time) {
    var timeString;
    var hr = Math.floor(time / 3600);
    var min = Math.floor((time % 3600) / 60);
    var sec = (time % 3600 % 60) % 60;

    if (hr > 0) {
        timeString = hr.toString() + " hr " + min.toString() + " min " + sec.toString() + " sec";
    }
    else if (min > 0) {
        timeString = min.toString() + " min " + sec.toString() + " sec";
    }
    else {
        timeString = sec.toString() + " sec";
    }

    time = null;
    hr = null;
    min = null;
    sec = null;

    try {
        return (timeString);
    }
    finally {
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
        }
        else if (hr > 0) {
            timeString = hr.toString() + " hr " + min.toString() + " min ago";
        }
        else if (min > 0) {
            timeString = min.toString() + " min ago";
        }

        day = null;
        hr = null;
        min = null;
    }
    else {
        timeString = null;
    }

    time = null;

    try {
        return (timeString);
    }
    finally {
        timeString = null;
    }
}

// ################################################################################################
//   General Function - End
// ################################################################################################

// ################################################################################################
//   HTML Function - Start
// ################################################################################################
function refreshTrapList() {
    try {
        var objUserHash = {
            uh: user.unique_hash
        };

        jQuery.ajax({
            type: 'POST',
            url: '/managers/ajax/users/gettrapcomponents.php',
            data: objUserHash,
            contentType: 'text/plain',
            dataType: 'json',
            xhrFields: {
                withCredentials: false
            },
            timeout: 10000,
            statusCode: {
                200: function () {
                }
            },
            success: function (data) {
                var objTrap = {
                    weapon: [],
                    base: [],
                    trinket: [],
                    bait: []
                };
                for (var i = 0; i < data.components.length; i++) {
                    if (data.components[i].classification == 'skin')
                        continue;
                    objTrap[data.components[i].classification].push(data.components[i].name);
                }
                window.localStorage.setItem('TrapListWeapon', objTrap.weapon.join());
                window.localStorage.setItem('TrapListBase', objTrap.base.join());
                window.localStorage.setItem('TrapListTrinket', objTrap.trinket.join());
                window.localStorage.setItem('TrapListBait', objTrap.bait.join());
            },
            error: function (error) {
                console.perror('refreshTrapList:', error);
            }
        });
    } catch (e) {
        console.perror('refreshTrapList', e.message);
    }
}

function bodyJS() {
    var objDefaultFGAR = {
        order: ['FG', 'AR'],
        weapon: new Array(2).fill(''),
        base: new Array(2).fill(''),
        trinket: new Array(2).fill(''),
        bait: new Array(2).fill('')
    };
    var objDefaultBCJOD = {
        order: ['JOD', 'LOW', 'MID', 'HIGH'],
        weapon: new Array(4).fill(''),
        base: new Array(4).fill(''),
        trinket: new Array(4).fill(''),
        bait: new Array(4).fill('')
    };
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

    function limitMinMax(value, min, max) {
        value = parseInt(value);
        min = parseInt(min);
        max = parseInt(max);
        if (value < min)
            value = min;
        else if (value > max)
            value = max;
        return value;
    }

    function isNullOrUndefined(obj) {
        return (obj === null || obj === undefined || obj === 'null' || obj === 'undefined' || (Array.isArray(obj) && obj.length === 0));
    }

    function onIdRestoreClicked() {
        var idRestore = document.getElementById('idRestore');
        var inputFiles = document.getElementById('inputFiles');
        if (window.FileReader) {
            if (inputFiles && window.sessionStorage.getItem('bRestart') != 'true') {
                inputFiles.click();
            }
        }
        else {
            alert('The File APIs are not fully supported in this browser.');
        }
    }

    function handleFiles(files) {
        if (files.length < 1)
            return;
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                var arr = evt.target.result.split('\r\n');
                var arrSplit = [];
                var bRestart = false;
                var nIndex = -1;
                var temp = "";
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf('|') > -1) {
                        arrSplit = arr[i].split('|');
                        if (arrSplit.length == 2) {
                            nIndex = arrSplit[0].indexOf('Z');
                            temp = (nIndex > -1) ? arrSplit[0].substr(0, nIndex + 1) : arrSplit[0];
                            if (Number.isNaN(Date.parse(temp))) {
                                console.log(arrSplit);
                                window.localStorage.setItem(arrSplit[0], arrSplit[1]);
                                window.sessionStorage.setItem(arrSplit[0], arrSplit[1]);
                                bRestart = true;
                            }
                        }
                    }
                }
                if (bRestart) {
                    alert('Please restart browser to take effect!');
                    window.sessionStorage.setItem('bRestart', 'true');
                    document.getElementById('idRestore').firstChild.textContent = 'Restart browser is required!';
                    document.getElementById('idRestore').style = "color:red";
                }
                else {
                    alert('Invalid preference file!');
                }
            }
        };
        var blob = files[0].slice(0, files[0].size);
        reader.readAsText(blob);
    }

    function onIdAdsClicked() {
        document.getElementById('inputShowAds').value = 'Loading Ads...';
        document.getElementById('inputShowAds').disabled = 'disabled';
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                document.getElementById('inputShowAds').value = 'Click to Show Ads';
                document.getElementById('inputShowAds').disabled = '';
                var arr = xmlHttp.responseText.split("\r\n");
                console.log(arr);
                var win;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf("http") === 0) {
                        win = window.open(arr[i]);
                        if (!win) {
                            alert("Please allow popups for this site");
                            return;
                        }
                    }
                }
            }
        };
        xmlHttp.open("GET", "https://dl.dropboxusercontent.com/s/3cbo6en86lrpas1/Test.txt", true); // true for asynchronous
        xmlHttp.send(null);
        window.setTimeout(function () {
            document.getElementById('inputShowAds').value = 'Click to Show Ads';
            document.getElementById('inputShowAds').disabled = '';
        }, 5000);
    }

    function onIdGetLogPreferenceClicked() {
        var i;
        var str = "";
        var strKeyName = "";
        var arrTimestamp = [];
        var arrValue = [];
        for (i = 0; i < window.localStorage.length; i++) {
            strKeyName = window.localStorage.key(i);
            if (strKeyName.indexOf('KR') === 0)
                continue;
            str += strKeyName + '|' + window.localStorage.getItem(strKeyName);
            str += "\r\n";
        }
        for (i = 0; i < window.sessionStorage.length; i++) {
            strKeyName = window.sessionStorage.key(i);
            if (strKeyName.indexOf('Log_') > -1) {
                arrTimestamp.push(parseFloat(strKeyName.split('_')[1]));
                arrValue.push(window.sessionStorage.getItem(strKeyName));
            }
        }
        arrTimestamp = arrTimestamp.sort();
        var nTimezoneOffset = -(new Date().getTimezoneOffset()) * 60000;
        for (i = 0; i < arrTimestamp.length; i++) {
            if (Number.isNaN(arrTimestamp[i]))
                strKeyName = arrTimestamp[i];
            else {
                arrTimestamp[i] += nTimezoneOffset;
                strKeyName = (new Date(arrTimestamp[i])).toISOString();
                strKeyName += '.' + arrTimestamp[i].toFixed(3).split('.')[1];
            }
            str += strKeyName + "|" + arrValue[i];
            str += "\r\n";
        }
        saveFile(str, 'log_preference.txt');
    }

    function saveFile(content, filename) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        pom.setAttribute('download', filename);

        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
    }

    function onSelectSpecialFeature() {
        saveSpecialFeature();
    }

    function saveSpecialFeature() {
        var selectSpecialFeature = document.getElementById('selectSpecialFeature');
        window.sessionStorage.setItem('SpecialFeature', selectSpecialFeature.value);
    }

    function initControlsSpecialFeature() {
        var selectSpecialFeature = document.getElementById('selectSpecialFeature');
        var storageValue = window.sessionStorage.getItem('SpecialFeature');
        if (storageValue === null || storageValue === undefined) {
            storageValue = 'None';
        }
        selectSpecialFeature.value = storageValue;
    }

    function onSelectMapHuntingChanged() {
        saveMapHunting();
        initControlsMapHunting();
    }

    function saveMapHunting() {
        var selectMapHunting = document.getElementById('selectMapHunting');
        var selectMouseList = document.getElementById('selectMouseList');
        var selectWeapon = document.getElementById('selectWeapon');
        var selectBase = document.getElementById('selectBase');
        var selectTrinket = document.getElementById('selectTrinket');
        var selectBait = document.getElementById('selectBait');
        var selectLeaveMap = document.getElementById('selectLeaveMap');
        var inputUncaughtMouse = document.getElementById('inputUncaughtMouse');
        var selectCatchLogic = document.getElementById('selectCatchLogic');
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
        var storageValue = JSON.parse(window.sessionStorage.getItem('MapHunting'));
        if (isNullOrUndefined(storageValue))
            storageValue = objDefaultMapHunting;
        storageValue.status = (selectMapHunting.value == 'true');
        if (inputUncaughtMouse.value === '')
            storageValue.selectedMouse = [];
        else
            storageValue.selectedMouse = inputUncaughtMouse.value.split(',');
        storageValue.logic = selectCatchLogic.value;
        storageValue.weapon = selectWeapon.value;
        storageValue.base = selectBase.value;
        storageValue.trinket = selectTrinket.value;
        storageValue.bait = selectBait.value;
        storageValue.leave = (selectLeaveMap.value == 'true');
        window.sessionStorage.setItem('MapHunting', JSON.stringify(storageValue));
    }

    function initControlsMapHunting() {
        var trUncaughtMouse = document.getElementById('trUncaughtMouse');
        var trSelectedUncaughtMouse = document.getElementById('trSelectedUncaughtMouse');
        var trCatchLogic = document.getElementById('trCatchLogic');
        var selectMapHunting = document.getElementById('selectMapHunting');
        var selectMouseList = document.getElementById('selectMouseList');
        var trMapHuntingTrapSetup = document.getElementById('trMapHuntingTrapSetup');
        var trMapHuntingLeave = document.getElementById('trMapHuntingLeave');
        var inputUncaughtMouse = document.getElementById('inputUncaughtMouse');
        var selectCatchLogic = document.getElementById('selectCatchLogic');
        var selectWeapon = document.getElementById('selectWeapon');
        var selectBase = document.getElementById('selectBase');
        var selectTrinket = document.getElementById('selectTrinket');
        var selectBait = document.getElementById('selectBait');
        var selectLeaveMap = document.getElementById('selectLeaveMap');
        var storageValue = window.sessionStorage.getItem('MapHunting');
        if (isNullOrUndefined(storageValue)) {
            selectMapHunting.selectedIndex = 0;
            trUncaughtMouse.style.display = 'none';
            trMapHuntingTrapSetup.style.display = 'none';
            trMapHuntingLeave.style.display = 'none';
            inputUncaughtMouse.value = '';
            selectCatchLogic.selectedIndex = -1;
            selectWeapon.selectedIndex = -1;
            selectBase.selectedIndex = -1;
            selectTrinket.selectedIndex = -1;
            selectBait.selectedIndex = -1;
            selectLeaveMap.selectedIndex = -1;
        }
        else {
            storageValue = JSON.parse(storageValue);
            selectMapHunting.value = storageValue.status;
            trUncaughtMouse.style.display = (storageValue.status) ? 'table-row' : 'none';
            trSelectedUncaughtMouse.style.display = (storageValue.status) ? 'table-row' : 'none';
            trCatchLogic.style.display = (storageValue.status) ? 'table-row' : 'none';
            trMapHuntingTrapSetup.style.display = (storageValue.status) ? 'table-row' : 'none';
            trMapHuntingLeave.style.display = (storageValue.status) ? 'table-row' : 'none';
            inputUncaughtMouse.value = storageValue.selectedMouse.join(',');
            selectCatchLogic.value = storageValue.logic;
            selectWeapon.value = storageValue.weapon;
            selectBase.value = storageValue.base;
            selectTrinket.value = storageValue.trinket;
            selectBait.value = storageValue.bait;
            selectLeaveMap.value = storageValue.leave;
        }
        storageValue = window.localStorage.getItem('Last Record Uncaught');
        if (!isNullOrUndefined(storageValue)) {
            storageValue = storageValue.split(",");
            var i;
            for (i = selectMouseList.options.length - 1; i >= 0; i--) {
                selectMouseList.remove(i);
            }
            var optionEle;
            for (i = 0; i < storageValue.length; i++) {
                optionEle = document.createElement("option");
                optionEle.setAttribute('value', storageValue[i]);
                optionEle.textContent = storageValue[i];
                selectMouseList.appendChild(optionEle);
            }
        }
        document.getElementById('inputSelectMouse').disabled = (selectMouseList.options.length > 0) ? '' : 'disabled';
    }

    function onInputSelectMouse() {
        var inputUncaughtMouse = document.getElementById('inputUncaughtMouse');
        var selectMouseList = document.getElementById('selectMouseList');
        if (inputUncaughtMouse.value.indexOf(selectMouseList.value) < 0) {
            if (inputUncaughtMouse.value.length !== 0)
                inputUncaughtMouse.value = selectMouseList.value + ',' + inputUncaughtMouse.value;
            else
                inputUncaughtMouse.value = selectMouseList.value;
        }
        saveMapHunting();
    }

    function onInputGetMouse() {
        var classTreasureMap = document.getElementsByClassName('mousehuntHud-userStat treasureMap')[0];
        if (classTreasureMap.children[2].textContent.toLowerCase().indexOf('remaining') < 0)
            return;

        document.getElementById('inputGetMouse').value = 'Processing...';
        document.getElementById('inputGetMouse').disabled = 'disabled';
        try {
            var objData = {
                sn: 'Hitgrab',
                hg_is_ajax: 1,
                action: 'info',
                uh: user.unique_hash
            };

            jQuery.ajax({
                type: 'POST',
                url: '/managers/ajax/users/relichunter.php',
                data: objData,
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                xhrFields: {
                    withCredentials: false
                },
                success: function (data) {
                    document.getElementById('inputGetMouse').value = 'Refresh Uncaught Mouse List';
                    document.getElementById('inputGetMouse').disabled = '';
                    console.log(data.treasure_map);
                    if (data.treasure_map.groups !== null && data.treasure_map.groups !== undefined) {
                        var arrUncaught = [];
                        for (var i = 0; i < data.treasure_map.groups.length; i++) {
                            if (data.treasure_map.groups[i].is_uncaught === true) {
                                for (var j = 0; j < data.treasure_map.groups[i].mice.length; j++) {
                                    arrUncaught.push(data.treasure_map.groups[i].mice[j].name);
                                }
                            }
                        }
                        window.localStorage.setItem('Last Record Uncaught', arrUncaught.join(","));
                        initControlsMapHunting();
                    }
                },
                error: function (error) {
                    document.getElementById('inputGetMouse').value = 'Refresh Uncaught Mouse List';
                    document.getElementById('inputGetMouse').disabled = '';
                    console.error('onInputGetMouse ajax:', error);
                }
            });
        }
        catch (e) {
            document.getElementById('inputGetMouse').value = 'Refresh Uncaught Mouse List';
            document.getElementById('inputGetMouse').disabled = '';
            console.error('onInputGetMouse', e.message);
        }
    }

    function onInputClearUncaughtMouse() {
        document.getElementById('inputUncaughtMouse').value = "";
        saveMapHunting();
    }

    var arrKey = ['SCCustom', 'Labyrinth', 'LGArea', 'eventLocation', 'FW', 'BRCustom', 'SGarden', 'Zokor', 'FRift', 'MapHunting', 'ZTower', 'BestTrap', 'Iceberg', 'WWRift', 'GES', 'FRox', 'GWH2016R', 'SpecialFeature', 'BWRift', 'BC_JOD', 'FG_AR'];

    function setLocalToSession() {
        var i, j, key;
        for (i = 0; i < window.localStorage.length; i++) {
            key = window.localStorage.key(i);
            for (j = 0; j < arrKey.length; j++) {
                if (key.indexOf(arrKey[j]) > -1) {
                    window.sessionStorage.setItem(key, window.localStorage.getItem(key));
                    break;
                }
            }
        }
    }

    function setSessionToLocal() {
        if (window.sessionStorage.length === 0)
            return;

        var i, j, key;
        for (i = 0; i < window.sessionStorage.length; i++) {
            key = window.sessionStorage.key(i);
            for (j = 0; j < arrKey.length; j++) {
                if (key.indexOf(arrKey[j]) > -1) {
                    window.localStorage.setItem(key, window.sessionStorage.getItem(key));
                    break;
                }
            }
        }
    }

    function onInputResetReload() {
        var strValue = document.getElementById('eventAlgo').value;
        var keyName;
        if (strValue == 'Burroughs Rift Custom') keyName = 'BRCustom';
        else if (strValue == 'All LG Area') keyName = 'LGArea';
        else if (strValue == 'SG') keyName = 'SGarden';
        else if (strValue == 'ZT') keyName = 'ZTower';
        else if (strValue == 'Sunken City Custom') keyName = 'SCCustom';
        else if (strValue == 'Labyrinth') keyName = 'Labyrinth';
        else if (strValue == 'Zokor') keyName = 'Zokor';
        else if (strValue == 'Fiery Warpath') keyName = 'FW';
        else if (strValue == 'Furoma Rift') keyName = 'FRift';
        else if (strValue == 'Iceberg') keyName = 'Iceberg';
        else if (strValue == 'WWRift') keyName = 'WWRift';
        else if (strValue == 'GES') keyName = 'GES';
        else if (strValue == 'Fort Rox') keyName = 'FRox';
        else if (strValue == 'GWH2016R') keyName = 'GWH2016R';
        else if (strValue == 'Bristle Woods Rift') keyName = 'BWRift';
        else if (strValue == 'BC/JOD') keyName = 'BC_JOD';
        else if (strValue == 'FG/AR') keyName = 'FG_AR';

        if (!isNullOrUndefined(keyName)) {
            window.sessionStorage.removeItem(keyName);
            window.localStorage.removeItem(keyName);
        }
    }

    function initControlsBestTrap() {
        var selectBestTrapPowerType = document.getElementById('selectBestTrapPowerType');
        var selectBestTrapWeapon = document.getElementById('selectBestTrapWeapon');
        var selectBestTrapBaseType = document.getElementById('selectBestTrapBaseType');
        var selectBestTrapBase = document.getElementById('selectBestTrapBase');
        var storageValue = window.sessionStorage.getItem('BestTrap');
        if (isNullOrUndefined(storageValue)) {
            selectBestTrapWeapon.selectedIndex = -1;
            selectBestTrapBase.selectedIndex = -1;
        }
        else {
            storageValue = JSON.parse(storageValue);
            selectBestTrapWeapon.value = storageValue.weapon[selectBestTrapPowerType.value];
            selectBestTrapBase.value = storageValue.base[selectBestTrapBaseType.value];
        }
    }

    function saveBestTrap() {
        var selectBestTrapPowerType = document.getElementById('selectBestTrapPowerType');
        var selectBestTrapWeapon = document.getElementById('selectBestTrapWeapon');
        var selectBestTrapBaseType = document.getElementById('selectBestTrapBaseType');
        var selectBestTrapBase = document.getElementById('selectBestTrapBase');
        var storageValue = window.sessionStorage.getItem('BestTrap');
        if (isNullOrUndefined(storageValue)) {
            var objBestTrapDefault = {
                weapon: {
                    arcane: '',
                    draconic: '',
                    forgotten: '',
                    hydro: '',
                    law: '',
                    physical: '',
                    rift: '',
                    shadow: '',
                    tactical: ''
                },
                base: {
                    luck: '',
                    power: ''
                }
            };
            storageValue = JSON.stringify(objBestTrapDefault);
        }

        storageValue = JSON.parse(storageValue);
        storageValue.weapon[selectBestTrapPowerType.value] = selectBestTrapWeapon.value;
        storageValue.base[selectBestTrapBaseType.value] = selectBestTrapBase.value;
        window.sessionStorage.setItem('BestTrap', JSON.stringify(storageValue));
    }

    function onInputMinAAChanged(input) {
        input.value = limitMinMax(input.value, input.min, input.max);
        saveGWH2016();
    }

    function onInputMinWorkChanged(input) {
        input.value = limitMinMax(input.value, input.min, input.max);
        saveGWH2016();
    }

    function onSelectGWHTrinketChanged() {
        saveGWH2016();
        initControlsGWH2016();
    }

    function initControlsGWH2016(bAutoChangeZone) {
        if (isNullOrUndefined(bAutoChangeZone))
            bAutoChangeZone = false;
        var selectGWHZone = document.getElementById('selectGWHZone');
        var selectGWHWeapon = document.getElementById('selectGWHWeapon');
        var selectGWHBase = document.getElementById('selectGWHBase');
        var selectGWHTrinket = document.getElementById('selectGWHTrinket');
        var selectGWHBait = document.getElementById('selectGWHBait');
        var selectGWHBoost = document.getElementById('selectGWHBoost');
        var selectGWHUseTurboBoost = document.getElementById('selectGWHUseTurboBoost');
        var inputMinAA = document.getElementById('inputMinAA');
        var inputMinFirework = document.getElementById('inputMinFirework');
        var selectGWHLandAfterRunOutFirework = document.getElementById('selectGWHLandAfterRunOutFirework');
        var storageValue = window.sessionStorage.getItem('GWH2016R');
        if (isNullOrUndefined(storageValue)) {
            selectGWHWeapon.selectedIndex = -1;
            selectGWHBase.selectedIndex = -1;
            selectGWHTrinket.selectedIndex = -1;
            selectGWHBait.selectedIndex = -1;
            selectGWHBoost.selectedIndex = -1;
            selectGWHUseTurboBoost.selectedIndex = 0;
            inputMinAA.value = 20;
            inputMinFirework.value = 20;
            selectGWHLandAfterRunOutFirework.selectedIndex = 0;
        }
        else {
            storageValue = JSON.parse(storageValue);
            var nIndex = storageValue.zone.indexOf(selectGWHZone.value);
            selectGWHWeapon.value = storageValue.weapon[nIndex];
            selectGWHBase.value = storageValue.base[nIndex];
            selectGWHTrinket.value = storageValue.trinket[nIndex];
            selectGWHBait.value = storageValue.bait[nIndex];
            selectGWHBoost.value = (storageValue.boost[nIndex] === true) ? 'true' : 'false';
            selectGWHBoost.disabled = (selectGWHTrinket.value.toUpperCase().indexOf('ANCHOR') > -1) ? 'disabled' : '';
            selectGWHUseTurboBoost.value = (storageValue.turbo === true) ? 'true' : 'false';
            inputMinAA.value = storageValue.minAAToFly;
            inputMinFirework.value = storageValue.minFireworkToFly;
            selectGWHLandAfterRunOutFirework.value = (storageValue.landAfterFireworkRunOut === true) ? 'true' : 'false';
        }
    }

    function saveGWH2016() {
        var selectGWHZone = document.getElementById('selectGWHZone');
        var selectGWHWeapon = document.getElementById('selectGWHWeapon');
        var selectGWHBase = document.getElementById('selectGWHBase');
        var selectGWHTrinket = document.getElementById('selectGWHTrinket');
        var selectGWHBait = document.getElementById('selectGWHBait');
        var selectGWHBoost = document.getElementById('selectGWHBoost');
        var selectGWHUseTurboBoost = document.getElementById('selectGWHUseTurboBoost');
        var inputMinAA = document.getElementById('inputMinAA');
        var inputMinFirework = document.getElementById('inputMinFirework');
        var selectGWHLandAfterRunOutFirework = document.getElementById('selectGWHLandAfterRunOutFirework');
        var storageValue = window.sessionStorage.getItem('GWH2016R');
        if (isNullOrUndefined(storageValue)) {
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
            storageValue = JSON.stringify(objDefaultGWH2016);
        }
        storageValue = JSON.parse(storageValue);
        var nIndex = storageValue.zone.indexOf(selectGWHZone.value);
        storageValue.weapon[nIndex] = selectGWHWeapon.value;
        storageValue.base[nIndex] = selectGWHBase.value;
        storageValue.trinket[nIndex] = selectGWHTrinket.value;
        storageValue.bait[nIndex] = selectGWHBait.value;
        storageValue.boost[nIndex] = (selectGWHTrinket.value.toUpperCase().indexOf('ANCHOR') > -1) ? false : (selectGWHBoost.value == 'true');
        storageValue.turbo = (selectGWHUseTurboBoost.value == 'true');
        storageValue.minAAToFly = parseInt(inputMinAA.value);
        storageValue.minFireworkToFly = parseInt(inputMinFirework.value);
        storageValue.landAfterFireworkRunOut = (selectGWHLandAfterRunOutFirework.value == 'true');
        window.sessionStorage.setItem('GWH2016R', JSON.stringify(storageValue));
    }

    function initControlsSCCustom(bAutoChangeZone) {
        if (isNullOrUndefined(bAutoChangeZone))
            bAutoChangeZone = false;
        var selectSCHuntZone = document.getElementById('selectSCHuntZone');
        var selectSCHuntZoneEnable = document.getElementById('selectSCHuntZoneEnable');
        var selectSCHuntBait = document.getElementById('selectSCHuntBait');
        var selectSCHuntTrinket = document.getElementById('selectSCHuntTrinket');
        var selectSCUseSmartJet = document.getElementById('selectSCUseSmartJet');
        var storageValue = window.sessionStorage.getItem('SCCustom');
        if (isNullOrUndefined(storageValue)) {
            var objDefaultSCCustom = {
                zone: ['ZONE_NOT_DIVE', 'ZONE_DEFAULT', 'ZONE_CORAL', 'ZONE_SCALE', 'ZONE_BARNACLE', 'ZONE_TREASURE', 'ZONE_DANGER', 'ZONE_DANGER_PP', 'ZONE_OXYGEN', 'ZONE_BONUS', 'ZONE_DANGER_PP_LOTA'],
                zoneID: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                isHunt: new Array(11).fill(true),
                bait: new Array(11).fill('Gouda'),
                trinket: new Array(11).fill('None'),
                useSmartJet: false
            };
            storageValue = JSON.stringify(objDefaultSCCustom);
        }

        storageValue = JSON.parse(storageValue);
        if (bAutoChangeZone && !isNullOrUndefined(user) && user.location.indexOf('Sunken City') > -1) {
            var zone = document.getElementsByClassName('zoneName')[0].innerText;
            var objZone = {
                'ZONE_TREASURE': ['Sand Dollar Sea Bar', 'Pearl Patch', 'Sunken Treasure'],
                'ZONE_DANGER': ['Feeding Grounds', 'Carnivore Cove'],
                'ZONE_DANGER_PP': ['Monster Trench'],
                'ZONE_DANGER_PP_LOTA': ['Lair of the Ancients'],
                'ZONE_OXYGEN': ['Deep Oxygen Stream', 'Oxygen Stream'],
                'ZONE_BONUS': ['Magma Flow'],
                'ZONE_CORAL': ['Coral Reef', 'Coral Garden', 'Coral Castle'],
                'ZONE_SCALE': ['School of Mice', 'Mermouse Den', 'Lost Ruins'],
                'ZONE_BARNACLE': ['Rocky Outcrop', 'Shipwreck', 'Haunted Shipwreck'],
                'ZONE_DEFAULT': ['Shallow Shoals', 'Sea Floor', 'Murky Depths'],
            };
            selectSCHuntZone.selectedIndex = 0;
            for (var prop in objZone) {
                if (objZone.hasOwnProperty(prop)) {
                    if (objZone[prop].indexOf(zone) > -1) {
                        selectSCHuntZone.value = prop;
                        break;
                    }
                }
            }
        }
        var nIndex = storageValue.zone.indexOf(selectSCHuntZone.value);
        if (nIndex < 0)
            nIndex = 0;
        selectSCHuntZoneEnable.value = storageValue.isHunt[nIndex];
        selectSCHuntBait.value = storageValue.bait[nIndex];
        selectSCHuntTrinket.value = storageValue.trinket[nIndex];
        selectSCUseSmartJet.value = storageValue.useSmartJet;
        selectSCHuntZoneEnable.style.display = (selectSCHuntZone.value == 'ZONE_NOT_DIVE') ? 'none' : '';
    }

    function saveSCCustomAlgo() {
        var selectSCHuntZone = document.getElementById('selectSCHuntZone');
        var selectSCHuntZoneEnable = document.getElementById('selectSCHuntZoneEnable');
        var selectSCHuntBait = document.getElementById('selectSCHuntBait');
        var selectSCHuntTrinket = document.getElementById('selectSCHuntTrinket');
        var selectSCUseSmartJet = document.getElementById('selectSCUseSmartJet');
        var storageValue = window.sessionStorage.getItem('SCCustom');
        if (isNullOrUndefined(storageValue)) {
            var objDefaultSCCustom = {
                zone: ['ZONE_NOT_DIVE', 'ZONE_DEFAULT', 'ZONE_CORAL', 'ZONE_SCALE', 'ZONE_BARNACLE', 'ZONE_TREASURE', 'ZONE_DANGER', 'ZONE_DANGER_PP', 'ZONE_OXYGEN', 'ZONE_BONUS', 'ZONE_DANGER_PP_LOTA'],
                zoneID: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                isHunt: new Array(11).fill(true),
                bait: new Array(11).fill('Gouda'),
                trinket: new Array(11).fill('None'),
                useSmartJet: false
            };
            storageValue = JSON.stringify(objDefaultSCCustom);
        }

        storageValue = JSON.parse(storageValue);
        var nIndex = storageValue.zone.indexOf(selectSCHuntZone.value);
        if (nIndex < 0)
            nIndex = 0;
        storageValue.isHunt[nIndex] = (selectSCHuntZoneEnable.value === 'true');
        storageValue.bait[nIndex] = selectSCHuntBait.value;
        storageValue.trinket[nIndex] = selectSCHuntTrinket.value;
        storageValue.useSmartJet = (selectSCUseSmartJet.value === 'true');
        window.sessionStorage.setItem('SCCustom', JSON.stringify(storageValue));
    }

    function onSelectLabyrinthDistrict() {
        saveLaby();
        initControlsLaby();
    }

    function onSelectLabyrinthDisarm() {
        var inputLabyrinthLastHunt = document.getElementById('inputLabyrinthLastHunt');
        var selectLabyrinthDisarm = document.getElementById('selectLabyrinthDisarm');
        inputLabyrinthLastHunt.disabled = (selectLabyrinthDisarm.value == 'true') ? '' : 'disabled';
        saveLaby();
    }

    function onInputLabyrinthLastHuntChanged(input) {
        input.value = limitMinMax(input.value, input.min, input.max);
        saveLaby();
    }

    function onSelectLabyrinthDisarmCompass() {
        saveLaby();
        initControlsLaby();
    }

    function onInputLabyrinthDECChanged(input) {
        input.value = limitMinMax(input.value, input.min, input.max);
        saveLaby();
    }

    function saveLaby() {
        var selectLabyrinthDistrict = document.getElementById('selectLabyrinthDistrict');
        var selectHallway15Plain = document.getElementById('selectHallway15Plain');
        var selectHallway1560Plain = document.getElementById('selectHallway1560Plain');
        var selectHallway1560Superior = document.getElementById('selectHallway1560Superior');
        var selectHallway60Plain = document.getElementById('selectHallway60Plain');
        var selectHallway60Superior = document.getElementById('selectHallway60Superior');
        var selectHallway60Epic = document.getElementById('selectHallway60Epic');
        var selectLabyrinthOtherBase = document.getElementById('selectLabyrinthOtherBase');
        var inputLabyrinthDEC = document.getElementById('inputLabyrinthDEC');
        var selectLabyrinthDisarmCompass = document.getElementById('selectLabyrinthDisarmCompass');
        var selectLabyrinthWeaponType = document.getElementById('selectLabyrinthWeaponType');
        var storageValue = window.sessionStorage.getItem('Labyrinth');
        if (isNullOrUndefined(storageValue)) {
            var objDefaultLaby = {
                districtFocus: 'None',
                between0and14: ['LP'],
                between15and59: ['SP', 'LS'],
                between60and100: ['SP', 'SS', 'LE'],
                chooseOtherDoors: false,
                typeOtherDoors: "SHORTEST_ONLY",
                securityDisarm: false,
                lastHunt: 0,
                armOtherBase: 'false',
                disarmCompass: true,
                nDeadEndClue: 0,
                weaponFarming: 'Forgotten'
            };
            storageValue = JSON.stringify(objDefaultLaby);
        }

        storageValue = JSON.parse(storageValue);
        storageValue.districtFocus = selectLabyrinthDistrict.value;
        storageValue.between0and14 = [selectHallway15Plain.value];
        storageValue.between15and59 = [selectHallway1560Plain.value, selectHallway1560Superior.value];
        storageValue.between60and100 = [selectHallway60Plain.value, selectHallway60Superior.value, selectHallway60Epic.value];
        storageValue.chooseOtherDoors = (document.getElementById('chooseOtherDoors').value == 'true');
        storageValue.typeOtherDoors = document.getElementById('typeOtherDoors').value;
        storageValue.securityDisarm = (document.getElementById('selectLabyrinthDisarm').value == 'true');
        storageValue.lastHunt = parseInt(document.getElementById('inputLabyrinthLastHunt').value);
        storageValue.armOtherBase = selectLabyrinthOtherBase.value;
        storageValue.disarmCompass = (selectLabyrinthDisarmCompass.value == 'true');
        storageValue.nDeadEndClue = parseInt(inputLabyrinthDEC.value);
        storageValue.weaponFarming = selectLabyrinthWeaponType.value;
        window.sessionStorage.setItem('Labyrinth', JSON.stringify(storageValue));
    }

    function initControlsLaby() {
        var selectLabyrinthDistrict = document.getElementById('selectLabyrinthDistrict');
        var inputLabyrinthLastHunt = document.getElementById('inputLabyrinthLastHunt');
        var selectLabyrinthDisarm = document.getElementById('selectLabyrinthDisarm');
        var selectHallway15Plain = document.getElementById('selectHallway15Plain');
        var selectHallway1560Plain = document.getElementById('selectHallway1560Plain');
        var selectHallway1560Superior = document.getElementById('selectHallway1560Superior');
        var selectHallway60Plain = document.getElementById('selectHallway60Plain');
        var selectHallway60Superior = document.getElementById('selectHallway60Superior');
        var selectHallway60Epic = document.getElementById('selectHallway60Epic');
        var selectChooseOtherDoors = document.getElementById('chooseOtherDoors');
        var typeOtherDoors = document.getElementById('typeOtherDoors');
        var selectLabyrinthOtherBase = document.getElementById('selectLabyrinthOtherBase');
        var selectLabyrinthDisarmCompass = document.getElementById('selectLabyrinthDisarmCompass');
        var inputLabyrinthDEC = document.getElementById('inputLabyrinthDEC');
        var selectLabyrinthWeaponType = document.getElementById('selectLabyrinthWeaponType');
        var storageValue = window.sessionStorage.getItem('Labyrinth');
        if (isNullOrUndefined(storageValue)) {
            selectLabyrinthDistrict.selectedIndex = -1;
            inputLabyrinthLastHunt.value = 2;
            selectLabyrinthDisarm.selectedIndex = -1;
            selectHallway15Plain.selectedIndex = -1;
            selectHallway1560Plain.selectedIndex = -1;
            selectHallway1560Superior.selectedIndex = -1;
            selectHallway60Plain.selectedIndex = -1;
            selectHallway60Superior.selectedIndex = -1;
            selectHallway60Epic.selectedIndex = -1;
            selectChooseOtherDoors.selectedIndex = -1;
            typeOtherDoors.selectedIndex = -1;
            selectLabyrinthOtherBase.selectedIndex = -1;
            selectLabyrinthDisarmCompass.selectedIndex = -1;
            inputLabyrinthDEC.value = 0;
            selectLabyrinthWeaponType.selectedIndex = 0;
        }
        else {
            storageValue = JSON.parse(storageValue);
            selectLabyrinthDistrict.value = storageValue.districtFocus;
            inputLabyrinthLastHunt.value = storageValue.lastHunt;
            selectLabyrinthDisarm.value = (storageValue.securityDisarm) ? 'true' : 'false';
            selectHallway15Plain.value = storageValue.between0and14[0];
            selectHallway1560Plain.value = storageValue.between15and59[0];
            selectHallway1560Superior.value = storageValue.between15and59[1];
            selectHallway60Plain.value = storageValue.between60and100[0];
            selectHallway60Superior.value = storageValue.between60and100[1];
            selectHallway60Epic.value = storageValue.between60and100[2];
            selectChooseOtherDoors.value = (storageValue.chooseOtherDoors) ? 'true' : 'false';
            typeOtherDoors.value = storageValue.typeOtherDoors;
            selectLabyrinthOtherBase.value = storageValue.armOtherBase;
            selectLabyrinthDisarmCompass.value = (storageValue.disarmCompass) ? 'true' : 'false';
            inputLabyrinthDEC.value = storageValue.nDeadEndClue;
            selectLabyrinthWeaponType.value = storageValue.weaponFarming;
        }
        inputLabyrinthLastHunt.disabled = (storageValue.securityDisarm) ? '' : 'disabled';
        document.getElementById('trPriorities15').style.display = (selectLabyrinthDistrict.value == 'None') ? 'none' : 'table-row';
        document.getElementById('trPriorities1560').style.display = (selectLabyrinthDistrict.value == 'None') ? 'none' : 'table-row';
        document.getElementById('trPriorities60').style.display = (selectLabyrinthDistrict.value == 'None') ? 'none' : 'table-row';
        document.getElementById('trLabyrinthOtherHallway').style.display = (selectLabyrinthDistrict.value == 'None') ? 'none' : 'table-row';
        inputLabyrinthDEC.disabled = (storageValue.disarmCompass) ? '' : 'disabled';
        selectHallway60Epic.style = (selectLabyrinthDistrict.value == 'TREASURY' || selectLabyrinthDistrict.value == 'FARMING') ? 'display:none' : 'display:inline';
        document.getElementById('typeOtherDoors').disabled = (storageValue.chooseOtherDoors) ? '' : 'disabled';
    }

    function saveLG() {
        var selectLGTGAutoFillSide = document.getElementById('selectLGTGAutoFillSide');
        var selectLGTGAutoFillState = document.getElementById('selectLGTGAutoFillState');
        var selectLGTGAutoPourSide = document.getElementById('selectLGTGAutoPourSide');
        var selectLGTGAutoPourState = document.getElementById('selectLGTGAutoPourState');
        var selectLGTGSide = document.getElementById('selectLGTGSide');
        var selectLGTGBase = document.getElementById('selectLGTGBase');
        var selectLGTGTrinket = document.getElementById('selectLGTGTrinket');
        var selectLGTGBait = document.getElementById('selectLGTGBait');
        var selectLCCCSide = document.getElementById('selectLCCCSide');
        var selectLCCCBase = document.getElementById('selectLCCCBase');
        var selectLCCCTrinket = document.getElementById('selectLCCCTrinket');
        var selectSaltedStatus = document.getElementById('selectSaltedStatus');
        var selectSCBase = document.getElementById('selectSCBase');
        var inputKGSalt = document.getElementById('inputKGSalt');
        var storageValue = window.sessionStorage.getItem('LGArea');
        if (isNullOrUndefined(storageValue)) {
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
            var objAllLG = {
                LG: JSON.parse(JSON.stringify(objLGTemplate)),
                TG: JSON.parse(JSON.stringify(objLGTemplate)),
                LC: JSON.parse(JSON.stringify(objLGTemplate)),
                CC: JSON.parse(JSON.stringify(objLGTemplate)),
                SD: JSON.parse(JSON.stringify(objLGTemplate)),
                SC: JSON.parse(JSON.stringify(objLGTemplate)),
            };
            storageValue = JSON.stringify(objAllLG);
        }
        storageValue = JSON.parse(storageValue);
        storageValue[selectLGTGAutoFillSide.value].isAutoFill = (selectLGTGAutoFillState.value == 'true');
        storageValue[selectLGTGAutoPourSide.value].isAutoPour = (selectLGTGAutoPourState.value == 'true');
        storageValue[selectLGTGSide.value].base.after = selectLGTGBase.value;
        storageValue[selectLGTGSide.value].base.after = selectLGTGBase.value;
        storageValue[selectLGTGSide.value].trinket.after = selectLGTGTrinket.value;
        storageValue[selectLGTGSide.value].bait.after = selectLGTGBait.value;
        storageValue[selectLCCCSide.value].base.after = selectLCCCBase.value;
        storageValue[selectLCCCSide.value].trinket.after = selectLCCCTrinket.value;
        storageValue.SC.base[selectSaltedStatus.value] = selectSCBase.value;
        storageValue.SC.maxSaltCharged = inputKGSalt.value;
        window.sessionStorage.setItem('LGArea', JSON.stringify(storageValue));
    }

    function initControlsLG(bAutoChangeLocation) {
        if (isNullOrUndefined(bAutoChangeLocation))
            bAutoChangeLocation = false;
        var selectLGTGAutoFillSide = document.getElementById('selectLGTGAutoFillSide');
        var selectLGTGAutoFillState = document.getElementById('selectLGTGAutoFillState');
        var selectLGTGAutoPourSide = document.getElementById('selectLGTGAutoPourSide');
        var selectLGTGAutoPourState = document.getElementById('selectLGTGAutoPourState');
        var selectLGTGSide = document.getElementById('selectLGTGSide');
        var selectLGTGBase = document.getElementById('selectLGTGBase');
        var selectLGTGTrinket = document.getElementById('selectLGTGTrinket');
        var selectLGTGBait = document.getElementById('selectLGTGBait');
        var selectLCCCSide = document.getElementById('selectLCCCSide');
        var selectLCCCBase = document.getElementById('selectLCCCBase');
        var selectLCCCTrinket = document.getElementById('selectLCCCTrinket');
        var selectSaltedStatus = document.getElementById('selectSaltedStatus');
        var selectSCBase = document.getElementById('selectSCBase');
        var inputKGSalt = document.getElementById('inputKGSalt');
        var storageValue = window.sessionStorage.getItem('LGArea');
        if (isNullOrUndefined(storageValue)) {
            selectLGTGAutoFillState.selectedIndex = -1;
            selectLGTGAutoPourState.selectedIndex = -1;
            selectLGTGBase.selectedIndex = -1;
            selectLGTGTrinket.selectedIndex = -1;
            selectLGTGBait.selectedIndex = -1;
            selectLCCCBase.selectedIndex = -1;
            selectLCCCTrinket.selectedIndex = -1;
            selectSCBase.selectedIndex = -1;
            inputKGSalt.value = 25;
        }
        else {
            storageValue = JSON.parse(storageValue);
            if (bAutoChangeLocation && !isNullOrUndefined(user)) {
                if (user.location.indexOf('Living Garden') > -1) {
                    selectLGTGAutoFillSide.value = 'LG';
                    selectLGTGAutoPourSide.value = 'LG';
                    selectLGTGSide.value = 'LG';
                }
                else if (user.location.indexOf('Twisted Garden') > -1) {
                    selectLGTGAutoFillSide.value = 'TG';
                    selectLGTGAutoPourSide.value = 'TG';
                    selectLGTGSide.value = 'TG';
                }
                else if (user.location.indexOf('Lost City') > -1) {
                    selectLCCCSide.value = 'LC';
                }
                else if (user.location.indexOf('Cursed City') > -1) {
                    selectLCCCSide.value = 'CC';
                }
            }
            selectLGTGAutoFillState.value = storageValue[selectLGTGAutoFillSide.value].isAutoFill;
            selectLGTGAutoPourState.value = storageValue[selectLGTGAutoPourSide.value].isAutoPour;
            selectLGTGBase.value = storageValue[selectLGTGSide.value].base.after;
            selectLGTGTrinket.value = storageValue[selectLGTGSide.value].trinket.after;
            selectLGTGBait.value = storageValue[selectLGTGSide.value].bait.after;
            selectLCCCBase.value = storageValue[selectLCCCSide.value].base.after;
            selectLCCCTrinket.value = storageValue[selectLCCCSide.value].trinket.after;
            selectSCBase.value = storageValue.SC.base[selectSaltedStatus.value];
            inputKGSalt.value = storageValue.SC.maxSaltCharged;
        }
    }

    function initControlsFW(bAutoChangeWave) {
        if (isNullOrUndefined(bAutoChangeWave))
            bAutoChangeWave = false;
        var selectFWWave = document.getElementById('selectFWWave');
        var selectFWTrapSetupWeapon = document.getElementById('selectFWTrapSetupWeapon');
        var selectFWTrapSetupBase = document.getElementById('selectFWTrapSetupBase');
        var selectFWStreak = document.getElementById('selectFWStreak');
        var selectFWFocusType = document.getElementById('selectFWFocusType');
        var selectFWPriorities = document.getElementById('selectFWPriorities');
        var selectFWCheese = document.getElementById('selectFWCheese');
        var selectFWCharmType = document.getElementById('selectFWCharmType');
        var selectFWSpecial = document.getElementById('selectFWSpecial');
        var selectFWLastTypeConfig = document.getElementById('selectFWLastTypeConfig');
        var selectFWLastTypeConfigIncludeArtillery = document.getElementById('selectFWLastTypeConfigIncludeArtillery');
        var selectFWSupportConfig = document.getElementById('selectFWSupportConfig');
        var selectFW4WardenStatus = document.getElementById('selectFW4WardenStatus');
        var selectFW4TrapSetupWeapon = document.getElementById('selectFW4TrapSetupWeapon');
        var selectFW4TrapSetupBase = document.getElementById('selectFW4TrapSetupBase');
        var selectFW4TrapSetupTrinket = document.getElementById('selectFW4TrapSetupTrinket');
        var selectFW4TrapSetupBait = document.getElementById('selectFW4TrapSetupBait');
        var storageValue = window.sessionStorage.getItem('FW');
        if (isNullOrUndefined(storageValue)) {
            selectFWTrapSetupWeapon.selectedIndex = -1;
            selectFWTrapSetupBase.selectedIndex = -1;
            selectFW4TrapSetupWeapon.selectedIndex = -1;
            selectFW4TrapSetupBase.selectedIndex = -1;
            selectFW4TrapSetupTrinket.selectedIndex = -1;
            selectFW4TrapSetupBait.selectedIndex = -1;
            selectFWFocusType.selectedIndex = -1;
            selectFWPriorities.selectedIndex = -1;
            selectFWCheese.selectedIndex = -1;
            selectFWCharmType.selectedIndex = -1;
            selectFWSpecial.selectedIndex = -1;
            selectFWLastTypeConfig.selectedIndex = -1;
            selectFWLastTypeConfigIncludeArtillery.selectedIndex = 0;
            selectFWSupportConfig.selectedIndex = 0;
        }
        else {
            storageValue = JSON.parse(storageValue);
            if (bAutoChangeWave && !isNullOrUndefined(user) && user.location.indexOf('Fiery Warpath') > -1) {
                if (user.viewing_atts.desert_warpath.wave < 1)
                    selectFWWave.value = 1;
                else if (user.viewing_atts.desert_warpath.wave > 4)
                    selectFWWave.value = 4;
                else
                    selectFWWave.value = user.viewing_atts.desert_warpath.wave;

                var nStreak = parseInt(user.viewing_atts.desert_warpath.streak_quantity);
                if (Number.isInteger(nStreak)) {
                    if (nStreak !== 0)
                        selectFWStreak.value = nStreak + 1;
                }
            }
            var strWave = 'wave' + selectFWWave.value;
            if (isNullOrUndefined(storageValue[strWave].weapon))
                storageValue[strWave].weapon = 'Sandtail Sentinel';
            if (isNullOrUndefined(storageValue[strWave].base))
                storageValue[strWave].base = 'Physical Brace Base';
            if (selectFWWave.value == 4) {
                selectFW4TrapSetupWeapon.value = storageValue[strWave].warden[selectFW4WardenStatus.value].weapon;
                selectFW4TrapSetupBase.value = storageValue[strWave].warden[selectFW4WardenStatus.value].base;
                selectFW4TrapSetupTrinket.value = storageValue[strWave].warden[selectFW4WardenStatus.value].trinket;
                selectFW4TrapSetupBait.value = storageValue[strWave].warden[selectFW4WardenStatus.value].bait;
            }
            else {
                selectFWTrapSetupWeapon.value = storageValue[strWave].weapon;
                selectFWTrapSetupBase.value = storageValue[strWave].base;
            }
            selectFWFocusType.value = storageValue[strWave].focusType;
            selectFWPriorities.value = storageValue[strWave].priorities;
            selectFWCheese.value = storageValue[strWave].cheese[selectFWStreak.selectedIndex];
            selectFWCharmType.value = storageValue[strWave].charmType[selectFWStreak.selectedIndex];
            selectFWSpecial.value = storageValue[strWave].special[selectFWStreak.selectedIndex];
            selectFWLastTypeConfig.value = storageValue[strWave].lastSoldierConfig;
            selectFWLastTypeConfigIncludeArtillery.value = (storageValue[strWave].includeArtillery) ? 'true' : 'false';
            selectFWSupportConfig.value = (storageValue[strWave].disarmAfterSupportRetreat) ? 'true' : 'false';
        }
        for (var i = 0; i < selectFWSpecial.options.length; i++) {
            if (selectFWSpecial.options[i].value == 'GARGANTUA_GGC') {
                if (selectFWStreak.selectedIndex >= 7)
                    selectFWSpecial.options[i].removeAttribute('disabled');
                else
                    selectFWSpecial.options[i].setAttribute('disabled', 'disabled');
                break;
            }
        }
        var nWave = parseInt(selectFWWave.value);
        var option = selectFWFocusType.children;
        for (var i = 0; i < option.length; i++) {
            if (option[i].innerText.indexOf('Special') > -1)
                option[i].style = (nWave == 1) ? 'display:none' : '';
        }
        if (selectFWWave.value == 4) {
            document.getElementById('trFWStreak').style.display = 'none';
            document.getElementById('trFWFocusType').style.display = 'none';
            document.getElementById('trFWLastType').style.display = 'none';
            document.getElementById('trFWSupportConfig').style.display = 'none';
            document.getElementById('trFWTrapSetup').style.display = 'none';
            document.getElementById('trFW4TrapSetup').style.display = 'table-row';
        }
        else {
            document.getElementById('trFWStreak').style.display = 'table-row';
            document.getElementById('trFWFocusType').style.display = 'table-row';
            document.getElementById('trFWLastType').style.display = 'table-row';
            document.getElementById('trFWSupportConfig').style.display = 'table-row';
            document.getElementById('trFWTrapSetup').style.display = 'table-row';
            document.getElementById('trFW4TrapSetup').style.display = 'none';
            if (selectFWWave.value == 3)
                selectFWLastTypeConfigIncludeArtillery.disabled = '';
            else
                selectFWLastTypeConfigIncludeArtillery.disabled = 'disabled';
        }
    }

    function saveFW() {
        var selectFWWave = document.getElementById('selectFWWave');
        var selectFWTrapSetupWeapon = document.getElementById('selectFWTrapSetupWeapon');
        var selectFWTrapSetupBase = document.getElementById('selectFWTrapSetupBase');
        var nWave = selectFWWave.value;
        var selectFWStreak = document.getElementById('selectFWStreak');
        var nStreak = parseInt(selectFWStreak.value);
        var nStreakLength = selectFWStreak.children.length;
        var selectFWFocusType = document.getElementById('selectFWFocusType');
        var selectFWPriorities = document.getElementById('selectFWPriorities');
        var selectFWCheese = document.getElementById('selectFWCheese');
        var selectFWCharmType = document.getElementById('selectFWCharmType');
        var selectFWSpecial = document.getElementById('selectFWSpecial');
        var selectFWLastTypeConfig = document.getElementById('selectFWLastTypeConfig');
        var selectFWLastTypeConfigIncludeArtillery = document.getElementById('selectFWLastTypeConfigIncludeArtillery');
        var selectFWSupportConfig = document.getElementById('selectFWSupportConfig');
        var selectFW4WardenStatus = document.getElementById('selectFW4WardenStatus');
        var selectFW4TrapSetupWeapon = document.getElementById('selectFW4TrapSetupWeapon');
        var selectFW4TrapSetupBase = document.getElementById('selectFW4TrapSetupBase');
        var selectFW4TrapSetupTrinket = document.getElementById('selectFW4TrapSetupTrinket');
        var selectFW4TrapSetupBait = document.getElementById('selectFW4TrapSetupBait');
        var storageValue = window.sessionStorage.getItem('FW');
        if (isNullOrUndefined(storageValue)) {
            var obj = {
                weapon: new Array(4),
                base: new Array(4),
                focusType: 'NORMAL',
                priorities: 'HIGHEST',
                cheese: new Array(nStreakLength),
                charmType: new Array(nStreakLength),
                special: new Array(nStreakLength),
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
            var objAll = {
                wave1: JSON.parse(JSON.stringify(obj)),
                wave2: JSON.parse(JSON.stringify(obj)),
                wave3: JSON.parse(JSON.stringify(obj)),
                wave4: JSON.parse(JSON.stringify(obj)),
            };
            storageValue = JSON.stringify(objAll);
        }
        storageValue = JSON.parse(storageValue);
        var strWave = 'wave' + selectFWWave.value;
        if (isNullOrUndefined(storageValue[strWave].weapon))
            storageValue[strWave].weapon = 'Sandtail Sentinel';
        if (isNullOrUndefined(storageValue[strWave].base))
            storageValue[strWave].base = 'Physical Brace Base';
        if (nWave == 4) {
            storageValue[strWave].warden[selectFW4WardenStatus.value].weapon = selectFW4TrapSetupWeapon.value;
            storageValue[strWave].warden[selectFW4WardenStatus.value].base = selectFW4TrapSetupBase.value;
            storageValue[strWave].warden[selectFW4WardenStatus.value].trinket = selectFW4TrapSetupTrinket.value;
            storageValue[strWave].warden[selectFW4WardenStatus.value].bait = selectFW4TrapSetupBait.value;
        }
        else {
            storageValue[strWave].weapon = selectFWTrapSetupWeapon.value;
            storageValue[strWave].base = selectFWTrapSetupBase.value;
        }
        storageValue[strWave].focusType = selectFWFocusType.value;
        storageValue[strWave].priorities = selectFWPriorities.value;
        storageValue[strWave].cheese[nStreak] = selectFWCheese.value;
        storageValue[strWave].charmType[nStreak] = selectFWCharmType.value;
        storageValue[strWave].special[nStreak] = selectFWSpecial.value;
        storageValue[strWave].lastSoldierConfig = selectFWLastTypeConfig.value;
        storageValue[strWave].includeArtillery = (selectFWLastTypeConfigIncludeArtillery.value == 'true');
        storageValue[strWave].disarmAfterSupportRetreat = (selectFWSupportConfig.value == 'true');
        window.sessionStorage.setItem('FW', JSON.stringify(storageValue));
    }

    function onSelectBRHuntMistTierChanged() {
        var hunt = document.getElementById('selectBRHuntMistTier').value;
        var storageValue = window.sessionStorage.getItem('BRCustom');
        if (isNullOrUndefined(storageValue)) {
            var objBR = {
                hunt: '',
                toggle: 1,
                name: ['Red', 'Green', 'Yellow', 'None'],
                weapon: new Array(4),
                base: new Array(4),
                trinket: new Array(4),
                bait: new Array(4)
            };
            storageValue = JSON.stringify(objBR);
        }
        storageValue = JSON.parse(storageValue);
        storageValue.hunt = hunt;
        window.sessionStorage.setItem('BRCustom', JSON.stringify(storageValue));
        initControlsBR();
    }

    function onInputToggleCanisterChanged(input) {
        input.value = limitMinMax(input.value, input.min, input.max);
        saveBR();
    }

    function initControlsBR() {
        var hunt = document.getElementById('selectBRHuntMistTier');
        var toggle = document.getElementById('inputToggleCanister');
        var weapon = document.getElementById('selectBRTrapWeapon');
        var base = document.getElementById('selectBRTrapBase');
        var trinket = document.getElementById('selectBRTrapTrinket');
        var bait = document.getElementById('selectBRTrapBait');
        var storageValue = window.sessionStorage.getItem('BRCustom');
        if (isNullOrUndefined(storageValue)) {
            toggle.value = 1;
            hunt.selectedIndex = 0;
            weapon.selectedIndex = -1;
            base.selectedIndex = -1;
            trinket.selectedIndex = -1;
            bait.selectedIndex = -1;
        }
        else {
            storageValue = JSON.parse(storageValue);
            hunt.value = storageValue.hunt;
            toggle.value = storageValue.toggle;
            var nIndex = storageValue.name.indexOf(hunt.value);
            weapon.value = storageValue.weapon[nIndex];
            base.value = storageValue.base[nIndex];
            trinket.value = storageValue.trinket[nIndex];
            bait.value = storageValue.bait[nIndex];
        }
        document.getElementById('trBRToggle').style.display = (hunt.value == 'Red') ? 'table-row' : 'none';
    }

    function saveBR() {
        var hunt = document.getElementById('selectBRHuntMistTier').value;
        var nToggle = parseInt(document.getElementById('inputToggleCanister').value);
        var weapon = document.getElementById('selectBRTrapWeapon').value;
        var base = document.getElementById('selectBRTrapBase').value;
        var trinket = document.getElementById('selectBRTrapTrinket').value;
        var bait = document.getElementById('selectBRTrapBait').value;
        var storageValue = window.sessionStorage.getItem('BRCustom');
        if (isNullOrUndefined(storageValue)) {
            var objBR = {
                hunt: '',
                toggle: 1,
                name: ['Red', 'Green', 'Yellow', 'None'],
                weapon: new Array(4),
                base: new Array(4),
                trinket: new Array(4),
                bait: new Array(4)
            };
            storageValue = JSON.stringify(objBR);
        }
        storageValue = JSON.parse(storageValue);
        var nIndex = storageValue.name.indexOf(hunt);
        if (nIndex < 0)
            nIndex = 0;
        storageValue.hunt = hunt;
        storageValue.toggle = nToggle;
        storageValue.weapon[nIndex] = weapon;
        storageValue.base[nIndex] = base;
        storageValue.trinket[nIndex] = trinket;
        storageValue.bait[nIndex] = bait;
        window.sessionStorage.setItem('BRCustom', JSON.stringify(storageValue));
    }

    function saveSG() {
        var selectSGSeason = document.getElementById('selectSGSeason');
        var selectSGTrapWeapon = document.getElementById('selectSGTrapWeapon');
        var selectSGTrapBase = document.getElementById('selectSGTrapBase');
        var selectSGTrapTrinket = document.getElementById('selectSGTrapTrinket');
        var selectSGTrapBait = document.getElementById('selectSGTrapBait');
        var selectSGDisarmBait = document.getElementById('selectSGDisarmBait');
        var storageValue = window.sessionStorage.getItem('SGarden');
        if (isNullOrUndefined(storageValue)) {
            var objSG = {
                weapon: new Array(4).fill(''),
                base: new Array(4).fill(''),
                trinket: new Array(4).fill(''),
                bait: new Array(4).fill(''),
                disarmBaitAfterCharged: false
            };
            storageValue = JSON.stringify(objSG);
        }
        storageValue = JSON.parse(storageValue);
        var nIndex = (selectSGSeason.selectedIndex < 0) ? 0 : selectSGSeason.selectedIndex;
        storageValue.weapon[nIndex] = selectSGTrapWeapon.value;
        storageValue.base[nIndex] = selectSGTrapBase.value;
        storageValue.trinket[nIndex] = selectSGTrapTrinket.value;
        storageValue.bait[nIndex] = selectSGTrapBait.value;
        storageValue.disarmBaitAfterCharged = (selectSGDisarmBait.value == 'true');
        window.sessionStorage.setItem('SGarden', JSON.stringify(storageValue));
    }

    function initControlsSG(bAutoChangeSeason) {
        if (isNullOrUndefined(bAutoChangeSeason))
            bAutoChangeSeason = false;
        var selectSGSeason = document.getElementById('selectSGSeason');
        var selectSGTrapWeapon = document.getElementById('selectSGTrapWeapon');
        var selectSGTrapBase = document.getElementById('selectSGTrapBase');
        var selectSGTrapTrinket = document.getElementById('selectSGTrapTrinket');
        var selectSGTrapBait = document.getElementById('selectSGTrapBait');
        var selectSGDisarmBait = document.getElementById('selectSGDisarmBait');
        var storageValue = window.sessionStorage.getItem('SGarden');
        if (isNullOrUndefined(storageValue)) {
            selectSGTrapWeapon.selectedIndex = -1;
            selectSGTrapBase.selectedIndex = -1;
            selectSGTrapTrinket.selectedIndex = -1;
            selectSGTrapBait.selectedIndex = -1;
            selectSGDisarmBait.selectedIndex = -1;
        }
        else {
            storageValue = JSON.parse(storageValue);
            if (bAutoChangeSeason && !isNullOrUndefined(user) && user.location.indexOf('Seasonal Garden') > -1) {
                var arrSeason = ['Spring', 'Summer', 'Fall', 'Winter'];
                var nTimeStamp = Date.parse(new Date()) / 1000;
                var nFirstSeasonTimeStamp = 1283328000;
                var nSeasonLength = 288000; // 80hr
                var nSeason = Math.floor((nTimeStamp - nFirstSeasonTimeStamp) / nSeasonLength) % arrSeason.length;
                selectSGSeason.value = arrSeason[nSeason].toUpperCase();
            }
            var nIndex = (selectSGSeason.selectedIndex < 0) ? 0 : selectSGSeason.selectedIndex;
            selectSGTrapWeapon.value = storageValue.weapon[nIndex];
            selectSGTrapBase.value = storageValue.base[nIndex];
            selectSGTrapTrinket.value = storageValue.trinket[nIndex];
            selectSGTrapBait.value = storageValue.bait[nIndex];
            selectSGDisarmBait.value = (storageValue.disarmBaitAfterCharged) ? 'true' : 'false';
        }
    }

    function initControlsZT(bAutoChangeMouseOrder) {
        if (isNullOrUndefined(bAutoChangeMouseOrder))
            bAutoChangeMouseOrder = false;
        var selectZTFocus = document.getElementById('selectZTFocus');
        var arrSelectZTMouseOrder = [document.getElementById('selectZTMouseOrder1st'), document.getElementById('selectZTMouseOrder2nd')];
        var arrSelectZTWeapon = [document.getElementById('selectZTWeapon1st'), document.getElementById('selectZTWeapon2nd')];
        var arrSelectZTBase = [document.getElementById('selectZTBase1st'), document.getElementById('selectZTBase2nd')];
        var arrSelectZTTrinket = [document.getElementById('selectZTTrinket1st'), document.getElementById('selectZTTrinket2nd')];
        var arrSelectZTBait = [document.getElementById('selectZTBait1st'), document.getElementById('selectZTBait2nd')];
        var storageValue = window.sessionStorage.getItem('ZTower');
        var i;
        if (isNullOrUndefined(storageValue)) {
            for (i = 0; i < 2; i++) {
                arrSelectZTMouseOrder[i].selectedIndex = 0;
                arrSelectZTWeapon[i].selectedIndex = -1;
                arrSelectZTBase[i].selectedIndex = -1;
                arrSelectZTTrinket[i].selectedIndex = -1;
                arrSelectZTBait[i].selectedIndex = -1;
            }
        }
        else {
            storageValue = JSON.parse(storageValue);
            selectZTFocus.value = storageValue.focus.toUpperCase();
            if (bAutoChangeMouseOrder && !isNullOrUndefined(user) && user.location.indexOf('Zugzwang\'s Tower') > -1) {
                var nProgressMystic = parseInt(user.viewing_atts.zzt_mage_progress);
                var nProgressTechnic = parseInt(user.viewing_atts.zzt_tech_progress);
                if (Number.isNaN(nProgressMystic) || Number.isNaN(nProgressTechnic)) {
                    for (i = 0; i < 2; i++) {
                        arrSelectZTMouseOrder[i].selectedIndex = 0;
                    }
                }
                else {
                    var arrProgress = [];
                    if (selectZTFocus.value.indexOf('MYSTIC') === 0)
                        arrProgress = [nProgressMystic, nProgressTechnic];
                    else
                        arrProgress = [nProgressTechnic, nProgressMystic];
                    for (i = 0; i < 2; i++) {
                        if (arrProgress[i] <= 7)
                            arrSelectZTMouseOrder[i].value = 'PAWN';
                        else if (arrProgress[i] <= 9)
                            arrSelectZTMouseOrder[i].value = 'KNIGHT';
                        else if (arrProgress[i] <= 11)
                            arrSelectZTMouseOrder[i].value = 'BISHOP';
                        else if (arrProgress[i] <= 13)
                            arrSelectZTMouseOrder[i].value = 'ROOK';
                        else if (arrProgress[i] <= 14)
                            arrSelectZTMouseOrder[i].value = 'QUEEN';
                        else if (arrProgress[i] <= 15)
                            arrSelectZTMouseOrder[i].value = 'KING';
                        else if (arrProgress[i] <= 16)
                            arrSelectZTMouseOrder[i].value = 'CHESSMASTER';
                    }
                }
            }
            for (i = 0; i < 2; i++) {
                if (arrSelectZTMouseOrder[i].selectedIndex < 0)
                    arrSelectZTMouseOrder[i].selectedIndex = 0;
            }
            var nIndex = -1;
            for (i = 0; i < 2; i++) {
                nIndex = storageValue.order.indexOf(arrSelectZTMouseOrder[i].value);
                if (nIndex < 0)
                    nIndex = 0;
                nIndex += i * 7;
                arrSelectZTWeapon[i].value = storageValue.weapon[nIndex];
                arrSelectZTBase[i].value = storageValue.base[nIndex];
                arrSelectZTTrinket[i].value = storageValue.trinket[nIndex];
                arrSelectZTBait[i].value = storageValue.bait[nIndex];
            }
        }
    }

    function saveZT() {
        var selectZTFocus = document.getElementById('selectZTFocus');
        var arrSelectZTMouseOrder = [document.getElementById('selectZTMouseOrder1st'), document.getElementById('selectZTMouseOrder2nd')];
        var arrSelectZTWeapon = [document.getElementById('selectZTWeapon1st'), document.getElementById('selectZTWeapon2nd')];
        var arrSelectZTBase = [document.getElementById('selectZTBase1st'), document.getElementById('selectZTBase2nd')];
        var arrSelectZTTrinket = [document.getElementById('selectZTTrinket1st'), document.getElementById('selectZTTrinket2nd')];
        var arrSelectZTBait = [document.getElementById('selectZTBait1st'), document.getElementById('selectZTBait2nd')];
        var storageValue = window.sessionStorage.getItem('ZTower');
        if (isNullOrUndefined(storageValue)) {
            var objZT = {
                focus: 'MYSTIC',
                order: ['PAWN', 'KNIGHT', 'BISHOP', 'ROOK', 'QUEEN', 'KING', 'CHESSMASTER'],
                weapon: new Array(14).fill(''),
                base: new Array(14).fill(''),
                trinket: new Array(14).fill('None'),
                bait: new Array(14).fill('Gouda'),
            };
            storageValue = JSON.stringify(objZT);
        }
        storageValue = JSON.parse(storageValue);
        var nIndex = -1;
        for (var i = 0; i < 2; i++) {
            nIndex = storageValue.order.indexOf(arrSelectZTMouseOrder[i].value);
            if (nIndex < 0)
                nIndex = 0;
            nIndex += i * 7;
            storageValue.focus = selectZTFocus.value;
            storageValue.weapon[nIndex] = arrSelectZTWeapon[i].value;
            storageValue.base[nIndex] = arrSelectZTBase[i].value;
            storageValue.trinket[nIndex] = arrSelectZTTrinket[i].value;
            storageValue.bait[nIndex] = arrSelectZTBait[i].value;
        }
        window.sessionStorage.setItem('ZTower', JSON.stringify(storageValue));
    }

    function saveZokor() {
        var selectZokorBossStatus = document.getElementById('selectZokorBossStatus');
        var selectZokorBait = document.getElementById('selectZokorBait');
        var selectZokorTrinket = document.getElementById('selectZokorTrinket');
        var storageValue = window.sessionStorage.getItem('Zokor');
        if (isNullOrUndefined(storageValue)) {
            var objZokor = {
                bossStatus: ['INCOMING', 'ACTIVE', 'DEFEATED'],
                bait: new Array(3).fill('Gouda'),
                trinket: new Array(3).fill('None')
            };
            storageValue = JSON.stringify(objZokor);
        }
        storageValue = JSON.parse(storageValue);
        var nIndex = storageValue.bossStatus.indexOf(selectZokorBossStatus.value);
        if (nIndex < 0)
            nIndex = 0;
        storageValue.bait[nIndex] = selectZokorBait.value;
        storageValue.trinket[nIndex] = selectZokorTrinket.value;
        window.sessionStorage.setItem('Zokor', JSON.stringify(storageValue));
    }

    function initControlsZokor() {
        var selectZokorBossStatus = document.getElementById('selectZokorBossStatus');
        var selectZokorBait = document.getElementById('selectZokorBait');
        var selectZokorTrinket = document.getElementById('selectZokorTrinket');
        var storageValue = window.sessionStorage.getItem('Zokor');
        if (isNullOrUndefined(storageValue)) {
            selectZokorBait.selectedIndex = -1;
            selectZokorTrinket.selectedIndex = -1;
        }
        else {
            storageValue = JSON.parse(storageValue);
            var nIndex = storageValue.bossStatus.indexOf(selectZokorBossStatus.value);
            if (nIndex < 0)
                nIndex = 0;
            selectZokorBait.value = storageValue.bait[nIndex];
            selectZokorTrinket.value = storageValue.trinket[nIndex];
        }
    }

    function onSelectFRTrapBait() {
        saveFR();
        initControlsFR();
    }

    function saveFR() {
        var selectEnterAtBattery = document.getElementById('selectEnterAtBattery');
        var selectRetreatAtBattery = document.getElementById('selectRetreatAtBattery');
        var nIndex = document.getElementById('selectTrapSetupAtBattery').selectedIndex;
        var weapon = document.getElementById('selectFRTrapWeapon').value;
        var base = document.getElementById('selectFRTrapBase').value;
        var trinket = document.getElementById('selectFRTrapTrinket').value;
        var bait = document.getElementById('selectFRTrapBait').value;
        var selectFRTrapBaitMasterOrder = document.getElementById('selectFRTrapBaitMasterOrder');
        var storageValue = window.sessionStorage.getItem('FRift');
        if (isNullOrUndefined(storageValue)) {
            var objFR = {
                enter: 0,
                retreat: 0,
                weapon: new Array(11).fill(''),
                base: new Array(11).fill(''),
                trinket: new Array(11).fill(''),
                bait: new Array(11).fill(''),
                masterOrder: new Array(11).fill('Glutter=>Combat=>Susheese')
            };
            storageValue = JSON.stringify(objFR);
        }
        storageValue = JSON.parse(storageValue);
        storageValue.enter = parseInt(selectEnterAtBattery.value);
        storageValue.retreat = parseInt(selectRetreatAtBattery.value);
        storageValue.weapon[nIndex] = weapon;
        storageValue.base[nIndex] = base;
        storageValue.trinket[nIndex] = trinket;
        storageValue.bait[nIndex] = bait;
        storageValue.masterOrder[nIndex] = selectFRTrapBaitMasterOrder.value;
        window.sessionStorage.setItem('FRift', JSON.stringify(storageValue));
    }

    function initControlsFR(bAutoChangeBatteryLevel) {
        if (isNullOrUndefined(bAutoChangeBatteryLevel))
            bAutoChangeBatteryLevel = false;
        var selectEnterAtBattery = document.getElementById('selectEnterAtBattery');
        var selectRetreatAtBattery = document.getElementById('selectRetreatAtBattery');
        var selectTrapSetupAtBattery = document.getElementById('selectTrapSetupAtBattery');
        var selectFRTrapWeapon = document.getElementById('selectFRTrapWeapon');
        var selectFRTrapBase = document.getElementById('selectFRTrapBase');
        var selectFRTrapTrinket = document.getElementById('selectFRTrapTrinket');
        var selectFRTrapBait = document.getElementById('selectFRTrapBait');
        var selectFRTrapBaitMasterOrder = document.getElementById('selectFRTrapBaitMasterOrder');
        var storageValue = window.sessionStorage.getItem('FRift');
        if (isNullOrUndefined(storageValue)) {
            selectEnterAtBattery.selectedIndex = -1;
            selectRetreatAtBattery.selectedIndex = -1;
            selectFRTrapWeapon.selectedIndex = -1;
            selectFRTrapBase.selectedIndex = -1;
            selectFRTrapTrinket.selectedIndex = -1;
            selectFRTrapBait.selectedIndex = -1;
            selectFRTrapBaitMasterOrder.selectedIndex = 0;
            selectTrapSetupAtBattery.selectedIndex = 0;
        }
        else {
            storageValue = JSON.parse(storageValue);
            var nIndex = 0;
            if (bAutoChangeBatteryLevel && !isNullOrUndefined(user) && user.location.indexOf('Furoma Rift') > -1 && (user.quests.QuestRiftFuroma.view_state == 'pagoda' || user.quests.QuestRiftFuroma.view_state == 'pagoda knows_all')) {
                var classCharge = document.getElementsByClassName('riftFuromaHUD-droid-charge');
                if (classCharge.length > 0) {
                    var nRemainingEnergy = parseInt(classCharge[0].innerText.replace(/,/g, ''));
                    if (Number.isInteger(nRemainingEnergy)) {
                        var arrCumulative = [20, 65, 140, 260, 460, 770, 1220, 1835, 2625, 3600];
                        for (var i = arrCumulative.length - 1; i >= 0; i--) {
                            if (nRemainingEnergy <= arrCumulative[i])
                                nIndex = i + 1;
                            else
                                break;
                        }
                        selectTrapSetupAtBattery.selectedIndex = nIndex;
                    }
                }
            }
            else {
                nIndex = selectTrapSetupAtBattery.selectedIndex;
            }
            selectEnterAtBattery.value = (Number.isInteger(storageValue.enter)) ? storageValue.enter : 'None';
            selectRetreatAtBattery.value = storageValue.retreat;
            selectFRTrapWeapon.value = storageValue.weapon[nIndex];
            selectFRTrapBase.value = storageValue.base[nIndex];
            selectFRTrapTrinket.value = storageValue.trinket[nIndex];
            selectFRTrapBait.value = storageValue.bait[nIndex];
            selectFRTrapBaitMasterOrder.value = storageValue.masterOrder[nIndex];
        }
        selectFRTrapBaitMasterOrder.style.display = (selectFRTrapBait.value == 'ORDER_MASTER') ? '' : 'none';
    }

    function saveIceberg() {
        var selectIcebergPhase = document.getElementById('selectIcebergPhase');
        var selectIcebergBase = document.getElementById('selectIcebergBase');
        var selectIcebergBait = document.getElementById('selectIcebergBait');
        var selectIcebergTrinket = document.getElementById('selectIcebergTrinket');
        var storageValue = window.sessionStorage.getItem('Iceberg');
        var arrOrder = ['GENERAL', 'TREACHEROUS', 'BRUTAL', 'BOMBING', 'MAD', 'ICEWING', 'HIDDEN', 'DEEP', 'SLUSHY'];
        if (isNullOrUndefined(storageValue)) {
            var objDefaultIceberg = {
                base: new Array(9).fill(''),
                trinket: new Array(9).fill('None'),
                bait: new Array(9).fill('Gouda')
            };
            storageValue = JSON.stringify(objDefaultIceberg);
        }
        storageValue = JSON.parse(storageValue);
        var nIndex = arrOrder.indexOf(selectIcebergPhase.value);
        if (nIndex < 0)
            nIndex = 0;
        storageValue.base[nIndex] = selectIcebergBase.value;
        storageValue.bait[nIndex] = selectIcebergBait.value;
        storageValue.trinket[nIndex] = selectIcebergTrinket.value;
        window.sessionStorage.setItem('Iceberg', JSON.stringify(storageValue));
    }

    function initControlsIceberg(bAutoChangePhase) {
        if (isNullOrUndefined(bAutoChangePhase))
            bAutoChangePhase = false;
        var selectIcebergPhase = document.getElementById('selectIcebergPhase');
        var selectIcebergBase = document.getElementById('selectIcebergBase');
        var selectIcebergBait = document.getElementById('selectIcebergBait');
        var selectIcebergTrinket = document.getElementById('selectIcebergTrinket');
        var storageValue = window.sessionStorage.getItem('Iceberg');
        if (isNullOrUndefined(storageValue)) {
            selectIcebergBase.selectedIndex = -1;
            selectIcebergBait.selectedIndex = -1;
            selectIcebergTrinket.selectedIndex = -1;
        }
        else {
            storageValue = JSON.parse(storageValue);
            var nIndex = -1;
            var arrOrder = ['GENERAL', 'TREACHEROUS', 'BRUTAL', 'BOMBING', 'MAD', 'ICEWING', 'HIDDEN', 'DEEP', 'SLUSHY'];
            if (bAutoChangePhase && !isNullOrUndefined(user)) {
                if (user.location.indexOf('Iceberg') > -1) {
                    var classCurrentPhase = document.getElementsByClassName('currentPhase');
                    var phase = (classCurrentPhase.length > 0) ? classCurrentPhase[0].textContent : user.quests.QuestIceberg.current_phase;
                    var classProgress = document.getElementsByClassName('user_progress');
                    var nProgress = (classProgress.length > 0) ? parseInt(classProgress[0].textContent.replace(',', '')) : parseInt(user.quests.QuestIceberg.user_progress);
                    if (nProgress == 300 || nProgress == 600 || nProgress == 1600 || nProgress == 1800)
                        nIndex = 0;
                    else {
                        phase = phase.toUpperCase();
                        for (var i = 1; i < arrOrder.length; i++) {
                            if (phase.indexOf(arrOrder[i]) > -1) {
                                selectIcebergPhase.value = arrOrder[i];
                                break;
                            }
                        }
                    }
                }
                else if (user.location.indexOf('Slushy Shoreline') > -1)
                    selectIcebergPhase.value = 'SLUSHY';
            }
            nIndex = arrOrder.indexOf(selectIcebergPhase.value);
            selectIcebergBase.value = storageValue.base[nIndex];
            selectIcebergTrinket.value = storageValue.trinket[nIndex];
            selectIcebergBait.value = storageValue.bait[nIndex];
        }
    }

    function saveFGAR() {
        var selectFGARSublocation = document.getElementById('selectFGARSublocation');
        var selectFGARWeapon = document.getElementById('selectFGARWeapon');
        var selectFGARBase = document.getElementById('selectFGARBase');
        var selectFGARTrinket = document.getElementById('selectFGARTrinket');
        var selectFGARBait = document.getElementById('selectFGARBait');
        var storageValue = window.sessionStorage.getItem('FG_AR');
        if (isNullOrUndefined(storageValue))
            storageValue = JSON.stringify(objDefaultFGAR);
        storageValue = JSON.parse(storageValue);
        var nIndex = storageValue.order.indexOf(selectFGARSublocation.value);
        storageValue.weapon[nIndex] = selectFGARWeapon.value;
        storageValue.base[nIndex] = selectFGARBase.value;
        storageValue.trinket[nIndex] = selectFGARTrinket.value;
        storageValue.bait[nIndex] = selectFGARBait.value;
        window.sessionStorage.setItem('FG_AR', JSON.stringify(storageValue));
    }

    function initControlsFGAR(bAutoChangeSublocation) {
        if (isNullOrUndefined(bAutoChangeSublocation))
            bAutoChangeSublocation = false;
        var selectFGARSublocation = document.getElementById('selectFGARSublocation');
        var selectFGARWeapon = document.getElementById('selectFGARWeapon');
        var selectFGARBase = document.getElementById('selectFGARBase');
        var selectFGARTrinket = document.getElementById('selectFGARTrinket');
        var selectFGARBait = document.getElementById('selectFGARBait');
        var storageValue = window.sessionStorage.getItem('FG_AR');
        if (isNullOrUndefined(storageValue))
            storageValue = JSON.stringify(objDefaultFGAR);
        storageValue = JSON.parse(storageValue);
        var nIndex = -1;
        if (bAutoChangeSublocation && !isNullOrUndefined(user))
            selectFGARSublocation.value = (user.location.indexOf('Acolyte Realm') > -1) ? 'AR' : 'FG';
        nIndex = storageValue.order.indexOf(selectFGARSublocation.value);
        selectFGARWeapon.value = storageValue.weapon[nIndex];
        selectFGARBase.value = storageValue.base[nIndex];
        selectFGARTrinket.value = storageValue.trinket[nIndex];
        selectFGARBait.value = storageValue.bait[nIndex];
    }

    function saveBCJOD() {
        var selectBCJODSublocation = document.getElementById('selectBCJODSublocation');
        var selectBCJODWeapon = document.getElementById('selectBCJODWeapon');
        var selectBCJODBase = document.getElementById('selectBCJODBase');
        var selectBCJODTrinket = document.getElementById('selectBCJODTrinket');
        var selectBCJODBait = document.getElementById('selectBCJODBait');
        var storageValue = window.sessionStorage.getItem('BC_JOD');
        if (isNullOrUndefined(storageValue))
            storageValue = JSON.stringify(objDefaultBCJOD);
        storageValue = JSON.parse(storageValue);
        var nIndex = storageValue.order.indexOf(selectBCJODSublocation.value);
        storageValue.weapon[nIndex] = selectBCJODWeapon.value;
        storageValue.base[nIndex] = selectBCJODBase.value;
        storageValue.trinket[nIndex] = selectBCJODTrinket.value;
        storageValue.bait[nIndex] = selectBCJODBait.value;
        window.sessionStorage.setItem('BC_JOD', JSON.stringify(storageValue));
    }

    function initControlsBCJOD(bAutoChangeSublocation) {
        if (isNullOrUndefined(bAutoChangeSublocation))
            bAutoChangeSublocation = false;
        var selectBCJODSublocation = document.getElementById('selectBCJODSublocation');
        var selectBCJODWeapon = document.getElementById('selectBCJODWeapon');
        var selectBCJODBase = document.getElementById('selectBCJODBase');
        var selectBCJODTrinket = document.getElementById('selectBCJODTrinket');
        var selectBCJODBait = document.getElementById('selectBCJODBait');
        var storageValue = window.sessionStorage.getItem('BC_JOD');
        if (isNullOrUndefined(storageValue))
            storageValue = JSON.stringify(objDefaultBCJOD);
        storageValue = JSON.parse(storageValue);
        var nIndex = -1;
        if (bAutoChangeSublocation && !isNullOrUndefined(user))
            selectBCJODSublocation.value = (user.location.indexOf('Balack\'s Cove') > -1) ? 'LOW' : 'JOD';
        nIndex = storageValue.order.indexOf(selectBCJODSublocation.value);
        selectBCJODWeapon.value = storageValue.weapon[nIndex];
        selectBCJODBase.value = storageValue.base[nIndex];
        selectBCJODTrinket.value = storageValue.trinket[nIndex];
        selectBCJODBait.value = storageValue.bait[nIndex];
    }

    function onSelectBWRiftForceActiveQuantum() {
        saveBWRift();
        initControlsBWRift();
    }

    function onSelectBWRiftForceDeactiveQuantum() {
        saveBWRift();
        initControlsBWRift();
    }

    function onInputRemaininigLootAChanged(input) {
        input.value = limitMinMax(input.value, input.min, input.max);
        saveBWRift();
    }

    function onInputRemaininigLootDChanged(input) {
        input.value = limitMinMax(input.value, input.min, input.max);
        saveBWRift();
    }

    function onSelectBWRiftChoosePortal() {
        saveBWRift();
        initControlsBWRift();
    }

    function onInputMinTimeSandChanged(input) {
        input.value = limitMinMax(input.value, input.min, input.max);
        saveBWRift();
    }

    function onSelectBWRiftMinRSCType() {
        saveBWRift();
        initControlsBWRift();
    }

    function onInputMinRSCChanged(input) {
        input.value = limitMinMax(input.value, input.min, input.max);
        saveBWRift();
    }

    function saveBWRift() {
        var selectBWRiftChamber = document.getElementById('selectBWRiftChamber');
        var selectBWRiftWeapon = document.getElementById('selectBWRiftWeapon');
        var selectBWRiftBase = document.getElementById('selectBWRiftBase');
        var selectBWRiftBait = document.getElementById('selectBWRiftBait');
        var selectBWRiftTrinket = document.getElementById('selectBWRiftTrinket');
        var selectBWRiftActivatePocketWatch = document.getElementById('selectBWRiftActivatePocketWatch');
        var selectBWRiftCleaverStatus = document.getElementById('selectBWRiftCleaverStatus');
        var selectBWRiftAlertLvl = document.getElementById('selectBWRiftAlertLvl');
        var selectBWRiftWeaponSpecial = document.getElementById('selectBWRiftWeaponSpecial');
        var selectBWRiftBaseSpecial = document.getElementById('selectBWRiftBaseSpecial');
        var selectBWRiftBaitSpecial = document.getElementById('selectBWRiftBaitSpecial');
        var selectBWRiftTrinketSpecial = document.getElementById('selectBWRiftTrinketSpecial');
        var selectBWRiftActivatePocketWatchSpecial = document.getElementById('selectBWRiftActivatePocketWatchSpecial');
        var selectBWRiftForceActiveQuantum = document.getElementById('selectBWRiftForceActiveQuantum');
        var inputRemainingLootA = document.getElementById('inputRemainingLootA');
        var selectBWRiftForceDeactiveQuantum = document.getElementById('selectBWRiftForceDeactiveQuantum');
        var inputRemainingLootD = document.getElementById('inputRemainingLootD');
        var selectBWRiftChoosePortal = document.getElementById('selectBWRiftChoosePortal');
        var selectBWRiftChoosePortalAfterCC = document.getElementById('selectBWRiftChoosePortalAfterCC');
        var selectBWRiftPriority = document.getElementById('selectBWRiftPriority');
        var selectBWRiftPriorityCursed = document.getElementById('selectBWRiftPriorityCursed');
        var selectBWRiftPortal = document.getElementById('selectBWRiftPortal');
        var selectBWRiftBuffCurse = document.getElementById('selectBWRiftBuffCurse');
        var inputMinTimeSand = document.getElementById('inputMinTimeSand');
        var selectBWRiftMinRSCType = document.getElementById('selectBWRiftMinRSCType');
        var inputMinRSC = document.getElementById('inputMinRSC');
        var selectBWRiftEnterWCurse = document.getElementById('selectBWRiftEnterWCurse');
        var storageValue = window.sessionStorage.getItem('BWRift');
        if (isNullOrUndefined(storageValue))
            storageValue = JSON.stringify(objDefaultBWRift);
        storageValue = JSON.parse(storageValue);
        var nIndexCursed = selectBWRiftChamber.value.indexOf('_CURSED');
        var bCursed = (nIndexCursed > -1);
        var strChamberName = (bCursed) ? selectBWRiftChamber.value.substr(0, nIndexCursed) : selectBWRiftChamber.value;
        var nIndex = storageValue.order.indexOf(strChamberName);
        if (nIndex < 0)
            nIndex = 0;
        if (bCursed)
            nIndex += 16;
        storageValue.master.weapon[nIndex] = selectBWRiftWeapon.value;
        storageValue.master.base[nIndex] = selectBWRiftBase.value;
        storageValue.master.bait[nIndex] = selectBWRiftBait.value;
        storageValue.master.trinket[nIndex] = selectBWRiftTrinket.value;
        storageValue.master.activate[nIndex] = (selectBWRiftActivatePocketWatch.value == 'true');
        storageValue.specialActivate.forceActivate[nIndex] = (selectBWRiftForceActiveQuantum.value == 'true');
        storageValue.specialActivate.remainingLootActivate[nIndex] = parseInt(inputRemainingLootA.value);
        storageValue.specialActivate.forceDeactivate[nIndex] = (selectBWRiftForceDeactiveQuantum.value == 'true');
        storageValue.specialActivate.remainingLootDeactivate[nIndex] = parseInt(inputRemainingLootD.value);
        var strTemp = '';
        if (strChamberName == 'GEARWORKS' || strChamberName == 'ANCIENT' || strChamberName == 'RUNIC') {
            nIndex = selectBWRiftCleaverStatus.selectedIndex;
            if (bCursed)
                nIndex += 2;
            if (strChamberName == 'GEARWORKS')
                strTemp = 'gw';
            else if (strChamberName == 'ANCIENT')
                strTemp = 'al';
            else
                strTemp = 'rl';
        }
        else if (strChamberName == 'GUARD') {
            nIndex = selectBWRiftAlertLvl.selectedIndex;
            if (bCursed)
                nIndex += 7;
            strTemp = 'gb';
        }
        /*else if(strChamberName == 'INGRESS'){
			nIndex = selectBWRiftFTC.selectedIndex;
			if(bCursed)
				nIndex += 4;
			strTemp = 'ic';
		}
		else if(strChamberName == 'FROZEN'){
			nIndex = selectBWRiftHunt.selectedIndex;
			if(bCursed)
				nIndex += 16;
			strTemp = 'fa';
		}*/
        else
            strTemp = 'master';
        if (strTemp !== 'master') {
            storageValue[strTemp].weapon[nIndex] = selectBWRiftWeaponSpecial.value;
            storageValue[strTemp].base[nIndex] = selectBWRiftBaseSpecial.value;
            storageValue[strTemp].bait[nIndex] = selectBWRiftBaitSpecial.value;
            storageValue[strTemp].trinket[nIndex] = selectBWRiftTrinketSpecial.value;
            if (selectBWRiftActivatePocketWatchSpecial.value == 'MASTER')
                storageValue[strTemp].activate[nIndex] = selectBWRiftActivatePocketWatchSpecial.value;
            else
                storageValue[strTemp].activate[nIndex] = (selectBWRiftActivatePocketWatchSpecial.value == 'true');
        }
        storageValue.minRSCType = selectBWRiftMinRSCType.value;
        storageValue.minRSC = parseInt(inputMinRSC.value);
        storageValue.choosePortal = (selectBWRiftChoosePortal.value == 'true');
        if (storageValue.choosePortal) {
            storageValue.choosePortalAfterCC = (selectBWRiftChoosePortalAfterCC.value == 'true');
            storageValue.priorities[selectBWRiftPriority.selectedIndex] = selectBWRiftPortal.value;
            storageValue.prioritiesCursed[selectBWRiftPriorityCursed.selectedIndex] = selectBWRiftPortalCursed.value;
            nIndex = parseInt(selectBWRiftBuffCurse.value);
            storageValue.minTimeSand[nIndex] = parseInt(inputMinTimeSand.value);
            storageValue.enterMinigameWCurse = (selectBWRiftEnterWCurse.value == 'true');
        }
        window.sessionStorage.setItem('BWRift', JSON.stringify(storageValue));
    }

    function initControlsBWRift(bAutoChangeChamber) {
        if (isNullOrUndefined(bAutoChangeChamber))
            bAutoChangeChamber = false;
        var selectBWRiftChamber = document.getElementById('selectBWRiftChamber');
        var selectBWRiftWeapon = document.getElementById('selectBWRiftWeapon');
        var selectBWRiftBase = document.getElementById('selectBWRiftBase');
        var selectBWRiftBait = document.getElementById('selectBWRiftBait');
        var selectBWRiftTrinket = document.getElementById('selectBWRiftTrinket');
        var selectBWRiftActivatePocketWatch = document.getElementById('selectBWRiftActivatePocketWatch');
        var selectBWRiftCleaverStatus = document.getElementById('selectBWRiftCleaverStatus');
        var selectBWRiftAlertLvl = document.getElementById('selectBWRiftAlertLvl');
        var selectBWRiftWeaponSpecial = document.getElementById('selectBWRiftWeaponSpecial');
        var selectBWRiftBaseSpecial = document.getElementById('selectBWRiftBaseSpecial');
        var selectBWRiftBaitSpecial = document.getElementById('selectBWRiftBaitSpecial');
        var selectBWRiftTrinketSpecial = document.getElementById('selectBWRiftTrinketSpecial');
        var selectBWRiftActivatePocketWatchSpecial = document.getElementById('selectBWRiftActivatePocketWatchSpecial');
        var selectBWRiftForceActiveQuantum = document.getElementById('selectBWRiftForceActiveQuantum');
        var inputRemainingLootA = document.getElementById('inputRemainingLootA');
        var selectBWRiftForceDeactiveQuantum = document.getElementById('selectBWRiftForceDeactiveQuantum');
        var inputRemainingLootD = document.getElementById('inputRemainingLootD');
        var selectBWRiftChoosePortal = document.getElementById('selectBWRiftChoosePortal');
        var selectBWRiftChoosePortalAfterCC = document.getElementById('selectBWRiftChoosePortalAfterCC');
        var selectBWRiftPriority = document.getElementById('selectBWRiftPriority');
        var selectBWRiftPriorityCursed = document.getElementById('selectBWRiftPriorityCursed');
        var selectBWRiftPortal = document.getElementById('selectBWRiftPortal');
        var selectBWRiftBuffCurse = document.getElementById('selectBWRiftBuffCurse');
        var inputMinTimeSand = document.getElementById('inputMinTimeSand');
        var selectBWRiftMinRSCType = document.getElementById('selectBWRiftMinRSCType');
        var inputMinRSC = document.getElementById('inputMinRSC');
        var selectBWRiftEnterWCurse = document.getElementById('selectBWRiftEnterWCurse');
        var storageValue = window.sessionStorage.getItem('BWRift');
        if (isNullOrUndefined(storageValue))
            storageValue = JSON.stringify(objDefaultBWRift);
        storageValue = JSON.parse(storageValue);
        var nIndex = -1;
        var bCursed = false;
        if (bAutoChangeChamber && !isNullOrUndefined(user) && user.location.indexOf('Bristle Woods Rift') > -1) {
            if (!(user.quests.QuestRiftBristleWoods.status_effects.un.indexOf('default') > -1 || user.quests.QuestRiftBristleWoods.status_effects.un.indexOf('remove') > -1) ||
                !(user.quests.QuestRiftBristleWoods.status_effects.fr.indexOf('default') > -1 || user.quests.QuestRiftBristleWoods.status_effects.fr.indexOf('remove') > -1) ||
                !(user.quests.QuestRiftBristleWoods.status_effects.st.indexOf('default') > -1 || user.quests.QuestRiftBristleWoods.status_effects.st.indexOf('remove') > -1))
                bCursed = true;
            var nRemaining = user.quests.QuestRiftBristleWoods.progress_remaining;
            if (nRemaining > 0) {
                var strName = user.quests.QuestRiftBristleWoods.chamber_name.split(' ')[0].toUpperCase();
                if (strName == 'ACOLYTE') {
                    if (user.quests.QuestRiftBristleWoods.minigame.acolyte_chamber.obelisk_charge < 100)
                        nIndex = storageValue.order.indexOf('ACOLYTE_CHARGING');
                    else if (user.quests.QuestRiftBristleWoods.minigame.acolyte_chamber.acolyte_sand > 0)
                        nIndex = storageValue.order.indexOf('ACOLYTE_DRAINING');
                    else
                        nIndex = storageValue.order.indexOf('ACOLYTE_DRAINED');
                }
                else
                    nIndex = storageValue.order.indexOf(strName);
                if (nIndex > -1)
                    selectBWRiftChamber.value = storageValue.order[nIndex];
            }
            else
                selectBWRiftChamber.value = 'NONE';
            if (bCursed)
                selectBWRiftChamber.value += '_CURSED';
        }
        var nIndexCursed = selectBWRiftChamber.value.indexOf('_CURSED');
        bCursed = (nIndexCursed > -1);
        var strChamberName = (bCursed) ? selectBWRiftChamber.value.substr(0, nIndexCursed) : selectBWRiftChamber.value;
        nIndex = storageValue.order.indexOf(strChamberName);
        if (nIndex < 0)
            nIndex = 0;
        if (bCursed)
            nIndex += 16;
        selectBWRiftWeapon.value = storageValue.master.weapon[nIndex];
        selectBWRiftBase.value = storageValue.master.base[nIndex];
        selectBWRiftTrinket.value = storageValue.master.trinket[nIndex];
        selectBWRiftBait.value = storageValue.master.bait[nIndex];
        selectBWRiftActivatePocketWatch.value = (storageValue.master.activate[nIndex] === true) ? 'true' : 'false';
        selectBWRiftForceActiveQuantum.value = (storageValue.specialActivate.forceActivate[nIndex] === true) ? 'true' : 'false';
        inputRemainingLootA.value = storageValue.specialActivate.remainingLootActivate[nIndex];
        inputRemainingLootA.disabled = (selectBWRiftForceActiveQuantum.value == 'true') ? '' : 'disabled';
        selectBWRiftForceDeactiveQuantum.value = (storageValue.specialActivate.forceDeactivate[nIndex] === true) ? 'true' : 'false';
        inputRemainingLootD.value = storageValue.specialActivate.remainingLootDeactivate[nIndex];
        inputRemainingLootD.disabled = (selectBWRiftForceDeactiveQuantum.value == 'true') ? '' : 'disabled';
        var strTemp = '';
        if (strChamberName == 'GEARWORKS' || strChamberName == 'ANCIENT' || strChamberName == 'RUNIC') {
            nIndex = selectBWRiftCleaverStatus.selectedIndex;
            if (bCursed)
                nIndex += 2;
            if (strChamberName == 'GEARWORKS')
                strTemp = 'gw';
            else if (strChamberName == 'ANCIENT')
                strTemp = 'al';
            else
                strTemp = 'rl';
            selectBWRiftCleaverStatus.style.display = '';
            selectBWRiftAlertLvl.style.display = 'none';
            selectBWRiftFTC.style.display = 'none';
            selectBWRiftHunt.style.display = 'none';
        }
        else if (strChamberName == 'GUARD') {
            nIndex = selectBWRiftAlertLvl.selectedIndex;
            if (bCursed)
                nIndex += 7;
            strTemp = 'gb';
            selectBWRiftCleaverStatus.style.display = 'none';
            selectBWRiftAlertLvl.style.display = '';
            selectBWRiftFTC.style.display = 'none';
            selectBWRiftHunt.style.display = 'none';
        }
        /*else if(strChamberName == 'INGRESS'){
			nIndex = selectBWRiftFTC.selectedIndex;
			if(bCursed)
				nIndex += 4;
			strTemp = 'ic';
			selectBWRiftAlertLvl.style.display = 'none';
			selectBWRiftFTC.style.display = '';
			selectBWRiftHunt.style.display = 'none';
		}
		else if(strChamberName == 'FROZEN'){
			nIndex = selectBWRiftHunt.selectedIndex;
			if(bCursed)
				nIndex += 16;
			strTemp = 'fa';
			selectBWRiftAlertLvl.style.display = 'none';
			selectBWRiftFTC.style.display = 'none';
			selectBWRiftHunt.style.display = '';
		}*/
        else {
            strTemp = 'master';
            selectBWRiftAlertLvl.style.display = 'none';
            selectBWRiftFTC.style.display = 'none';
            selectBWRiftHunt.style.display = 'none';
        }
        if (strTemp == 'master')
            document.getElementById('trBWRiftTrapSetupSpecial').style.display = 'none';
        else {
            selectBWRiftWeaponSpecial.value = storageValue[strTemp].weapon[nIndex];
            selectBWRiftBaseSpecial.value = storageValue[strTemp].base[nIndex];
            selectBWRiftTrinketSpecial.value = storageValue[strTemp].trinket[nIndex];
            selectBWRiftBaitSpecial.value = storageValue[strTemp].bait[nIndex];
            if (storageValue[strTemp].activate[nIndex] == 'MASTER')
                selectBWRiftActivatePocketWatchSpecial.value = storageValue[strTemp].activate[nIndex];
            else
                selectBWRiftActivatePocketWatchSpecial.value = (storageValue[strTemp].activate[nIndex] === true) ? 'true' : 'false';
            document.getElementById('trBWRiftTrapSetupSpecial').style.display = '';
        }
        selectBWRiftChoosePortal.value = (storageValue.choosePortal === true) ? 'true' : 'false';
        selectBWRiftChoosePortalAfterCC.value = (storageValue.choosePortalAfterCC === true) ? 'true' : 'false';
        selectBWRiftPortal.value = storageValue.priorities[selectBWRiftPriority.selectedIndex];
        selectBWRiftPortalCursed.value = storageValue.prioritiesCursed[selectBWRiftPriorityCursed.selectedIndex];
        nIndex = parseInt(selectBWRiftBuffCurse.value);
        inputMinTimeSand.value = storageValue.minTimeSand[nIndex];
        selectBWRiftMinRSCType.value = storageValue.minRSCType;
        inputMinRSC.value = storageValue.minRSC;
        selectBWRiftEnterWCurse.value = (storageValue.enterMinigameWCurse === true) ? 'true' : 'false';
        if (selectBWRiftChoosePortal.value == 'true') {
            document.getElementById('trBWRiftChoosePortalAfterCC').style.display = '';
            document.getElementById('trBWRiftPortalPriority').style.display = '';
            document.getElementById('trBWRiftPortalPriorityCursed').style.display = '';
            document.getElementById('trBWRiftMinTimeSand').style.display = '';
            document.getElementById('trBWRiftEnterMinigame').style.display = '';
            document.getElementById('trBWRiftMinRSC').style.display = '';
        }
        else {
            document.getElementById('trBWRiftChoosePortalAfterCC').style.display = 'none';
            document.getElementById('trBWRiftPortalPriority').style.display = 'none';
            document.getElementById('trBWRiftPortalPriorityCursed').style.display = 'none';
            document.getElementById('trBWRiftMinTimeSand').style.display = 'none';
            document.getElementById('trBWRiftEnterMinigame').style.display = 'none';
            document.getElementById('trBWRiftMinRSC').style.display = 'none';
        }
        inputMinRSC.style.display = (selectBWRiftMinRSCType.value == 'NUMBER') ? '' : 'none';
    }

    function saveFRox() {
        var selectFRoxStage = document.getElementById('selectFRoxStage');
        var selectFRoxWeapon = document.getElementById('selectFRoxWeapon');
        var selectFRoxBase = document.getElementById('selectFRoxBase');
        var selectFRoxBait = document.getElementById('selectFRoxBait');
        var selectFRoxTrinket = document.getElementById('selectFRoxTrinket');
        var selectFRoxActivateTower = document.getElementById('selectFRoxActivateTower');
        var selectFRoxFullHPDeactivate = document.getElementById('selectFRoxFullHPDeactivate');
        var storageValue = window.sessionStorage.getItem('FRox');
        if (isNullOrUndefined(storageValue)) {
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
            storageValue = JSON.stringify(objDefaultFRox);
        }
        storageValue = JSON.parse(storageValue);
        var nIndex = storageValue.order.indexOf(selectFRoxStage.value);
        if (nIndex < 0)
            nIndex = 0;
        storageValue.weapon[nIndex] = selectFRoxWeapon.value;
        storageValue.base[nIndex] = selectFRoxBase.value;
        storageValue.bait[nIndex] = selectFRoxBait.value;
        storageValue.trinket[nIndex] = selectFRoxTrinket.value;
        storageValue.activate[nIndex] = (selectFRoxActivateTower.value == 'true');
        storageValue.fullHPDeactivate = (selectFRoxFullHPDeactivate.value == 'true');
        window.sessionStorage.setItem('FRox', JSON.stringify(storageValue));
    }

    function initControlsFRox(bAutoChangeStage) {
        if (isNullOrUndefined(bAutoChangeStage))
            bAutoChangeStage = false;
        var selectFRoxStage = document.getElementById('selectFRoxStage');
        var selectFRoxWeapon = document.getElementById('selectFRoxWeapon');
        var selectFRoxBase = document.getElementById('selectFRoxBase');
        var selectFRoxBait = document.getElementById('selectFRoxBait');
        var selectFRoxTrinket = document.getElementById('selectFRoxTrinket');
        var selectFRoxActivateTower = document.getElementById('selectFRoxActivateTower');
        var selectFRoxFullHPDeactivate = document.getElementById('selectFRoxFullHPDeactivate');
        var storageValue = window.sessionStorage.getItem('FRox');
        if (isNullOrUndefined(storageValue)) {
            selectFRoxWeapon.selectedIndex = -1;
            selectFRoxBase.selectedIndex = -1;
            selectFRoxBait.selectedIndex = -1;
            selectFRoxTrinket.selectedIndex = -1;
            selectFRoxActivateTower.selectedIndex = -1;
            selectFRoxFullHPDeactivate.selectedIndex = -1;
        }
        else {
            storageValue = JSON.parse(storageValue);
            var nIndex = -1;
            if (bAutoChangeStage && !isNullOrUndefined(user) && user.location.indexOf('Fort Rox') > -1) {
                if (user.quests.QuestFortRox.is_dawn === true)
                    selectFRoxStage.value = 'DAWN';
                else if (user.quests.QuestFortRox.current_phase == 'night') {
                    nIndex = storageValue.stage.indexOf(user.quests.QuestFortRox.current_stage);
                    if (nIndex > -1)
                        selectFRoxStage.value = storageValue.order[nIndex];
                }
                else if (user.quests.QuestFortRox.current_phase == 'day') {
                    selectFRoxStage.value = 'DAY';
                }
            }
            nIndex = storageValue.order.indexOf(selectFRoxStage.value);
            if (nIndex < 0)
                nIndex = 0;
            selectFRoxWeapon.value = storageValue.weapon[nIndex];
            selectFRoxBase.value = storageValue.base[nIndex];
            selectFRoxTrinket.value = storageValue.trinket[nIndex];
            selectFRoxBait.value = storageValue.bait[nIndex];
            selectFRoxActivateTower.value = (storageValue.activate[nIndex] === true) ? 'true' : 'false';
            selectFRoxFullHPDeactivate.value = (storageValue.fullHPDeactivate === true) ? 'true' : 'false';
        }
    }

    function onSelectWWRiftFaction() {
        onInputMinRageChanged(document.getElementById('inputMinRage'));
    }

    function onInputMinRageChanged(input) {
        var selectWWRiftFaction = document.getElementById('selectWWRiftFaction');
        var nMin = (selectWWRiftFaction.value == 'MBW_45_48') ? 45 : input.min;
        var nMax = (selectWWRiftFaction.value == 'MBW_40_44') ? 44 : input.max;
        input.value = limitMinMax(input.value, nMin, nMax);
        saveWWRift();
        initControlsWWRift();
    }

    function saveWWRift() {
        var selectWWRiftFaction = document.getElementById('selectWWRiftFaction');
        var selectWWRiftFactionNext = document.getElementById('selectWWRiftFactionNext');
        var selectWWRiftRage = document.getElementById('selectWWRiftRage');
        var selectWWRiftTrapWeapon = document.getElementById('selectWWRiftTrapWeapon');
        var selectWWRiftTrapBase = document.getElementById('selectWWRiftTrapBase');
        var selectWWRiftTrapTrinket = document.getElementById('selectWWRiftTrapTrinket');
        var selectWWRiftTrapBait = document.getElementById('selectWWRiftTrapBait');
        var selectWWRiftMBWBar4044 = document.getElementById('selectWWRiftMBWBar4044');
        var selectWWRiftMBWBar4548 = document.getElementById('selectWWRiftMBWBar4548');
        var selectWWRiftMBWTrapWeapon = document.getElementById('selectWWRiftMBWTrapWeapon');
        var selectWWRiftMBWTrapBase = document.getElementById('selectWWRiftMBWTrapBase');
        var selectWWRiftMBWTrapTrinket = document.getElementById('selectWWRiftMBWTrapTrinket');
        var selectWWRiftMBWTrapBait = document.getElementById('selectWWRiftMBWTrapBait');
        var inputMinRage = document.getElementById('inputMinRage');
        var storageValue = window.sessionStorage.getItem('WWRift');
        if (isNullOrUndefined(storageValue)) {
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
            storageValue = JSON.stringify(objDefaultWWRift);
        }
        storageValue = JSON.parse(storageValue);
        storageValue.factionFocus = selectWWRiftFaction.value;
        storageValue.factionFocusNext = selectWWRiftFactionNext.value;
        var nIndex = selectWWRiftRage.selectedIndex;
        if (nIndex < 0)
            nIndex = 0;
        storageValue.faction.weapon[nIndex] = selectWWRiftTrapWeapon.value;
        storageValue.faction.base[nIndex] = selectWWRiftTrapBase.value;
        storageValue.faction.trinket[nIndex] = selectWWRiftTrapTrinket.value;
        storageValue.faction.bait[nIndex] = selectWWRiftTrapBait.value;
        storageValue.MBW.minRageLLC = parseInt(inputMinRage.value);
        if (selectWWRiftFaction.value == 'MBW_40_44') {
            nIndex = selectWWRiftMBWBar4044.selectedIndex;
            if (nIndex < 0)
                nIndex = 0;
            storageValue.MBW.rage4044.weapon[nIndex] = selectWWRiftMBWTrapWeapon.value;
            storageValue.MBW.rage4044.base[nIndex] = selectWWRiftMBWTrapBase.value;
            storageValue.MBW.rage4044.trinket[nIndex] = selectWWRiftMBWTrapTrinket.value;
            storageValue.MBW.rage4044.bait[nIndex] = selectWWRiftMBWTrapBait.value;
        }
        else if (selectWWRiftFaction.value == 'MBW_45_48') {
            nIndex = selectWWRiftMBWBar4548.selectedIndex;
            if (nIndex < 0)
                nIndex = 0;
            storageValue.MBW.rage4548.weapon[nIndex] = selectWWRiftMBWTrapWeapon.value;
            storageValue.MBW.rage4548.base[nIndex] = selectWWRiftMBWTrapBase.value;
            storageValue.MBW.rage4548.trinket[nIndex] = selectWWRiftMBWTrapTrinket.value;
            storageValue.MBW.rage4548.bait[nIndex] = selectWWRiftMBWTrapBait.value;
        }
        window.sessionStorage.setItem('WWRift', JSON.stringify(storageValue));
    }

    function initControlsWWRift(bAutoChangeRageLevel) {
        if (isNullOrUndefined(bAutoChangeRageLevel))
            bAutoChangeRageLevel = false;
        var selectWWRiftFaction = document.getElementById('selectWWRiftFaction');
        var selectWWRiftFactionNext = document.getElementById('selectWWRiftFactionNext');
        var selectWWRiftRage = document.getElementById('selectWWRiftRage');
        var selectWWRiftTrapWeapon = document.getElementById('selectWWRiftTrapWeapon');
        var selectWWRiftTrapBase = document.getElementById('selectWWRiftTrapBase');
        var selectWWRiftTrapTrinket = document.getElementById('selectWWRiftTrapTrinket');
        var selectWWRiftTrapBait = document.getElementById('selectWWRiftTrapBait');
        var selectWWRiftMBWBar4044 = document.getElementById('selectWWRiftMBWBar4044');
        var selectWWRiftMBWBar4548 = document.getElementById('selectWWRiftMBWBar4548');
        var selectWWRiftMBWTrapWeapon = document.getElementById('selectWWRiftMBWTrapWeapon');
        var selectWWRiftMBWTrapBase = document.getElementById('selectWWRiftMBWTrapBase');
        var selectWWRiftMBWTrapTrinket = document.getElementById('selectWWRiftMBWTrapTrinket');
        var selectWWRiftMBWTrapBait = document.getElementById('selectWWRiftMBWTrapBait');
        var inputMinRage = document.getElementById('inputMinRage');
        var storageValue = window.sessionStorage.getItem('WWRift');
        if (isNullOrUndefined(storageValue)) {
            selectWWRiftFaction.selectedIndex = -1;
            selectWWRiftFactionNext.selectedIndex = 0;
            selectWWRiftRage.selectedIndex = 0;
            selectWWRiftTrapWeapon.selectedIndex = -1;
            selectWWRiftTrapBase.selectedIndex = -1;
            selectWWRiftTrapTrinket.selectedIndex = -1;
            selectWWRiftTrapBait.selectedIndex = -1;
            inputMinRage.value = 40;
            selectWWRiftMBWBar4044.selectedIndex = 0;
            selectWWRiftMBWBar4548.selectedIndex = 0;
            selectWWRiftMBWTrapWeapon.selectedIndex = -1;
            selectWWRiftMBWTrapBase.selectedIndex = -1;
            selectWWRiftMBWTrapTrinket.selectedIndex = -1;
            selectWWRiftMBWTrapBait.selectedIndex = -1;
        }
        else {
            storageValue = JSON.parse(storageValue);
            selectWWRiftFaction.value = storageValue.factionFocus;
            selectWWRiftFactionNext.value = storageValue.factionFocusNext;
            if (bAutoChangeRageLevel && !isNullOrUndefined(user) && user.location.indexOf('Whisker Woods Rift') > -1) {
                var arrOrder = ['CC', 'GGT', 'DL'];
                var arrRage = new Array(3);
                var classRage = document.getElementsByClassName('riftWhiskerWoodsHUD-zone-rageLevel');
                for (var i = 0; i < classRage.length; i++)
                    arrRage[i] = parseInt(classRage[i].textContent);
                var temp = arrOrder.indexOf(storageValue.factionFocus);
                if (temp != -1 && Number.isInteger(arrRage[temp]))
                    selectWWRiftRage.selectedIndex = Math.floor(arrRage[temp] / 25);
            }
            var nIndex = (selectWWRiftRage.selectedIndex < 0) ? 0 : selectWWRiftRage.selectedIndex;
            selectWWRiftTrapWeapon.value = storageValue.faction.weapon[nIndex];
            selectWWRiftTrapBase.value = storageValue.faction.base[nIndex];
            selectWWRiftTrapTrinket.value = storageValue.faction.trinket[nIndex];
            selectWWRiftTrapBait.value = storageValue.faction.bait[nIndex];
            inputMinRage.value = storageValue.MBW.minRageLLC;
            var temp = '';
            if (selectWWRiftFaction.value == 'MBW_40_44') {
                nIndex = (selectWWRiftMBWBar4044.selectedIndex < 0) ? 0 : selectWWRiftMBWBar4044.selectedIndex;
                temp = 'rage4044';
            }
            else if (selectWWRiftFaction.value == 'MBW_45_48') {
                nIndex = (selectWWRiftMBWBar4548.selectedIndex < 0) ? 0 : selectWWRiftMBWBar4548.selectedIndex;
                temp = 'rage4548';
            }
            if (temp !== '') {
                selectWWRiftMBWTrapWeapon.value = storageValue.MBW[temp].weapon[nIndex];
                selectWWRiftMBWTrapBase.value = storageValue.MBW[temp].base[nIndex];
                selectWWRiftMBWTrapTrinket.value = storageValue.MBW[temp].trinket[nIndex];
                selectWWRiftMBWTrapBait.value = storageValue.MBW[temp].bait[nIndex];
            }
        }
        if (selectWWRiftFaction.value.indexOf('MBW') > -1) {
            selectWWRiftMBWBar4044.style.display = (selectWWRiftFaction.value == 'MBW_40_44') ? '' : 'none';
            selectWWRiftMBWBar4548.style.display = (selectWWRiftFaction.value == 'MBW_40_44') ? 'none' : '';
            document.getElementById('trWWRiftFactionFocusNext').style.display = 'none';
            document.getElementById('trWWRiftMBWMinRage').style.display = 'table-row';
            document.getElementById('trWWRiftMBWTrapSetup').style.display = 'table-row';
            document.getElementById('trWWRiftTrapSetup').style.display = 'none';
        }
        else {
            document.getElementById('trWWRiftFactionFocusNext').style.display = 'table-row';
            document.getElementById('trWWRiftMBWMinRage').style.display = 'none';
            document.getElementById('trWWRiftMBWTrapSetup').style.display = 'none';
            document.getElementById('trWWRiftTrapSetup').style.display = 'table-row';
        }
    }

    function onSelectGESSDLoadCrate() {
        saveGES();
        initControlsGES();
    }

    function onSelectGESRRRepellent() {
        saveGES();
        initControlsGES();
    }

    function onSelectGESDCStokeEngine() {
        saveGES();
        initControlsGES();
    }

    function saveGES() {
        var selectGESStage = document.getElementById('selectGESStage');
        var selectGESTrapWeapon = document.getElementById('selectGESTrapWeapon');
        var selectGESTrapBase = document.getElementById('selectGESTrapBase');
        var selectGESSDTrapTrinket = document.getElementById('selectGESSDTrapTrinket');
        var selectGESRRTrapTrinket = document.getElementById('selectGESRRTrapTrinket');
        var selectGESDCTrapTrinket = document.getElementById('selectGESDCTrapTrinket');
        var selectGESTrapBait = document.getElementById('selectGESTrapBait');
        var selectGESSDLoadCrate = document.getElementById('selectGESSDLoadCrate');
        var inputMinCrate = document.getElementById('inputMinCrate');
        var selectGESRRRepellent = document.getElementById('selectGESRRRepellent');
        var inputMinRepellent = document.getElementById('inputMinRepellent');
        var selectGESDCStokeEngine = document.getElementById('selectGESDCStokeEngine');
        var inputMinFuelNugget = document.getElementById('inputMinFuelNugget');
        var storageValue = window.sessionStorage.getItem('GES');
        if (isNullOrUndefined(storageValue)) {
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
            storageValue = JSON.stringify(objDefaultGES);
        }
        storageValue = JSON.parse(storageValue);
        var strStage = selectGESStage.value;
        storageValue[strStage].weapon = selectGESTrapWeapon.value;
        storageValue[strStage].base = selectGESTrapBase.value;
        storageValue[strStage].bait = selectGESTrapBait.value;
        if (strStage == 'RR')
            storageValue[strStage].trinket = selectGESRRTrapTrinket.value;
        else if (strStage == 'DC')
            storageValue[strStage].trinket = selectGESDCTrapTrinket.value;
        else
            storageValue[strStage].trinket = selectGESTrapTrinket.value;
        storageValue.bLoadCrate = (selectGESSDLoadCrate.value == 'true');
        storageValue.nMinCrate = parseInt(inputMinCrate.value);
        storageValue.bUseRepellent = (selectGESRRRepellent.value == 'true');
        storageValue.nMinRepellent = parseInt(inputMinRepellent.value);
        storageValue.bStokeEngine = (selectGESDCStokeEngine.value == 'true');
        storageValue.nMinFuelNugget = parseInt(inputMinFuelNugget.value);
        window.sessionStorage.setItem('GES', JSON.stringify(storageValue));
    }

    function initControlsGES(bAutoChangePhase) {
        if (isNullOrUndefined(bAutoChangePhase))
            bAutoChangePhase = false;
        var selectGESStage = document.getElementById('selectGESStage');
        var selectGESTrapWeapon = document.getElementById('selectGESTrapWeapon');
        var selectGESTrapBase = document.getElementById('selectGESTrapBase');
        var selectGESTrapTrinket = document.getElementById('selectGESTrapTrinket');
        var selectGESRRTrapTrinket = document.getElementById('selectGESRRTrapTrinket');
        var selectGESDCTrapTrinket = document.getElementById('selectGESDCTrapTrinket');
        var selectGESTrapBait = document.getElementById('selectGESTrapBait');
        var selectGESSDLoadCrate = document.getElementById('selectGESSDLoadCrate');
        var inputMinCrate = document.getElementById('inputMinCrate');
        var selectGESRRRepellent = document.getElementById('selectGESRRRepellent');
        var inputMinRepellent = document.getElementById('inputMinRepellent');
        var selectGESDCStokeEngine = document.getElementById('selectGESDCStokeEngine');
        var inputMinFuelNugget = document.getElementById('inputMinFuelNugget');
        var storageValue = window.sessionStorage.getItem('GES');
        if (bAutoChangePhase && !isNullOrUndefined(user) && user.location.indexOf('Gnawnian Express Station') > -1) {
            if (user.quests.QuestTrainStation.on_train) {
                var strCurrentPhase = '';
                var classPhase = document.getElementsByClassName('box phaseName');
                if (classPhase.length > 0 && classPhase[0].children.length > 1)
                    strCurrentPhase = classPhase[0].children[1].textContent;
                if (strCurrentPhase == 'Supply Depot') {
                    selectGESStage.value = 'SD';
                    var nTurn = parseInt(document.getElementsByClassName('supplyHoarderTab')[0].textContent.substr(0, 1));
                    selectGESStage.value = (nTurn <= 0) ? 'SD_BEFORE' : 'SD_AFTER';
                }
                else if (strCurrentPhase == 'Raider River')
                    selectGESStage.value = 'RR';
                else if (strCurrentPhase == 'Daredevil Canyon')
                    selectGESStage.value = 'DC';
            }
            else
                selectGESStage.value = 'WAITING';
        }
        var strStage = selectGESStage.value;
        if (isNullOrUndefined(storageValue)) {
            selectGESTrapWeapon.selectedIndex = -1;
            selectGESTrapBase.selectedIndex = -1;
            selectGESTrapTrinket.selectedIndex = -1;
            selectGESRRTrapTrinket.selectedIndex = -1;
            selectGESDCTrapTrinket.selectedIndex = -1;
            selectGESTrapBait.selectedIndex = -1;
            selectGESSDLoadCrate.selectedIndex = 0;
            inputMinCrate.value = 11;
            selectGESRRRepellent.selectedIndex = 0;
            inputMinRepellent.value = 11;
            selectGESDCStokeEngine.selectedIndex = 0;
            inputMinFuelNugget.value = 20;
        }
        else {
            storageValue = JSON.parse(storageValue);
            selectGESTrapWeapon.value = storageValue[strStage].weapon;
            selectGESTrapBase.value = storageValue[strStage].base;
            selectGESTrapBait.value = storageValue[strStage].bait;
            if (strStage == 'RR')
                selectGESRRTrapTrinket.value = storageValue.RR.trinket;
            else if (strStage == 'DC')
                selectGESDCTrapTrinket.value = storageValue.DC.trinket;
            else
                selectGESTrapTrinket.value = storageValue[strStage].trinket;
            selectGESSDLoadCrate.value = (storageValue.bLoadCrate === true) ? 'true' : 'false';
            inputMinCrate.value = storageValue.nMinCrate;
            selectGESRRRepellent.value = (storageValue.bUseRepellent === true) ? 'true' : 'false';
            inputMinRepellent.value = storageValue.nMinRepellent;
            selectGESDCStokeEngine.value = (storageValue.bStokeEngine === true) ? 'true' : 'false';
            inputMinFuelNugget.value = storageValue.nMinFuelNugget;
        }
        if (strStage == 'RR') {
            selectGESTrapTrinket.style.display = 'none';
            selectGESRRTrapTrinket.style.display = '';
            selectGESDCTrapTrinket.style.display = 'none';
        }
        else if (strStage == 'DC') {
            selectGESTrapTrinket.style.display = 'none';
            selectGESRRTrapTrinket.style.display = 'none';
            selectGESDCTrapTrinket.style.display = '';
        }
        else {
            selectGESTrapTrinket.style.display = '';
            selectGESRRTrapTrinket.style.display = 'none';
            selectGESDCTrapTrinket.style.display = 'none';
        }
        inputMinCrate.disabled = (selectGESSDLoadCrate.value == 'true') ? '' : 'disabled';
        inputMinRepellent.disabled = (selectGESRRRepellent.value == 'true') ? '' : 'disabled';
        inputMinFuelNugget.disabled = (selectGESDCStokeEngine.value == 'true') ? '' : 'disabled';
    }

    function showOrHideTr(algo) {
        var objTableRow = {
            'All LG Area': {
                arr: ['trLGTGAutoFill', 'trLGTGAutoPour', 'trPourTrapSetup', 'trCurseLiftedTrapSetup', 'trSaltedTrapSetup'],
                init: function (data) {
                    initControlsLG(data);
                }
            },
            'Sunken City Custom': {
                arr: ['trSCCustom', 'trSCCustomUseSmartJet'],
                init: function (data) {
                    initControlsSCCustom(data);
                }
            },
            'Labyrinth': {
                arr: ['trLabyrinth', 'trPriorities15', 'trPriorities1560', 'trPriorities60', 'trLabyrinthOtherHallway', 'trLabyrinthDisarm', 'trLabyrinthArmOtherBase', 'trLabyrinthDisarmCompass', 'trLabyrinthWeaponFarming'],
                init: function (data) {
                    initControlsLaby(data);
                }
            },
            'Fiery Warpath': {
                arr: ['trFWWave', 'trFWTrapSetup', 'trFW4TrapSetup', 'trFWStreak', 'trFWFocusType', 'trFWLastType', 'trFWSupportConfig'],
                init: function (data) {
                    initControlsFW(data);
                }
            },
            'Burroughs Rift Custom': {
                arr: ['trBRConfig', 'trBRToggle', 'trBRTrapSetup'],
                init: function (data) {
                    initControlsBR(data);
                }
            },
            'SG': {
                arr: ['trSGTrapSetup', 'trSGDisarmBait'],
                init: function (data) {
                    initControlsSG(data);
                }
            },
            'Zokor': {
                arr: ['trZokorTrapSetup'],
                init: function (data) {
                    initControlsZokor(data);
                }
            },
            'Furoma Rift': {
                arr: ['trFREnterBattery', 'trFRRetreatBattery', 'trFRTrapSetupAtBattery'],
                init: function (data) {
                    initControlsFR(data);
                }
            },
            'ZT': {
                arr: ['trZTFocus', 'trZTTrapSetup1st', 'trZTTrapSetup2nd'],
                init: function (data) {
                    initControlsZT(data);
                }
            },
            'Iceberg': {
                arr: ['trIceberg'],
                init: function (data) {
                    initControlsIceberg(data);
                }
            },
            'WWRift': {
                arr: ['trWWRiftFactionFocus', 'trWWRiftFactionFocusNext', 'trWWRiftTrapSetup', 'trWWRiftMBWTrapSetup', 'trWWRiftMBWMinRage'],
                init: function (data) {
                    initControlsWWRift(data);
                }
            },
            'GES': {
                arr: ['trGESTrapSetup', 'trGESSDLoadCrate', 'trGESRRRepellent', 'trGESDCStokeEngine'],
                init: function (data) {
                    initControlsGES(data);
                }
            },
            'Fort Rox': {
                arr: ['trFRoxTrapSetup', 'trFRoxDeactiveTower'],
                init: function (data) {
                    initControlsFRox(data);
                }
            },
            'GWH2016R': {
                arr: ['trGWHTrapSetup', 'trGWHTurboBoost', 'trGWHFlying', 'trGWHFlyingFirework', 'trGWHFlyingLand'],
                init: function (data) {
                    initControlsGWH2016(data);
                }
            },
            'Bristle Woods Rift': {
                arr: ['trBWRiftSubLocation', 'trBWRiftMasterTrapSetup', 'trBWRiftAutoChoosePortal', 'trBWRiftPortalPriority', 'trBWRiftPortalPriorityCursed', 'trBWRiftMinTimeSand', 'trBWRiftMinRSC', 'trBWRiftDeactivatePocketWatch', 'trBWRiftChoosePortalAfterCC', 'trBWRiftTrapSetupSpecial', 'trBWRiftEnterMinigame', 'trBWRiftActivatePocketWatch'],
                init: function (data) {
                    initControlsBWRift(data);
                }
            },
            'BC/JOD': {
                arr: ['trBCJODSubLocation', 'trBCJODTrapSetup'],
                init: function (data) {
                    initControlsBCJOD(data);
                }
            },
            'FG/AR': {
                arr: ['trFGARSubLocation', 'trFGARTrapSetup'],
                init: function (data) {
                    initControlsFGAR(data);
                }
            },
        };
        var i, temp;
        for (var prop in objTableRow) {
            if (objTableRow.hasOwnProperty(prop)) {
                temp = (prop == algo) ? 'table-row' : 'none';
                for (i = 0; i < objTableRow[prop].arr.length; i++)
                    document.getElementById(objTableRow[prop].arr[i]).style.display = temp;
            }
        }
        if (!isNullOrUndefined(objTableRow[algo]))
            objTableRow[algo].init(true);

        initControlsMapHunting();
        initControlsSpecialFeature();
    }
}

// ################################################################################################
//   HTML Function - End
// #################################################################################################