"use server";

import { revalidatePath } from "next/cache";
import { ApiError } from "@/lib/api/client";
import { getSession, requireSession, setSession } from "@/lib/auth/session";
import type { ActionState } from "@/lib/auth/types";
import { updateProfile } from "./api";
import { validateProfile } from "./validation";

function readString(formData: FormData, key: string): string {
    return (formData.get(key) ?? "").toString().trim();
}

function readStack(formData: FormData): string[] {
    return formData.getAll("stack")
        .map((value) => value.toString().trim())
        .filter((id) => id.length > 0);
}

function fail(error: unknown): ActionState {
    if (error instanceof ApiError) return { ok: false, message: error.message };
    return { ok: false, message: "No se pudo actualizar el perfil." };
}

export async function updateProfileAction(
    _state: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const { token } = await requireSession();

    const name = readString(formData, "fullName");
    const bio = readString(formData, "bio");
    const githubUrl = readString(formData, "githubUrl");
    const gitlabUrl = readString(formData, "gitlabUrl");
    const stack = readStack(formData);

    const fieldErrors = validateProfile({ fullName: name, bio, githubUrl, gitlabUrl });
    if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

    try {
        const updatedUser = await updateProfile(
            {
                name,
                bio: bio || null,
                githubUrl: githubUrl || null,
                gitlabUrl: gitlabUrl || null,
                stack,
            },
            token,
        );

        const session = await getSession();
        if (session) {
            await setSession({ ...session, user: updatedUser });
        }

        revalidatePath("/profile");
        return { ok: true };
    } catch (error) {
        return fail(error);
    }
}