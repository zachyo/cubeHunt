"use client";

import React, { useState } from "react";
import { GameProvider, useGame } from "@/contexts/GameContext";
import Header from "@/components/Header";
import CubeGrid from "@/components/CubeGrid";
import Marketplace from "@/components/Marketplace";
import Leaderboard from "@/components/Leaderboard";
import NFTCard from "@/components/NFTCard";

function GameContent() {
  const { cubes, revealCube, isLoading, user, revealingCubeId, listNFT } =
    useGame();
  const [activeTab, setActiveTab] = useState<"hunt" | "market">("hunt");

  const handleList = (nftId: string) => {
    const price = prompt("Enter price in SUI:");
    if (price && !isNaN(Number(price))) {
      listNFT(nftId, Number(price));
      alert("NFT listed successfully!");
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <main
        className="container"
        style={{ paddingTop: "80px", paddingBottom: "40px" }}
      >
        {/* Hero Section */}
        <div className="text-center" style={{ marginBottom: "40px" }}>
          <div style={{ marginBottom: "20px" }}>
            <span className="badge">🎮 Web3 Gaming • NFT Treasure Hunt</span>
          </div>

          <h1
            className="text-2xl"
            style={{
              fontSize: "3rem",
              marginBottom: "20px",
              color: "var(--color-primary)",
            }}
          >
            Hunt. Reveal. Own.
          </h1>

          <p
            className="text-lg text-muted"
            style={{ maxWidth: "600px", margin: "0 auto 40px" }}
          >
            Explore an infinite 100x100 grid of mystery cubes. Each reveal mints
            a unique NFT with rare traits.
            <br />
            <strong>Will you find the legendary cubes?</strong>
          </p>

          {/* Game HUD */}
          <div
            className="flex justify-center gap-4"
            style={{ flexWrap: "wrap", marginBottom: "40px" }}
          >
            <div className="card text-center" style={{ minWidth: "150px" }}>
              <div className="text-muted text-sm">Score</div>
              <div className="text-xl font-bold">
                {user?.score?.toLocaleString() || 0}
              </div>
            </div>
            <div className="card text-center" style={{ minWidth: "150px" }}>
              <div className="text-muted text-sm">Combo</div>
              <div
                className="text-xl font-bold"
                style={{
                  color:
                    user?.combo && user.combo > 1
                      ? "var(--color-accent)"
                      : "inherit",
                }}
              >
                x{user?.combo || 0}
              </div>
            </div>
            <div className="card text-center" style={{ minWidth: "150px" }}>
              <div className="text-muted text-sm">Revealed</div>
              <div
                className="text-xl font-bold"
                style={{ color: "var(--color-secondary)" }}
              >
                {cubes.filter((c) => c.revealed).length}
              </div>
            </div>
            <div className="card text-center" style={{ minWidth: "150px" }}>
              <div className="text-muted text-sm">Legendaries</div>
              <div
                className="text-xl font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                {
                  cubes.filter((c) => c.revealed && c.rarity === "legendary")
                    .length
                }{" "}
                / 50
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab("hunt")}
              className={`btn ${
                activeTab === "hunt" ? "btn-primary" : "btn-secondary"
              }`}
            >
              🎯 Start Hunting
            </button>

            <button
              onClick={() => setActiveTab("market")}
              className={`btn ${
                activeTab === "market" ? "btn-primary" : "btn-secondary"
              }`}
            >
              🏪 Marketplace
            </button>
          </div>
        </div>

        {activeTab === "hunt" ? (
          <div
            className="flex gap-8"
            style={{ alignItems: "flex-start", flexDirection: "column" }}
          >
            {/* Main Game Area */}
            <div style={{ width: "100%" }}>
              <div className="card">
                <div
                  className="flex justify-between items-center"
                  style={{ marginBottom: "20px" }}
                >
                  <h2 className="text-xl font-bold">The Grid</h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        background: "#4caf50",
                        borderRadius: "50%",
                        display: "inline-block",
                      }}
                    />
                    <span className="text-muted">Live</span>
                  </div>
                </div>
                <CubeGrid
                  cubes={cubes}
                  onCubeClick={revealCube}
                  isLoading={isLoading}
                  revealingCubeId={revealingCubeId}
                />
              </div>

              {/* User Collection Preview */}
              {user && user.nfts.length > 0 && (
                <div className="card" style={{ marginTop: "20px" }}>
                  <div
                    className="flex justify-between items-center"
                    style={{ marginBottom: "20px" }}
                  >
                    <h3 className="text-xl font-bold">🏆 Your Recent Finds</h3>
                    <span className="badge">{user.nfts.length} NFTs</span>
                  </div>
                  <div className="grid-responsive">
                    {user.nfts
                      .slice(-3)
                      .reverse()
                      .map((nft) => (
                        <NFTCard
                          key={nft.id}
                          nft={nft}
                          showActions={true}
                          onList={() => handleList(nft.id)}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              <Leaderboard />

              {/* Game Info Card */}
              <div
                className="card"
                style={{ background: "var(--color-secondary)", color: "white" }}
              >
                <h3 className="text-xl font-bold mb-4">📊 How It Works</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3 items-center">
                    <div className="circle-number">1</div>
                    <div>
                      <div className="font-bold">Connect Wallet</div>
                      <div style={{ opacity: 0.9 }}>
                        Link your Sui wallet to start hunting on the grid.
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="circle-number">2</div>
                    <div>
                      <div className="font-bold">Reveal Cubes</div>
                      <div style={{ opacity: 0.9 }}>
                        Click cubes to reveal them. You might find an NFT, a
                        trap, or a hint!
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="circle-number">3</div>
                    <div>
                      <div className="font-bold">Score & Luck</div>
                      <div style={{ opacity: 0.9 }}>
                        Points are saved automatically. High combos increase
                        your luck for the next reveal!
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rarity Guide */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4">💎 Rarity Guide</h3>
                <div className="flex flex-col gap-2">
                  <div className="rarity-row legendary">
                    <span>Legendary</span>
                    <span>0.5%</span>
                  </div>
                  <div className="rarity-row epic">
                    <span>Epic</span>
                    <span>1.5%</span>
                  </div>
                  <div className="rarity-row rare">
                    <span>Rare</span>
                    <span>8%</span>
                  </div>
                  <div className="rarity-row uncommon">
                    <span>Uncommon</span>
                    <span>20%</span>
                  </div>
                  <div className="rarity-row common">
                    <span>Common</span>
                    <span>70%</span>
                  </div>
                </div>
                <div className="text-xs text-muted mt-4 text-center">
                  * Probabilities can be boosted by in-game events and combos!
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <Marketplace />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          marginTop: "40px",
          padding: "40px 0",
        }}
      >
        <div className="container flex justify-between items-center">
          <div className="text-muted text-sm">
            © 2024 CubeHunt. Built on Sui Network.
          </div>
          <div className="flex gap-6 text-sm text-muted">
            <a href="#">Docs</a>
            <a href="#">Discord</a>
            <a href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
