"use server";

import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { loginRequest, registerRequest } from "./api";
import { clearSession, setSession } from "./session";
import type { ActionState } from "./types";
import { validateLogin, validateRegister } from "./validation";

function readString(formData: FormData, key: string): string {
    return (formData.get(key) ?? "").toString().trim();
}

function readStack(formData: FormData): string[] {
    const raw = formData.getAll("stack").map(String).filter(Boolean);
    if (raw.length) return raw;
    const joined = readString(formData, "stack");
    return joined ? joined.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

function fromApiError(error: unknown): ActionState {
    if (error instanceof ApiError) {
        return { ok: false, message: error.message };
    }
    return { ok: false, message: "No se pudo conectar con el servidor." };
}

export async function loginAction(_state: ActionState, formData: FormData): Promise<ActionState> {
    const email = readString(formData, "email");
    const password = formData.get("password")?.toString() ?? "";

    const fieldErrors = validateLogin({ email, password });
    if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

    try {
        const auth = await loginRequest({ email, password });
        await setSession(auth);
    } catch (error) {
        return fromApiError(error);
    }
    redirect("/dashboard");
}

export async function registerAction(_state: ActionState, formData: FormData): Promise<ActionState> {
    const name = readString(formData, "name");
    const email = readString(formData, "email");
    const password = formData.get("password")?.toString() ?? "";
    const confirmPassword = formData.get("confirmPassword")?.toString() ?? "";
    const stack = readStack(formData);

    const fieldErrors = validateRegister({ name, email, password, confirmPassword, stack });
    if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

    try {
        const auth = await registerRequest({ name, email, password, stack });
        await setSession(auth);
    } catch (error) {
        return fromApiError(error);
    }
    redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
    await clearSession();
    redirect("/login");
}
