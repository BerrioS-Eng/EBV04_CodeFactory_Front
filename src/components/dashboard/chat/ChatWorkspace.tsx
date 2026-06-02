"use client";

import { useCallback, useEffect, useState } from "react";
import { useChatSocket } from "@/hooks/useChatSocket";
import { fetchMessages } from "@/lib/chat/actions";
import { ConversationList } from "./ConversationList";
import { MessageThread } from "./MessageThread";
import { MessageComposer } from "./MessageComposer";
import type { ChatMessage, Conversation, MessageType } from "@/lib/chat/types";

interface Props {
    token: string;
    currentUserId: number;
    initialConversations: Conversation[];
    initialConversationId?: number | null;
}

export function ChatWorkspace({
    token,
    currentUserId,
    initialConversations,
    initialConversationId = null,
}: Props) {
    const [conversations] = useState(initialConversations);
    const [active, setActive] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const onIncoming = useCallback(
        (msg: ChatMessage) => {
            setActive((current) => {
                if (current && msg.conversationId === current.id) {
                    setMessages((prev) =>
                        prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
                    );
                }
                return current;
            });
        },
        [],
    );

    const { connected, sendMessage } = useChatSocket(token, onIncoming);

    const selectConversation = useCallback(async (c: Conversation) => {
        setActive(c);
        const history = await fetchMessages(c.id); // viene desc → invertir a asc
        setMessages([...history].reverse());
    }, []);

    useEffect(() => {
        if (initialConversationId == null) return;
        const target = conversations.find((c) => c.id === initialConversationId);
        if (target) void selectConversation(target);
    }, [initialConversationId, conversations, selectConversation]);

    const handleSend = (content: string, type: MessageType, language?: string) => {
        if (!active) return;
        sendMessage({ conversationId: active.id, content, type, language });
        // El propio mensaje vuelve por /user/queue/messages (eres participante),
        // así que no hacemos optimistic update para evitar duplicados.
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
            <ConversationList
                conversations={conversations}
                activeId={active?.id ?? null}
                onSelect={selectConversation}
            />
            <div className="flex-1 flex flex-col">
                {active ? (
                    <>
                        <div className="border-b px-4 py-3 flex items-center justify-between">
                            <span className="font-medium">{active.otherUser.fullName}</span>
                            <span className={`text-xs ${connected ? "text-green-600" : "text-muted-foreground"}`}>
                                {connected ? "● en línea" : "○ conectando…"}
                            </span>
                        </div>
                        <MessageThread messages={messages} currentUserId={currentUserId} />
                        <MessageComposer disabled={!connected} onSend={handleSend} />
                    </>
                ) : (
                    <div className="flex-1 grid place-items-center text-muted-foreground">
                        Selecciona una conversación
                    </div>
                )}
            </div>
        </div>
    );
}