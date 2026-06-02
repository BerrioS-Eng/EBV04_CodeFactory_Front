import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectExplorer from "@/components/dashboard/ProjectExplorer";
import { tryOr } from "@/lib/api/safe";
import { listTechnologies } from "@/lib/auth/api";
import { requireSession } from "@/lib/auth/session";
import { listProjects } from "@/lib/projects/api";

export default async function DashboardPage() {
    const { token } = await requireSession();

    const [projectsPage, technologies] = await Promise.all([
        tryOr(listProjects({ size: 50 }, token), null),
        tryOr(listTechnologies(), []),
    ]);
    const projects = projectsPage?.content ?? [];

    return (
        <div className="flex min-h-screen flex-col">
            <DashboardHeader
                title="Explorar Proyectos"
                badge={`${projects.length} proyectos`}
            />
            <div className="flex-1 overflow-y-auto">
                <ProjectExplorer initialProjects={projects} technologies={technologies} />
            </div>
        </div>
    );
}
