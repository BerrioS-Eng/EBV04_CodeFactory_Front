import { FiFolder, FiMessageCircle, FiMessageSquare, FiUsers } from "react-icons/fi";
import type { Statistics } from "@/lib/admin/types";

export default function AnalyticsView({ stats }: { stats: Statistics | null }) {
    if (!stats) {
        return <div className="p-8 text-muted-foreground">No se pudieron cargar las estadísticas.</div>;
    }

    const cards = [
        { icon: FiUsers, label: "Usuarios", value: stats.totalUsers },
        { icon: FiFolder, label: "Proyectos", value: stats.totalProjects },
        { icon: FiMessageCircle, label: "Debates", value: stats.totalDiscussions },
        { icon: FiMessageSquare, label: "Comentarios", value: stats.totalComments },
    ];
    const maxProj = Math.max(1, ...stats.mostUsedTechnologies.map((t) => t.projectCount));

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-card/50 px-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-brand">Analíticas</h2>
            </header>

            <div className="mx-auto w-full max-w-6xl space-y-8 px-6 py-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((c) => (
                        <div key={c.label} className="rounded-lg border border-border bg-card p-5">
                            <c.icon className="mb-2 h-5 w-5 text-primary" />
                            <p className="text-2xl font-bold">{c.value}</p>
                            <p className="text-sm text-muted-foreground">{c.label}</p>
                        </div>
                    ))}
                </div>

                <section className="rounded-lg border border-border bg-card p-6">
                    <h3 className="mb-4 text-lg font-semibold">Tecnologías más usadas</h3>
                    {stats.mostUsedTechnologies.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Sin datos.</p>
                    ) : (
                        <ul className="space-y-3">
                            {stats.mostUsedTechnologies.map((t) => (
                                <li key={t.id}>
                                    <div className="mb-1 flex justify-between text-sm">
                                        <span className="font-medium">{t.name}</span>
                                        <span className="text-muted-foreground">{t.projectCount} proy. · {t.userCount} devs</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-muted">
                                        <div className="h-2 rounded-full bg-primary" style={{ width: `${(t.projectCount / maxProj) * 100}%` }} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}