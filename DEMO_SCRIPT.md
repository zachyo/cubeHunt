# 🎬 CubeHunt - 3 Minute Demo Script

**Total Time: 3:00 minutes**

---

## 🎯 Demo Objective

Showcase CubeHunt's core gameplay loop, blockchain integration, and marketplace functionality in a compelling, easy-to-follow demonstration.

---

## ⏱️ Timeline Breakdown

### **[0:00 - 0:30] Introduction & Hook (30 seconds)**

**Script:**

> "Welcome to CubeHunt - a Web3 treasure hunt game built on Sui blockchain. Imagine exploring a massive grid of 10,000 mystery cubes, where each discovery mints a unique NFT with rare traits, all happening on-chain in real-time. Let me show you how it works."

**Actions:**

1. Open the application at `localhost:3000`
2. Show the landing page with the hero section
3. Highlight the game stats: Score, Combo, Revealed count, Legendaries counter
4. Point to the "Hunt. Reveal. Own." tagline

**Key Talking Points:**

- 100x100 grid = 10,000 unique positions
- Five rarity tiers from Common to Legendary
- Every reveal is an on-chain transaction

---

### **[0:30 - 1:15] Wallet Connection & First Reveal (45 seconds)**

**Script:**

> "First, I'll connect my Sui wallet. This is a real blockchain transaction - not a simulation. Watch what happens when I reveal my first cube."

**Actions:**

1. Click "Connect Wallet" in the header
2. Select your Sui wallet and approve connection
3. Show the wallet address appearing in the header
4. Click "🎯 Start Hunting" button
5. Click on an unrevealed cube (dark gray) in the grid
6. Wait for wallet popup and approve the transaction
7. Show the reveal animation and NFT minting

**Key Talking Points:**

- "The wallet connection uses Sui's dApp Kit for seamless integration"
- "Each cube reveal calls our Move smart contract's `reveal_cube` function"
- "Notice the transaction confirmation - this is a real blockchain interaction"
- "The NFT traits are generated on-chain using coordinates and timestamp"

**What to Highlight:**

- Loading state during transaction
- Score increase after reveal
- NFT appearing in "Your Recent Finds" section
- Rarity badge on the NFT card

---

### **[1:15 - 2:00] NFT Collection & Traits (45 seconds)**

**Script:**

> "Let me reveal a few more cubes to show the variety of traits. Each NFT has unique characteristics - color, pattern, glow effects, and animations - all determined by on-chain randomness."

**Actions:**

1. Reveal 2-3 more cubes in quick succession
2. Click "🎨 My NFTs" tab
3. Show the full collection view
4. Hover over different NFTs to show their details
5. Point out different rarities and traits

**Key Talking Points:**

- "Each NFT stores its grid coordinates (x, y) permanently"
- "Rarity affects visual traits: Legendary NFTs have glow and pulse animations"
- "The smart contract uses a bitmap to track which cubes are revealed - super gas efficient"
- "Notice the combo multiplier increasing - this affects your score"

**What to Highlight:**

- Different colors: Gold, Purple, Blue, Green, Gray
- Different patterns: Solid, Striped, Dotted, Gradient
- Rarity distribution in your collection
- Minted timestamp on each NFT

---

### **[2:00 - 2:40] Marketplace Demo (40 seconds)**

**Script:**

> "Now for the marketplace. I can list any NFT for sale, and other players can buy it with SUI tokens. This is a fully decentralized peer-to-peer marketplace."

**Actions:**

1. From "My NFTs" view, click "List for Sale" on one of your NFTs
2. Enter a price (e.g., "0.5 SUI")
3. Approve the transaction
4. Click "🏪 Marketplace" tab
5. Show your listed NFT appearing in the marketplace
6. Point out other listings (if any)
7. Show the "Buy" and "Details" buttons

**Key Talking Points:**

- "Listing wraps the NFT in a shared object called ListingWrapper"
- "The NFT is held in escrow until someone buys it or I cancel"
- "Buyers pay in SUI tokens - the payment goes directly to the seller"
- "No intermediary fees - true peer-to-peer trading"

**What to Highlight:**

- Price display in SUI
- Seller address (truncated)
- NFT traits visible in marketplace
- Real-time marketplace updates

---

### **[2:40 - 3:00] Technical Highlights & Closing (20 seconds)**

