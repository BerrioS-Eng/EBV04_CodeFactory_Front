export const NOTIFICATION_TYPES = [
    "application_received",
    "application_accepted",
    "application_rejected",
    "project_published",
    "project_started",
    "profile_updated",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface Notification {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    read: boolean;
    link: string | null;
    createdAt: string;
}
