import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProjectExplorer from "@/components/dashboard/ProjectExplorer";
import { listTechnologies } from "@/lib/auth/api";
import { requireSession } from "@/lib/auth/session";
import type { Technology } from "@/lib/auth/types";
import { listProjects } from "@/lib/projects/api";
import type { Project } from "@/lib/projects/types";

export default async function DashboardPage() {
    const { user, token } = await requireSession();

    const [projects, technologies] = await Promise.all([
        loadProjects(token),
        loadTechnologies(),
    ]);

    return (
        <div className="flex min-h-screen flex-col">
            <DashboardHeader
                title="Explorar Proyectos"
                badge={`${projects.length} proyectos`}
                user={user}
            />
            <div className="flex-1 overflow-y-auto">
                <ProjectExplorer initialProjects={projects} technologies={technologies} />
            </div>
        </div>
    );
}

async function loadProjects(token: string): Promise<Project[]> {
    try {
        const page = await listProjects({ size: 50 }, token);
        return page.content;
    } catch {
        return [];
    }
}

async function loadTechnologies(): Promise<Technology[]> {
    try {
        return await listTechnologies();
    } catch {
        return [];
    }
}
