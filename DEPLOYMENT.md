# 🚀 CubeHunt Deployment & Next Steps Guide

This guide will walk you through deploying your CubeHunt game to the Sui network and configuring the frontend to make it fully functional.

## 1. Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js & npm:** (v18 or later)
- **Sui CLI:** Required to deploy the smart contract.
  - **Recommended (Binary):** Run this command to install the binary directly (saves disk space):
    ```bash
    wget https://github.com/MystenLabs/sui/releases/download/testnet-v1.37.2/sui-testnet-v1.37.2-ubuntu-x86_64.tgz
    tar -xvzf sui-testnet-v1.37.2-ubuntu-x86_64.tgz
    sudo mv sui /usr/local/bin/
    sui --version
    ```
  - **Alternative (Source):** `cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui` (Requires ~20GB free space)
- **Sui Wallet:** You need a wallet with testnet SUI tokens for gas fees.

## 2. Setting up your Wallet

To deploy from your own wallet (e.g., the one you use in your browser), you need to import it into the Sui CLI.

1.  **Export your Private Key:**

    - Open your Sui Wallet extension.
    - Go to **Settings** -> **Export Private Key**.
    - Copy the key (starts with `suiprivkey...`).

2.  **Import into CLI:**

    ```bash
    sui keytool import "YOUR_PRIVATE_KEY_HERE" ed25519
    ```

    _(Note: Replace `ed25519` with `secp256k1` if your wallet uses that scheme, but most Sui wallets are ed25519)._

    **Important:** After importing, check the output for the `alias` (e.g., `wizardly-agates`) or the address. You must switch to this address:

    ```bash
    sui client switch --address <YOUR_IMPORTED_ADDRESS_OR_ALIAS>
    ```

3.  **Switch to Testnet:**
    Ensure you are connected to the correct network (assuming "onechain" refers to deploying **on-chain** to Sui Testnet):

    ```bash
    sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
    sui client switch --env testnet
    ```

4.  **Fund your Wallet:**
    Make sure your address has SUI tokens. You can request them from the [Sui Testnet Faucet](https://discord.gg/sui) or use the wallet extension's "Request Testnet SUI" button.

## 2.1. Deploying on Devnet (Optional)

If you prefer to use **Devnet** instead of Testnet:

1.  **Switch CLI to Devnet:**

    ```bash
    sui client new-env --alias devnet --rpc https://fullnode.devnet.sui.io:443
    sui client switch --env devnet
    ```

2.  **Update `contracts/Move.toml`:**
    Change the dependency revision:

    ```toml
    [dependencies]
    Sui = { ..., rev = "framework/devnet" }
    ```

3.  **Update `src/config.ts`:**
    Set `export const NETWORK = "devnet";`

4.  **Get Devnet Tokens:**
    Use the `#devnet-faucet` channel in the [Sui Discord](https://discord.gg/sui).

## 3. Deploying the Smart Contract

1.  **Navigate to the contracts directory:**

    ```bash
    cd contracts
    ```

2.  **Build the Move contract:**

    ```bash
    sui move build
    ```

3.  **Publish to Sui Testnet:**

    ```bash
    sui client publish --gas-budget 100000000 --skip-dependency-verification
    ```

4.  **Save the Output:**
    After a successful deployment, the console will output details. Look for:

    - **Package ID:** The ID of your deployed package.
    - **GameState Object ID:** The ID of the `GameState` shared object created in the `init` function.

    **Copy these IDs carefully.**

## 3. Configuring the Frontend

1.  **Open the config file:**
    `cubehunt-app/src/config.ts`

2.  **Update IDs:**
    Replace the placeholder `0x0` values with your actual deployed IDs:

    ```typescript
    export const PACKAGE_ID =
      process.env.NEXT_PUBLIC_PACKAGE_ID || "YOUR_DEPLOYED_PACKAGE_ID";
    export const GAME_STATE_ID =
      process.env.NEXT_PUBLIC_GAME_STATE_ID || "YOUR_GAME_STATE_OBJECT_ID";
    ```

    _Tip: For better security and flexibility, create a `.env.local` file in the `cubehunt-app` directory and set these as environment variables:_

    ```env
    NEXT_PUBLIC_PACKAGE_ID=0x...
    NEXT_PUBLIC_GAME_STATE_ID=0x...
    ```

## 4. Running the Frontend

1.  **Navigate to the app directory:**

    ```bash
    cd cubehunt-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Your game is now running at `http://localhost:3000`.

## 5. Next Steps for Full Functionality

To take this from a demo to a production-ready dApp, consider implementing the following:

### 🔗 Blockchain Integration

- **Marketplace Logic:** Implement the `buyNFT` and `unlistNFT` functions in `GameContext.tsx`. This requires querying on-chain `ListingWrapper` objects.
- **Indexer:** For a robust leaderboard and marketplace, consider using a Sui Indexer to track events (`CubeRevealed`, `NFTListed`, `NFTSold`) efficiently instead of relying solely on direct RPC calls.

### 🎨 UI/UX Enhancements

- **Wallet Feedback:** Add more visual feedback during transaction signing and processing.
- **User Profiles:** Allow users to set a username or avatar stored on-chain or in a database.

### 🚀 Production Deployment

- **Build:** Run `npm run build` to create a production-optimized build.
- **Host:** Deploy your frontend to Vercel, Netlify, or your preferred hosting provider. Remember to set your environment variables in the hosting dashboard.
