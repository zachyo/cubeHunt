"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { Cube, NFT, User, Event, MarketListing } from "@/types";
import { generateCubeGrid, generateNFT } from "@/utils/cubeGenerator";
import { PACKAGE_ID, GAME_STATE_ID, MODULE_NAME, GAS_BUDGET } from "@/config";

interface GameContextType {
  user: User | null;
  cubes: Cube[];
  events: Event[];
  marketplace: MarketListing[];
  isLoading: boolean;
  revealCube: (cubeId: number) => Promise<void>;
  listNFT: (nftId: string, price: number) => void;
  buyNFT: (listingIndex: number) => void;
  unlistNFT: (nftId: string) => void;
  revealingCubeId: number | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [cubes, setCubes] = useState<Cube[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [marketplace, setMarketplace] = useState<MarketListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [revealingCubeId, setRevealingCubeId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Initialize Grid (Visuals)
  useEffect(() => {
    const generatedCubes = generateCubeGrid(); // Base grid
    setCubes(generatedCubes);
    setIsLoading(false);
  }, []);

  // Fetch Game State and Marketplace from Chain
  useEffect(() => {
    if (!client || GAME_STATE_ID === "0x0") return;

    const fetchGameState = async () => {
      try {
        // 1. Fetch Global Game State (Bitmap)
        const gameState = await client.getObject({
          id: GAME_STATE_ID,
          options: { showContent: true },
        });

        if (gameState.data?.content?.dataType === "moveObject") {
          const fields = gameState.data.content.fields as any;
          const bitmap = fields.revealed_bitmap as number[];

          // Update cubes based on bitmap
          setCubes((prev) => {
            const newCubes = [...prev];
            newCubes.forEach((cube) => {
              const byteIndex = Math.floor(cube.id / 8);
              const bitOffset = cube.id % 8;
              const byte = bitmap[byteIndex] || 0;
              const isRevealed = ((byte >> bitOffset) & 1) === 1;
              if (isRevealed) {
                cube.revealed = true;
              }
            });
            return newCubes;
          });
        }

        // 2. Fetch Marketplace Listings
        // We query for NFTListed events to find the ListingWrapper IDs.
        const listingEvents = await client.queryEvents({
          query: { MoveModule: { package: PACKAGE_ID, module: MODULE_NAME } },
          limit: 50,
          order: "descending",
        });

        // Filter for NFTListed events
        const listedEvents = listingEvents.data.filter((e) =>
          e.type.includes("::NFTListed")
        );

        // Extract listing IDs
        const listingIds = listedEvents.map(
          (e) => (e.parsedJson as any).listing_id
        );

        // Fetch the actual ListingWrapper objects
        // Note: Some might be sold/deleted, so we need to handle nulls
        if (listingIds.length > 0) {
          const listingObjects = await client.multiGetObjects({
            ids: listingIds,
            options: { showContent: true },
          });

          const activeListings: MarketListing[] = [];

          listingObjects.forEach((obj) => {
            if (obj.data?.content?.dataType === "moveObject") {
              const fields = obj.data.content.fields as any;
              // The NFT is wrapped inside.
              // Note: In Move, wrapping a struct puts it in the fields.
              // The `nft` field will contain the CubeNFT struct fields.
              const nftFields = fields.nft.fields;

              activeListings.push({
                id: obj.data.objectId, // This is the ListingWrapper ID
                seller: fields.seller,
                price: Number(fields.price) / 1e9, // Convert MIST to SUI
                nft: {
                  id: fields.nft.fields.id.id, // Inner ID
                  name: `Cube #${nftFields.x},${nftFields.y}`,
                  rarity: nftFields.rarity,
                  traits: {
                    color: nftFields.color,
                    pattern: nftFields.pattern,
                    glow: nftFields.glow,
                    animation: nftFields.animation,
                  },
                  mintedAt: Number(nftFields.minted_at),
                  owner: fields.seller, // Technically owned by listing, but seller listed it
                  listed: true,
                },
              });
            }
          });

          setMarketplace(activeListings);
        } else {
          setMarketplace([]);
        }
      } catch (e) {
        console.error("Failed to fetch game state:", e);
      }
    };

    fetchGameState();
    const interval = setInterval(fetchGameState, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [client]);

  // Fetch User Data
  useEffect(() => {
    if (!currentAccount) {
      setUser(null);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch owned CubeNFTs
        const objects = await client.getOwnedObjects({
          owner: currentAccount.address,
          filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::CubeNFT` },
          options: { showContent: true, showDisplay: true },
        });

        const nfts: NFT[] = objects.data.map((obj) => {
          const fields = (obj.data?.content as any)?.fields;
          return {
            id: obj.data?.objectId || "",
            name: `Cube #${fields?.x},${fields?.y}`, // Fallback name
            rarity: fields?.rarity || "common",
            traits: {
              color: fields?.color || "#000",
              pattern: fields?.pattern || "solid",
              glow: fields?.glow || false,
              animation: fields?.animation || "none",
            },
            mintedAt: Number(fields?.minted_at || Date.now()),
            owner: currentAccount.address,
            listed: false,
          };
        });

        // Fetch Balance
        const balance = await client.getBalance({
          owner: currentAccount.address,
        });

        // Load saved game state
        const savedScore = parseInt(
          localStorage.getItem(`score_${currentAccount.address}`) || "0"
        );
        const savedCombo = parseInt(
          localStorage.getItem(`combo_${currentAccount.address}`) || "0"
        );
        const savedMaxCombo = parseInt(
          localStorage.getItem(`maxCombo_${currentAccount.address}`) || "0"
        );

        setUser({
          address: currentAccount.address,
          name: "Hunter", // Could fetch from a profile contract
          nfts,
          cubesRevealed: nfts.length, // Approximation
          raresFound: nfts.filter((n) => n.rarity !== "common").length,
          balance: Number(balance.totalBalance) / 1e9, // Convert MIST to SUI
          score: savedScore,
          combo: savedCombo,
          maxCombo: savedMaxCombo,
        });
      } catch (e) {
        console.error("Failed to fetch user data:", e);
      }
    };

    fetchUserData();
  }, [currentAccount, client]);

  const updateUserScore = (points: number, resetCombo: boolean = false) => {
    if (!user) return;

    setUser((prev) => {
      if (!prev) return null;
      const newCombo = resetCombo ? 0 : prev.combo + 1;
      const comboMultiplier = 1 + newCombo * 0.1; // 10% bonus per combo
      const scoreToAdd = Math.floor(points * comboMultiplier);
      const newScore = prev.score + scoreToAdd;
      const newMaxCombo = Math.max(prev.maxCombo, newCombo);

      // Persist
      localStorage.setItem(`score_${prev.address}`, newScore.toString());
      localStorage.setItem(`combo_${prev.address}`, newCombo.toString());
      localStorage.setItem(`maxCombo_${prev.address}`, newMaxCombo.toString());

      return {
        ...prev,
        score: newScore,
        combo: newCombo,
        maxCombo: newMaxCombo,
      };
    });
  };

  const revealEmptyNeighbors = (startCube: Cube, currentCubes: Cube[]) => {
    const queue = [startCube];
    const visited = new Set([startCube.id]);
    const revealedIds: number[] = [];

    while (queue.length > 0) {
      const cube = queue.shift()!;
      revealedIds.push(cube.id);

      if (cube.neighborCount === 0) {
        // Add neighbors
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = cube.x + dx;
            const ny = cube.y + dy;
            if (nx >= 0 && nx < 100 && ny >= 0 && ny < 100) {
              const neighborId = ny * 100 + nx;
              const neighbor = currentCubes[neighborId];
              if (
                neighbor &&
                !neighbor.revealed &&
                !visited.has(neighborId) &&
                neighbor.type !== "nft" &&
                neighbor.type !== "trap"
              ) {
                visited.add(neighborId);
                queue.push(neighbor);
              }
            }
          }
        }
      }
    }
    return revealedIds;
  };

