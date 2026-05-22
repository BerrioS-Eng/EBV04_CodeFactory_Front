import { FiUser } from "react-icons/fi";
import type { AuthUser } from "@/lib/auth/types";

export default function ProfileCard({ user }: { user: AuthUser }) {
    const totalParticipations = user.projectsCount + user.collaborationsCount;

    return (
        <div className="mb-6 overflow-hidden rounded-lg border border-border bg-card animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20" />
            <div className="px-8 pb-8">
                <div className="-mt-16 mb-6 flex items-end gap-6">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-border bg-card">
                        <FiUser size={48} className="text-primary" />
                    </div>
                    <div className="flex-1 pt-16">
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <span
                                className="rounded-md border border-brand/20 bg-primary/10 px-3 py-1 text-xs font-medium text-brand"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {user.role.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-border pt-6">
                    <Stat value={user.projectsCount} label="Proyectos creados" tone="brand" />
                    <Stat value={user.collaborationsCount} label="Colaboraciones" tone="secondary" />
                    <Stat value={totalParticipations} label="Total participaciones" tone="brand" />
                </div>
            </div>
        </div>
    );
}

function Stat({
    value,
    label,
    tone,
}: {
    value: number;
    label: string;
    tone: "primary" | "secondary" | "brand";
}) {
    const color = tone === "primary"
        ? "text-primary"
        : tone === "secondary"
            ? "text-secondary"
            : "text-brand";
    return (
        <div className="text-center">
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
}