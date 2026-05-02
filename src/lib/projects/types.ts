import type { AuthUser } from "@/lib/auth/types";

export const PROJECT_STATUSES = [
    "draft",
    "seeking_collaborators",
    "in_development",
    "completed",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface ProjectCollaborator {
    id: number;
    name: string;
    avatar?: string | null;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    stackRequired: string[];
    status: ProjectStatus;
    creatorId: number;
    creator: Pick<AuthUser, "id" | "name" | "avatar"> & Partial<AuthUser>;
    collaborators: ProjectCollaborator[];
    createdAt: string;
    updatedAt: string;
    startedAt: string | null;
    completedAt: string | null;
    applicationCount: number;
    canApply: boolean;
}

export interface ProjectFilters {
    technologyIds?: string[];
    page?: number;
    size?: number;
}

export interface PaginatedProjects {
    content: Project[];
    totalElements: number;
    number: number;
    size: number;
    totalPages: number;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
    draft: "Borrador",
    seeking_collaborators: "Buscando Colaboradores",
    in_development: "En Desarrollo",
    completed: "Completado",
};

export const APPLICATION_STATUSES = ["pending", "accepted", "rejected", "closed"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface Application {
    id: number;
    projectId: number;
    applicantId: number;
    applicant: Pick<AuthUser, "id" | "name" | "email" | "stack" | "avatar"> & Partial<AuthUser>;
    message: string | null;
    status: ApplicationStatus;
    createdAt: string;
    updatedAt: string;
}
