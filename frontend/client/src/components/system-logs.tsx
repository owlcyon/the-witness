import React, { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw } from "lucide-react";

interface LogEntry {
    id: string;
    timestamp: string;
    agent_name: string;
    type: "INFO" | "WARN" | "ACTION" | "SUCCESS";
    message: string;
}

export function SystemLogs() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/v1/logs?limit=50");
            const data = await response.json();

            if (Array.isArray(data)) {
                setLogs(data);
            } else if (data.logs) {
                setLogs(data.logs);
            } else {
                setLogs([]);
            }
        } catch (err) {
            setError("Failed to fetch logs");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const getTypeColor = (type: string) => {
        switch (type) {
            case "WARN": return "text-[var(--color-warning)]";
            case "ACTION": return "text-primary";
            case "SUCCESS": return "text-[var(--color-success)]";
            default: return "text-muted-foreground";
        }
    };

    return (
        <div className="h-full flex flex-col panel">
            <div className="panel-header flex items-center justify-between">
                <span>SYSTEM LOGS</span>
                <button
                    onClick={fetchLogs}
                    disabled={isLoading}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                >
                    {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <RefreshCw className="w-3 h-3" />
                    )}
                </button>
            </div>

            <ScrollArea className="flex-1">
                {error && (
                    <div className="text-[var(--color-error)] text-[10px] font-mono p-2 m-2 bg-[var(--color-error)]/10 border border-[var(--color-error)]/30 rounded">
                        {error}
                    </div>
                )}

                {logs.length === 0 && !error && !isLoading && (
                    <div className="text-muted-foreground text-[10px] font-mono text-center py-4">
                        No logs
                    </div>
                )}

                <div className="font-mono text-[10px]">
                    {logs.map((log) => (
                        <div key={log.id} className="px-3 py-1.5 border-b border-border/50 hover:bg-muted/20">
                            <div className="flex gap-2">
                                <span className="text-muted-foreground/50 shrink-0">
                                    {new Date(log.timestamp).toLocaleTimeString()}
                                </span>
                                <span className={`shrink-0 w-12 ${getTypeColor(log.type)}`}>
                                    {log.type}
                                </span>
                                <span className="text-primary shrink-0">{log.agent_name}</span>
                            </div>
                            <div className="text-foreground/70 mt-0.5 pl-[4ch]">
                                {log.message}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
