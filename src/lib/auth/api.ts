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

export function listTechnologies(): Promise<Technology[]> {
    return apiFetch<Technology[]>("/api/technologies", {
        next: { revalidate: 3600 },
    });
}
