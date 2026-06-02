import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import { tryOr, tryOrNull } from "@/lib/api/safe";
import { listTechnologies } from "@/lib/auth/api";
import { requireSession } from "@/lib/auth/session";
import { getPublicProfile } from "@/lib/profile/api";
import ProfileReadOnly from "@/components/dashboard/profile/ProfileReadOnly";
import UserConnectActions from "@/components/dashboard/UserConnectActions";

export default async function PublicProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const { user, token } = await requireSession();

    const profile = await tryOrNull(getPublicProfile(id, token));
    if (!profile) notFound();

    const technologies = await tryOr(listTechnologies(), []);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card/50 px-6 backdrop-blur-sm">
                <Link href="/dashboard" aria-label="Volver" className="rounded-md p-2 transition-colors hover:bg-accent">
                    <FiArrowLeft size={20} />
                </Link>
                <h2 className="line-clamp-1 flex-1 text-xl font-semibold text-brand">{profile.name}</h2>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
                    <section className="flex flex-col items-start justify-between gap-4 rounded-lg border border-border bg-card p-6 sm:flex-row sm:items-center">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
                            <p className="text-sm capitalize text-muted-foreground">{profile.role}</p>
                        </div>
                        {/* En su propio perfil ya no mostramos "Ver perfil" */}
                        <UserConnectActions
                            userId={profile.id}
                            currentUserId={user.id}
                            size="md"
                            showProfileLink={false}
                        />
                    </section>

                    <ProfileReadOnly user={profile} technologies={technologies} />
                </div>
            </div>
        </div>
    );
}