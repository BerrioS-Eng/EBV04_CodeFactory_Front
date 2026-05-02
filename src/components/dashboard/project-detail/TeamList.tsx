import { FiCode, FiUsers } from "react-icons/fi";
import type { Project } from "@/lib/projects/types";

export default function TeamList({
    project,
    technologyName,
}: {
    project: Project;
    technologyName: (id: string) => string;
}) {
    return (
        <div className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold">Miembros del Equipo</h3>
            <div className="space-y-3">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                            <FiUsers size={24} className="text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">{project.creator.name}</p>
                            <p className="text-sm text-muted-foreground">Creador del proyecto</p>
                        </div>
                        <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                            OWNER
                        </span>
                    </div>
                </div>

                {project.collaborators.map((collab) => (
                    <div key={collab.id} className="rounded-lg border border-border p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                                <FiCode size={24} className="text-secondary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">{collab.name}</p>
                                <CollaboratorStack
                                    stack={"stack" in collab ? (collab.stack as string[] | undefined) : undefined}
                                    technologyName={technologyName}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CollaboratorStack({
    stack,
    technologyName,
}: {
    stack: string[] | undefined;
    technologyName: (id: string) => string;
}) {
    if (!stack?.length) return null;
    return (
        <div className="mt-1 flex flex-wrap gap-1">
            {stack.slice(0, 3).map((id) => (
                <span
                    key={id}
                    className="text-xs text-muted-foreground"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    {technologyName(id)}
                </span>
            ))}
        </div>
    );
}
