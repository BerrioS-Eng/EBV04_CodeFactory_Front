import "server-only";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

export class ApiError extends Error {
    constructor(
        public status: number,
        public body: unknown,
        message?: string,
    ) {
        super(message ?? `Request failed (${status})`);
    }
}

interface RequestOptions extends Omit<RequestInit, "body" | "headers"> {
    body?: unknown;
    token?: string | null;
    headers?: Record<string, string>;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, token, headers, ...rest } = options;
    const res = await fetch(`${BACKEND_URL}${path}`, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        body: body == null ? undefined : JSON.stringify(body),
    });

    const text = await res.text();
    const data = text ? safeJson(text) : null;

    if (!res.ok) {
        const message = isErrorBody(data) ? data.message : undefined;
        throw new ApiError(res.status, data, message);
    }
    return data as T;
}

function safeJson(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function isErrorBody(value: unknown): value is { message: string } {
    return typeof value === "object" && value !== null && "message" in value && typeof (value as { message: unknown }).message === "string";
}
