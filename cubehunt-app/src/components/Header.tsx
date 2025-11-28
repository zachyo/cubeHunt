"use client";

import React from "react";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import "../app/header-mobile.css";

export default function Header() {
  const currentAccount = useCurrentAccount();

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-soft)",
      }}
    >
      <div className="container">
        <div
          className="flex justify-between items-center header-content"
          style={{ height: "80px" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div
              style={{
                width: "40px",
                height: "40px",
                background: "var(--color-primary)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              C
            </div>
            <div className="logo-text">
              <span
                className="text-xl font-bold"
                style={{ color: "var(--color-text)" }}
              >
                CubeHunt
              </span>
              <div className="text-sm text-muted" style={{ lineHeight: 1 }}>
                On Sui
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8 header-nav">
            <a href="#hunt" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              Hunt
            </a>
            <a href="#market" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
              Marketplace
            </a>
            <a
              href="#leaderboard"
              style={{ fontWeight: 600, fontSize: "0.9rem" }}
            >
              Leaderboard
            </a>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {currentAccount ? (
              <div
                className="wallet-info"
                style={{
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  borderRadius: "30px",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex flex-col items-end">
                  <span
                    className="wallet-status"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-light)",
                    }}
                  >
                    Connected
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: "bold" }}>
                    {currentAccount.address.slice(0, 6)}...
                    {currentAccount.address.slice(-4)}
                  </span>
                </div>
                <div
                  className="wallet-avatar"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "var(--color-secondary)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                  }}
                >
                  {currentAccount.address.slice(2, 4).toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="connect-wallet-wrapper">
                <ConnectButton className="btn btn-primary" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
