"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/lib/api/client";
import { requireRole } from "@/lib/auth/session";
import { ELEVATED_ROLES, type ActionState } from "@/lib/auth/types";
import * as adminApi from "./api";

function fail(error: unknown): ActionState {
    if (error instanceof ApiError) return { ok: false, message: error.message };
    return { ok: false, message: "No se pudo completar la operación." };
}

export async function changeRoleAction(userId: number, role: string): Promise<ActionState> {
    const session = await requireRole(ELEVATED_ROLES);
    if (session.user.role !== "admin") {
        return { ok: false, message: "Solo un administrador puede cambiar roles." };
    }
    try {
        await adminApi.updateUserRole(userId, role, session.token);
        revalidatePath("/admin/users");
        return { ok: true };
    } catch (e) { return fail(e); }
}

export async function suspendUserAction(userId: number): Promise<ActionState> {
    const session = await requireRole(ELEVATED_ROLES);
    try {
        await adminApi.suspendUser(userId, session.token);
        revalidatePath("/admin/users");
        return { ok: true };
    } catch (e) { return fail(e); }
}

export async function reactivateUserAction(userId: number): Promise<ActionState> {
    const session = await requireRole(ELEVATED_ROLES);
    try {
        await adminApi.reactivateUser(userId, session.token);
        revalidatePath("/admin/users");
        return { ok: true };
    } catch (e) { return fail(e); }
}