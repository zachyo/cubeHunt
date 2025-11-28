"use client";

import React from "react";
import { NFT } from "@/types";
import { getRarityGradient } from "@/utils/cubeGenerator";

interface NFTCardProps {
  nft: NFT;
  price?: number;
  seller?: string;
  onList?: () => void;
  onUnlist?: () => void;
  onBuy?: () => void;
  showActions?: boolean;
}

export default function NFTCard({
  nft,
  price,
  seller,
  onList,
  onUnlist,
  onBuy,
  showActions = true,
}: NFTCardProps) {
  const rarityGradient = getRarityGradient(nft.rarity);

  // Extract coordinates from NFT name (format: "Cube #X,Y")
  const coordinates = nft.name.match(/#(\d+),(\d+)/);
  const x = coordinates ? coordinates[1] : "?";
  const y = coordinates ? coordinates[2] : "?";

  // Truncate address for display
  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(to bottom right, #111827, #000000)",
        border: "1px solid #1f2937",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.3s",
      }}
    >
      {/* NFT Visual */}
      <div
        style={{
          height: "192px",
          background: `linear-gradient(to bottom right, ${
            rarityGradient.includes("purple")
              ? "#7c3aed, #db2777"
              : rarityGradient.includes("blue")
              ? "#3b82f6, #1d4ed8"
              : rarityGradient.includes("yellow")
              ? "#f59e0b, #d97706"
              : rarityGradient.includes("green")
              ? "#10b981, #059669"
              : "#6b7280, #4b5563"
          })`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "128px",
              height: "128px",
              borderRadius: "8px",
              backgroundColor: nft.traits.color,
              boxShadow: nft.traits.glow
                ? `0 0 30px ${nft.traits.color}`
                : "none",
              animation:
                nft.traits.animation !== "none"
                  ? `${nft.traits.animation} 3s infinite`
                  : "none",
            }}
          >
            {nft.traits.pattern === "striped" && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)",
                }}
              />
            )}
            {nft.traits.pattern === "dotted" && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                  opacity: 0.3,
                }}
              />
            )}
            {nft.traits.pattern === "gradient" && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to bottom right, rgba(255,255,255,0.3), transparent)",
                }}
              />
            )}
          </div>
        </div>

        {/* Rarity Badge */}
        <div style={{ position: "absolute", top: "8px", right: "8px" }}>
          <span
            style={{
              padding: "4px 12px",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              borderRadius: "9999px",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
            }}
          >
            {nft.rarity}
          </span>
        </div>

        {/* Glow Indicator */}
        {nft.traits.glow && (
          <div style={{ position: "absolute", top: "8px", left: "8px" }}>
            <span
              style={{
                padding: "4px 8px",
                background: "rgba(234, 179, 8, 0.8)",
                color: "black",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "9999px",
              }}
            >
              ✨ Glow
            </span>
          </div>
        )}

        {/* Coordinates Badge */}
        <div style={{ position: "absolute", bottom: "8px", left: "8px" }}>
          <span
            style={{
              padding: "4px 8px",
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              fontSize: "12px",
              fontFamily: "monospace",
              borderRadius: "4px",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
            }}
          >
            📍 ({x}, {y})
          </span>
        </div>
      </div>

      {/* NFT Info */}
      <div style={{ padding: "16px" }}>
        <h3
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: "12px",
          }}
        >
          {nft.name}
        </h3>

        {/* Traits Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
            fontSize: "12px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              background: "rgba(31, 41, 55, 0.5)",
              borderRadius: "4px",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ color: "#9ca3af", fontSize: "11px" }}>Color</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "2px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  backgroundColor: nft.traits.color,
                }}
              />
              <span
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: "10px",
                }}
              >
                {nft.traits.color}
              </span>
            </div>
          </div>
          <div
            style={{
              background: "rgba(31, 41, 55, 0.5)",
              borderRadius: "4px",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ color: "#9ca3af", fontSize: "11px" }}>Pattern</span>
            <p
              style={{
                color: "white",
                fontWeight: "500",
                textTransform: "capitalize",
                margin: 0,
              }}
            >
              {nft.traits.pattern}
            </p>
          </div>
          <div
            style={{
              background: "rgba(31, 41, 55, 0.5)",
              borderRadius: "4px",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ color: "#9ca3af", fontSize: "11px" }}>
              Animation
            </span>
            <p
              style={{
                color: "white",
                fontWeight: "500",
                textTransform: "capitalize",
                margin: 0,
              }}
            >
              {nft.traits.animation}
            </p>
          </div>
          <div
            style={{
              background: "rgba(31, 41, 55, 0.5)",
              borderRadius: "4px",
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ color: "#9ca3af", fontSize: "11px" }}>Minted</span>
            <p
              style={{
                color: "white",
                fontWeight: "500",
                fontSize: "10px",
                margin: 0,
              }}
            >
              {new Date(nft.mintedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Price Display */}
        {price !== undefined && (
          <div
            style={{
              paddingTop: "12px",
              borderTop: "1px solid #1f2937",
              marginTop: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "4px",
              }}
            >
              <span style={{ color: "#9ca3af", fontSize: "12px" }}>Price</span>
              {seller && (
                <span
                  style={{
                    color: "#6b7280",
                    fontSize: "10px",
                    fontFamily: "monospace",
                  }}
                >
                  {truncateAddress(seller)}
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                background: "linear-gradient(to right, #c084fc, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: 0,
              }}
            >
              {price.toFixed(2)} SUI
            </p>
          </div>
        )}

        {/* Legacy price from NFT object (for backward compatibility) */}
        {price === undefined && nft.price !== undefined && (
          <div
            style={{
              paddingTop: "12px",
              borderTop: "1px solid #1f2937",
              marginTop: "12px",
            }}
          >
            <span style={{ color: "#9ca3af", fontSize: "12px" }}>Price</span>
            <p
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                background: "linear-gradient(to right, #c084fc, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                margin: 0,
              }}
            >
              {nft.price.toFixed(2)} SUI
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div
            style={{
              paddingTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {!nft.listed && onList && (
              <button
                onClick={onList}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "linear-gradient(to right, #9333ea, #db2777)",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #7e22ce, #be185d)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(147, 51, 234, 0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #9333ea, #db2777)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
              >
                🏷️ List for Sale
              </button>
            )}

            {nft.listed && onUnlist && (
              <button
                onClick={onUnlist}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "#374151",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#4b5563";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#374151";
                }}
              >
                ❌ Unlist
              </button>
            )}

            {onBuy && (
              <button
                onClick={onBuy}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "linear-gradient(to right, #059669, #10b981)",
                  color: "white",
                  fontWeight: "600",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #047857, #059669)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(16, 185, 129, 0.5)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, #059669, #10b981)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
                }}
              >
                💰 Buy Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
