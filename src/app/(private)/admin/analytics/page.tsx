import { tryOr } from "@/lib/api/safe";
import { requireRole } from "@/lib/auth/session";
import { ELEVATED_ROLES } from "@/lib/auth/types";
import { getStatistics } from "@/lib/admin/api";
import AnalyticsView from "@/components/dashboard/admin/AnalyticsView";

export default async function AdminAnalyticsPage() {
    const session = await requireRole(ELEVATED_ROLES);
    const stats = await tryOr(getStatistics(session.token), null);
    return <AnalyticsView stats={stats} />;
}