  const revealCube = async (cubeId: number) => {
    if (!currentAccount) {
      alert("Please connect your wallet first!");
      return;
    }

    const cube = cubes[cubeId];
    if (cube.revealed) return;

    setRevealingCubeId(cubeId);
    setIsLoading(true);

    try {
      if (cube.type === "nft") {
        // Contract Call for NFTs
        const tx = new Transaction();
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::reveal_cube`,
          arguments: [
            tx.object(GAME_STATE_ID),
            tx.object("0x6"), // Clock object
            tx.pure.u64(cube.x),
            tx.pure.u64(cube.y),
          ],
        });

        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: (result: any) => {
              console.log("Reveal success:", result);
              setCubes((prev) => {
                const newCubes = [...prev];
                if (newCubes[cubeId]) {
                  newCubes[cubeId].revealed = true;
                }
                return newCubes;
              });

              // Calculate points based on rarity
              const points = {
                common: 100,
                uncommon: 200,
                rare: 500,
                epic: 1000,
                legendary: 5000,
              }[cube.rarity];

              updateUserScore(points);
            },
            onError: (err) => {
              console.error("Reveal failed:", err);
              alert("Transaction failed: " + err.message);
            },
          }
        );
      } else if (cube.type === "trap") {
        // Trap Logic
        setCubes((prev) => {
          const newCubes = [...prev];
          newCubes[cubeId].revealed = true;
          return newCubes;
        });
        updateUserScore(-50, true); // Reset combo, deduct points
        alert("BOOM! You hit a trap!");
      } else {
        // Empty/Hint Logic
        setCubes((prev) => {
          const newCubes = [...prev];
          newCubes[cubeId].revealed = true;

          // Recursive reveal if 0 neighbors
          if (cube.neighborCount === 0) {
            const idsToReveal = revealEmptyNeighbors(cube, newCubes);
            idsToReveal.forEach((id) => {
              newCubes[id].revealed = true;
            });
            updateUserScore(10 * idsToReveal.length);
          } else {
            updateUserScore(10);
          }

          return newCubes;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setRevealingCubeId(null);
    }
  };

  const listNFT = async (nftId: string, price: number) => {
    if (!currentAccount) return;

    const tx = new Transaction();
    const priceInMist = price * 1e9;

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::list_nft`,
      arguments: [tx.object(nftId), tx.pure.u64(priceInMist)],
    });

    signAndExecuteTransaction({ transaction: tx });
  };

  const buyNFT = async (listingIndex: number) => {
    if (!currentAccount) return;

    const listing = marketplace[listingIndex];
    if (!listing) return;

    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(listing.price * 1e9)]);

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::buy_nft`,
      arguments: [
        tx.object(listing.id), // ListingWrapper ID
        coin,
      ],
    });

    signAndExecuteTransaction(
      { transaction: tx },
      {
        onSuccess: () => {
          alert("NFT Bought successfully!");
          // Optimistically remove from marketplace
          setMarketplace((prev) => prev.filter((_, i) => i !== listingIndex));
        },
        onError: (e: Error) => {
          console.error("Buy failed", e);
          alert("Failed to buy NFT: " + e.message);
        },
      }
    );
  };

  const unlistNFT = async (nftId: string) => {
    // Needs listing object ID, not NFT ID.
    // Would need to query listings to find the one wrapping this NFT.
  };

  return (
    <GameContext.Provider
      value={{
        user,
        cubes,
        events,
        marketplace,
        isLoading,
        revealCube,
        listNFT,
        buyNFT,
        unlistNFT,
        revealingCubeId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
