"use client";

import React, { useState } from "react";
import { useGame } from "@/contexts/GameContext";
import NFTCard from "./NFTCard";

export default function Marketplace() {
  const { marketplace, buyNFT, user } = useGame();
  const [filter, setFilter] = useState<string>("all");

  const filteredListings = marketplace.filter((listing) => {
    if (filter === "all") return true;
    return listing.nft.rarity === filter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div
        className="flex justify-between items-center"
        style={{ flexWrap: "wrap", gap: "16px" }}
      >
        <h2
          className="text-2xl font-bold"
          style={{ color: "var(--color-primary)" }}
        >
          NFT Marketplace
        </h2>

        <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
          {["all", "legendary", "epic", "rare", "uncommon", "common"].map(
            (rarity) => (
              <button
                key={rarity}
                onClick={() => setFilter(rarity)}
                className="btn"
                style={{
                  padding: "8px 16px",
                  fontSize: "0.875rem",
                  background:
                    filter === rarity
                      ? "var(--color-primary)"
                      : "var(--color-surface)",
                  color: filter === rarity ? "white" : "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  boxShadow: filter === rarity ? "none" : "var(--shadow-soft)",
                }}
              >
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="text-center" style={{ padding: "80px 0" }}>
          <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🏪</div>
          <h3 className="text-xl font-bold mb-2">No listings found</h3>
          <p className="text-muted">
            {filter === "all"
              ? "Be the first to list an NFT!"
              : `No ${filter} NFTs available right now.`}
          </p>
        </div>
      ) : (
        <>
          <div className="text-sm text-muted">
            Showing {filteredListings.length} listing
            {filteredListings.length !== 1 ? "s" : ""}
          </div>

          <div className="grid-responsive">
            {filteredListings.map((listing, index) => (
              <NFTCard
                key={listing.nft.id}
                nft={listing.nft}
                price={listing.price}
                seller={listing.seller}
                onBuy={() => buyNFT(index)}
                showActions={user !== null && listing.seller !== user.address}
              />
            ))}
          </div>
        </>
      )}

      <div
        className="card"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <h3 className="text-xl font-bold mb-4">Marketplace Info</h3>
        <div
          className="grid-responsive"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          }}
        >
          <div>
            <span className="text-muted">Total Listings:</span>
            <p className="text-2xl font-bold">{marketplace.length}</p>
          </div>
          <div>
            <span className="text-muted">Trading Fee:</span>
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--color-secondary)" }}
            >
              2%
            </p>
          </div>
          <div>
            <span className="text-muted">Total Volume:</span>
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              {marketplace.reduce((sum, l) => sum + l.price, 0).toFixed(2)} SUI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
