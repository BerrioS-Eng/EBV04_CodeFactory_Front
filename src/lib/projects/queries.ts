import type { AuthUser } from "@/lib/auth/types";
import type { Project } from "./types";

export interface ProjectBuckets {
    created: Project[];
    drafts: Project[];
    collaborating: Project[];
}

export function bucketProjectsByUser(projects: Project[], userId: AuthUser["id"]): ProjectBuckets {
    const created: Project[] = [];
    const drafts: Project[] = [];
    const collaborating: Project[] = [];

    for (const project of projects) {
        const isCreator = project.creatorId === userId;
        if (isCreator && project.status === "draft") drafts.push(project);
        else if (isCreator) created.push(project);
        else if (project.collaborators.some((c) => c.id === userId)) collaborating.push(project);
    }
    return { created, drafts, collaborating };
}
