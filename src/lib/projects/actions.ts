"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/lib/api/client";
import { requireSession } from "@/lib/auth/session";
import type { ActionState } from "@/lib/auth/types";
import {
    acceptApplication,
    applyToProject,
    completeProject,
    publishProject,
    rejectApplication,
    startDevelopment,
} from "./api";

function fail(error: unknown): ActionState {
    if (error instanceof ApiError) return { ok: false, message: error.message };
    return { ok: false, message: "No se pudo completar la operación." };
}

function refresh(projectId: number | string): void {
    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath("/dashboard");
}

export async function applyAction(
    projectId: number | string,
    _state: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const { token } = await requireSession();
    const message = (formData.get("message") ?? "").toString().trim();
    try {
        await applyToProject(projectId, token, message || undefined);
        refresh(projectId);
        return { ok: true };
    } catch (error) {
        return fail(error);
    }
}

export async function publishAction(projectId: number | string): Promise<ActionState> {
    const { token } = await requireSession();
    try {
        await publishProject(projectId, token);
        refresh(projectId);
        return { ok: true };
    } catch (error) {
        return fail(error);
    }
}

export async function startDevelopmentAction(projectId: number | string): Promise<ActionState> {
    const { token } = await requireSession();
    try {
        await startDevelopment(projectId, token);
        refresh(projectId);
        return { ok: true };
    } catch (error) {
        return fail(error);
    }
}

export async function completeAction(projectId: number | string): Promise<ActionState> {
    const { token } = await requireSession();
    try {
        await completeProject(projectId, token);
        refresh(projectId);
        return { ok: true };
    } catch (error) {
        return fail(error);
    }
}

export async function acceptApplicationAction(
    projectId: number | string,
    applicationId: number | string,
): Promise<ActionState> {
    const { token } = await requireSession();
    try {
        await acceptApplication(projectId, applicationId, token);
        refresh(projectId);
        return { ok: true };
    } catch (error) {
        return fail(error);
    }
}

export async function rejectApplicationAction(
    projectId: number | string,
    applicationId: number | string,
): Promise<ActionState> {
    const { token } = await requireSession();
    try {
        await rejectApplication(projectId, applicationId, token);
        refresh(projectId);
        return { ok: true };
    } catch (error) {
        return fail(error);
    }
}
