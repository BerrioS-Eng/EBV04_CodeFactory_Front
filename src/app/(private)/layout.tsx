import type { ReactNode } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import RealtimeNotifications from "@/components/dashboard/notifications/RealtimeNotifications";
import { requireSession } from "@/lib/auth/session";

export default async function PrivateLayout({ children }: { children: ReactNode }) {
    const session = await requireSession();
    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar user={session.user} />
            <main className="flex-1 min-w-0">{children}</main>
            <RealtimeNotifications token={session.token} />
        </div>
    );
}