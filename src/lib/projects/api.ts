import "server-only";

import { apiFetch } from "@/lib/api/client";
import type { Application, PaginatedProjects, Project, ProjectFilters } from "./types";

export function listProjects(
    filters: ProjectFilters = {},
    token?: string | null,
): Promise<PaginatedProjects> {
    const search = new URLSearchParams();
    if (filters.technologyIds?.length) search.set("technologyIds", filters.technologyIds.join(","));
    if (filters.page != null) search.set("page", String(filters.page));
    if (filters.size != null) search.set("size", String(filters.size));
    if (filters.userId != null) search.set("userId", String(filters.userId));
    const qs = search.toString();
    return apiFetch<PaginatedProjects>(`/api/projects${qs ? `?${qs}` : ""}`, {
        token,
        cache: "no-store",
    });
}

export function getProject(id: number | string, token?: string | null): Promise<Project> {
    return apiFetch<Project>(`/api/projects/${id}`, { token, cache: "no-store" });
}

export interface CreateProjectPayload {
    title: string;
    description: string;
    technologyIds: number[];
}

export function createProject(payload: CreateProjectPayload, token: string): Promise<Project> {
    return apiFetch<Project>("/api/projects", { method: "POST", token, body: payload });
}

export function listApplicationsForProject(
    projectId: number | string,
    token: string,
): Promise<Application[]> {
    return apiFetch<Application[]>(`/api/projects/${projectId}/applications`, {
        token,
        cache: "no-store",
    });
}

export function applyToProject(
    projectId: number | string,
    token: string,
    message?: string,
): Promise<Application> {
    return apiFetch<Application>(`/api/projects/${projectId}/apply`, {
        method: "POST",
        token,
        body: message ? { message } : {},
    });
}

export function acceptApplication(
    projectId: number | string,
    applicationId: number | string,
    token: string,
): Promise<Application> {
    return apiFetch<Application>(
        `/api/projects/${projectId}/applications/${applicationId}/accepted`,
        { method: "PUT", token },
    );
}

export function rejectApplication(
    projectId: number | string,
    applicationId: number | string,
    token: string,
): Promise<Application> {
    return apiFetch<Application>(
        `/api/projects/${projectId}/applications/${applicationId}/rejected`,
        { method: "PUT", token },
    );
}

export function publishProject(projectId: number | string, token: string): Promise<Project> {
    return apiFetch<Project>(`/api/projects/${projectId}/publish`, { method: "PUT", token });
}

export function startDevelopment(projectId: number | string, token: string): Promise<Project> {
    return apiFetch<Project>(`/api/projects/${projectId}/start-development`, {
        method: "POST",
        token,
    });
}

export function completeProject(projectId: number | string, token: string): Promise<Project> {
    return apiFetch<Project>(`/api/projects/${projectId}/complete`, { method: "POST", token });
}

export async function listMyProjects(token: string): Promise<Project[]> {
    const res = await apiFetch<{ content: Project[] }>("/api/projects/my?size=100", { token, cache: "no-store" });
    return res.content;
}
export async function listMyDrafts(token: string): Promise<Project[]> {
    const res = await apiFetch<{ content: Project[] }>("/api/projects/my/drafts?size=100", { token, cache: "no-store" });
    return res.content;
}
export function listCollaborating(token: string): Promise<Project[]> {
    return apiFetch<Project[]>("/api/projects/my/collaborating", { token, cache: "no-store" });
}