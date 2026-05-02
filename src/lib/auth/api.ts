import "server-only";

import { apiFetch } from "@/lib/api/client";
import type {
    AuthResponse,
    AuthUser,
    LoginPayload,
    RegisterPayload,
    Technology,
} from "./types";

export function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/api/auth/login", { method: "POST", body: payload });
}

export function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
    return apiFetch<AuthResponse>("/api/auth/register", { method: "POST", body: payload });
}

export function getCurrentUser(token: string): Promise<AuthUser> {
    return apiFetch<AuthUser>("/api/users/me", { token, cache: "no-store" });
}

export async function listTechnologies(): Promise<Technology[]> {
    const raw = await apiFetch<Array<{ id: string | number; name: string }>>(
        "/api/technologies",
        { next: { revalidate: 3600 } },
    );
    return raw.map((t) => ({ id: String(t.id), name: t.name }));
}
