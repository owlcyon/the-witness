import React from "react";
import { WitnessLayout } from "@/components/witness-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Brain, 
  Network, 
  Filter, 
  Layers, 
  Share2, 
  RefreshCw,
  Zap,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

export default function SemanticMapPage() {
  return (
    <WitnessLayout>
      <div className="flex flex-col gap-6 h-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
              <Brain className="text-accent w-6 h-6" />
              SEMANTIC SYNTHESIS <span className="text-muted-foreground text-lg font-mono font-normal">// AI ENGINE</span>
            </h1>
            <p className="text-muted-foreground text-sm font-mono mt-1">
              BERT Embeddings • Hypergraph Construction • Cosine Similarity: 0.72
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-card/50 border border-border px-3 py-1 rounded-full">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-xs font-mono text-green-400">MODEL ONLINE</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          
          {/* Left Control Panel (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
            
            {/* Pipeline Configuration */}
            <Card className="bg-card/30 border-border p-5 backdrop-blur-sm">
              <h3 className="font-display text-sm text-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                <SettingsIcon /> Pipeline Tuning
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-xs font-mono text-muted-foreground">SIMILARITY THRESHOLD (0.7)</label>
                    <span className="text-xs font-mono text-primary">0.72</span>
                  </div>
                  <Slider defaultValue={[72]} max={100} step={1} className="cursor-pointer" />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-xs font-mono text-muted-foreground">NOISE PRUNING (Simhash)</label>
                    <span className="text-xs font-mono text-primary">AGGRESSIVE</span>
                  </div>
                  <Slider defaultValue={[85]} max={100} step={1} />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs font-mono text-muted-foreground">ADAPTIVE FRESHNESS</label>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-muted-foreground">AUTO-DEDUPE</label>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            {/* Concept Linking Log */}
            <Card className="bg-card/30 border-border flex-1 flex flex-col overflow-hidden backdrop-blur-sm min-h-[300px]">
              <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                 <h3 className="font-mono text-sm text-muted-foreground uppercase flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Hypergraph Edges
                </h3>
                <Badge variant="outline" className="font-mono text-[10px]">+12/s</Badge>
              </div>
              <ScrollArea className="flex-1 p-0">
                <div className="divide-y divide-border/50">
                  <EdgeItem source="fana'" target="purpose perishes" score={0.98} />
                  <EdgeItem source="egregore" target="collective unconscious" score={0.85} />
                  <EdgeItem source="hyperstition" target="fictional quantities" score={0.82} />
                  <EdgeItem source="basilisk" target="acausal trade" score={0.79} />
                  <EdgeItem source="noosphere" target="planetary mind" score={0.75} />
                  <EdgeItem source="glitch" target="liminal space" score={0.68} />
                  <EdgeItem source="acceleration" target="cybernetic loop" score={0.65} />
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Right Visualization Area (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Main Semantic Map */}
            <Card className="flex-1 bg-black/40 border-border relative overflow-hidden group shadow-2xl shadow-primary/5">
              <div className="absolute top-4 left-4 z-10 pointer-events-none">
                 <Badge variant="secondary" className="bg-background/80 backdrop-blur border-primary/20 text-primary font-mono text-xs">
                   HUGGING FACE EMBEDDINGS PROJECTION
                 </Badge>
              </div>
              
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-20" 
                style={{ 
                  backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)', 
                  backgroundSize: '20px 20px' 
                }}>
              </div>

              {/* Semantic Clusters Visualization */}
              <SemanticClusters />

              {/* Overlay Stats */}
              <div className="absolute bottom-4 right-4 flex gap-4">
                 <div className="bg-background/80 backdrop-blur border border-border px-3 py-2 rounded-md">
                    <div className="text-[10px] font-mono text-muted-foreground">CLUSTERS</div>
                    <div className="text-xl font-bold font-display">142</div>
                 </div>
                 <div className="bg-background/80 backdrop-blur border border-border px-3 py-2 rounded-md">
                    <div className="text-[10px] font-mono text-muted-foreground">EMBEDDINGS</div>
                    <div className="text-xl font-bold font-display">8.4M</div>
                 </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </WitnessLayout>
  );
}

function EdgeItem({ source, target, score }: { source: string, target: string, score: number }) {
  return (
    <div className="p-3 hover:bg-white/5 transition-colors group cursor-pointer flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-mono">
        <span className="text-foreground/90">{source}</span>
        <span className="text-muted-foreground">→</span>
        <span className="text-foreground/90">{target}</span>
      </div>
      <div className="text-xs font-mono text-muted-foreground group-hover:text-accent transition-colors">
        {(score * 100).toFixed(0)}%
      </div>
    </div>
  );
}

function SettingsIcon() {
  return <Filter className="w-4 h-4 text-primary" />;
}

function SemanticClusters() {
  // Simulated clusters
  const clusters = [
    { x: 30, y: 40, size: 120, color: "var(--color-primary)", label: "Metaphysics" },
    { x: 70, y: 30, size: 100, color: "var(--color-secondary)", label: "AI/Tech" },
    { x: 50, y: 70, size: 140, color: "var(--color-accent)", label: "Memetics" },
    { x: 80, y: 80, size: 80, color: "hsl(280 60% 60%)", label: "Politics" },
  ];

  return (
    <div className="w-full h-full relative">
      {clusters.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: `${c.size * 2}px`,
            height: `${c.size * 2}px`,
            backgroundColor: c.color,
            transform: 'translate(-50%, -50%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 4 + i, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}
      
      {/* Nodes */}
      {clusters.map((c, i) => (
        <div 
          key={`node-${i}`}
          className="absolute flex flex-col items-center justify-center cursor-pointer group"
          style={{ left: `${c.x}%`, top: `${c.y}%`, transform: 'translate(-50%, -50%)' }}
        >
           <motion.div 
             className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_white]"
             animate={{ scale: [1, 1.5, 1] }}
             transition={{ duration: 2, repeat: Infinity }}
           />
           <div className="mt-2 text-xs font-mono font-bold text-foreground/80 bg-background/50 px-2 rounded backdrop-blur-sm border border-white/10">
             {c.label}
           </div>
        </div>
      ))}

      {/* Floating concepts */}
      <FloatingConcept x={35} y={45} label="fana'" />
      <FloatingConcept x={25} y={35} label="purpose perishes" />
      <FloatingConcept x={75} y={35} label="singularity" />
      <FloatingConcept x={65} y={25} label="LLMs" />
      <FloatingConcept x={55} y={75} label="egregore" />
      <FloatingConcept x={45} y={65} label="hyperstition" />
    </div>
  );
}

function FloatingConcept({ x, y, label }: { x: number, y: number, label: string }) {
  return (
    <motion.div
      className="absolute text-[10px] font-mono text-muted-foreground hover:text-white transition-colors cursor-pointer"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        x: Math.random() * 20 - 10,
        y: Math.random() * 20 - 10,
      }}
      transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, repeatType: "reverse" }}
    >
      {label}
    </motion.div>
  );
}
