import NotificationsList from "@/components/dashboard/notifications/NotificationsList";
import { tryOr } from "@/lib/api/safe";
import { requireSession } from "@/lib/auth/session";
import { listNotifications } from "@/lib/notifications/api";

export default async function NotificationsPage() {
    const { token } = await requireSession();
    const notifications = await tryOr(listNotifications(token), []);
    return <NotificationsList notifications={notifications} />;
}
