"use client";

import { useMemo, useState, useTransition, type ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
    FiAlertCircle,
    FiBell,
    FiCheck,
    FiCheckCircle,
    FiMail,
    FiMessageCircle,
    FiMessageSquare,
    FiPlay,
    FiSend,
    FiUser,
    FiUsers,
    FiUserX,
} from "react-icons/fi";
import { toast } from "sonner";
import {
    markAllAsReadAction,
    markAsReadAction,
} from "@/lib/notifications/actions";
import type { Notification, NotificationType } from "@/lib/notifications/types";
import { relativeTime } from "@/lib/format/relative-time";

type IconType = ComponentType<{ size?: number; className?: string }>;

const ICONS: Record<NotificationType, IconType> = {
    application_received: FiUsers,
    application_accepted: FiCheckCircle,
    application_rejected: FiAlertCircle,
    project_published: FiSend,
    project_started: FiPlay,
    profile_updated: FiUser,
    application_withdrawn: FiUserX,
    new_comment: FiMessageSquare,
    new_message: FiMail,
    new_discussion: FiMessageCircle,
};

const COLORS: Record<NotificationType, string> = {
    application_received: "text-primary",
    application_accepted: "text-brand",
    application_rejected: "text-destructive",
    project_published: "text-secondary",
    project_started: "text-secondary",
    profile_updated: "text-primary",
    application_withdrawn: "text-primary",
    new_comment: "text-secondary",
    new_message: "text-brand",
    new_discussion: "text-primary",
};

type Filter = "all" | "unread";

export default function NotificationsList({
    notifications,
}: {
    notifications: Notification[];
}) {
    const router = useRouter();
    const [filter, setFilter] = useState<Filter>("all");
    const [pending, start] = useTransition();

    const unreadCount = notifications.filter((n) => !n.read).length;
    const filtered = useMemo(
        () => (filter === "all" ? notifications : notifications.filter((n) => !n.read)),
        [filter, notifications],
    );

    const handleClick = (n: Notification) => {
        if (n.read) {
            if (n.link) router.push(n.link);
            return;
        }
        start(async () => {
            const result = await markAsReadAction(n.id);
            if (!result?.ok) toast.error(result?.message ?? "Error al marcar como leída");
            if (n.link) router.push(n.link);
        });
    };

    const handleMarkOne = (id: number) =>
        start(async () => {
            const result = await markAsReadAction(id);
            if (!result?.ok) toast.error(result?.message ?? "Error al marcar como leída");
        });

    const handleMarkAll = () =>
        start(async () => {
            const result = await markAllAsReadAction();
            if (result?.ok) toast.success("Todas las notificaciones marcadas como leídas");
            else toast.error(result?.message ?? "Error al marcar notificaciones");
        });

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="flex h-full items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center border border-brand rounded-lg bg-brand/20">
                            <FiBell className="h-5 w-5 text-brand font-bold" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-none">Notificaciones</h2>
                            <p className="text-lg text-muted-foreground">
                                {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
                            </p>
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAll}
                            disabled={pending}
                            className="flex items-center gap-2 rounded-md px-4 py-2 text-lg text-primary transition-colors hover:bg-brand/20 disabled:opacity-50"
                        >
                            <FiCheckCircle size={16} />
                            <span>Marcar todas como leídas</span>
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-4xl px-6 py-8">
                    <div role="tablist" className="mb-6 flex gap-2">
                        <FilterTab
                            active={filter === "all"}
                            label={`Todas (${notifications.length})`}
                            onClick={() => setFilter("all")}
                        />
                        <FilterTab
                            active={filter === "unread"}
                            label={`Sin leer (${unreadCount})`}
                            onClick={() => setFilter("unread")}
                        />
                    </div>

                    {filtered.length === 0 ? (
                        <EmptyState filter={filter} />
                    ) : (
                        <ul className="space-y-2">
                            {filtered.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    notification={n}
                                    onSelect={handleClick}
                                    onMarkRead={handleMarkOne}
                                    pending={pending}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function FilterTab({
    active,
    label,
    onClick,
}: {
    active: boolean;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={`rounded-md px-4 py-2 transition-colors ${active
                ? "border border-brand bg-brand/20 text-brand"
                : "border border-transparent text-foreground/70 hover:bg-accent"
                }`}
        >
            {label}
        </button>
    );
}

function NotificationItem({
    notification,
    onSelect,
    onMarkRead,
    pending,
}: {
    notification: Notification;
    onSelect: (n: Notification) => void;
    onMarkRead: (id: number) => void;
    pending: boolean;
}) {
    const Icon = ICONS[notification.type] ?? FiBell;
    const color = COLORS[notification.type] ?? "text-primary";

    return (
        <li>
            <div
                role="button"
                tabIndex={0}
                onClick={() => onSelect(notification)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelect(notification);
                    }
                }}
                className={`group flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors ${notification.read
                    ? "border-border bg-card hover:border-primary/30"
                    : "border-brand/40 bg-primary/5 hover:border-primary/40"
                    }`}
            >
                <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${notification.read ? "bg-muted/50" : "bg-primary/10"
                        }`}
                >
                    <Icon size={20} className={color} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-start justify-between gap-4">
                        <h4
                            className={`font-medium ${notification.read ? "text-foreground/80" : "text-foreground"
                                }`}
                        >
                            {notification.title}
                        </h4>
                        <span className="shrink-0 text-xs text-muted-foreground">
                            {relativeTime(notification.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    {notification.link && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(notification); // marca como leída y navega a n.link
                            }}
                            className="mt-2 inline-flex items-center gap-1 rounded-md border border-border px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-accent"
                        >
                            Detalle
                        </button>
                    )}
                </div>

                {!notification.read && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMarkRead(notification.id);
                        }}
                        disabled={pending}
                        title="Marcar como leída"
                        aria-label="Marcar como leída"
                        className="shrink-0 rounded-md p-2 opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 disabled:opacity-50"
                    >
                        <FiCheck size={16} className="text-primary" />
                    </button>
                )}
            </div>
        </li>
    );
}

function EmptyState({ filter }: { filter: Filter }) {
    return (
        <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
                <FiBell size={40} className="text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-medium">
                {filter === "unread"
                    ? "No tienes notificaciones sin leer"
                    : "No tienes notificaciones"}
            </h3>
            <p className="text-sm text-muted-foreground">
                {filter === "unread"
                    ? "Todas tus notificaciones están al día"
                    : "Recibirás notificaciones sobre tus proyectos y colaboraciones"}
            </p>
        </div>
    );
}
