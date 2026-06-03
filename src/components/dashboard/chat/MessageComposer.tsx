"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Code2, Send } from "lucide-react";
import type { MessageType } from "@/lib/chat/types";

interface Props {
    disabled?: boolean;
    onSend: (content: string, type: MessageType, language?: string) => void;
}

export function MessageComposer({ disabled, onSend }: Props) {
    const [content, setContent] = useState("");
    const [codeMode, setCodeMode] = useState(false);
    const [language, setLanguage] = useState("javascript");

    const submit = () => {
        const trimmed = content.trim();
        if (!trimmed) return;
        onSend(trimmed, codeMode ? "CODE" : "TEXT", codeMode ? language : undefined);
        setContent("");
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        // Enter envía texto; en modo código, Enter hace salto de línea
        if (e.key === "Enter" && !e.shiftKey && !codeMode) {
            e.preventDefault();
            submit();
        }
    };

    return (
        <div className="border-t p-3 space-y-2">
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant={codeMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCodeMode((v) => !v)}
                >
                    <Code2 className="h-4 w-4 mr-1" /> Código
                </Button>
                {codeMode && (
                    <Input
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        placeholder="lenguaje (ej: java)"
                        className="h-9 w-44"
                    />
                )}
            </div>
            <div className="flex gap-2 items-end">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder={codeMode ? "Pega tu fragmento de código…" : "Escribe un mensaje…"}
                    rows={codeMode ? 5 : 1}
                    className={codeMode ? "font-mono text-sm" : "text-base"}
                    disabled={disabled}
                />
                <Button onClick={submit} disabled={disabled || !content.trim()} size="icon">
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}