import Link from "next/link";
import { FiBell, FiMessageCircle } from "react-icons/fi";

export interface DashboardHeaderProps {
    title: string;
    badge?: string;
    hasUnreadNotifications?: boolean;
}

export default function DashboardHeader({
    title,
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
                        href="/dashboard/notifications"
                        label="Notificaciones"
                        icon={<FiBell size={20} className="text-foreground/70" />}
                        dot={hasUnreadNotifications}
                    />
                    <IconLink
                        href="/dashboard/messages"
                        label="Mensajes"
                        icon={<FiMessageCircle size={20} className="text-foreground/70" />}
                    />
                    
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
            className="relative rounded-md p-2 transition-colors hover:bg-brand"
        >
            {icon}
            {dot && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />}
        </Link>
    );
}
