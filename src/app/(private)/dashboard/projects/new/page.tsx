import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { tryOr } from "@/lib/api/safe";
import { listTechnologies } from "@/lib/auth/api";
import { requireSession } from "@/lib/auth/session";
import CreateProjectForm from "@/components/dashboard/project-create/CreateProjectForm";

export default async function CreateProjectPage() {
    await requireSession();
    const technologies = await tryOr(listTechnologies(), []);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card/50 px-6 backdrop-blur-sm">
                <Link
                    href="/dashboard"
                    aria-label="Volver al dashboard"
                    className="rounded-md p-2 transition-colors hover:bg-accent"
                >
                    <FiArrowLeft size={20} />
                </Link>
                <h2 className="line-clamp-1 flex-1 text-lg font-semibold">Crear Nuevo Proyecto</h2>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-4xl px-6 py-8">
                    <div className="rounded-lg border border-border bg-card p-8">
                        <CreateProjectForm technologies={technologies} />
                    </div>
                </div>
            </div>
        </div>
    );
}
