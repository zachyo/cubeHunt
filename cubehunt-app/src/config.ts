export const NETWORK = "testnet";

// Replace these with your deployed contract addresses
export const PACKAGE_ID =
  process.env.NEXT_PUBLIC_PACKAGE_ID ||
  "0xae027f8324f2d0d8310f380bfba686cb7b071184d61a59a6a134f3520635fcf7";
export const GAME_STATE_ID =
  process.env.NEXT_PUBLIC_GAME_STATE_ID ||
  "0x64ee9446caec7ec000da8a5177a4a9b22a0bd494ec92167f98d2ffff4d5b04a1";
export const MODULE_NAME = "game";

export const GAS_BUDGET = 10000000; // 0.01 SUI
