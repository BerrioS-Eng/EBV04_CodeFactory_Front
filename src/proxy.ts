import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { ELEVATED_ROLES, type Session } from "@/lib/auth/types";

const PUBLIC_AUTH_PATHS = ["/login", "/register"];
const PROTECTED_PREFIXES = ["/dashboard", "/my-projects", "/messages", "/profile", "/admin"];
const ADMIN_PREFIXES = ["/admin"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const session = readSession(request);

    if (!session && PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("from", pathname);
        return NextResponse.redirect(url);
    }

    if (session && PUBLIC_AUTH_PATHS.includes(pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        url.search = "";
        return NextResponse.redirect(url);
    }

    if (
        session &&
        ADMIN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/")) &&
        !ELEVATED_ROLES.includes(session.user.role)
    ) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        url.search = "";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

function readSession(request: NextRequest): Session | null {
    const raw = request.cookies.get(SESSION_COOKIE)?.value;
    if (!raw) return null;
    try {
        const session = JSON.parse(raw) as Session;
        if (new Date(session.expiresAt).getTime() <= Date.now()) return null;
        return session;
    } catch {
        return null;
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)$).*)"],
};
