"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { applyAction } from "@/lib/projects/actions";
import type { ActionState } from "@/lib/auth/types";

export default function ApplyForm({ projectId }: { projectId: number | string }) {
    const action = applyAction.bind(null, projectId);
    const [state, formAction, pending] = useActionState<ActionState, FormData>(action, undefined);

    useEffect(() => {
        if (!state) return;
        if (state.ok) toast.success("Postulación enviada exitosamente");
        else if (state.message) toast.error(state.message);
    }, [state]);

    return (
        <form action={formAction} className="border-t border-border pt-6">
            <h3 className="mb-3 text-lg font-semibold">Postularme a este proyecto</h3>
            <textarea
                name="message"
                rows={4}
                placeholder="Mensaje opcional: cuéntale al creador por qué quieres colaborar..."
                className="w-full resize-none rounded-md border border-border bg-input-background p-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
                type="submit"
                disabled={pending}
                className="mt-3 rounded-md bg-primary px-6 py-2 text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
                {pending ? "Enviando..." : "Enviar Postulación"}
            </button>
        </form>
    );
}
