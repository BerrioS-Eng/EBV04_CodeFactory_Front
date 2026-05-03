import "server-only";

import { ApiError } from "./client";

export async function tryOr<T>(promise: Promise<T>, fallback: T): Promise<T> {
    try {
        return await promise;
    } catch {
        return fallback;
    }
}

export async function tryOrNull<T>(
    promise: Promise<T>,
    swallowStatuses: readonly number[] = [403, 404],
): Promise<T | null> {
    try {
        return await promise;
    } catch (error) {
        if (error instanceof ApiError && swallowStatuses.includes(error.status)) return null;
        throw error;
    }
}
