import "server-only";

import { apiFetch } from "@/lib/api/client";
import type { AuthUser } from "@/lib/auth/types";
import type { UpdateProfilePayload } from "./types";

export function updateProfile(payload: UpdateProfilePayload, token: string): Promise<AuthUser> {
    return apiFetch<AuthUser>("/api/users/me", {
        method: "PUT",
        token,
        body: payload,
    });
}

export function getPublicProfile(id: number | string, token: string): Promise<AuthUser> {
    return apiFetch<AuthUser>(`/api/users/${id}`, { token, cache: "no-store" });
}