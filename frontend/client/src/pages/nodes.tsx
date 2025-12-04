import React from "react";
import { WitnessLayout } from "@/components/witness-layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Cpu, 
  HardDrive, 
  Cloud, 
  Shield, 
  Zap, 
  RefreshCw, 
  Server,
  Bot,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function NodesPage() {
  return (
    <WitnessLayout>
      <div className="flex flex-col gap-6 h-full max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
              <Server className="text-primary w-6 h-6" />
              INFRASTRUCTURE & AUTONOMY <span className="text-muted-foreground text-lg font-mono font-normal">// CLOUD CONTROL</span>
            </h1>
            <p className="text-muted-foreground text-sm font-mono mt-1">
              AWS/GCP Hybrid • GPU Cluster: H100s Active • Autonomy Loop: Self-Healing
            </p>
          </div>
          <div className="flex gap-4">
             <Badge variant="outline" className="border-primary/50 text-primary font-mono h-8 px-3">
               <Zap className="w-3 h-3 mr-2 fill-primary" />
               92,401 GPU-HOURS
             </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          
          {/* Left: Cloud Resources */}
          <div className="flex flex-col gap-6">
            <Card className="bg-card/30 border-border p-5 backdrop-blur-sm">
              <h3 className="font-display text-sm text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Cloud className="w-4 h-4" /> Compute Fabric (ECS/Lambda)
              </h3>
              
              <div className="space-y-6">
                <ResourceBar label="EC2 Fleet (t4g.xlarge)" used={85} total="120 Nodes" color="bg-primary" />
                <ResourceBar label="Lambda Concurrency" used={42} total="450/1000" color="bg-secondary" />
                <ResourceBar label="GPU Inference (H100)" used={92} total="8/8 Cluster" color="bg-accent" />
                <ResourceBar label="S3 Storage (Petabytes)" used={65} total="1.2 PB" color="bg-muted-foreground" />
              </div>
            </Card>

            <Card className="bg-card/30 border-border p-5 backdrop-blur-sm flex-1">
               <h3 className="font-display text-sm text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Shield className="w-4 h-4" /> Distributed Frontier
               </h3>
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-background/40 p-3 rounded border border-border">
                    <div className="text-[10px] font-mono text-muted-foreground">BLOOM FILTER LOAD</div>
                    <div className="text-xl font-bold font-display text-green-400">0.004%</div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-1">FALSE POSITIVE RATE</div>
                  </div>
                  <div className="bg-background/40 p-3 rounded border border-border">
                    <div className="text-[10px] font-mono text-muted-foreground">URLS PROCESSED</div>
                    <div className="text-xl font-bold font-display text-primary">4.2B</div>
                  </div>
               </div>
               <div className="h-32 w-full bg-black/20 border border-border rounded relative overflow-hidden">
                  {/* Visualization of Bloom Filter bits */}
                  <div className="absolute inset-0 flex flex-wrap content-start opacity-50">
                    {Array.from({ length: 400 }).map((_, i) => (
                      <div key={i} className={`w-1 h-1 m-[1px] rounded-[1px] ${Math.random() > 0.9 ? 'bg-primary' : 'bg-muted/20'}`}></div>
                    ))}
                  </div>
               </div>
            </Card>
          </div>

          {/* Center: Autonomy Loop */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="bg-card/30 border-border flex-1 relative overflow-hidden backdrop-blur-sm flex flex-col">
               <div className="p-5 border-b border-border bg-muted/10 flex justify-between items-center z-10">
                 <h3 className="font-display text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                   <Bot className="w-4 h-4 text-accent" /> Autonomy Engine (LangChain Agents)
                 </h3>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                   <span className="text-xs font-mono text-accent">SELF-HEALING ACTIVE</span>
                 </div>
               </div>

               <div className="flex-1 p-6 relative">
                  {/* Agent Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                    <RefreshCw className="w-64 h-64 animate-spin-slow" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                     <AgentStatus name="ORCHESTRATOR-ALPHA" status="PLANNING" task="Redistributing load to us-east-1" health={100} />
                     <AgentStatus name="SENTINEL-BETA" status="HEALING" task="Restarting Worker #42 (Memory Leak)" health={85} warning />
                     <AgentStatus name="CATALYST-GAMMA" status="FEEDBACK" task="Injecting 'Hyperstition' seed back to queue" health={100} />
                     <AgentStatus name="ARCHIVIST-DELTA" status="IDLE" task="Waiting for S3 batch commit" health={100} />
                  </div>

                  <div className="mt-8">
                    <h4 className="font-mono text-xs text-muted-foreground mb-2 uppercase">Autonomy Event Log</h4>
                    <div className="bg-black/40 rounded border border-border p-4 font-mono text-xs h-48 overflow-y-auto">
                       <LogEntry time="10:42:15" type="INFO" msg="Queue depth exceeded threshold (15k). Scaling Lambda." />
                       <LogEntry time="10:42:08" type="WARN" msg="Worker #42 unresponsive. Sentinel agent activated." />
                       <LogEntry time="10:42:09" type="ACTION" msg="Sentinel: Terminating instance i-09834..." />
                       <LogEntry time="10:42:12" type="SUCCESS" msg="Sentinel: Replacement instance provisioned." />
                       <LogEntry time="10:41:55" type="INFO" msg="Catalyst: New semantic cluster found. Generating seeds." />
                       <LogEntry time="10:41:45" type="INFO" msg="Bloom filter rotated. False positive rate normalized." />
                    </div>
                  </div>
               </div>
            </Card>
          </div>

        </div>
      </div>
    </WitnessLayout>
  );
}

function ResourceBar({ label, used, total, color }: any) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-[10px] font-mono text-muted-foreground uppercase">{label}</span>
        <span className="text-[10px] font-mono text-foreground">{total}</span>
      </div>
      <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${used}%` }}></div>
      </div>
    </div>
  );
}

function AgentStatus({ name, status, task, health, warning }: any) {
  return (
    <div className={`p-4 rounded border ${warning ? 'border-accent/50 bg-accent/5' : 'border-border bg-card/50'} transition-colors`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Bot className={`w-4 h-4 ${warning ? 'text-accent' : 'text-primary'}`} />
          <span className="font-mono text-xs font-bold">{name}</span>
        </div>
        <Badge variant="outline" className={`text-[10px] ${warning ? 'border-accent text-accent' : 'border-green-500 text-green-500'}`}>
          {status}
        </Badge>
      </div>
      <div className="text-sm font-medium mb-3 h-10 line-clamp-2">{task}</div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 bg-muted/50 rounded-full overflow-hidden">
          <div className={`h-full ${warning ? 'bg-accent' : 'bg-green-500'}`} style={{ width: `${health}%` }}></div>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground">{health}% HEALTH</span>
      </div>
    </div>
  );
}

function LogEntry({ time, type, msg }: any) {
  const color = type === 'WARN' ? 'text-accent' : (type === 'ACTION' ? 'text-primary' : (type === 'SUCCESS' ? 'text-green-400' : 'text-muted-foreground'));
  return (
    <div className="mb-1 flex gap-3">
      <span className="text-muted-foreground opacity-50">[{time}]</span>
      <span className={`font-bold w-12 ${color}`}>{type}</span>
      <span className="text-foreground/80">{msg}</span>
    </div>
  );
}
