# CubeHunt - OneHack 2.0 GameFi Edition

CubeHunt is a free-to-play, event-based NFT hunt game built for the OneHack 2.0 Hackathon. Players explore a massive procedural grid (10,000+ cubes) to uncover hidden dynamic NFTs via on-chain reveals.

![CubeHunt Demo](https://via.placeholder.com/800x400?text=CubeHunt+Gameplay)

## 🎮 Features

- **Procedural Cube Grid**: Explore a 100x100 grid with 10,000 unique positions.
- **Rarity System**: Find Common, Uncommon, Rare, Epic, and Legendary cubes.
- **Dynamic NFTs**: Each revealed cube mints a unique NFT with traits (color, pattern, animation).
- **Marketplace**: Trade your discovered NFTs with other players.
- **Live Events**: Compete in timed events for ONE token rewards.
- **Wallet Integration**: Seamless onboarding with OneWallet (simulated for demo).

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/cubehunt.git
   cd cubehunt/cubehunt-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Graphics**: HTML5 Canvas (for high-performance grid rendering)
- **State Management**: React Context API
- **Blockchain**: OneChain (Move L1) - _Mocked for MVP_

## 📖 How to Play

1. **Connect Wallet**: Click the "Connect Wallet" button in the top right.
2. **Hunt**: Click on unrevealed cubes (dark gray) in the grid.
3. **Reveal**: Confirm the transaction (simulated) to reveal the cube's contents.
4. **Collect**: If you find an NFT, it's added to your collection.
5. **Trade**: List your rare finds on the Marketplace or buy from others.
6. **Compete**: Check the Leaderboard to see your ranking in the current event.

## 🏗 Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── CubeGrid.tsx  # Canvas-based grid game
│   ├── Header.tsx    # Navigation & Wallet
│   ├── Leaderboard.tsx # Event rankings
│   ├── Marketplace.tsx # NFT trading interface
│   └── NFTCard.tsx   # NFT visualization
├── contexts/         # Global state (GameContext)
├── types/            # TypeScript definitions
└── utils/            # Helper functions (RNG, generation)
```

## 🏆 Hackathon Tracks

This project targets the **GameFi** track of OneHack 2.0, demonstrating:

- Innovative gameplay mechanics (Grid Hunt)
- Seamless Web3 onboarding (OneWallet)
- Composable NFT usage

## 📄 License

MIT
