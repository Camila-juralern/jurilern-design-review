export const AVATAR_PRICES: Record<string, number> = {
  fox: 0,
  owl: 40,
  cat: 60,
  panda: 80,
  person: 100,
}

export type SpecialLootCategory = 'avatar' | 'hat' | 'outfit' | 'arms' | 'wings' | 'eyes' | 'room'
export type SpecialLootItem = {
  id: string
  category: SpecialLootCategory
  name: string
  emoji: string
  slot?: 'scene' | 'specialDecor'
}

export const SPECIAL_LOOT: SpecialLootItem[] = [
  { id: 'dragon', category: 'avatar', name: 'Drache', emoji: '🐲' },
  { id: 'unicorn', category: 'avatar', name: 'Einhorn', emoji: '🦄' },
  { id: 'phoenix', category: 'avatar', name: 'Phönix', emoji: '🔥' },
  { id: 'wolf', category: 'avatar', name: 'Wolf', emoji: '🐺' },
  { id: 'hat_crown', category: 'hat', name: 'Goldene Krone', emoji: '👑' },
  { id: 'hat_wizard', category: 'hat', name: 'Zauberhut', emoji: '🧙' },
  { id: 'hat_halo', category: 'hat', name: 'Lichtring', emoji: '😇' },
  { id: 'outfit_space', category: 'outfit', name: 'Space-Anzug', emoji: '🚀' },
  { id: 'outfit_judge', category: 'outfit', name: 'Richterrobe', emoji: '⚖️' },
  { id: 'outfit_judge_royal', category: 'outfit', name: 'Festliche Richterrobe', emoji: '👩‍⚖️' },
  { id: 'arms_robot_silver', category: 'arms', name: 'Silberne Roboterarme', emoji: '🦾' },
  { id: 'arms_robot_gold', category: 'arms', name: 'Goldene Roboterarme', emoji: '⚙️' },
  { id: 'arms_robot_plasma', category: 'arms', name: 'Plasma-Roboterarme', emoji: '✨' },
  { id: 'wings_angel', category: 'wings', name: 'Engelsflügel', emoji: '🪽' },
  { id: 'wings_dragon', category: 'wings', name: 'Drachenflügel', emoji: '🐉' },
  { id: 'wings_phoenix', category: 'wings', name: 'Phönixflügel', emoji: '🔥' },
  { id: 'eyes_rose', category: 'eyes', name: 'Rosafarbene Augen', emoji: '🩷' },
  { id: 'eyes_gold', category: 'eyes', name: 'Goldene Augen', emoji: '🌟' },
  { id: 'eyes_red', category: 'eyes', name: 'Rubinrote Augen', emoji: '❤️' },
  { id: 'eyes_ice', category: 'eyes', name: 'Eisblaue Augen', emoji: '🧊' },
  { id: 'eyes_violet', category: 'eyes', name: 'Violette Augen', emoji: '💜' },
  { id: 'room_diploma', category: 'room', slot: 'specialDecor', name: 'Goldenes Abschluss-Diplom', emoji: '🎓' },
  { id: 'scene_space', category: 'room', slot: 'scene', name: 'Weltraum-Klassenzimmer', emoji: '🌌' },
  { id: 'scene_moon', category: 'room', slot: 'scene', name: 'Mondstation', emoji: '🌙' },
  { id: 'scene_sun', category: 'room', slot: 'scene', name: 'Sonnen-Terrasse', emoji: '☀️' },
  { id: 'scene_castle', category: 'room', slot: 'scene', name: 'Schloss-Bibliothek', emoji: '🏰' },
  { id: 'scene_aurora', category: 'room', slot: 'scene', name: 'Polarlicht-Lernraum', emoji: '🌠' },
]

export const LUCKBOX_PRICE = 300

export const DECOR_PRICES: Record<string, number> = {
  plant: 30,
  books: 45,
  lamp: 60,
  trophy: 100,
}

export const STORE_ITEMS: Record<string, { name: string; category: 'hat' | 'outfit' | 'wall' | 'floor' | 'decor'; price: number }> = {
  hat_cap: { name: 'Basecap', category: 'hat', price: 35 },
  outfit_hoodie: { name: 'Lern-Hoodie', category: 'outfit', price: 0 },
  outfit_robe: { name: 'Jura-Robe', category: 'outfit', price: 80 },
  outfit_scholar: { name: 'Gelehrten-Outfit', category: 'outfit', price: 110 },
  wall_indigo: { name: 'Indigo-Wand', category: 'wall', price: 0 },
  wall_mint: { name: 'Mint-Wand', category: 'wall', price: 45 },
  wall_rose: { name: 'Rosé-Wand', category: 'wall', price: 55 },
  wall_sunset: { name: 'Sonnenuntergang-Wand', category: 'wall', price: 75 },
  floor_oak: { name: 'Eichenparkett', category: 'floor', price: 0 },
  floor_carpet: { name: 'Samtteppich', category: 'floor', price: 55 },
  floor_marble: { name: 'Marmor', category: 'floor', price: 95 },
  floor_stars: { name: 'Sternenboden', category: 'floor', price: 130 },
  decor_plant: { name: 'Große Zimmerpflanze', category: 'decor', price: 35 },
  decor_bookshelf: { name: 'Bücherregal', category: 'decor', price: 70 },
  decor_lamp: { name: 'Lichterkette', category: 'decor', price: 45 },
  decor_trophy: { name: 'Team-Pokal', category: 'decor', price: 100 },
  decor_plush: { name: 'Fuchs-Plüschtier', category: 'decor', price: 65 },
}

export const FOCUS_MINUTES = [15, 25, 30, 45, 50]
export const REWARDS = { personalPerFocus: 25, teamPerFocus: 10, teamTogetherBonus: 5 }
export const ONLINE_WINDOW_MS = 2 * 60 * 1000
