"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
    FiBarChart2,
    FiFolder,
    FiHome,
    FiLogOut,
    FiMessageCircle,
    FiShield,
    FiUser,
    FiUsers,
} from "react-icons/fi";
import { logoutAction } from "@/lib/auth/actions";
import { ELEVATED_ROLES, hasRole, type AuthUser } from "@/lib/auth/types";

type IconType = ComponentType<{ className?: string; size?: number }>;

type MenuItem = { icon: IconType; label: string; path: string; exact?: boolean };

const MENU_ITEMS: MenuItem[] = [
    { icon: FiHome, label: "Dashboard", path: "/dashboard", exact: true },
    { icon: FiFolder, label: "Mis Proyectos", path: "/dashboard/projects", exact: true },
    { icon: FiMessageCircle, label: "Mensajes", path: "/messages" },
    { icon: FiUser, label: "Perfil", path: "/dashboard/profile" },
];

const ADMIN_ITEMS: MenuItem[] = [
    { icon: FiShield, label: "Administración", path: "/admin" },
    { icon: FiUsers, label: "Usuarios", path: "/admin/users" },
    { icon: FiBarChart2, label: "Analíticas", path: "/admin/analytics" },
];

export default function Sidebar({ user }: { user: AuthUser }) {
    const pathname = usePathname();
    const showAdmin = hasRole(user, ELEVATED_ROLES);

    return (
        <aside className="hidden md:flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface sticky top-0">
            <div className="flex h-16 items-center gap-3 border-b border-border px-6">
                <Link href="/" className="flex items-center gap-3">
                    <span
                        aria-hidden
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-brand font-mono text-sm font-bold text-background"
                    >
                        {">_"}
                    </span>
                    <span className="font-mono text-base font-bold tracking-tight text-brand">
                        DevCollab
                    </span>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
                <NavSection items={MENU_ITEMS} pathname={pathname} />
                {showAdmin && (
                    <>
                        <div className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Admin
                        </div>
                        <NavSection items={ADMIN_ITEMS} pathname={pathname} />
                    </>
                )}
            </nav>

            <div className="border-t border-border p-3">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 font-mono text-sm text-brand">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.role}</p>
                    </div>
                </div>
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                    >
                        <FiLogOut className="h-4 w-4" />
                        <span>Cerrar sesión</span>
                    </button>
                </form>
            </div>
        </aside>
    );
}

function NavSection({ items, pathname }: { items: MenuItem[]; pathname: string }) {
    return (
        <ul className="space-y-1">
            {items.map(({ icon: Icon, label, path, exact }) => {
                const active = exact
                    ? pathname === path
                    : pathname === path || pathname.startsWith(path + "/");
                return (
                    <li key={path}>
                        <Link
                            href={path}
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-lg transition-colors ${
                                active
                                    ? "bg-brand/10 text-brand"
                                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                            }`}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{label}</span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
