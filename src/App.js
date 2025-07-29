import React, { useState, useEffect, useRef } from "react";
import FileNode from "./components/FileNode";
import WormOverlay from "./components/WormOverlay";
import LearningPanel from "./components/LearningPanel";
import { fetchTree } from "./services/api";
import "./App.css";

// Flatten file structure
function collectFiles(node, list = []) {
  if (node.type === "file") {
    list.push(node);
  } else if (node.children) {
    node.children.forEach((child) => collectFiles(child, list));
  }
  return list;
}

// Risk scoring
function getRiskScore(fileName) {
  const ext = fileName.split(".").pop();
  const riskMap = { exe: 5, docx: 4, js: 3, txt: 1 };
  return riskMap[ext] || 2;
}

const SIZE_THRESHOLD_MB = 3;
const BLOCK_PROBABILITY = 0.15;
const STEALTH_SKIP_PROBABILITY = 0.2;

function App() {
  const [teachingMode, setTeachingMode] = useState(false);
  const [smartMode, setSmartMode] = useState(false);
  const [treeData, setTreeData] = useState(null);
  const [infectedFiles, setInfectedFiles] = useState([]);
  const [currentInfectionIndex, setCurrentInfectionIndex] = useState(-1);
  const [infectionRunning, setInfectionRunning] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [trailLog, setTrailLog] = useState([]);
  const [infectionEnded, setInfectionEnded] = useState(false);

  const zapSound = useRef(null);
  const infectionIndexRef = useRef(0);

  useEffect(() => {
    zapSound.current = new Audio("/infection.mp3");
  }, []);

  useEffect(() => {
    if (!infectionRunning && zapSound.current) {
      zapSound.current.pause();
      zapSound.current.currentTime = 0;
    }
  }, [infectionRunning]);

  useEffect(() => {
    fetchTree()
      .then((data) => setTreeData(data))
      .catch((err) => console.error("Error fetching tree:", err));
  }, []);

  function logTrail(action, file) {
    setTrailLog((prev) => [
      ...prev,
      {
        action,
        name: file.name,
        sizeMB: file.sizeMB,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }

  useEffect(() => {
    if (treeData && infectionRunning && intervalId === null) {
      let files = collectFiles(treeData);
      const smartFilteringActive = smartMode && !teachingMode;

      if (smartFilteringActive) {
        files = files.sort(
          (a, b) => getRiskScore(b.name) - getRiskScore(a.name)
        );
      }

      let i = infectionIndexRef.current;

      const id = setInterval(() => {
        while (i < files.length) {
          const file = files[i];

          if (!teachingMode) {
            if (
              smartFilteringActive &&
              file.sizeMB !== undefined &&
              file.sizeMB > SIZE_THRESHOLD_MB
            ) {
              logTrail("skipped-large", file);
              i++;
              infectionIndexRef.current = i;
              continue;
            }

            if (
              smartFilteringActive &&
              Math.random() < STEALTH_SKIP_PROBABILITY
            ) {
              logTrail("skipped-stealth", file);
              i++;
              infectionIndexRef.current = i;
              continue;
            }

            if (Math.random() < BLOCK_PROBABILITY) {
              logTrail("blocked", file);
              i++;
              infectionIndexRef.current = i;
              continue;
            }
          }

          file.infected = true;
          logTrail("infected", file);
          setTreeData({ ...treeData });
          setInfectedFiles((prev) => [...prev, file.name]);
          setCurrentInfectionIndex(i);
          infectionIndexRef.current = i + 1;

          if (zapSound.current) {
            zapSound.current.pause();
            zapSound.current.currentTime = 0;
            zapSound.current.play().catch(() => {});
          }

          break;
        }

        if (i >= files.length) {
          clearInterval(id);
          setInfectionRunning(false);
          setInfectionEnded(true);
          setIntervalId(null);
          infectionIndexRef.current = 0;
        } else {
          i++;
        }
      }, 2200);

      setIntervalId(id);
    }
  }, [infectionRunning, treeData, smartMode, teachingMode,intervalId]);

  const countByAction = (action) =>
    trailLog.filter((item) => item.action === action).length;

  return (
    <>
      <div className="App">
        <h1 className="animated-title">🗂️ Cyber Worm Simulator</h1>
        {infectionRunning && (
          <div className="alert-banner">
            ⚠️ Threat Detected: Infection in Progress
          </div>
        )}

        {treeData ? <FileNode node={treeData} /> : <p>Loading tree...</p>}
        <WormOverlay currentPath={infectedFiles[currentInfectionIndex]} />
        <LearningPanel
          currentFile={infectedFiles[currentInfectionIndex]}
          teachingMode={teachingMode}
        />

        {treeData && (
          <div className="progress-bar">
            <div
              className="fill"
              style={{
                width: `${
                  (infectedFiles.length / collectFiles(treeData).length) * 100
                }%`,
              }}
            ></div>
          </div>
        )}

        {trailLog.length > 0 && (
          <div className="trail-log">
            <h4>📜 Smart Filtering Trail</h4>
            <ul>
              {trailLog.map((entry, idx) => (
                <li key={idx}>
                  <strong>{entry.name}</strong> ({entry.sizeMB}MB) at{" "}
                  {entry.timestamp}:{" "}
                  {entry.action === "infected"
                    ? "✅ Infected"
                    : entry.action === "skipped-large"
                    ? "⛔ Skipped (Too Large)"
                    : entry.action === "skipped-stealth"
                    ? "🕶️ Skipped (Stealth)"
                    : "🔒 Blocked (Security Trap)"}
                </li>
              ))}
            </ul>
          </div>
        )}

        {infectionEnded && (
          <div className="summary">
            <h3>📊 Infection Summary</h3>
            <ul>
              <li>✅ Infected: {countByAction("infected")}</li>
              <li>🕶️ Skipped (Stealth): {countByAction("skipped-stealth")}</li>
              <li>⛔ Skipped (Too Large): {countByAction("skipped-large")}</li>
              <li>🔒 Blocked (Security): {countByAction("blocked")}</li>
              <li>📁 Total Considered: {trailLog.length}</li>
            </ul>
          </div>
        )}
      </div>

      <div className="toggle">
        <label>
          <input
            type="checkbox"
            checked={teachingMode}
            onChange={() => setTeachingMode(!teachingMode)}
          />
          Teaching Mode
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="checkbox"
            checked={smartMode}
            onChange={() => setSmartMode(!smartMode)}
          />
          Smart Worm Mode
        </label>
      </div>

      <div className="controls">
        <button
          onClick={() => {
            setInfectionRunning(true);
            setInfectionEnded(false);
          }}
          disabled={infectionRunning}
        >
          Start Infection
        </button>
        <button
          onClick={() => {
            clearInterval(intervalId);
            setInfectionRunning(false);
            setIntervalId(null);
          }}
        >
          Pause
        </button>
        <button
          onClick={() => {
            clearInterval(intervalId);
            setTreeData((prev) => {
              const resetTree = JSON.parse(JSON.stringify(prev));
              collectFiles(resetTree).forEach(
                (file) => (file.infected = false)
              );
              return resetTree;
            });
            setInfectedFiles([]);
            setTrailLog([]);
            setCurrentInfectionIndex(-1);
            setInfectionRunning(false);
            setIntervalId(null);
            setInfectionEnded(false);
            infectionIndexRef.current = 0;
          }}
        >
          Reset
        </button>
      </div>
    </>
  );
}

export default App;
