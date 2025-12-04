import React from "react";
import { motion } from "framer-motion";

interface Node {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  pulse: boolean;
}

export function LoomViz() {
  const [nodes, setNodes] = React.useState<Node[]>([]);

  React.useEffect(() => {
    // Fetch initial graph
    fetch("/api/v1/graph/nodes")
      .then(res => res.json())
      .then(data => {
        if (data.nodes) {
          setNodes(data.nodes);
        }
      })
      .catch(err => console.error("Failed to fetch graph:", err));

    // WebSocket for updates
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/loom`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "snapshot" && message.data?.nodes) {
          const vizNodes = message.data.nodes.map((n: any) => ({
            id: n.id,
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 80,
            size: 4 + Math.random() * 4,
            color: n.cluster === "ai" ? "var(--color-primary)" :
              n.cluster === "spiritual" ? "hsl(280 40% 50%)" :
                n.cluster === "cultural" ? "hsl(160 50% 45%)" : "var(--color-muted-foreground)",
            pulse: n.virality > 70
          }));
          setNodes(vizNodes);
        } else if (message.type === "node_update" && message.data) {
          setNodes((prev: Node[]) => {
            const idx = prev.findIndex(n => n.id === message.data.id);
            const newNode = {
              id: message.data.id,
              x: 10 + Math.random() * 80,
              y: 10 + Math.random() * 80,
              size: 6,
              color: "var(--color-primary)",
              pulse: true
            };
            if (idx >= 0) {
              const newNodes = [...prev];
              newNodes[idx] = { ...newNodes[idx], ...newNode };
              return newNodes;
            } else {
              return [...prev, newNode];
            }
          });
        }
      } catch (e) {
        console.error("Error parsing Loom WS:", e);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="w-full h-full relative bg-background overflow-hidden">
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {nodes.map((node, i) => (
          nodes.slice(i + 1, i + 3).map((target) => (
            <line
              key={`${node.id}-${target.id}`}
              x1={`${node.x}%`}
              y1={`${node.y}%`}
              x2={`${target.x}%`}
              y2={`${target.y}%`}
              stroke="var(--color-border)"
              strokeWidth="1"
              opacity="0.3"
            />
          ))
        ))}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute rounded-full cursor-pointer"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: node.size,
            height: node.size,
            backgroundColor: node.color,
            boxShadow: node.pulse ? `0 0 ${node.size}px ${node.color}` : 'none',
            transform: 'translate(-50%, -50%)'
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          whileHover={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      ))}

      {/* Stats overlay */}
      <div className="absolute bottom-3 right-3 text-[10px] font-mono text-muted-foreground bg-background/80 px-2 py-1 border border-border rounded">
        NODES: {nodes.length}
      </div>
    </div>
  );
}
