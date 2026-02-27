import React, { useState } from "react";
import BackgroundWave from "./BackgroundWave"; // adjust import path

const waveOptions = [
  "hero",
  "cta-0",
  "cta-1",
  "cta-2",
  "cta-3",
  "portfolio",
  "services",
  "footer",
];

const WaveDemo = () => {
  const [activeEffect, setActiveEffect] = useState("hero");
  const [isMenuOpen] = useState(false); // set to false if not using a menu
  const [progress] = useState(0); // 0–100, can be changed for testing
  const [isWaveOn] = useState(true); // wave enabled

  const handleChange = (e) => {
    setActiveEffect(e.target.value);
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Dropdown positioned in the top-left corner */}
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 10 }}>
        <select
          value={activeEffect}
          onChange={handleChange}
          style={{
            padding: "8px 12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            background: "rgba(255,255,255,0.9)",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {waveOptions.map((effect) => (
            <option key={effect} value={effect}>
              {effect}
            </option>
          ))}
        </select>
      </div>

      {/* The wave canvas */}
      <BackgroundWave
        isMenuOpen={isMenuOpen}
        activeEffect={activeEffect}
        progress={progress}
        isWaveOn={isWaveOn}
      />
    </div>
  );
};

export default WaveDemo;
