import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react";

type SeedType = "keyword" | "user" | "hashtag" | "thread";
type Priority = "critical" | "standard" | "low";

interface InjectResult {
    success: boolean;
    seed_id?: string;
    error?: string;
}

export function SeedInjector() {
    const [url, setUrl] = useState("");
    const [seedType, setSeedType] = useState<SeedType>("thread");
    const [priority, setPriority] = useState<Priority>("standard");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<InjectResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/v1/seeds", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim(), seed_type: seedType, priority }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult({ success: true, seed_id: data.seed_id });
                setUrl("");
            } else {
                setResult({ success: false, error: data.detail || "Failed to inject" });
            }
        } catch (err) {
            setResult({ success: false, error: "Network error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="panel">
            <div className="panel-header">INJECT SEED</div>

            <form onSubmit={handleSubmit} className="p-3 space-y-3">
                <Input
                    type="text"
                    placeholder="Paste URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-background border-border font-mono text-sm h-9"
                    disabled={isLoading}
                />

                {/* Type buttons */}
                <div className="flex gap-1">
                    {(["thread", "user", "hashtag", "keyword"] as SeedType[]).map((type) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setSeedType(type)}
                            disabled={isLoading}
                            className={`flex-1 text-[10px] font-mono py-1 rounded border transition-colors ${seedType === type
                                    ? 'bg-primary/20 border-primary text-primary'
                                    : 'border-border text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {type.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Priority */}
                <div className="flex gap-1">
                    {(["low", "standard", "critical"] as Priority[]).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPriority(p)}
                            disabled={isLoading}
                            className={`flex-1 text-[10px] font-mono py-1 rounded border transition-colors ${priority === p
                                    ? p === 'critical' ? 'bg-[var(--color-warning)]/20 border-[var(--color-warning)] text-[var(--color-warning)]'
                                        : 'bg-muted border-border text-foreground'
                                    : 'border-border text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {p.toUpperCase()}
                        </button>
                    ))}
                </div>

                <Button type="submit" className="w-full h-8 text-xs font-mono" disabled={isLoading || !url.trim()}>
                    {isLoading ? (
                        <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> INJECTING...</>
                    ) : (
                        <><Send className="w-3 h-3 mr-2" /> INJECT</>
                    )}
                </Button>

                {result && (
                    <div className={`p-2 rounded border text-[10px] font-mono flex items-center gap-2 ${result.success
                            ? 'bg-[var(--color-success)]/10 border-[var(--color-success)]/30 text-[var(--color-success)]'
                            : 'bg-[var(--color-error)]/10 border-[var(--color-error)]/30 text-[var(--color-error)]'
                        }`}>
                        {result.success ? (
                            <><CheckCircle className="w-3 h-3" /> ID: {result.seed_id}</>
                        ) : (
                            <><AlertCircle className="w-3 h-3" /> {result.error}</>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}
