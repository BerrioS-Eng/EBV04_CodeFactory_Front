import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiCode } from "react-icons/fi";
import { tryOr, tryOrNull } from "@/lib/api/safe";
import { listTechnologies } from "@/lib/auth/api";
import { requireSession } from "@/lib/auth/session";
import { getProject, listApplicationsForProject } from "@/lib/projects/api";
import type { Application, Project } from "@/lib/projects/types";
import { makeTechnologyName } from "@/lib/technologies/utils";
import ApplicationsList from "@/components/dashboard/project-detail/ApplicationsList";
import ApplyForm from "@/components/dashboard/project-detail/ApplyForm";
import ProjectActions from "@/components/dashboard/project-detail/ProjectActions";
import ProjectStatusBadge from "@/components/dashboard/project-detail/ProjectStatusBadge";
import ProjectTabs from "@/components/dashboard/project-detail/ProjectTabs";
import TeamList from "@/components/dashboard/project-detail/TeamList";
import UserConnectActions from "@/components/dashboard/UserConnectActions";

export default async function ProjectDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ tab?: string }>;
}) {
    const { id } = await params;
    const { tab } = await searchParams;
    const { user, token } = await requireSession();

    const project = await tryOrNull(getProject(id, token));
    if (!project) notFound();

    const isOwner = user.id === project.creatorId;
    const isCollaborator = project.collaborators.some((c) => c.id === user.id);

    const [applications, technologies] = await Promise.all([
        isOwner
            ? tryOr(listApplicationsForProject(project.id, token), [])
            : Promise.resolve<Application[]>([]),
        tryOr(listTechnologies(), []),
    ]);
    const technologyName = makeTechnologyName(technologies);
    const pendingCount = applications.filter((a) => a.status === "pending").length;

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
                <h2 className="line-clamp-1 flex-1 text-xl font-semibold text-brand">{project.title}</h2>
                <ProjectStatusBadge status={project.status} />
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-6xl px-6 py-8">
                    <ProjectSummary
                        project={project}
                        canApply={project.canApply && !isOwner && !isCollaborator}
                        isOwner={isOwner}
                        currentUserId={user.id}
                        technologyName={technologyName}
                    />

                    <ProjectTabs
                        initialKey={tab}
                        tabs={[
                            {
                                key: "overview",
                                label: "Vista General",
                                panel: <OverviewPanel project={project} />,
                            },
                            {
                                key: "applications",
                                label: `Postulaciones (${pendingCount})`,
                                visible: isOwner,
                                panel: (
                                    <ApplicationsList
                                        projectId={project.id}
                                        applications={applications}
                                        technologies={technologies}
                                    />
                                ),
                            },
                            {
                                key: "team",
                                label: `Equipo (${project.collaborators.length})`,
                                panel: <TeamList project={project} technologyName={technologyName} currentUserId={user.id} />,
                            },
                            {
                                key: "discussions",
                                label: "Debates",
                                panel: <DiscussionsPanel canSee={isOwner || isCollaborator} />,
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

function ProjectSummary({
    project,
    canApply,
    isOwner,
    currentUserId,
    technologyName,
}: {
    project: Project;
    canApply: boolean;
    isOwner: boolean;
    currentUserId: number;
    technologyName: (id: string) => string;
}) {
    return (
        <section className="mb-6 rounded-lg border border-border bg-card p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-6 md:flex-row">
                <div className="flex-1">
                    <h1 className="mb-3 text-3xl font-bold tracking-tight">{project.title}</h1>
                    <p className="mb-6 whitespace-pre-line text-muted-foreground">{project.description}</p>

                    <div className="mb-6 flex flex-wrap gap-2">
                        {project.stackRequired.map((id) => (
                            <span
                                key={id}
                                className="rounded-md border border-sidebar-primary/20 bg-sidebar-primary/10 px-3 py-1.5 text-sm text-sidebar-primary"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {technologyName(id)}
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                        <div className="mt-4">
                            <UserConnectActions userId={project.creatorId} currentUserId={currentUserId} />
                        </div>
                        <span className="flex items-center gap-2">
                            <FiCalendar size={16} />
                            {formatDate(project.createdAt)}
                        </span>
                        {project.collaborators.length > 0 && (
                            <span className="flex items-center gap-2">
                                <FiCode size={16} />
                                {project.collaborators.length} colaboradores
                            </span>
                        )}
                    </div>
                </div>

                <ProjectActions project={project} isOwner={isOwner} />
            </div>

            {canApply && <ApplyForm projectId={project.id} />}
        </section>
    );
}

function OverviewPanel({ project }: { project: Project }) {
    const blocks: Array<{ label: string; value: string | number }> = [
        { label: "Estado", value: project.status },
        { label: "Postulaciones", value: project.applicationCount },
        { label: "Colaboradores", value: project.collaborators.length },
        { label: "Creado", value: formatDate(project.createdAt) },
    ];
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            {blocks.map((b) => (
                <div key={b.label} className="rounded-lg border border-border bg-background/40 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{b.label}</p>
                    <p className="mt-1 text-base font-medium">{b.value}</p>
                </div>
            ))}
        </div>
    );
}

function DiscussionsPanel({ canSee }: { canSee: boolean }) {
    return (
        <div>
            <h3 className="mb-4 text-lg font-semibold">Debates Técnicos</h3>
            <p className="py-8 text-center text-muted-foreground">
                {canSee
                    ? "Próximamente: módulo de debates técnicos."
                    : "Solo los colaboradores pueden ver los debates."}
            </p>
        </div>
    );
}

function formatDate(iso: string): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("es", { day: "2-digit", month: "long", year: "numeric" });
}
