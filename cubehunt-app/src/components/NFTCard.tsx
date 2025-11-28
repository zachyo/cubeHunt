"use client";

import React from "react";
import { NFT } from "@/types";
import { getRarityGradient } from "@/utils/cubeGenerator";

interface NFTCardProps {
  nft: NFT;
  onList?: () => void;
  onUnlist?: () => void;
  onBuy?: () => void;
  showActions?: boolean;
}

export default function NFTCard({
  nft,
  onList,
  onUnlist,
  onBuy,
  showActions = true,
}: NFTCardProps) {
  const rarityGradient = getRarityGradient(nft.rarity);

  return (
    <div className="group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
      {/* NFT Visual */}
      <div
        className={`h-48 bg-gradient-to-br ${rarityGradient} relative overflow-hidden`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`w-32 h-32 rounded-lg ${
              nft.traits.glow ? "animate-pulse" : ""
            }`}
            style={{
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
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            )}
            {nft.traits.pattern === "dotted" && (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "10px 10px",
                  opacity: 0.3,
                }}
              />
            )}
            {nft.traits.pattern === "gradient" && (
              <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent" />
            )}
          </div>
        </div>

        {/* Rarity Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-xs font-bold uppercase rounded-full border border-white/20">
            {nft.rarity}
          </span>
        </div>

        {/* Glow Indicator */}
        {nft.traits.glow && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-yellow-500/80 text-black text-xs font-bold rounded-full">
              ✨ Glow
            </span>
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div className="p-4 space-y-3">
        <h3 className="text-white font-bold text-lg truncate">{nft.name}</h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-400">Pattern:</span>
            <p className="text-white font-medium capitalize">
              {nft.traits.pattern}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Animation:</span>
            <p className="text-white font-medium capitalize">
              {nft.traits.animation}
            </p>
          </div>
        </div>

        {nft.price !== undefined && (
          <div className="pt-2 border-t border-gray-800">
            <span className="text-gray-400 text-xs">Price:</span>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
              {nft.price} ONE
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="pt-2 space-y-2">
            {!nft.listed && onList && (
              <button
                onClick={onList}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                List for Sale
              </button>
            )}

            {nft.listed && onUnlist && (
              <button
                onClick={onUnlist}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
              >
                Unlist
              </button>
            )}

            {onBuy && (
              <button
                onClick={onBuy}
                className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                Buy Now
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
