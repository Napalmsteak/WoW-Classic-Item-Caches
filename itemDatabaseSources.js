"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEM_DATABASE_SOURCES = void 0;
const createSourceKey = (expansion, type, name) => `${expansion}::${type}::${name}`.toLowerCase();
const buildSources = (expansion, type, phase, names) => names.map((name) => ({
    key: createSourceKey(expansion, type, name),
    expansion,
    name,
    type,
    phase
}));
exports.ITEM_DATABASE_SOURCES = [
    ...buildSources('Classic Era', 'Dungeon', 1, [
        'Ragefire Chasm',
        'The Deadmines',
        'Wailing Caverns',
        'Shadowfang Keep',
        'Blackfathom Deeps',
        'The Stockade',
        'Gnomeregan',
        'Razorfen Kraul',
        'Scarlet Monastery',
        'Razorfen Downs',
        'Uldaman',
        'Zul\'Farrak',
        'Maraudon',
        'The Temple of Atal\'Hakkar',
        'Blackrock Depths',
        'Lower Blackrock Spire',
        'Upper Blackrock Spire',
        'Scholomance',
        'Stratholme'
    ]),
    ...buildSources('Classic Era', 'Raid', 1, [
        'Molten Core',
        'Onyxia\'s Lair'
    ]),
    ...buildSources('Classic Era', 'Dungeon', 2, [
        'Dire Maul'
    ]),
    ...buildSources('Classic Era', 'Raid', 3, [
        'Blackwing Lair'
    ]),
    ...buildSources('Classic Era', 'Raid', 4, [
        'Zul\'Gurub'
    ]),
    ...buildSources('Classic Era', 'Raid', 5, [
        'Ruins of Ahn\'Qiraj',
        'Temple of Ahn\'Qiraj'
    ]),
    ...buildSources('Classic Era', 'Raid', 6, [
        'Naxxramas'
    ]),
    ...buildSources('TBC Classic', 'Dungeon', 1, [
        'Hellfire Ramparts',
        'The Blood Furnace',
        'The Shattered Halls',
        'The Slave Pens',
        'The Underbog',
        'The Steamvault',
        'Mana-Tombs',
        'Auchenai Crypts',
        'Sethekk Halls',
        'Shadow Labyrinth',
        'Old Hillsbrad Foothills',
        'The Black Morass',
        'The Mechanar',
        'The Botanica',
        'The Arcatraz'
    ]),
    ...buildSources('TBC Classic', 'Raid', 1, [
        'Karazhan',
        'Gruul\'s Lair',
        'Magtheridon\'s Lair'
    ]),
    ...buildSources('TBC Classic', 'Raid', 2, [
        'Serpentshrine Cavern',
        'Tempest Keep'
    ]),
    ...buildSources('TBC Classic', 'Raid', 3, [
        'Hyjal Summit',
        'Black Temple'
    ]),
    ...buildSources('TBC Classic', 'Raid', 4, [
        'Zul\'Aman'
    ]),
    ...buildSources('TBC Classic', 'Dungeon', 5, [
        'Magisters\' Terrace'
    ]),
    ...buildSources('TBC Classic', 'Raid', 5, [
        'Sunwell Plateau'
    ]),
    ...buildSources('Wrath Classic', 'Dungeon', 1, [
        'Utgarde Keep',
        'The Nexus',
        'Azjol-Nerub',
        'Ahn\'kahet: The Old Kingdom',
        'Drak\'Tharon Keep',
        'The Violet Hold',
        'Gundrak',
        'Halls of Stone',
        'Halls of Lightning',
        'The Oculus',
        'Utgarde Pinnacle',
        'The Culling of Stratholme',
        'Trial of the Champion'
    ]),
    ...buildSources('Wrath Classic', 'Raid', 1, [
        'Naxxramas',
        'The Obsidian Sanctum',
        'The Eye of Eternity'
    ]),
    ...buildSources('Wrath Classic', 'Raid', 2, [
        'Ulduar'
    ]),
    ...buildSources('Wrath Classic', 'Raid', 3, [
        'Trial of the Crusader'
    ]),
    ...buildSources('Wrath Classic', 'Dungeon', 4, [
        'The Forge of Souls',
        'Pit of Saron',
        'Halls of Reflection'
    ]),
    ...buildSources('Wrath Classic', 'Raid', 4, [
        'Onyxia\'s Lair',
        'Icecrown Citadel'
    ]),
    ...buildSources('Wrath Classic', 'Raid', 5, [
        'The Ruby Sanctum'
    ]),
    ...buildSources('Cata Classic', 'Dungeon', 1, [
        'Blackrock Caverns',
        'Throne of the Tides',
        'The Stonecore',
        'The Vortex Pinnacle',
        'Lost City of the Tol\'vir',
        'Grim Batol',
        'Halls of Origination',
        'The Deadmines',
        'Shadowfang Keep'
    ]),
    ...buildSources('Cata Classic', 'Raid', 1, [
        'Blackwing Descent',
        'The Bastion of Twilight',
        'Throne of the Four Winds'
    ]),
    ...buildSources('Cata Classic', 'Dungeon', 3, [
        'Zul\'Aman',
        'Zul\'Gurub'
    ]),
    ...buildSources('Cata Classic', 'Raid', 3, [
        'Firelands'
    ]),
    ...buildSources('Cata Classic', 'Dungeon', 4, [
        'End Time',
        'Well of Eternity',
        'Hour of Twilight'
    ]),
    ...buildSources('Cata Classic', 'Raid', 4, [
        'Dragon Soul'
    ]),
    ...buildSources('MoP Classic', 'Dungeon', 1, [
        'Temple of the Jade Serpent',
        'Stormstout Brewery',
        'Shado-Pan Monastery',
        'Gate of the Setting Sun',
        'Siege of Niuzao Temple',
        'Mogu\'shan Palace',
        'Scarlet Halls',
        'Scarlet Monastery',
        'Scholomance'
    ]),
    ...buildSources('MoP Classic', 'Raid', 1, [
        'Mogu\'shan Vaults',
        'Heart of Fear',
        'Terrace of Endless Spring'
    ]),
    ...buildSources('MoP Classic', 'Raid', 2, [
        'Throne of Thunder'
    ]),
    ...buildSources('MoP Classic', 'Raid', 4, [
        'Siege of Orgrimmar'
    ])
];
