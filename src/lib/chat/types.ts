export type MessageType = "TEXT" | "CODE";

export interface ChatUser {
    id: number;
    fullName: string;
    githubUrl: string | null;
}

export interface Conversation {
    id: number;
    otherUser: ChatUser;
    lastMessage: string | null;
    lastMessageAt: string;
}

export interface ChatMessage {
    id: number;
    conversationId: number;
    senderId: number;
    senderName: string;
    content: string;
    type: MessageType;
    language: string | null;
    createdAt: string;
}

export interface SendMessagePayload {
    conversationId: number;
    content: string;
    type: MessageType;
    language?: string | null;
}