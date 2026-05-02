"use client";

import { useMemo, useTransition } from "react";
import { FiCheck, FiUsers, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { acceptApplicationAction, rejectApplicationAction } from "@/lib/projects/actions";
import type { Technology } from "@/lib/auth/types";
import type { Application } from "@/lib/projects/types";

interface Props {
    projectId: number | string;
    applications: Application[];
    technologies: Technology[];
}

export default function ApplicationsList({ projectId, applications, technologies }: Props) {
    const pending = applications.filter((a) => a.status === "pending");
    const technologyName = useMemo(() => {
        const map = new Map(technologies.map((t) => [String(t.id), t.name] as const));
        return (id: string) => map.get(String(id)) ?? String(id);
    }, [technologies]);

    return (
        <div className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold">Postulaciones Pendientes</h3>
            {pending.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No hay postulaciones pendientes</p>
            ) : (
                pending.map((application) => (
                    <ApplicationItem
                        key={application.id}
                        projectId={projectId}
                        application={application}
                        technologyName={technologyName}
                    />
                ))
            )}
        </div>
    );
}

function ApplicationItem({
    projectId,
    application,
    technologyName,
}: {
    projectId: number | string;
    application: Application;
    technologyName: (id: string) => string;
}) {
    const [busy, start] = useTransition();

    const decide = (kind: "accept" | "reject") =>
        start(async () => {
            const fn = kind === "accept" ? acceptApplicationAction : rejectApplicationAction;
            const result = await fn(projectId, application.id);
            if (result?.ok) toast.success(kind === "accept" ? "Colaborador aceptado" : "Postulación rechazada");
            else toast.error(result?.message ?? "Error al actualizar la postulación");
        });

    return (
        <div className="rounded-lg border border-border p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                            <FiUsers size={20} className="text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">{application.applicant.name}</p>
                            <p className="text-sm text-muted-foreground">{application.applicant.email}</p>
                        </div>
                    </div>
                    {application.message && (
                        <p className="mt-3 rounded-md bg-accent/30 p-3 text-sm text-foreground/80">
                            {application.message}
                        </p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {application.applicant.stack.map((id) => (
                            <span
                                key={id}
                                className="rounded bg-muted/50 px-2 py-0.5 text-xs text-foreground/70"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {technologyName(id)}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => decide("accept")}
                        disabled={busy}
                        aria-label="Aceptar postulación"
                        className="rounded-md bg-primary/10 p-2 text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
                    >
                        <FiCheck size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => decide("reject")}
                        disabled={busy}
                        aria-label="Rechazar postulación"
                        className="rounded-md bg-destructive/10 p-2 text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                    >
                        <FiX size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
