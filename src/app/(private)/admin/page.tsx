import Link from "next/link";
import { FiBarChart2, FiUsers } from "react-icons/fi";
import { tryOr } from "@/lib/api/safe";
import { requireRole } from "@/lib/auth/session";
import { ELEVATED_ROLES } from "@/lib/auth/types";
import { getStatistics } from "@/lib/admin/api";

export default async function AdminHomePage() {
    const session = await requireRole(ELEVATED_ROLES);
    const stats = await tryOr(getStatistics(session.token), null);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-card/50 px-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-brand">Administración</h2>
            </header>
            <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
                <p className="text-muted-foreground">Hola {session.user.name}, gestiona la plataforma desde aquí.</p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat label="Usuarios" value={stats?.totalUsers} />
                    <Stat label="Proyectos" value={stats?.totalProjects} />
                    <Stat label="Debates" value={stats?.totalDiscussions} />
                    <Stat label="Comentarios" value={stats?.totalComments} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Link href="/admin/users" className="flex items-center gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40">
                        <FiUsers className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-medium">Gestión de usuarios</p>
                            <p className="text-sm text-muted-foreground">Roles, suspensión y reactivación</p>
                        </div>
                    </Link>
                    <Link href="/admin/analytics" className="flex items-center gap-3 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40">
                        <FiBarChart2 className="h-6 w-6 text-primary" />
                        <div>
                            <p className="font-medium">Analíticas</p>
                            <p className="text-sm text-muted-foreground">Métricas de la plataforma</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value?: number }) {
    return (
        <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-2xl font-bold">{value ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
}