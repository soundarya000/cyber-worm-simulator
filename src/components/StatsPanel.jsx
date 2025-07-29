import React from "react";

export default function StatsPanel({ infectedCount, totalFiles }) {
  return (
    <div className="stats">
      <p>
        📊 Infected: {infectedCount} / {totalFiles}
      </p>
      <p>🐛 Worms active!</p>
    </div>
  );
}
