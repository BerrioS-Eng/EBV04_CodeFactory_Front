"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiFilter, FiPlus, FiSearch } from "react-icons/fi";
import type { Technology } from "@/lib/auth/types";
import type { Project, ProjectStatus } from "@/lib/projects/types";
import FilterPanel from "./FilterPanel";
import ProjectCard from "./ProjectCard";

export interface ProjectExplorerProps {
    initialProjects: Project[];
    technologies: Technology[];
}

export default function ProjectExplorer({ initialProjects, technologies }: ProjectExplorerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const techNameById = useMemo(() => {
        const map = new Map(technologies.map((t) => [String(t.id), t.name] as const));
        return (id: string) => map.get(String(id)) ?? String(id);
    }, [technologies]);

    const filteredProjects = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return initialProjects.filter((project) => {
            if (selectedStatuses.length && !selectedStatuses.includes(project.status)) return false;
            if (selectedTechs.length && !selectedTechs.every((id) => project.stackRequired.includes(id)))
                return false;
            if (q) {
                const haystack = `${project.title} ${project.description}`.toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });
    }, [initialProjects, searchQuery, selectedTechs, selectedStatuses]);

    const toggleTech = (id: string) =>
        setSelectedTechs((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

    const toggleStatus = (status: ProjectStatus) =>
        setSelectedStatuses((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
        );

    const clearFilters = () => {
        setSelectedTechs([]);
        setSelectedStatuses([]);
        setSearchQuery("");
    };

    const activeFilterCount = selectedTechs.length + selectedStatuses.length;
    const hasActiveFilters = activeFilterCount > 0 || searchQuery.length > 0;

    return (
        <div className="mx-auto w-full max-w-7xl px-6 py-8">
            <section className="mb-8 space-y-4">
                <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <FiSearch
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={20}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar proyectos por título o descripción..."
                            className="w-full rounded-lg border border-border bg-card py-3 pl-12 pr-4 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters((v) => !v)}
                        aria-expanded={showFilters}
                        className={`flex items-center gap-2 rounded-lg border px-6 py-3 transition-colors ${
                            showFilters || activeFilterCount > 0
                                ? "border-brand bg-primary/10 text-brand"
                                : "border-border bg-card hover:bg-accent"
                        }`}
                    >
                        <FiFilter size={20} />
                        <span>Filtros</span>
                        {activeFilterCount > 0 && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    <Link
                        href="/dashboard/projects/new"
                        className="flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-medium text-background transition-all hover:brightness-110"
                        style={{ fontFamily: "var(--font-mono)" }}
                    >
                        <FiPlus size={20} />
                        <span>NUEVO PROYECTO</span>
                    </Link>
                </div>

                {showFilters && (
                    <FilterPanel
                        technologies={technologies}
                        selectedTechs={selectedTechs}
                        selectedStatuses={selectedStatuses}
                        onToggleTech={toggleTech}
                        onToggleStatus={toggleStatus}
                        onClear={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                    />
                )}
            </section>

            {filteredProjects.length === 0 ? (
                <EmptyState hasActiveFilters={hasActiveFilters} onClear={clearFilters} />
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-300">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} technologyName={techNameById} />
                    ))}
                </div>
            )}
        </div>
    );
}

function EmptyState({
    hasActiveFilters,
    onClear,
}: {
    hasActiveFilters: boolean;
    onClear: () => void;
}) {
    return (
        <div className="py-16 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/30">
                <FiSearch size={32} className="text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No se encontraron proyectos</h3>
            <p className="mb-6 text-sm text-muted-foreground">
                {hasActiveFilters
                    ? "Prueba ajustando los filtros de búsqueda"
                    : "Sé el primero en crear un proyecto"}
            </p>
            {hasActiveFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="text-primary transition-colors hover:text-primary/80"
                >
                    Limpiar filtros
                </button>
            )}
        </div>
    );
}
