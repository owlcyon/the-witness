import React from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  Network,
  Globe,
  Cpu,
  Settings,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WitnessLayoutProps {
  children: React.ReactNode;
}

export function WitnessLayout({ children }: WitnessLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden font-ui">

      {/* Sidebar - Fixed */}
      <aside className="w-14 border-r border-border bg-sidebar flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center justify-center border-b border-border">
          <Eye className="w-5 h-5 text-primary" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
          <NavLink href="/" icon={Activity} label="Dashboard" active={location === "/"} />
          <NavLink href="/loom" icon={Network} label="Loom" active={location === "/loom"} />
          <NavLink href="/stream" icon={Cpu} label="Pipeline" active={location === "/stream"} />
          <NavLink href="/map" icon={Globe} label="Map" active={location === "/map"} />
          <NavLink href="/nodes" icon={Cpu} label="Nodes" active={location === "/nodes"} />
        </nav>

        {/* Settings */}
        <div className="p-2 border-t border-border">
          <Link href="/system">
            <div className={cn(
              "w-10 h-10 flex items-center justify-center rounded cursor-pointer transition-colors",
              location === "/system" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}>
              <Settings className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card/50">
          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]"></span>
              SYSTEM ONLINE
            </span>
            <span className="text-border">|</span>
            <span>NOOSPHERE: CONNECTED</span>
            <span className="text-border">|</span>
            <span className="text-primary">v1.0.0</span>
          </div>

          <div className="text-xs font-mono text-muted-foreground">
            {new Date().toLocaleTimeString()}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded cursor-pointer transition-colors",
          active
            ? "bg-primary/20 text-primary"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
        title={label}
      >
        <Icon className="w-4 h-4" />
      </div>
    </Link>
  );
}
