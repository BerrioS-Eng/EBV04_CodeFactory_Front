import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role, Session } from "./types";

export const SESSION_COOKIE = "devlink_session";

export async function setSession(session: Session): Promise<void> {
    const store = await cookies();
    const expires = new Date(session.expiresAt);
    store.set(SESSION_COOKIE, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: Number.isFinite(expires.getTime()) ? expires : undefined,
    });
}

export async function clearSession(): Promise<void> {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
}

export const getSession = cache(async (): Promise<Session | null> => {
    const store = await cookies();
    const raw = store.get(SESSION_COOKIE)?.value;
    if (!raw) return null;
    try {
        const session = JSON.parse(raw) as Session;
        if (new Date(session.expiresAt).getTime() <= Date.now()) return null;
        return session;
    } catch {
        return null;
    }
});

export async function requireSession(): Promise<Session> {
    const session = await getSession();
    if (!session) redirect("/login");
    return session;
}

export async function requireRole(allowed: readonly Role[]): Promise<Session> {
    const session = await requireSession();
    if (!allowed.includes(session.user.role)) redirect("/dashboard");
    return session;
}
