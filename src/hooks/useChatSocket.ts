"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import type { ChatMessage, SendMessagePayload } from "@/lib/chat/types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws";

export function useChatSocket(token: string, onMessage: (msg: ChatMessage) => void) {
    const clientRef = useRef<Client | null>(null);
    const [connected, setConnected] = useState(false);

    // Mantener el callback fresco sin re-suscribir
    const handlerRef = useRef(onMessage);
    useEffect(() => { handlerRef.current = onMessage; }, [onMessage]);

    useEffect(() => {
        const client = new Client({
            brokerURL: WS_URL,
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            onConnect: () => {
                setConnected(true);
                client.subscribe("/user/queue/messages", (frame: IMessage) => {
                    handlerRef.current(JSON.parse(frame.body) as ChatMessage);
                });
            },
            onDisconnect: () => setConnected(false),
            onStompError: (f) => console.error("STOMP error:", f.headers["message"]),
        });

        client.activate();
        clientRef.current = client;

        return () => { void client.deactivate(); };
    }, [token]);

    const sendMessage = useCallback((payload: SendMessagePayload) => {
        const client = clientRef.current;
        if (!client?.connected) return;
        client.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(payload),
        });
    }, []);

    return { connected, sendMessage };
}