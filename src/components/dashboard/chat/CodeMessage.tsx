"use client";

export function CodeMessage({ code, language }: { code: string; language: string | null }) {
    return (
        <div className="rounded-md border bg-muted/50 overflow-hidden">
            {language && (
                <div className="px-3 py-1 text-xs font-mono text-muted-foreground border-b bg-muted">
                    {language}
                </div>
            )}
            <pre className="p-3 overflow-x-auto text-sm">
                <code className="font-mono whitespace-pre">{code}</code>
            </pre>
        </div>
    );
}