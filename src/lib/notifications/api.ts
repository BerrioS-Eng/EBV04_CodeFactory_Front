import "server-only";

import { apiFetch } from "@/lib/api/client";
import type { Notification } from "./types";

export function listNotifications(token: string): Promise<Notification[]> {
    return apiFetch<Notification[]>("/api/notifications", { token, cache: "no-store" });
}

export function markNotificationAsRead(id: number | string, token: string): Promise<void> {
    return apiFetch<void>(`/api/notifications/${id}/read`, { method: "POST", token });
}
