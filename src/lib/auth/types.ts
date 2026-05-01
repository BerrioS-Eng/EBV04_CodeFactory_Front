export const ROLES = ["developer", "admin", "moderator"] as const;
export type Role = (typeof ROLES)[number];

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: Role;
    status: "active" | "suspended";
    stack: string[];
    bio: string | null;
    avatar: string | null;
    createdAt: string;
    projectsCount: number;
    collaborationsCount: number;
    githubUrl: string | null;
    gitlabUrl: string | null;
}

export interface AuthResponse {
    token: string;
    expiresAt: string;
    user: AuthUser;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    stack: string[];
}

export interface Session {
    token: string;
    expiresAt: string;
    user: AuthUser;
}

export interface Technology {
    id: string;
    name: string;
}

export type FieldErrors = Partial<Record<string, string>>;

export type ActionState =
    | { ok: false; message?: string; fieldErrors?: FieldErrors }
    | { ok: true }
    | undefined;

export const ELEVATED_ROLES: readonly Role[] = ["admin", "moderator"] as const;

export function hasRole(user: { role: Role } | null | undefined, allowed: readonly Role[]): boolean {
    return !!user && allowed.includes(user.role);
}
