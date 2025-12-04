import React from "react";
import { WitnessLayout } from "@/components/witness-layout";
import { LoomViz } from "@/components/loom-viz";
import { MemeStream } from "@/components/meme-stream";
import { SeedInjector } from "@/components/seed-injector";
import { SystemLogs } from "@/components/system-logs";
import { Zap, Network, Activity, Radio } from "lucide-react";

export default function Dashboard() {
  return (
    <WitnessLayout>
      <div className="h-full flex flex-col gap-4">

        {/* Top Row: Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="NODES" value="1,247" icon={Network} />
          <StatCard label="MEMES/SEC" value="842" icon={Zap} />
          <StatCard label="UPTIME" value="99.9%" icon={Activity} />
          <StatCard label="SIGNALS" value="12.4K" icon={Radio} />
        </div>

        {/* Main Grid: 3 columns */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">

          {/* Left: Seed Injector + Logs */}
          <div className="col-span-3 flex flex-col gap-4">
            <SeedInjector />
            <div className="flex-1 min-h-0">
              <SystemLogs />
            </div>
          </div>

          {/* Center: The Loom Visualization */}
          <div className="col-span-6 panel overflow-hidden">
            <div className="panel-header flex items-center justify-between">
              <span>THE LOOM // LIVE TOPOLOGY</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--color-success)] rounded-full animate-pulse"></span>
                <span className="text-[10px]">RENDERING</span>
              </span>
            </div>
            <div className="h-[calc(100%-3rem)]">
              <LoomViz />
            </div>
          </div>

          {/* Right: Meme Stream */}
          <div className="col-span-3 overflow-hidden">
            <MemeStream />
          </div>

        </div>
      </div>
    </WitnessLayout>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="panel px-4 py-3 flex items-center justify-between">
      <div>
        <div className="text-xs text-muted-foreground font-mono">{label}</div>
        <div className="text-xl font-mono font-medium">{value}</div>
      </div>
      <Icon className="w-5 h-5 text-muted-foreground" />
    </div>
  );
}
