export const AVATAR_PRICES: Record<string, number> = {
  fox: 0, owl: 40, cat: 60, panda: 80, person: 100,
  dragon: 180, unicorn: 220, phoenix: 260, wolf: 150,
}

export const DECOR_PRICES: Record<string, number> = { plant: 30, books: 45, lamp: 60, trophy: 100 }

export const STORE_ITEMS: Record<string, { name: string; category: 'hat' | 'outfit' | 'wall' | 'floor' | 'decor'; price: number }> = {
  hat_cap: { name: 'Basecap', category: 'hat', price: 35 },
  hat_crown: { name: 'Krone', category: 'hat', price: 120 },
  hat_wizard: { name: 'Zauberhut', category: 'hat', price: 90 },
  hat_halo: { name: 'Lichtring', category: 'hat', price: 180 },
  outfit_hoodie: { name: 'Lern-Hoodie', category: 'outfit', price: 0 },
  outfit_robe: { name: 'Jura-Robe', category: 'outfit', price: 80 },
  outfit_space: { name: 'Space-Anzug', category: 'outfit', price: 140 },
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