**Script:**

> "Under the hood, CubeHunt uses Move smart contracts on Sui with bitmap state management for gas efficiency. The entire 10,000-cube grid state fits in just 1,250 bytes. All game logic is on-chain, transparent, and verifiable. Thanks for watching!"

**Actions:**

1. Quickly show the leaderboard
2. Scroll to show the "How It Works" section
3. Point to the Rarity Guide
4. Show footer with "Built on Sui Network"

**Key Talking Points:**

- "Built with Next.js 14 and TypeScript"
- "Move smart contracts for all game logic"
- "HTML5 Canvas for smooth grid rendering"
- "Event-driven architecture for real-time updates"

---

## 🎥 Pro Tips for Recording

### Before Recording:

- [ ] Clear browser cache and cookies
- [ ] Have Sui wallet funded with testnet SUI
- [ ] Pre-approve wallet connection to save time
- [ ] Close unnecessary browser tabs
- [ ] Set browser zoom to 100%
- [ ] Test audio levels

### During Recording:

- [ ] Speak clearly and at a moderate pace
- [ ] Use cursor highlighting or zoom for important UI elements
- [ ] Pause briefly after each major action for visual clarity
- [ ] Show transaction confirmations but don't dwell on them
- [ ] Keep energy high and enthusiasm genuine

### Camera/Screen Setup:

- [ ] Record in 1920x1080 or higher
- [ ] Use screen recording software (OBS, Loom, etc.)
- [ ] Consider picture-in-picture for personal touch
- [ ] Ensure good lighting if showing face
- [ ] Use a quality microphone

---

## 🎬 Alternative 3-Minute Script (Faster Pace)

If you need to condense or have technical issues, use this backup timeline:

**[0:00-0:20]** Quick intro + show landing page  
**[0:20-1:00]** Connect wallet + reveal 1 cube  
**[1:00-1:40]** Reveal 2 more cubes + show collection  
**[1:40-2:30]** List NFT + show marketplace  
**[2:30-3:00]** Technical highlights + close

---

## 📝 Backup Talking Points

If you have extra time or need to fill gaps:

- **On Gas Efficiency**: "Traditional games store everything off-chain. CubeHunt proves you can have rich gameplay entirely on-chain with smart design."

- **On Randomness**: "We use pseudo-randomness combining timestamp, coordinates, and blockchain epoch. For production, we'd integrate Sui's VRF."

- **On Scalability**: "The bitmap approach means we could scale to millions of cubes without significant gas increases."

- **On Future Features**: "We're planning timed events, guild battles, and token rewards for competitive play."

---

## 🚨 Troubleshooting During Demo

**If wallet won't connect:**

- Refresh page and try again
- Show the code in `GameContext.tsx` that handles connection
- Explain the Sui dApp Kit integration

**If transaction fails:**

- Check wallet has sufficient SUI
- Explain gas budget concept
- Show the Move contract's `reveal_cube` function

**If grid doesn't load:**

- Refresh and show it's a Canvas element
- Explain the rendering optimization
- Show the `CubeGrid.tsx` component

**If marketplace is empty:**

- List one of your own NFTs first
- Explain the shared object pattern
- Show the `ListingWrapper` struct in Move code

---

## 🎯 Key Messages to Emphasize

1. **Real Blockchain Integration** - Not a mock, actual Sui transactions
2. **Gas Efficiency** - Bitmap storage innovation
3. **On-Chain Randomness** - Verifiable trait generation
4. **Decentralized Marketplace** - No intermediaries
5. **Premium UX** - Web3 can be beautiful and smooth

---

## 📊 Success Metrics

Your demo is successful if viewers understand:

- ✅ What CubeHunt is (NFT treasure hunt game)
- ✅ How it works (reveal cubes → mint NFTs → trade)
- ✅ Why it's innovative (on-chain logic, gas efficiency)
- ✅ The technical stack (Sui, Move, Next.js)

---

## 🎬 Post-Demo Actions

After recording:

1. Edit for clarity (cut long pauses, failed attempts)
2. Add captions for accessibility
3. Include GitHub link in description
4. Add timestamps in video description
5. Export in multiple formats (MP4, WebM)

---

**Good luck with your demo! 🚀**

_Remember: Enthusiasm is contagious. If you're excited about CubeHunt, your audience will be too!_
