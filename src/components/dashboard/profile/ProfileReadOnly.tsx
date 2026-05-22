import { FiCalendar, FiCode, FiGithub, FiGitlab, FiMail } from "react-icons/fi";
import type { AuthUser, Technology } from "@/lib/auth/types";
import TechnologyChips from "@/components/dashboard/TechnologyChips";

export interface ProfileReadOnlyProps {
    user: AuthUser;
    technologies: Technology[];
}

export default function ProfileReadOnly({ user, technologies }: ProfileReadOnlyProps) {
    return (
        <div className="space-y-6">
            <section className="rounded-lg border border-border bg-card p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h3 className="mb-6 text-lg font-semibold">Información Personal</h3>

                <div className="space-y-6">
                    <Row label="Nombre completo">
                        <p className="rounded-md bg-muted/30 px-4 py-2.5">{user.name}</p>
                    </Row>

                    <Row label="Correo electrónico" icon={<FiMail size={16} />}>
                        <p className="rounded-md bg-muted/30 px-4 py-2.5 text-muted-foreground">
                            {user.email}{" "}
                            <span className="text-xs">(no modificable)</span>
                        </p>
                    </Row>

                    <Row label="Biografía">
                        <div className="rounded-md bg-muted/30 px-4 py-2.5">
                            {user.bio ? (
                                <p className="whitespace-pre-wrap">{user.bio}</p>
                            ) : (
                                <span className="italic text-muted-foreground">Sin biografía</span>
                            )}
                        </div>
                    </Row>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Row label="GitHub" icon={<FiGithub size={16} />}>
                            <ProfileLink url={user.githubUrl} />
                        </Row>
                        <Row label="GitLab" icon={<FiGitlab size={16} />}>
                            <ProfileLink url={user.gitlabUrl} />
                        </Row>
                    </div>

                    <Row label="Miembro desde" icon={<FiCalendar size={16} />}>
                        <p className="rounded-md bg-muted/30 px-4 py-2.5">
                            {formatDate(user.createdAt)}
                        </p>
                    </Row>
                </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-6 flex items-center gap-2">
                    <FiCode className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Stack Técnico</h3>
                </div>
                <TechnologyChips ids={user.stack} technologies={technologies} />
            </section>
        </div>
    );
}

function Row({
    label,
    icon,
    children,
}: {
    label: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-foreground/80">
                {icon}
                <span>{label}</span>
            </div>
            {children}
        </div>
    );
}

function ProfileLink({ url }: { url: string | null }) {
    if (!url) {
        return (
            <p className="rounded-md bg-muted/30 px-4 py-2.5">
                <span className="italic text-muted-foreground">Sin enlace</span>
            </p>
        );
    }
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate rounded-md bg-muted/30 px-4 py-2.5 text-primary hover:underline"
        >
            {url}
        </a>
    );
}

function formatDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}