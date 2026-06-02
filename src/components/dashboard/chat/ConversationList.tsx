"use client";

import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/chat/types";

interface Props {
    conversations: Conversation[];
    activeId: number | null;
    onSelect: (c: Conversation) => void;
}

export function ConversationList({ conversations, activeId, onSelect }: Props) {
    return (
        <div className="w-72 border-r overflow-y-auto">
            {conversations.length === 0 && (
                <p className="p-4 text-sm text-muted-foreground">No tienes chats todavía.</p>
            )}
            {conversations.map((c) => (
                <button
                    key={c.id}
                    onClick={() => onSelect(c)}
                    className={cn(
                        "w-full text-left px-4 py-3 border-b hover:bg-muted/50 transition",
                        activeId === c.id && "bg-muted",
                    )}
                >
                    <p className="font-medium text-sm">{c.otherUser.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                        {c.lastMessage ?? "Sin mensajes"}
                    </p>
                </button>
            ))}
        </div>
    );
}