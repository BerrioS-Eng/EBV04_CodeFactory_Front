"use server";

import { requireSession } from "@/lib/auth/session";
import * as chatApi from "./api";
import type { ChatMessage, Conversation } from "./types";

export async function fetchConversations(): Promise<Conversation[]> {
    const session = await requireSession();
    return chatApi.listConversations(session.token);
}

export async function openConversation(recipientId: number): Promise<Conversation> {
    const session = await requireSession();
    return chatApi.startConversation(recipientId, session.token);
}

export async function fetchMessages(conversationId: number, page = 0): Promise<ChatMessage[]> {
    const session = await requireSession();
    return chatApi.getMessages(conversationId, session.token, page);
}