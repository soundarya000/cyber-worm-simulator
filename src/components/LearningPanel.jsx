import React, { useEffect, useState } from "react";
import infectionTips from "../data/infectionTips";
import "./LearningPanel.css";

export default function LearningPanel({ currentFile, teachingMode }) {
  const [visibleTip, setVisibleTip] = useState("");

  useEffect(() => {
    if (teachingMode && currentFile) {
      const extension = currentFile.split(".").pop();
      const tip = infectionTips[extension] || infectionTips.default;
      setVisibleTip(tip);
    } else {
      setVisibleTip("");
    }
  }, [currentFile, teachingMode]);

  if (!teachingMode || !currentFile) return null;

  return (
    <div className="learning-panel active">
      <h3>🧠 Teaching Mode Activated</h3>
      <p>
        <strong>Infecting:</strong> <code>{currentFile}</code>
      </p>
      <p>
        <em key={currentFile}>{visibleTip}</em>
      </p>
    </div>
  );
}
