"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Cube } from "@/types";
import { getRarityColor } from "@/utils/cubeGenerator";

interface CubeGridProps {
  cubes: Cube[];
  onCubeClick: (cubeId: number) => void;
  isLoading: boolean;
  revealingCubeId?: number | null;
}

const CUBE_SIZE = 40;
const CUBE_GAP = 2;
const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 600;

export default function CubeGrid({
  cubes,
  onCubeClick,
  isLoading,
  revealingCubeId,
}: CubeGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCube, setHoveredCube] = useState<number | null>(null);
  const [selectedCube, setSelectedCube] = useState<Cube | null>(null);
  const animationRef = useRef<number | null>(null);
  const [animFrame, setAnimFrame] = useState(0);

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas - Light Theme Background
    ctx.fillStyle = "#fdfbf7";
    ctx.fillRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);

    // Calculate visible range
    const startX = Math.max(0, Math.floor(-offset.x / (CUBE_SIZE + CUBE_GAP)));
    const endX = Math.min(
      100,
      Math.ceil((-offset.x + VIEWPORT_WIDTH) / (CUBE_SIZE + CUBE_GAP))
    );
    const startY = Math.max(0, Math.floor(-offset.y / (CUBE_SIZE + CUBE_GAP)));
    const endY = Math.min(
      100,
      Math.ceil((-offset.y + VIEWPORT_HEIGHT) / (CUBE_SIZE + CUBE_GAP))
    );

    // Draw cubes
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const cubeIndex = y * 100 + x;
        const cube = cubes[cubeIndex];
        if (!cube) continue;

        const posX = offset.x + x * (CUBE_SIZE + CUBE_GAP);
        const posY = offset.y + y * (CUBE_SIZE + CUBE_GAP);

        // Skip if outside viewport
        if (
          posX + CUBE_SIZE < 0 ||
          posX > VIEWPORT_WIDTH ||
          posY + CUBE_SIZE < 0 ||
          posY > VIEWPORT_HEIGHT
        ) {
          continue;
        }

        // Draw cube
        if (cube.revealed) {
          if (cube.type === "nft" && cube.nft) {
            // Revealed cube with NFT
            const color = cube.nft.traits.color;
            ctx.fillStyle = color;
            ctx.fillRect(posX, posY, CUBE_SIZE, CUBE_SIZE);

            // Glow effect for rare cubes
            if (cube.nft.traits.glow) {
              ctx.shadowBlur = 10;
              ctx.shadowColor = color;
              ctx.strokeStyle = color;
              ctx.lineWidth = 2;
              ctx.strokeRect(posX, posY, CUBE_SIZE, CUBE_SIZE);
              ctx.shadowBlur = 0;
            }

            // Border
            ctx.strokeStyle = "rgba(0,0,0,0.1)";
            ctx.lineWidth = 1;
            ctx.strokeRect(posX, posY, CUBE_SIZE, CUBE_SIZE);
          } else if (cube.type === "trap") {
            // Trap
            ctx.fillStyle = "#ffebee"; // Light Red
            ctx.fillRect(posX, posY, CUBE_SIZE, CUBE_SIZE);
            ctx.fillStyle = "#ef4444";
            ctx.font = "24px serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("💣", posX + CUBE_SIZE / 2, posY + CUBE_SIZE / 2);

            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 2;
            ctx.strokeRect(posX, posY, CUBE_SIZE, CUBE_SIZE);
          } else {
            // Empty / Hint
            ctx.fillStyle = "#ffffff"; // White
            ctx.fillRect(posX, posY, CUBE_SIZE, CUBE_SIZE);

            if (cube.neighborCount && cube.neighborCount > 0) {
              const colors = [
                "#60a5fa",
                "#34d399",
                "#f87171",
                "#a78bfa",
                "#fbbf24",
                "#f472b6",
                "#333",
                "#333",
              ];
              ctx.fillStyle = colors[cube.neighborCount - 1] || "#333";
              ctx.font = "bold 20px monospace";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(
                cube.neighborCount.toString(),
                posX + CUBE_SIZE / 2,
                posY + CUBE_SIZE / 2
              );
            }

            ctx.strokeStyle = "#e0e0e0";
            ctx.lineWidth = 1;
            ctx.strokeRect(posX, posY, CUBE_SIZE, CUBE_SIZE);
          }
        } else {
          // Unrevealed cube - Light Theme
          // const baseColor = getRarityColor(cube.rarity); // Maybe use this for border or subtle tint?
          // For now, let's keep them uniform light grey to be "quiet"

          ctx.fillStyle = cube.id === hoveredCube ? "#d6d6d6" : "#eeeeee";
          ctx.fillRect(posX, posY, CUBE_SIZE, CUBE_SIZE);

          // Border
          ctx.strokeStyle = cube.id === hoveredCube ? "#bbb" : "#e0e0e0";
          ctx.lineWidth = cube.id === hoveredCube ? 2 : 1;
          ctx.strokeRect(posX, posY, CUBE_SIZE, CUBE_SIZE);

          // Question mark for unrevealed
          if (cube.id === hoveredCube && cube.id !== revealingCubeId) {
            ctx.fillStyle = "#888";
            ctx.font = "bold 20px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("?", posX + CUBE_SIZE / 2, posY + CUBE_SIZE / 2);
          }

          // Revealing animation
          if (cube.id === revealingCubeId) {
            const time = Date.now() / 200;
            const alpha = (Math.sin(time) + 1) / 2; // 0 to 1

            // Scanning effect
            ctx.fillStyle = `rgba(255, 142, 114, ${alpha * 0.5})`; // Primary color pulse
            ctx.fillRect(posX, posY, CUBE_SIZE, CUBE_SIZE);

            ctx.strokeStyle = `rgba(255, 142, 114, ${0.5 + alpha * 0.5})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(posX, posY, CUBE_SIZE, CUBE_SIZE);
          }
        }
      }
    }

    // Draw grid info
    ctx.fillStyle = "#888";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(
      `Offset: (${Math.round(offset.x)}, ${Math.round(offset.y)})`,
      10,
      20
    );
    ctx.fillText(`Visible: ${(endX - startX) * (endY - startY)} cubes`, 10, 35);
  }, [cubes, offset, hoveredCube, revealingCubeId]);

  useEffect(() => {
    drawGrid();

    if (revealingCubeId !== null && revealingCubeId !== undefined) {
      animationRef.current = requestAnimationFrame(() => {
        setAnimFrame((prev) => prev + 1);
      });
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawGrid, revealingCubeId, animFrame]);

  const getCubeAtPosition = (x: number, y: number): number | null => {
    const gridX = Math.floor((-offset.x + x) / (CUBE_SIZE + CUBE_GAP));
    const gridY = Math.floor((-offset.y + y) / (CUBE_SIZE + CUBE_GAP));

    if (gridX < 0 || gridX >= 100 || gridY < 0 || gridY >= 100) {
      return null;
    }

    return gridY * 100 + gridX;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else {
      const cubeId = getCubeAtPosition(x, y);
      setHoveredCube(cubeId);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isLoading) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cubeId = getCubeAtPosition(x, y);

    if (cubeId !== null) {
      const cube = cubes[cubeId];
      if (cube && !cube.revealed) {
        setSelectedCube(cube);
        onCubeClick(cubeId);
      } else if (cube && cube.revealed) {
        setSelectedCube(cube);
      }
    }
  };

  return (
    <div
      className="relative"
      style={{ overflow: "hidden", borderRadius: "var(--radius-lg)" }}
    >
      <canvas
        ref={canvasRef}
        width={VIEWPORT_WIDTH}
        height={VIEWPORT_HEIGHT}
        style={{
          border: "2px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          cursor: isDragging ? "grabbing" : "grab",
          background: "var(--color-bg)",
          width: "100%",
          maxWidth: "100%",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      />

      {selectedCube && (
        <div
          className="card"
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "300px",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            onClick={() => setSelectedCube(null)}
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              fontSize: "1.2rem",
              color: "var(--color-text-light)",
            }}
          >
            ✕
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                background: selectedCube.revealed
                  ? "var(--color-bg)"
                  : "var(--color-secondary)",
                border: "1px solid var(--color-border)",
              }}
            >
              {selectedCube.revealed
                ? selectedCube.type === "nft"
                  ? "💎"
                  : selectedCube.type === "trap"
                  ? "💣"
                  : selectedCube.neighborCount
                : "?"}
            </div>
            <div>
              <h3 className="text-lg font-bold">Cube #{selectedCube.id}</h3>
              <p className="text-sm text-muted">
                Position ({selectedCube.x}, {selectedCube.y})
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {selectedCube.revealed ? (
              <>
                <div
                  style={{
                    padding: "12px",
                    background: "var(--color-bg)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <div className="text-xs text-muted uppercase mb-1">
                    Status
                  </div>
                  <div
                    className="font-bold text-lg"
                    style={{
                      color:
                        selectedCube.type === "nft"
                          ? "var(--color-primary)"
                          : selectedCube.type === "trap"
                          ? "red"
                          : "var(--color-secondary)",
                    }}
                  >
                    {selectedCube.type === "nft"
                      ? "NFT Minted!"
                      : selectedCube.type === "trap"
                      ? "Trap Triggered!"
                      : "Sector Scanned"}
                  </div>
                </div>

                {selectedCube.type === "nft" && selectedCube.nft && (
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Rarity</span>
                      <span
                        className="font-bold capitalize"
                        style={{ color: getRarityColor(selectedCube.rarity) }}
                      >
                        {selectedCube.rarity}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Pattern</span>
                      <span className="capitalize">
                        {selectedCube.nft.traits.pattern}
                      </span>
                    </div>
                  </div>
                )}

                {selectedCube.type === "empty" && (
                  <div className="text-sm text-muted">
                    {selectedCube.neighborCount === 0
                      ? "Safe sector. No signals nearby."
                      : `Detected ${selectedCube.neighborCount} signal${
                          selectedCube.neighborCount === 1 ? "" : "s"
                        } nearby!`}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p
                  className="font-medium mb-2"
                  style={{ color: "var(--color-primary)" }}
                >
                  Ready to Reveal?
                </p>
                <p className="text-xs text-muted">
                  Clicking this cube will attempt to mint an NFT or scan the
                  sector.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2" style={{ marginTop: "16px" }}>
        <button
          onClick={() => setOffset({ x: 0, y: 0 })}
          className="btn btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.875rem" }}
        >
          Reset View
        </button>
        <button
          onClick={() => setOffset({ x: -2000, y: -2000 })}
          className="btn btn-secondary"
          style={{ padding: "8px 16px", fontSize: "0.875rem" }}
        >
          Center Grid
        </button>
      </div>

      <div className="mt-2 text-xs text-muted">
        💡 Drag to pan • Click unrevealed cubes to mint NFTs • 10,000 total
        cubes
      </div>
    </div>
  );
}
