import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, ArrowUpRight } from "lucide-react";

interface MemeEvent {
  id: string;
  source: string;
  content: string;
  timestamp: string;
  virality: number;
  tags: string[];
  url?: string;
}

export function MemeStream() {
  const [events, setEvents] = React.useState<MemeEvent[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    // Fetch initial history
    fetch("/api/v1/stream?limit=50")
      .then(res => res.json())
      .then(data => {
        if (data.events) {
          setEvents(data.events);
        }
      })
      .catch(err => console.error("Failed to fetch stream:", err));

    // WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/stream`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "meme" && message.data) {
          setEvents((prev: MemeEvent[]) => [message.data, ...prev].slice(0, 100));
        }
      } catch (e) {
        console.error("Error parsing WS message:", e);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="h-full flex flex-col panel">
      {/* Header */}
      <div className="panel-header flex items-center justify-between">
        <span>LIVE STREAM</span>
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[var(--color-success)] animate-pulse' : 'bg-muted-foreground'}`}></span>
          <span className="text-[10px]">{isConnected ? 'LIVE' : 'OFFLINE'}</span>
        </span>
      </div>

      {/* Stream */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {events.map((evt) => {
            const ContentWrapper = evt.url ? 'a' : 'div';
            const wrapperProps = evt.url ? {
              href: evt.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "block p-3 hover:bg-muted/30 transition-colors cursor-pointer group"
            } : {
              className: "p-3 hover:bg-muted/30 transition-colors cursor-pointer group"
            };

            return (
              // @ts-ignore
              <ContentWrapper key={evt.id} {...wrapperProps}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono text-primary flex items-center gap-1">
                    {evt.source}
                    {evt.url && <ArrowUpRight className="w-3 h-3 opacity-50" />}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 line-clamp-2 mb-2">
                  {evt.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {evt.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] text-muted-foreground px-1 border border-border rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {evt.virality > 60 && <Zap className="w-3 h-3 text-[var(--color-warning)]" />}
                    <span className="text-[10px] font-mono">{Math.round(evt.virality)}%</span>
                  </div>
                </div>
              </ContentWrapper>
            );
          })}

          {events.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm font-mono">
              Waiting for signals...
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
