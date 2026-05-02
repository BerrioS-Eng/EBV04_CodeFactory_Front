import Link from "next/link";
import { FiBell, FiMessageCircle, FiUser } from "react-icons/fi";
import type { AuthUser } from "@/lib/auth/types";

export interface DashboardHeaderProps {
    title: string;
    user: AuthUser;
    badge?: string;
    hasUnreadNotifications?: boolean;
}

export default function DashboardHeader({
    title,
    user,
    badge,
    hasUnreadNotifications = false,
}: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex h-full items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    {badge && (
                        <span
                            className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs text-brand"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            {badge}
                        </span>
                    )}
                </div>

                <nav className="flex items-center gap-3">
                    <IconLink
                        href="/notifications"
                        label="Notificaciones"
                        icon={<FiBell size={20} className="text-foreground/70" />}
                        dot={hasUnreadNotifications}
                    />
                    <IconLink
                        href="/messages"
                        label="Mensajes"
                        icon={<FiMessageCircle size={20} className="text-foreground/70" />}
                    />
                    <div className="h-6 w-px bg-border" />
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 rounded-md px-3 py-1.5 transition-colors hover:bg-accent"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                            <FiUser size={16} className="text-primary" />
                        </div>
                        <span className="text-sm">{user.name}</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}

function IconLink({
    href,
    label,
    icon,
    dot = false,
}: {
    href: string;
    label: string;
    icon: React.ReactNode;
    dot?: boolean;
}) {
    return (
        <Link
            href={href}
            aria-label={label}
            className="relative rounded-md p-2 transition-colors hover:bg-accent"
        >
            {icon}
            {dot && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />}
        </Link>
    );
}
