import "server-only";

import { apiFetch } from "@/lib/api/client";
import type { AuthUser } from "@/lib/auth/types";
import type { Statistics } from "./types";

export function listUsers(token: string): Promise<AuthUser[]> {
    return apiFetch<AuthUser[]>("/api/admin/users", { token, cache: "no-store" });
}
export function updateUserRole(id: number, role: string, token: string): Promise<AuthUser> {
    return apiFetch<AuthUser>(`/api/admin/users/${id}/role`, { method: "PATCH", token, body: { role } });
}
export function suspendUser(id: number, token: string): Promise<AuthUser> {
    return apiFetch<AuthUser>(`/api/admin/users/${id}/suspend`, { method: "POST", token });
}
export function reactivateUser(id: number, token: string): Promise<AuthUser> {
    return apiFetch<AuthUser>(`/api/admin/users/${id}/reactivate`, { method: "POST", token });
}
export function getStatistics(token: string): Promise<Statistics> {
    return apiFetch<Statistics>("/api/statistics", { token, cache: "no-store" });
}