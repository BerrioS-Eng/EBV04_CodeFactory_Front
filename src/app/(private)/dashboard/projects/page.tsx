
import MyProjects from "@/components/dashboard/my-projects/MyProjects";
import { tryOr } from "@/lib/api/safe";
import { listTechnologies } from "@/lib/auth/api";
import { requireSession } from "@/lib/auth/session";
import { listProjects } from "@/lib/projects/api";
import { Button } from "@base-ui/react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { LuFolderKanban } from "react-icons/lu";

type TabType = 'created' | 'collaborating' | 'drafts';

export default async function Page() {
    const { user, token } = await requireSession();

    const [projectPage, technologies] = await Promise.all([
        tryOr(listProjects({ size: 50, userId: user.id }, token), null),
        tryOr(listTechnologies(), []),
    ]);


    return (
        <main className="flex-1 flex flex-col">
            <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
                <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-brand/20 rounded-lg flex items-center justify-center border border-brand">
                            <LuFolderKanban className="w-5 h-5 text-brand font-bold" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold leading-none">Mis Proyectos</h2>
                            <p className="text-ls text-muted-foreground mt-1">Gestiona tus proyectos y colaboraciones</p>
                        </div>
                    </div>

                    <Button className="font-mono gap-2">
                        <Link
                        href="/dashboard/projects/new"
                        className="flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-medium text-background transition-all hover:brightness-110"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        <FiPlus size={20} />
                        <span>NUEVO</span>
                    </Link>
                    </Button>
                </div>
            </header>
            <MyProjects
                initialProjects={projectPage?.content || []}
                user={user}
                technologies={technologies}
            />
        </main>
    );
}