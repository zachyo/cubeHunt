# 🎮 CubeHunt - Web3 NFT Treasure Hunt

<div align="center">

![CubeHunt Banner](https://img.shields.io/badge/Built%20on-Sui%20Network-4DA2FF?style=for-the-badge)
![Move](https://img.shields.io/badge/Smart%20Contracts-Move-000000?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

**An innovative GameFi experience where exploration meets blockchain**

[Live Demo](#) • [Documentation](./DEPLOYMENT.md) • [Smart Contracts](./contracts)

</div>

---

## 🌟 Overview

CubeHunt transforms NFT discovery into an engaging treasure hunt game. Players explore a massive 100x100 grid containing 10,000 unique positions, revealing mystery cubes that mint dynamic NFTs with rare traits directly on the Sui blockchain.

### ✨ What Makes CubeHunt Special?

- **🎯 True On-Chain Gaming**: Every cube reveal is a blockchain transaction that mints a verifiable NFT
- **💎 Dynamic Rarity System**: Five rarity tiers with procedurally-generated traits
- **🏪 Decentralized Marketplace**: Trade your discoveries peer-to-peer with SUI tokens
- **⚡ Gas-Efficient Design**: Bitmap storage manages 10,000 cubes in just 1,250 bytes
- **🎨 Premium UI/UX**: Smooth Canvas-based rendering with modern design aesthetics

---

## 🎮 How to Play

1. **Connect Wallet** - Link your Sui wallet to start hunting
2. **Explore the Grid** - Click on unrevealed cubes (dark gray squares)
3. **Reveal & Mint** - Confirm the transaction to reveal what's inside
4. **Collect NFTs** - Discover NFTs with unique traits and rarities
5. **Trade** - List your rare finds on the marketplace or buy from others
6. **Compete** - Climb the leaderboard with high scores and combos

### 🎲 Rarity Distribution

| Rarity           | Probability | Special Effects        |
| ---------------- | ----------- | ---------------------- |
| 🌟 **Legendary** | 0.5%        | Glow + Pulse Animation |
| 💜 **Epic**      | 1.5%        | Glow + Float Animation |
| 💙 **Rare**      | 8%          | Glow Effect            |
| 💚 **Uncommon**  | 20%         | Enhanced Colors        |
| ⚪ **Common**    | 70%         | Standard Traits        |

---

## 🏗️ Architecture

### Frontend Stack

```
cubehunt-app/
├── src/
│   ├── app/              # Next.js 14 App Router
│   │   ├── page.tsx      # Main game interface
│   │   ├── layout.tsx    # Root layout with providers
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── CubeGrid.tsx  # Canvas-based grid renderer
│   │   ├── Header.tsx    # Navigation & wallet
│   │   ├── Marketplace.tsx # NFT trading interface
│   │   ├── Leaderboard.tsx # Rankings display
│   │   ├── MyNFTs.tsx    # User collection
│   │   └── NFTCard.tsx   # NFT visualization
│   ├── contexts/         # State management
│   │   └── GameContext.tsx # Game state & blockchain logic
│   ├── types/            # TypeScript definitions
│   │   └── index.ts      # Type definitions
│   ├── utils/            # Helper functions
│   │   └── cubeGenerator.ts # RNG & trait generation
│   └── config.ts         # Blockchain configuration
```

### Smart Contract Architecture

```move
module cube_hunt::game {
    // Core Structures
    struct GameState { ... }      // Shared object managing grid state
    struct CubeNFT { ... }        // NFT with coordinates & traits
    struct ListingWrapper { ... } // Marketplace listing

    // Main Functions
    public entry fun reveal_cube(...)    // Mint NFT on reveal
    public entry fun list_nft(...)       // Create marketplace listing
    public entry fun buy_nft(...)        // Purchase listed NFT
    public entry fun cancel_listing(...) // Remove listing
}
```

**Key Technical Innovations:**

1. **Bitmap State Management**: Uses a 1,250-byte vector to track 10,000 cube states efficiently
2. **On-Chain Randomness**: Combines timestamp, coordinates, and epoch for deterministic trait generation
3. **Shared Object Pattern**: GameState is shared for concurrent access without ownership conflicts
4. **Event-Driven Design**: Emits events for indexer integration and real-time updates

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Sui CLI ([Installation Guide](https://docs.sui.io/build/install))
- Sui Wallet with testnet SUI tokens

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/cubeHunt.git
   cd cubeHunt
   ```

2. **Install frontend dependencies**

   ```bash
   cd cubehunt-app
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Deploying Smart Contracts

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**

```bash
cd contracts
sui move build
sui client publish --gas-budget 100000000 --skip-dependency-verification
```

After deployment, update `cubehunt-app/src/config.ts` with your Package ID and GameState ID.

---

## 🔧 Configuration

Create a `.env.local` file in `cubehunt-app/`:

```env
NEXT_PUBLIC_PACKAGE_ID=0x...
NEXT_PUBLIC_GAME_STATE_ID=0x...
NEXT_PUBLIC_NETWORK=testnet
```

Or directly edit `src/config.ts`:

```typescript
export const PACKAGE_ID = "0xYOUR_PACKAGE_ID";
export const GAME_STATE_ID = "0xYOUR_GAME_STATE_ID";
export const NETWORK = "testnet"; // or "devnet"
```

---

## 📊 Smart Contract Details

### GameState Structure

- **revealed_bitmap**: Efficient bitmap tracking (1 bit per cube)
- **admin**: Contract administrator address
- **balance**: Accumulated SUI from game fees (future feature)

### CubeNFT Traits

Each NFT contains:

- **Coordinates** (x, y): Unique grid position
- **Rarity**: legendary, epic, rare, uncommon, common
- **Color**: 5 vibrant color schemes
- **Pattern**: solid, striped, dotted, gradient
- **Glow**: Boolean for rare+ NFTs
- **Animation**: pulse, float, or none
- **Minted At**: Timestamp for provenance

### Events

```move
struct CubeRevealed { finder, x, y, rarity, nft_id }
struct NFTListed { seller, nft_id, listing_id, price }
struct NFTSold { seller, buyer, nft_id, price }
```

---

## 🎯 Roadmap

### Phase 1: Core Gameplay ✅

- [x] Grid exploration mechanics
- [x] On-chain NFT minting
- [x] Wallet integration
- [x] Score & combo system

### Phase 2: Marketplace ✅

- [x] List NFT functionality
- [x] Buy NFT with SUI
- [x] Cancel listing
- [x] Real-time marketplace updates

### Phase 3: Enhanced Features 🚧

- [ ] Sui Indexer integration for efficient queries
- [ ] Timed events with token rewards
- [ ] User profiles (on-chain usernames/avatars)
- [ ] Advanced rarity boosting mechanics

### Phase 4: Social & Competitive 📋

- [ ] Multi-player competitive modes
- [ ] Guild/team features
- [ ] Achievement system
- [ ] Referral rewards

---

## 🛠️ Development

### Build for Production

```bash
cd cubehunt-app
npm run build
npm start
```

### Run Tests

```bash
# Smart contract tests
cd contracts
sui move test

# Frontend tests (if implemented)
cd cubehunt-app
npm test
```

### Code Quality

```bash
# Lint
npm run lint

# Type check
npm run type-check
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Sui Network** - For the blazing-fast blockchain infrastructure
- **Mysten Labs** - For excellent developer tools and documentation
- **OneHack 2.0** - For the opportunity to build innovative GameFi

---

## 📞 Contact & Links

- **Demo**: [Live Application](#)
- **Documentation**: [Deployment Guide](./DEPLOYMENT.md)
- **Twitter**: [@YourHandle](#)
- **Discord**: [Join Community](#)

---

<div align="center">

**Built with ❤️ for the Web3 Gaming Community**

⭐ Star this repo if you find it interesting!

</div>
