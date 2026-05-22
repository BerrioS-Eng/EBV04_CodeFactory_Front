import { tryOr } from "@/lib/api/safe";
import { listTechnologies } from "@/lib/auth/api";
import { requireSession } from "@/lib/auth/session";
import ProfileView from "@/components/dashboard/profile/ProfileView";

export default async function ProfilePage() {
    const { user } = await requireSession();
    const technologies = await tryOr(listTechnologies(), []);

    return <ProfileView user={user} technologies={technologies} />;
}