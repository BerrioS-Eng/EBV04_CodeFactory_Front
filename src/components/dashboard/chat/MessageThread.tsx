"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { CodeMessage } from "./CodeMessage";
import type { ChatMessage } from "@/lib/chat/types";

interface Props {
    messages: ChatMessage[];
    currentUserId: number;
}

export function MessageThread({ messages, currentUserId }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m) => {
                const mine = m.senderId === currentUserId;
                return (
                    <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                        <div
                            className={cn(
                                "max-w-[75%] rounded-lg px-4 py-2.5",
                                mine ? "bg-primary text-primary-foreground" : "bg-muted",
                            )}
                        >
                            {m.type === "CODE" ? (
                                <CodeMessage code={m.content} language={m.language} />
                            ) : (
                                <p className="whitespace-pre-wrap wrap-break-word text-base">{m.content}</p>
                            )}
                            <span className="block mt-1 text-xs opacity-70">
                                {new Date(m.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>
                );
            })}
            <div ref={bottomRef} />
        </div>
    );
}