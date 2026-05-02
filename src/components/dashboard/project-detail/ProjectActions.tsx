"use client";

import { useTransition } from "react";
import { FiCheckCircle, FiPlay, FiSend } from "react-icons/fi";
import { toast } from "sonner";
import {
    completeAction,
    publishAction,
    startDevelopmentAction,
} from "@/lib/projects/actions";
import type { Project } from "@/lib/projects/types";

interface Props {
    project: Project;
    isOwner: boolean;
}

type ActionFn = () => Promise<{ ok: true } | { ok: false; message?: string } | undefined>;

export default function ProjectActions({ project, isOwner }: Props) {
    const [pending, start] = useTransition();
    if (!isOwner) return null;

    const run = (fn: ActionFn, successMsg: string) =>
        start(async () => {
            const result = await fn();
            if (result?.ok) toast.success(successMsg);
            else toast.error(result?.message ?? "Error al ejecutar la operación");
        });

    return (
        <div className="flex flex-col gap-2">
            {project.status === "draft" && (
                <ActionButton
                    icon={<FiSend size={18} />}
                    label="Publicar"
                    onClick={() => run(() => publishAction(project.id), "Proyecto publicado")}
                    pending={pending}
                />
            )}
            {project.status === "seeking_collaborators" && project.collaborators.length > 0 && (
                <ActionButton
                    icon={<FiPlay size={18} />}
                    label="Iniciar Desarrollo"
                    variant="secondary"
                    onClick={() =>
                        run(() => startDevelopmentAction(project.id), "Desarrollo iniciado")
                    }
                    pending={pending}
                />
            )}
            {project.status === "in_development" && (
                <ActionButton
                    icon={<FiCheckCircle size={18} />}
                    label="Marcar Completado"
                    variant="brand"
                    onClick={() => run(() => completeAction(project.id), "Proyecto completado")}
                    pending={pending}
                />
            )}
        </div>
    );
}

function ActionButton({
    icon,
    label,
    onClick,
    pending,
    variant = "primary",
}: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    pending: boolean;
    variant?: "primary" | "secondary" | "brand";
}) {
    const styles = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        brand: "bg-brand text-background hover:brightness-110",
    }[variant];
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={pending}
            className={`flex items-center gap-2 rounded-md px-4 py-2 transition-all disabled:opacity-50 ${styles}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}
