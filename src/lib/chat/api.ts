import "server-only";

import { apiFetch } from "@/lib/api/client";
import type { Conversation, ChatMessage } from "./types";

export function listConversations(token: string): Promise<Conversation[]> {
    return apiFetch<Conversation[]>("/api/conversations", { token, cache: "no-store" });
}

export function startConversation(recipientId: number, token: string): Promise<Conversation> {
    return apiFetch<Conversation>("/api/conversations", {
        method: "POST",
        token,
        body: { recipientId },
    });
}

export function getMessages(
    conversationId: number,
    token: string,
    page = 0,
    size = 30,
): Promise<ChatMessage[]> {
    return apiFetch<ChatMessage[]>(
        `/api/conversations/${conversationId}/messages?page=${page}&size=${size}`,
        { token, cache: "no-store" },
    );
}