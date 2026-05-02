"use client";

import type { ComponentType } from "react";
import { FiCheckCircle, FiCode, FiUsers } from "react-icons/fi";
import type { Technology } from "@/lib/auth/types";
import type { ProjectStatus } from "@/lib/projects/types";

type IconType = ComponentType<{ size?: number; className?: string }>;

const STATUS_FILTERS: ReadonlyArray<{ value: ProjectStatus; label: string; icon: IconType }> = [
    { value: "seeking_collaborators", label: "Buscando Colaboradores", icon: FiUsers },
    { value: "in_development", label: "En Desarrollo", icon: FiCode },
    { value: "completed", label: "Completados", icon: FiCheckCircle },
];

export interface FilterPanelProps {
    technologies: Technology[];
    selectedTechs: string[];
    selectedStatuses: ProjectStatus[];
    onToggleTech: (id: string) => void;
    onToggleStatus: (status: ProjectStatus) => void;
    onClear: () => void;
    hasActiveFilters: boolean;
}

export default function FilterPanel({
    technologies,
    selectedTechs,
    selectedStatuses,
    onToggleTech,
    onToggleStatus,
    onClear,
    hasActiveFilters,
}: FilterPanelProps) {
    return (
        <div className="space-y-6 rounded-lg border border-border bg-card p-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <section>
                <h3 className="mb-3 text-sm font-medium text-foreground/80">Estado del Proyecto</h3>
                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map(({ value, label, icon: Icon }) => {
                        const active = selectedStatuses.includes(value);
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => onToggleStatus(value)}
                                aria-pressed={active}
                                className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors ${
                                    active
                                        ? "border-primary bg-primary/20 text-primary"
                                        : "border-border/50 bg-muted/30 text-foreground/70 hover:bg-muted"
                                }`}
                            >
                                <Icon size={16} />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section>
                <h3 className="mb-3 text-sm font-medium text-foreground/80">Tecnologías</h3>
                {technologies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Catálogo no disponible.</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech) => {
                            const active = selectedTechs.includes(tech.id);
                            return (
                                <button
                                    key={tech.id}
                                    type="button"
                                    onClick={() => onToggleTech(tech.id)}
                                    aria-pressed={active}
                                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                                        active
                                            ? "border-secondary bg-secondary/20 text-secondary"
                                            : "border-border/50 bg-muted/30 text-foreground/70 hover:bg-muted"
                                    }`}
                                    style={{ fontFamily: "var(--font-mono)" }}
                                >
                                    {tech.name}
                                </button>
                            );
                        })}
                    </div>
                )}
            </section>

            {hasActiveFilters && (
                <div className="border-t border-border pt-4">
                    <button
                        type="button"
                        onClick={onClear}
                        className="text-sm text-destructive transition-colors hover:text-destructive/80"
                    >
                        Limpiar todos los filtros
                    </button>
                </div>
            )}
        </div>
    );
}
