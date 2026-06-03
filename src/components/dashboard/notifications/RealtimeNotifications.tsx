"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Client, type IMessage } from "@stomp/stompjs";
import { toast } from "sonner";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/ws";

interface IncomingNotification {
    id: number;
    type: string;
    title: string;
    message: string;
    read: boolean;
    link: string | null;
    createdAt: string;
}

export default function RealtimeNotifications({ token }: { token: string }) {
    const router = useRouter();
    const routerRef = useRef(router);

    useEffect(() => {
        routerRef.current = router;
    });

    useEffect(() => {
        const client = new Client({
            brokerURL: WS_URL,
            connectHeaders: { Authorization: `Bearer ${token}` },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            onConnect: () => {
                client.subscribe("/user/queue/notifications", (frame: IMessage) => {
                    const n = JSON.parse(frame.body) as IncomingNotification;
                    toast(n.title, {
                        description: n.message,
                        action: n.link
                            ? { label: "Ver", onClick: () => routerRef.current.push(n.link!) }
                            : undefined,
                    });
                    // refresca la lista de notificaciones / badges si están montados
                    routerRef.current.refresh();
                });
            },
        });
        client.activate();
        return () => { void client.deactivate(); };
    }, [token]);

    return null;
}