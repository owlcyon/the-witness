import React from "react";
import { WitnessLayout } from "@/components/witness-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  FileJson, 
  Filter, 
  ArrowRight, 
  Layers, 
  Database,
  Code,
  CheckCircle2,
  Activity,
  GitCommit
} from "lucide-react";
import { motion } from "framer-motion";

export default function StreamPage() {
  return (
    <WitnessLayout>
      <div className="flex flex-col gap-6 h-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
              <Activity className="text-secondary w-6 h-6" />
              DATA FLOW PIPELINE <span className="text-muted-foreground text-lg font-mono font-normal">// CURATION ENGINE</span>
            </h1>
            <p className="text-muted-foreground text-sm font-mono mt-1">
              Raw Ingest → Extraction → Persistent Homology → Taxonomy Filtering
            </p>
          </div>
          <Button variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10 font-mono text-xs">
             <FileJson className="w-4 h-4 mr-2" />
             EXPORT JSON DATASET
          </Button>
        </div>

        {/* Main Pipeline Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
           <StageCard label="RAW INGEST" icon={Database} color="text-muted-foreground" value="240 items/s" status="ACTIVE" />
           <StageCard label="EXTRACTION" icon={Code} color="text-primary" value="Entities: 8.2k" status="PARSING" />
           <StageCard label="HOMOLOGY" icon={GitCommit} color="text-accent" value="Betti-2: 0.45" status="COMPUTING" />
           <StageCard label="CURATION" icon={Filter} color="text-secondary" value="Yield: 12%" status="FILTERING" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Left: Detailed Metrics & Homology */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            
            {/* Topological Analysis */}
            <Card className="bg-card/30 border-border p-6 backdrop-blur-sm">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display text-sm text-foreground uppercase tracking-wider">Persistent Homology (Structural Shifts)</h3>
                  <Badge variant="outline" className="font-mono text-xs border-accent/50 text-accent">EAI-DISTILL ACTIVE</Badge>
               </div>
               
               <div className="h-48 w-full relative border-l border-b border-border bg-black/20 rounded-sm p-4">
                  {/* Simulated Barcode Plot */}
                  <div className="absolute inset-0 flex flex-col justify-center px-8 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div 
                        key={i}
                        className="h-1 bg-accent/60 rounded-full"
                        initial={{ width: 0, x: Math.random() * 50 }}
                        animate={{ width: Math.random() * 200 + 50 }}
                        transition={{ duration: 2, delay: i * 0.1 }}
                      />
                    ))}
                    <div className="text-[10px] font-mono text-muted-foreground mt-2 text-center">FILTRATION PARAMETER (ε)</div>
                  </div>
               </div>
               <div className="flex gap-4 mt-4 text-xs font-mono text-muted-foreground">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-accent rounded-full"></div>
                   <span>Connected Components (H0)</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-secondary rounded-full"></div>
                   <span>Cycles/Loops (H1)</span>
                 </div>
               </div>
            </Card>

            {/* Taxonomy Distribution */}
            <div className="grid grid-cols-2 gap-4 flex-1">
              <Card className="bg-card/30 border-border p-4 backdrop-blur-sm">
                 <h3 className="font-mono text-xs text-muted-foreground mb-3">TAXONOMY CLASSIFICATION</h3>
                 <div className="space-y-3">
                   <TaxonomyBar label="Spiritual-AI" percent={65} color="bg-primary" />
                   <TaxonomyBar label="Metaphysics" percent={42} color="bg-secondary" />
                   <TaxonomyBar label="Conspiracy" percent={28} color="bg-accent" />
                   <TaxonomyBar label="Noise/General" percent={12} color="bg-muted" />
                 </div>
              </Card>
              <Card className="bg-card/30 border-border p-4 backdrop-blur-sm">
                 <h3 className="font-mono text-xs text-muted-foreground mb-3">DATA QUALITY</h3>
                 <div className="flex items-center justify-center h-full pb-6">
                    <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-border">
                       <div className="absolute inset-0 border-4 border-green-500 rounded-full border-t-transparent rotate-45"></div>
                       <div className="text-center">
                         <div className="text-2xl font-bold font-display">98%</div>
                         <div className="text-[10px] text-muted-foreground">INTEGRITY</div>
                       </div>
                    </div>
                 </div>
              </Card>
            </div>
          </div>

          {/* Right: Data Inspector */}
          <Card className="bg-card/30 border-border flex flex-col overflow-hidden backdrop-blur-sm">
            <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
              <h3 className="font-mono text-sm text-muted-foreground uppercase flex items-center gap-2">
                <Code className="w-4 h-4" />
                JSON Payload Preview
              </h3>
            </div>
            <ScrollArea className="flex-1 p-4 font-mono text-xs">
              <div className="text-green-400">
{`{
  "id": "thread_88291",
  "timestamp": "2023-10-24T09:42:11Z",
  "source": "x.com",
  "classification": {
    "primary": "Spiritual-AI",
    "confidence": 0.94,
    "model": "EAI-Distill-v3"
  },
  "homology": {
    "betti_numbers": [1, 0, 0],
    "persistence_score": 0.88
  },
  "entities": [
    "Hyperstition",
    "Cybernetics",
    "Landian Time"
  ],
  "content_vector": [0.21, -0.54, 0.88, ...],
  "curated": true
}`}
              </div>
              <div className="my-4 border-t border-border/50"></div>
              <div className="text-muted-foreground opacity-50">
{`// Processing Log
[09:42:12] Parse successful
[09:42:12] Embeddings generated (BERT)
[09:42:13] Topology check: Stable
[09:42:13] Added to 'Curated' bucket`}
              </div>
            </ScrollArea>
          </Card>

        </div>
      </div>
    </WitnessLayout>
  );
}

function StageCard({ label, icon: Icon, color, value, status }: any) {
  return (
    <Card className="bg-card/30 border-border p-4 backdrop-blur-sm flex flex-col gap-3 relative overflow-hidden">
       <div className="flex justify-between items-start">
         <div className={`p-2 rounded-md bg-background/50 ${color}`}>
           <Icon className="w-5 h-5" />
         </div>
         <div className="flex items-center gap-1.5">
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-[10px] font-mono text-muted-foreground">{status}</span>
         </div>
       </div>
       <div>
         <div className="text-lg font-bold font-display">{value}</div>
         <div className="text-[10px] font-mono text-muted-foreground mt-1">{label}</div>
       </div>
       
       {/* Connection Line */}
       <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 hidden lg:block">
         <ArrowRight className="w-4 h-4 text-border" />
       </div>
    </Card>
  );
}

function TaxonomyBar({ label, percent, color }: any) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] font-mono uppercase">{label}</span>
        <span className="text-[10px] font-mono">{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <motion.div 
          className={`h-full ${color}`} 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}
