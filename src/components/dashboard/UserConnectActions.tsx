"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiUser, FiMessageSquare } from "react-icons/fi";
import { toast } from "sonner";
import { openConversation } from "@/lib/chat/actions";

interface Props {
    userId: number;
    currentUserId: number;
    size?: "sm" | "md";
    showProfileLink?: boolean;
}

export default function UserConnectActions({
    userId,
    currentUserId,
    size = "sm",
    showProfileLink = true,
}: Props) {
    const router = useRouter();
    const [pending, startTransition] = useTransition();
    const isSelf = userId === currentUserId;

    // Si soy yo mismo, no muestro acciones (ni "Ver perfil" ni "Enviar mensaje").
    if (isSelf) return null;

    const pad = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

    const handleMessage = () => {
        startTransition(async () => {
            try {
                const conv = await openConversation(userId);
                router.push(`/dashboard/messages?c=${conv.id}`);
            } catch {
                toast.error("No se pudo abrir el chat");
            }
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {showProfileLink && (
                <Link
                    href={`/dashboard/users/${userId}`}
                    className={`inline-flex items-center gap-1.5 rounded-md border border-border ${pad} font-medium transition-colors hover:bg-accent`}
                >
                    <FiUser size={14} /> Ver perfil
                </Link>
            )}
            <button
                type="button"
                onClick={handleMessage}
                disabled={pending}
                className={`inline-flex items-center gap-1.5 rounded-md bg-primary ${pad} font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60`}
            >
                <FiMessageSquare size={14} /> {pending ? "Abriendo…" : "Enviar mensaje"}
            </button>
        </div>
    );
}