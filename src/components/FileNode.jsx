import React, { useState } from "react";

export default function FileNode({ node }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded(!expanded);
  const isFolder = node.type === "folder";

  return (
    <div className={`file-node ${node.infected ? "infected" : ""}`}>
      <div onClick={toggle}>
        {isFolder ? (expanded ? "📂" : "📁") : "📄"} {node.name}
      </div>

      {isFolder && expanded && (
        <div className="children" style={{ paddingLeft: "1rem" }}>
          {node.children.map((child, index) => (
            <FileNode key={index} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}
