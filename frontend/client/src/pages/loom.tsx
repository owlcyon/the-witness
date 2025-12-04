import React from "react";
import { WitnessLayout } from "@/components/witness-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bug, 
  Globe, 
  Server, 
  Database, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Terminal,
  AlertCircle,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { motion } from "framer-motion";

export default function LoomPage() {
  return (
    <WitnessLayout>
      <div className="flex flex-col gap-6 h-full max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
              <Bug className="text-primary w-6 h-6" />
              THE LOOM <span className="text-muted-foreground text-lg font-mono font-normal">// CRAWLER NEXUS</span>
            </h1>
            <p className="text-muted-foreground text-sm font-mono mt-1">
              Distributed Spider Orchestration • Celery/RabbitMQ Grid • 24 Active Workers
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10 font-mono text-xs">
              <Terminal className="w-4 h-4 mr-2" />
              VIEW LOGS
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs">
              <Plus className="w-4 h-4 mr-2" />
              NEW SEED
            </Button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Left Col: Control & Status */}
          <div className="flex flex-col gap-6 lg:col-span-2 overflow-y-auto pr-2">
            
            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Active Spiders" value="24" icon={Bug} active />
              <MetricCard label="Queue Depth" value="14.2k" icon={Database} color="text-accent" />
              <MetricCard label="Throughput" value="840/s" icon={Server} color="text-secondary" />
              <MetricCard label="Error Rate" value="0.04%" icon={AlertCircle} color="text-green-500" />
            </div>

            {/* Active Workers Grid */}
            <Card className="bg-card/30 border-border p-6 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-sm text-foreground uppercase tracking-wider">Distributed Worker Grid (Consistent Hashing)</h3>
                <Badge variant="outline" className="font-mono text-xs border-green-500/50 text-green-400 bg-green-500/10 animate-pulse">
                  ALL SYSTEMS NOMINAL
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <WorkerNode key={i} id={`worker-${i+1}`} domain={['x.com', 'reddit.com', '4chan.org', 'substack.com'][i % 4]} />
                ))}
              </div>
            </Card>

            {/* Seed Injection */}
            <Card className="bg-card/30 border-border p-6 backdrop-blur-sm flex-1">
               <h3 className="font-display text-sm text-foreground uppercase tracking-wider mb-4">Seed Injection</h3>
               <div className="flex gap-4">
                 <div className="flex-1">
                   <label className="text-xs font-mono text-muted-foreground mb-2 block">TARGET URL / KEYWORD</label>
                   <div className="flex gap-2">
                     <Input className="bg-background/50 border-border font-mono text-sm" placeholder="e.g. https://x.com/search?q=hyperstition" />
                     <Button variant="secondary" className="shrink-0">INJECT</Button>
                   </div>
                 </div>
                 <div className="w-48">
                   <label className="text-xs font-mono text-muted-foreground mb-2 block">PRIORITY</label>
                   <select className="w-full h-10 bg-background/50 border border-border rounded-md px-3 text-sm font-mono focus:outline-none focus:border-primary">
                     <option>CRITICAL (Real-time)</option>
                     <option>HIGH (Hourly)</option>
                     <option>STANDARD (Daily)</option>
                     <option>LOW (Archival)</option>
                   </select>
                 </div>
               </div>
            </Card>
          </div>

          {/* Right Col: Queue & Stream */}
          <div className="flex flex-col gap-6 h-full min-h-[500px]">
            <Card className="flex-1 bg-card/30 border-border flex flex-col overflow-hidden backdrop-blur-sm">
              <div className="p-4 border-b border-border bg-muted/20">
                <h3 className="font-mono text-sm text-muted-foreground uppercase flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Task Queue (RabbitMQ)
                </h3>
              </div>
              <ScrollArea className="flex-1 p-0">
                <div className="divide-y divide-border/50">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <QueueItem key={i} index={i} />
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>

        </div>
      </div>
    </WitnessLayout>
  );
}

function MetricCard({ label, value, icon: Icon, color = "text-primary", active = false }: any) {
  return (
    <div className="bg-card/40 border border-border p-4 rounded-lg relative overflow-hidden group hover:border-primary/50 transition-colors">
      {active && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
      <Icon className={`w-5 h-5 ${color} mb-2 opacity-80 group-hover:opacity-100 transition-opacity`} />
      <div className="text-2xl font-display font-bold">{value}</div>
      <div className="text-[10px] font-mono text-muted-foreground uppercase mt-1">{label}</div>
    </div>
  );
}

function WorkerNode({ id, domain }: { id: string, domain: string }) {
  return (
    <div className="bg-background/40 border border-border p-3 rounded-sm hover:border-primary/50 transition-all cursor-pointer group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[2px] h-full bg-primary/0 group-hover:bg-primary transition-colors"></div>
      <div className="flex justify-between items-start mb-2">
        <Cpu className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
          <div className="w-1 h-1 bg-green-500/50 rounded-full"></div>
        </div>
      </div>
      <div className="font-mono text-xs font-bold text-foreground">{id}</div>
      <div className="font-mono text-[10px] text-muted-foreground mt-1 truncate">{domain}</div>
      
      <div className="mt-3 h-1 w-full bg-muted/50 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "20%" }}
          animate={{ width: ["20%", "80%", "45%", "90%"] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
    </div>
  );
}

function QueueItem({ index }: { index: number }) {
  const status = index === 0 ? "PROCESSING" : (index % 5 === 0 ? "RETRYING" : "QUEUED");
  const statusColor = status === "PROCESSING" ? "text-green-400" : (status === "RETRYING" ? "text-accent" : "text-muted-foreground");
  
  return (
    <div className="p-3 hover:bg-white/5 transition-colors font-mono text-xs flex items-center justify-between group">
      <div className="flex flex-col gap-1">
        <span className="text-foreground/90 group-hover:text-primary transition-colors">task_{29384 + index}::fetch_thread</span>
        <span className="text-muted-foreground text-[10px]">target: x.com/user_{index}</span>
      </div>
      <div className={`flex items-center gap-2 ${statusColor}`}>
        <span className="text-[10px]">{status}</span>
        {status === "PROCESSING" && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>}
      </div>
    </div>
  );
}
