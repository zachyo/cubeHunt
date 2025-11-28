"use client";

import React, { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import NFTCard from "./NFTCard";

export default function MyNFTs() {
  const { user, listNFT } = useGame();
  const [selectedNFT, setSelectedNFT] = useState<string | null>(null);
  const [listingPrice, setListingPrice] = useState("");

  const handleListNFT = (nftId: string) => {
    setSelectedNFT(nftId);
  };

  const confirmListing = () => {
    if (selectedNFT && listingPrice && !isNaN(Number(listingPrice))) {
      listNFT(selectedNFT, Number(listingPrice));
      alert("NFT listed successfully!");
      setSelectedNFT(null);
      setListingPrice("");
    } else {
      alert("Please enter a valid price");
    }
  };

  if (!user) {
    return (
      <div className="card text-center" style={{ padding: "60px 20px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔐</div>
        <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
        <p className="text-muted">
          Connect your wallet to view and manage your NFTs
        </p>
      </div>
    );
  }

  const myNFTs = user.nfts || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div
        className="flex justify-between items-center"
        style={{ flexWrap: "wrap", gap: "16px" }}
      >
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: "var(--color-primary)" }}
          >
            My NFT Collection
          </h2>
          <p className="text-muted">
            {myNFTs.length} NFT{myNFTs.length !== 1 ? "s" : ""} owned
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
          <div
            className="card"
            style={{ padding: "12px 20px", minWidth: "120px" }}
          >
            <div className="text-xs text-muted">Total NFTs</div>
            <div className="text-xl font-bold">{myNFTs.length}</div>
          </div>
          <div
            className="card"
            style={{ padding: "12px 20px", minWidth: "120px" }}
          >
            <div className="text-xs text-muted">Rare+</div>
            <div
              className="text-xl font-bold"
              style={{ color: "var(--color-accent)" }}
            >
              {
                myNFTs.filter((n) =>
                  ["rare", "epic", "legendary"].includes(n.rarity)
                ).length
              }
            </div>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      {myNFTs.length === 0 ? (
        <div className="card text-center" style={{ padding: "80px 20px" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🎁</div>
          <h3 className="text-xl font-bold mb-2">No NFTs Yet</h3>
          <p className="text-muted" style={{ marginBottom: "24px" }}>
            Start hunting to reveal and mint your first NFT!
          </p>
          <a href="#hunt" className="btn btn-primary">
            🎯 Start Hunting
          </a>
        </div>
      ) : (
        <div className="grid-responsive">
          {myNFTs.map((nft) => (
            <div key={nft.id} style={{ position: "relative" }}>
              <NFTCard
                nft={nft}
                onList={() => handleListNFT(nft.id)}
                showActions={!nft.listed}
              />
            </div>
          ))}
        </div>
      )}

      {/* Listing Modal */}
      {selectedNFT && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setSelectedNFT(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: "400px",
              width: "100%",
              padding: "32px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">List NFT for Sale</h3>
            <p className="text-muted mb-4">
              Set a price for your NFT. Buyers will pay this amount in SUI.
            </p>

            <div style={{ marginBottom: "24px" }}>
              <label
                htmlFor="price"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                Price (SUI)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                className="input"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedNFT(null)}
                className="btn"
                style={{
                  flex: 1,
                  background: "var(--color-surface)",
                  color: "var(--color-text)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmListing}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                List NFT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
