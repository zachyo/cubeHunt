import { Cube, NFT } from "@/types";

// Seeded random number generator for procedural generation
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}

export const GRID_SIZE = 100; // 100x100 = 10,000 cubes
export const TOTAL_CUBES = GRID_SIZE * GRID_SIZE;

// Rarity probabilities
const RARITY_WEIGHTS = {
  common: 0.7, // 70%
  uncommon: 0.2, // 20%
  rare: 0.08, // 8%
  epic: 0.015, // 1.5%
  legendary: 0.005, // 0.5%
};

const COLORS = {
  common: ["#6B7280", "#9CA3AF", "#D1D5DB"],
  uncommon: ["#10B981", "#34D399", "#6EE7B7"],
  rare: ["#3B82F6", "#60A5FA", "#93C5FD"],
  epic: ["#8B5CF6", "#A78BFA", "#C4B5FD"],
  legendary: ["#F59E0B", "#FBBF24", "#FCD34D", "#FFD700"],
};

const PATTERNS = [
  "solid",
  "striped",
  "dotted",
  "gradient",
  "crystalline",
  "nebula",
];
const ANIMATIONS = ["pulse", "rotate", "float", "shimmer", "none"];

export function generateCubeGrid(
  seed: number = Date.now(),
  luckFactor: number = 1.0
): Cube[] {
  const rng = new SeededRandom(seed);
  const cubes: Cube[] = [];

  // 1. Generate base cubes
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const id = y * GRID_SIZE + x;
      const rand = rng.next();

      let type: "nft" | "empty" | "trap";
      if (rand > 0.8) {
        type = "nft"; // 20% chance of NFT
      } else if (rand < 0.05) {
        type = "trap"; // 5% chance of Trap
      } else {
        type = "empty"; // 75% chance of Empty/Hint
      }

      // Rarity only matters for NFTs, but we assign it generally for color/visuals
      const rarity = determineRarity(rng.next(), luckFactor);

      cubes.push({
        id,
        x,
        y,
        revealed: false,
        rarity,
        type,
      });
    }
  }

  // 2. Calculate neighbor counts for empty cells
  // We count adjacent NFTs and Traps as "points of interest"
  const getCube = (x: number, y: number) => {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return null;
    return cubes[y * GRID_SIZE + x];
  };

  for (const cube of cubes) {
    if (cube.type === "empty") {
      let count = 0;
      // Check all 8 neighbors
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const neighbor = getCube(cube.x + dx, cube.y + dy);
          if (
            neighbor &&
            (neighbor.type === "nft" || neighbor.type === "trap")
          ) {
            count++;
          }
        }
      }
      cube.neighborCount = count;
    }
  }

  return cubes;
}

function determineRarity(
  random: number,
  luckFactor: number = 1.0
): "common" | "uncommon" | "rare" | "epic" | "legendary" {
  let cumulative = 0;

  // Clone and adjust weights based on luck
  // Higher luck factor = higher chance for rare items
  // We reduce common weight and distribute it to others
  const weights = { ...RARITY_WEIGHTS };

  if (luckFactor > 1.0) {
    const boost = luckFactor - 1.0; // e.g. 1.5 -> 0.5 boost
    weights.legendary *= 1 + boost * 2; // Legendaries get double boost
    weights.epic *= 1 + boost * 1.5;
    weights.rare *= 1 + boost;
    weights.uncommon *= 1 + boost * 0.5;

    // Recalculate common to ensure sum is ~1 (normalization not strictly needed for this simple logic but good for correctness)
    // Actually, simpler approach: just check thresholds.
    // If we increase weights, the cumulative sum exceeds 1, but that's fine as long as we check in order.
    // However, our loop checks `random <= cumulative`. If weights increase, cumulative increases faster.
    // So `common` (first) needs to be checked LAST or we need to invert the logic.
    // The current logic checks: common, then uncommon, etc.
    // Wait, RARITY_WEIGHTS order matters.
    // The original object key order is not guaranteed in JS, but usually insertion order.
    // Let's be explicit.
  }

  // Explicit check order: Legendary -> Epic -> Rare -> Uncommon -> Common
  // This makes it easier to boost high tiers.

  if (random < weights.legendary) return "legendary";
  if (random < weights.legendary + weights.epic) return "epic";
  if (random < weights.legendary + weights.epic + weights.rare) return "rare";
  if (
    random <
    weights.legendary + weights.epic + weights.rare + weights.uncommon
  )
    return "uncommon";

  return "common";
}

export function generateNFT(
  cubeId: number,
  rarity: string,
  owner: string
): NFT {
  const rng = new SeededRandom(cubeId);
  const colors = COLORS[rarity as keyof typeof COLORS];
  const color = colors[Math.floor(rng.next() * colors.length)];
  const pattern = PATTERNS[Math.floor(rng.next() * PATTERNS.length)];
  const animation = ANIMATIONS[Math.floor(rng.next() * ANIMATIONS.length)];
  const glow = rarity === "epic" || rarity === "legendary" || rng.next() > 0.7;

  return {
    id: `NFT-${cubeId}-${Date.now()}`,
    name: `${rarity.charAt(0).toUpperCase() + rarity.slice(1)} Cube #${cubeId}`,
    rarity: rarity as NFT["rarity"],
    traits: {
      color,
      pattern,
      glow,
      animation,
    },
    mintedAt: Date.now(),
    owner,
    listed: false,
  };
}

export function getRarityColor(rarity: string): string {
  const colors = {
    common: "#6B7280",
    uncommon: "#10B981",
    rare: "#3B82F6",
    epic: "#8B5CF6",
    legendary: "#F59E0B",
  };
  return colors[rarity as keyof typeof colors] || colors.common;
}

export function getRarityGradient(rarity: string): string {
  const gradients = {
    common: "from-gray-500 to-gray-600",
    uncommon: "from-green-500 to-emerald-600",
    rare: "from-blue-500 to-blue-700",
    epic: "from-purple-500 to-violet-700",
    legendary: "from-yellow-400 via-orange-500 to-amber-600",
  };
  return gradients[rarity as keyof typeof gradients] || gradients.common;
}
