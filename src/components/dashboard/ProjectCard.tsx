import Link from "next/link";
import { FiClock, FiUsers } from "react-icons/fi";
import type { Project, ProjectStatus } from "@/lib/projects/types";
import { STATUS_LABELS } from "@/lib/projects/types";

const STATUS_STYLES: Record<ProjectStatus, string> = {
    draft: "bg-muted/30 text-muted-foreground border-border/60",
    seeking_collaborators: "bg-brand/10 text-brand border-brand/30",
    in_development: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    completed: "bg-secondary/20 text-foreground border-secondary/40",
};

export default function ProjectCard({
    project,
    technologyName,
}: {
    project: Project;
    technologyName: (id: string) => string;
}) {
    const stack = project.stackRequired.slice(0, 4);
    const extra = project.stackRequired.length - stack.length;

    return (
        <Link
            href={`/dashboard/projects/${project.id}`}
            className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand/40"
        >
            <div className="mb-3 flex items-center justify-between gap-2">
                <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STATUS_STYLES[project.status]}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    {STATUS_LABELS[project.status]}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <FiClock className="h-3 w-3" />
                    {formatDate(project.createdAt)}
                </span>
            </div>

            <h3 className="mb-2 line-clamp-1 text-lg font-semibold tracking-tight transition-colors group-hover:text-brand">
                {project.title}
            </h3>
            <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{project.description}</p>

            <div className="mb-4 flex flex-wrap gap-1.5">
                {stack.map((id) => (
                    <span
                        key={id}
                        className="rounded-md bg-muted/40 px-2 py-0.5 text-xs text-foreground/80"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        {technologyName(id)}
                    </span>
                ))}
                {extra > 0 && (
                    <span className="rounded-md bg-muted/40 px-2 py-0.5 text-xs text-muted-foreground">
                        +{extra}
                    </span>
                )}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="truncate">por {project.creator.name}</span>
                <span className="flex items-center gap-1">
                    <FiUsers className="h-3 w-3" />
                    {project.applicationCount}
                </span>
            </div>
        </Link>
    );
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("es", { day: "2-digit", month: "short" });
}
