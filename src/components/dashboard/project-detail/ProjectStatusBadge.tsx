import type { ProjectStatus } from "@/lib/projects/types";
import { STATUS_LABELS } from "@/lib/projects/types";

const STYLES: Record<ProjectStatus, string> = {
    draft: "bg-muted/30 text-muted-foreground",
    seeking_collaborators: "bg-brand/10 text-brand",
    in_development: "bg-amber-500/10 text-amber-400",
    completed: "bg-secondary/20 text-foreground",
};

export default function ProjectStatusBadge({
    status,
    size = "md",
}: {
    status: ProjectStatus;
    size?: "sm" | "md";
}) {
    const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-sm";
    return (
        <span
            className={`rounded-md font-medium ${padding} ${STYLES[status]}`}
            style={{ fontFamily: "var(--font-mono)" }}
        >
            {STATUS_LABELS[status]}
        </span>
    );
}
