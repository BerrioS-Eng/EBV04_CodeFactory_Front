"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import type { ActionState } from "@/lib/auth/types";
import { listNotifications, markNotificationAsRead } from "./api";

function fail(error: unknown): ActionState {
    if (error instanceof ApiError) return { ok: false, message: error.message };
    return { ok: false, message: "No se pudo completar la operación." };
}

function refresh(): void {
    revalidatePath("/dashboard/notifications");
    revalidatePath("/dashboard");
}

export async function markAsReadAction(id: number | string): Promise<ActionState> {
    const { token } = await requireSession();
    try {
        await markNotificationAsRead(id, token);
        refresh();
        return { ok: true };
    } catch (error) {
        return fail(error);
    }
}

export async function markAllAsReadAction(): Promise<ActionState> {
    const { token } = await requireSession();
    try {
        const all = await listNotifications(token);
        const unread = all.filter((n) => !n.read);
        await Promise.all(unread.map((n) => markNotificationAsRead(n.id, token)));
        refresh();
        return { ok: true };
    } catch (error) {
        return fail(error);
    }
}
