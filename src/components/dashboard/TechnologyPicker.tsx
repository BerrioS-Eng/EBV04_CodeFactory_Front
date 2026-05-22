"use client";

import { FiCode, FiX } from "react-icons/fi";
import type { Technology } from "@/lib/auth/types";

export interface TechnologyPickerProps {
    technologies: Technology[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    label?: string;
    required?: boolean;
    inputName?: string;
    showIcon?: boolean;
    emptyMessage?: string;
    error?: string;
}

export default function TechnologyPicker({
    technologies,
    selectedIds,
    onToggle,
    label = "Stack Técnico",
    required = false,
    inputName,
    showIcon = true,
    emptyMessage = "Catálogo de tecnologías no disponible.",
    error,
}: TechnologyPickerProps) {
    const selectedTech = (id: string) => technologies.find((t) => t.id === id);

    return (
        <div>
            {inputName &&
                selectedIds.map((id) => (
                    <input key={id} type="hidden" name={inputName} value={id} />
                ))}

            <div className="mb-3 flex items-center gap-2">
                {showIcon && <FiCode className="h-4 w-4 text-primary" />}
                <label className="text-xl text-foreground/80">
                    {label}
                    {required && <span className="text-brand">*</span>}
                </label>
                {selectedIds.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                        ({selectedIds.length} seleccionada{selectedIds.length === 1 ? "" : "s"})
                    </span>
                )}
            </div>

            {selectedIds.length > 0 && (
                <div className="mb-4 rounded-md border border-primary/20 bg-primary/5 p-3">
                    <div className="flex flex-wrap gap-2">
                        {selectedIds.map((id) => {
                            const tech = selectedTech(id);
                            return (
                                <span
                                    key={id}
                                    className="flex items-center gap-2 rounded-md border border-brand/30 bg-brand/20 px-3 py-1.5 text-primary"
                                >
                                    <span
                                        className="font-bold text-brand"
                                        style={{ fontFamily: "var(--font-mono)" }}
                                    >
                                        {tech?.name ?? id}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onToggle(id)}
                                        aria-label={`Quitar ${tech?.name ?? id}`}
                                        className="rounded-sm p-0.5 transition-colors hover:bg-primary/30"
                                    >
                                        <FiX size={14} className="text-brand" />
                                    </button>
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="max-h-80 overflow-y-auto rounded-md border border-border bg-input-background p-4">
                {technologies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{emptyMessage}</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech) => {
                            const active = selectedIds.includes(tech.id);
                            return (
                                <button
                                    key={tech.id}
                                    type="button"
                                    onClick={() => onToggle(tech.id)}
                                    disabled={active}
                                    aria-pressed={active}
                                    className={`rounded-md border px-3 py-1.5 text-sm transition-all ${
                                        active
                                            ? "cursor-default border-sidebar-primary bg-sidebar-primary/20 text-sidebar-primary font-bold opacity-50"
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
            </div>

            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
    );
}