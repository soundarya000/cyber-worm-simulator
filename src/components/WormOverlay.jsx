import React from "react";
import "./wormOverlay.css"; // Optional: move worm-specific styles here

export default function WormOverlay({ currentPath }) {
  if (!currentPath) return null;

  return (
    <div className="worm-overlay">
      <div className="worm">
        🐛 <span className="trail">~</span> Infecting:{" "}
        <code>{currentPath}</code>
      </div>
    </div>
  );
}
