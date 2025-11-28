export interface Cube {
  id: number;
  x: number;
  y: number;
  revealed: boolean;
  nft?: NFT;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  type: "nft" | "empty" | "trap";
  neighborCount?: number; // For empty cubes: number of adjacent NFTs/Traps
}

export interface NFT {
  id: string;
  name: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  traits: {
    color: string;
    pattern: string;
    glow: boolean;
    animation: string;
  };
  mintedAt: number;
  owner: string;
  price?: number;
  listed: boolean;
}

export interface User {
  address: string;
  name: string;
  avatar?: string;
  nfts: NFT[];
  cubesRevealed: number;
  raresFound: number;
  balance: number;
  score: number;
  combo: number;
  maxCombo: number;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  startTime: number;
  endTime: number;
  active: boolean;
  reward: number;
  leaderboard: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  user: string;
  score: number;
  raresFound: number;
}

export interface MarketListing {
  id: string; // ListingWrapper ID
  nft: NFT;
  price: number;
  seller: string;
  listedAt?: number;
}
