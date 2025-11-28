"use client";

import React, { useState, useEffect } from "react";
import { useGame } from "@/contexts/GameContext";

export default function Leaderboard() {
  const { events } = useGame();
  const activeEvent = events.find((e) => e.active);
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!activeEvent) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = activeEvent.endTime - now;

      if (diff <= 0) {
        setTimeLeft("ENDED");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [activeEvent]);

  if (!activeEvent) {
    return (
      <div className="card">
        <h3 className="text-xl font-bold mb-2">No Active Events</h3>
        <p className="text-muted">Check back later for new hunting events!</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid var(--color-border)",
          background: "var(--color-bg)",
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold">{activeEvent.name}</h2>
          <span className="badge" style={{ background: "#4caf50" }}>
            LIVE
          </span>
        </div>
        <p className="text-muted text-sm mb-4">{activeEvent.description}</p>

        <div className="flex gap-4 text-sm">
          <div>
            <span className="text-muted">Prize Pool:</span>
            <span
              className="ml-2 font-bold"
              style={{ color: "var(--color-accent)" }}
            >
              {activeEvent.reward} ONE
            </span>
          </div>
          <div>
            <span className="text-muted">Ends in:</span>
            <span className="ml-2 font-mono">{timeLeft}</span>
          </div>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead
            style={{
              background: "rgba(0,0,0,0.02)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              color: "var(--color-text-light)",
            }}
          >
            <tr>
              <th style={{ padding: "12px 24px", textAlign: "left" }}>Rank</th>
              <th style={{ padding: "12px 24px", textAlign: "left" }}>
                Hunter
              </th>
              <th style={{ padding: "12px 24px", textAlign: "right" }}>
                Score
              </th>
              <th style={{ padding: "12px 24px", textAlign: "right" }}>
                Rares
              </th>
            </tr>
          </thead>
          <tbody>
            {activeEvent.leaderboard.map((entry) => (
              <tr
                key={entry.rank}
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <td style={{ padding: "16px 24px" }}>
                  <div
                    className="circle-number"
                    style={{
                      background:
                        entry.rank === 1
                          ? "#f6d860"
                          : entry.rank === 2
                          ? "#e0e0e0"
                          : entry.rank === 3
                          ? "#ff8e72"
                          : "transparent",
                      color: entry.rank <= 3 ? "white" : "inherit",
                      fontSize: "0.9rem",
                    }}
                  >
                    {entry.rank}
                  </div>
                </td>
                <td style={{ padding: "16px 24px", fontWeight: 500 }}>
                  {entry.user}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    textAlign: "right",
                    fontWeight: "bold",
                    color: "var(--color-primary)",
                  }}
                >
                  {entry.score}
                </td>
                <td
                  style={{
                    padding: "16px 24px",
                    textAlign: "right",
                    color: "var(--color-secondary)",
                  }}
                >
                  {entry.raresFound}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          padding: "16px",
          textAlign: "center",
          background: "rgba(0,0,0,0.02)",
        }}
      >
        <button
          style={{
            color: "var(--color-primary)",
            fontWeight: 600,
            fontSize: "0.875rem",
          }}
        >
          View Full Leaderboard →
        </button>
      </div>
    </div>
  );
}
