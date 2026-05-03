"use client";

import { useActionState, useEffect, useState } from "react";
import { FiCode, FiFileText, FiSave, FiSend, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { createProjectAction } from "@/lib/projects/actions";
import type { ActionState, Technology } from "@/lib/auth/types";
import { FormField } from "@/components/ui/form-field";

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 1000;

export default function CreateProjectForm({ technologies }: { technologies: Technology[] }) {
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        createProjectAction,
        undefined,
    );
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

    const errors = state && !state.ok ? state.fieldErrors : undefined;
    const message = state && !state.ok ? state.message : undefined;

    useEffect(() => {
        if (message) toast.error(message);
    }, [message]);

    const toggleTech = (id: string) =>
        setSelectedTechs((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
        );

    const canDraft = title.trim().length > 0;
    const canPublish = canDraft && description.trim().length > 0 && selectedTechs.length > 0;

    const selectedTech = (id: string) => technologies.find((t) => t.id === id);

    return (
        <form action={formAction} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {selectedTechs.map((id) => (
                <input key={id} type="hidden" name="stack" value={id} />
            ))}

            <Intro />

            <FormField
                label="Título del Proyecto"
                required
                error={errors?.title}
                hint="Sé claro y descriptivo"
                count={`${title.length}/${TITLE_MAX}`}
            >
                <input
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={TITLE_MAX}
                    placeholder="ej. Sistema de Gestión de Inventario en Tiempo Real"
                    className="w-full rounded-md border border-border bg-input-background px-4 py-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </FormField>

            <FormField
                label="Descripción"
                required
                error={errors?.description}
                hint="Explica qué necesitas construir y por qué"
                count={`${description.length}/${DESCRIPTION_MAX}`}
            >
                <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={DESCRIPTION_MAX}
                    rows={6}
                    placeholder="Describe tu proyecto: objetivo, funcionalidades principales, alcance esperado..."
                    className="w-full resize-none rounded-md border border-border bg-input-background px-4 py-3 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </FormField>

            <div>
                <div className="mb-3 flex items-center gap-2">
                    <FiCode className="h-4 w-4 text-primary" />
                    <label className="text-xl text-foreground/80">
                        Stack Técnico Requerido <span className="text-brand">*</span>
                    </label>
                    {selectedTechs.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                            ({selectedTechs.length} seleccionadas)
                        </span>
                    )}
                </div>

                {selectedTechs.length > 0 && (
                    <div className="mb-4 rounded-md border border-primary/20 bg-primary/5 p-3">
                        <div className="flex flex-wrap gap-2">
                            {selectedTechs.map((id) => {
                                const tech = selectedTech(id);
                                return (
                                    <span
                                        key={id}
                                        className="flex items-center gap-2 rounded-md border border-brand/30 bg-brand/20 px-3 py-1.5 text-primary"
                                    >
                                        <span className="font-bold text-brand" style={{ fontFamily: "var(--font-mono)" }}>
                                            {tech?.name ?? id}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => toggleTech(id)}
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
                        <p className="text-sm text-muted-foreground">Catálogo de tecnologías no disponible.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {technologies.map((tech) => {
                                const active = selectedTechs.includes(tech.id);
                                return (
                                    <button
                                        key={tech.id}
                                        type="button"
                                        onClick={() => toggleTech(tech.id)}
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
                {errors?.stack && <p className="mt-2 text-sm text-destructive">{errors.stack}</p>}
            </div>

            <RequirementsBox />

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                <button
                    type="submit"
                    name="intent"
                    value="draft"
                    disabled={pending || !canDraft}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-muted px-6 py-3 text-foreground transition-all hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FiSave size={20} />
                    <span>Guardar como Borrador</span>
                </button>
                <button
                    type="submit"
                    name="intent"
                    value="publish"
                    disabled={pending || !canPublish}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-brand px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    {pending ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    ) : (
                        <>
                            <FiSend size={20} />
                            <span>PUBLICAR PROYECTO</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}


function Intro() {
    return (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/20">
                    <FiCode className="h-5 w-5 text-brand" />
                </div>
                <div>
                    <h3 className="mb-1 font-bold text-brand text-xl">¿Tienes una idea?</h3>
                    <p className="text-lg text-foreground/70">
                        Crea un proyecto y encuentra desarrolladores que compartan tu visión. Puedes
                        guardarlo como borrador o publicarlo inmediatamente.
                    </p>
                </div>
            </div>
        </div>
    );
}

function RequirementsBox() {
    return (
        <div className="rounded-lg border border-border/50 bg-accent/30 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-lg font-medium">
                <FiFileText size={16} className="text-secondary" />
                Campos obligatorios
            </h4>
            <ul className="ml-6 list-disc space-y-1 text-lg text-foreground/70">
                <li>
                    <strong>Para guardar como borrador:</strong> Solo necesitas un título.
                </li>
                <li>
                    <strong>Para publicar:</strong> Título, descripción y al menos una tecnología.
                </li>
            </ul>
        </div>
    );
}
