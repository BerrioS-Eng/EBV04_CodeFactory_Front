import type { Technology } from "@/lib/auth/types";
import { makeTechnologyName } from "@/lib/technologies/utils";

export interface TechnologyChipsProps {
    ids: string[];
    technologies: Technology[];
    emptyMessage?: string;
}

export default function TechnologyChips({
    ids,
    technologies,
    emptyMessage = "Sin tecnologías",
}: TechnologyChipsProps) {
    const nameOf = makeTechnologyName(technologies);

    if (ids.length === 0) {
        return <p className="text-sm italic text-muted-foreground">{emptyMessage}</p>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {ids.map((id) => (
                <span
                    key={id}
                    className="rounded-md border border-brand/20 bg-secondary/10 px-3 py-1.5 text-brand"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    {nameOf(id)}
                </span>
            ))}
        </div>
    );
}