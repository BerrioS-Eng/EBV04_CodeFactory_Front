"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FiCheckCircle, FiSearch, FiSlash } from "react-icons/fi";
import type { AuthUser } from "@/lib/auth/types";
import { changeRoleAction, reactivateUserAction, suspendUserAction } from "@/lib/admin/actions";

const ROLE_OPTIONS = [
    { value: "DEVELOPER", label: "Developer" },
    { value: "MODERATOR", label: "Moderador" },
    { value: "ADMIN", label: "Admin" },
];

export default function UsersTable({
    users,
    currentUserId,
    canManageRoles,
}: {
    users: AuthUser[];
    currentUserId: number;
    canManageRoles: boolean;
}) {
    const [query, setQuery] = useState("");
    const [pending, start] = useTransition();

    const filtered = users.filter(
        (u) =>
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase()),
    );

    const onRoleChange = (userId: number, role: string) =>
        start(async () => {
            const res = await changeRoleAction(userId, role);
            res?.ok ? toast.success("Rol actualizado") : toast.error(res?.message ?? "Error al cambiar rol");
        });

    const onToggleActive = (u: AuthUser) =>
        start(async () => {
            const res = u.status === "active" ? await suspendUserAction(u.id) : await reactivateUserAction(u.id);
            if (res?.ok) toast.success(u.status === "active" ? "Usuario suspendido" : "Usuario reactivado");
            else toast.error(res?.message ?? "No se pudo completar la acción");
        });

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-card/50 px-6 backdrop-blur-sm">
                <h2 className="text-xl font-semibold text-brand">Gestión de usuarios</h2>
            </header>

            <div className="mx-auto w-full max-w-7xl space-y-5 px-6 py-10">
                <div className="relative max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar por nombre o correo…"
                        className="w-full rounded-md border border-border bg-input-background py-2.5 pl-10 pr-3 text-base focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                    <table className="w-full text-base">
                        <thead className="bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                            <tr>
                                <th className="px-5 py-4">Usuario</th>
                                <th className="px-5 py-4">Rol</th>
                                <th className="px-5 py-4">Estado</th>
                                <th className="px-5 py-4">Actividad</th>
                                <th className="px-5 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filtered.map((u) => {
                                const isSelf = u.id === currentUserId;
                                return (
                                    <tr key={u.id} className="hover:bg-muted/20">
                                        <td className="px-5 py-4">
                                            <p className="font-medium">
                                                {u.name}
                                                {isSelf && <span className="ml-2 text-xs text-muted-foreground">(tú)</span>}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{u.email}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            {canManageRoles && !isSelf ? (
                                                <select
                                                    key={`${u.id}-${u.role}`}
                                                    defaultValue={u.role.toUpperCase()}
                                                    disabled={pending}
                                                    onChange={(e) => onRoleChange(u.id, e.target.value)}
                                                    className="rounded-md border border-border bg-input-background px-3 py-1.5 text-sm text-foreground"
                                                >
                                                    {ROLE_OPTIONS.map((r) => (
                                                        <option key={r.value} value={r.value} className="bg-card text-foreground">{r.label}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <RoleBadge role={u.role} />
                                            )}
                                        </td>
                                        <td className="px-5 py-4"><StatusBadge status={u.status} /></td>
                                        <td className="px-5 py-4 text-muted-foreground">
                                            {u.projectsCount} proy. · {u.collaborationsCount} colab.
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {!isSelf && (
                                                <button
                                                    type="button"
                                                    disabled={pending}
                                                    onClick={() => onToggleActive(u)}
                                                    className={`inline-flex items-center gap-1.5 rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                                                        u.status === "active"
                                                            ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                                                            : "border-brand/30 text-brand hover:bg-brand/10"
                                                    }`}
                                                >
                                                    {u.status === "active"
                                                        ? <><FiSlash size={15} /> Suspender</>
                                                        : <><FiCheckCircle size={15} /> Reactivar</>}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <p className="p-6 text-center text-sm text-muted-foreground">Sin usuarios.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function RoleBadge({ role }: { role: string }) {
    const map: Record<string, string> = {
        admin: "bg-destructive/15 text-destructive",
        moderator: "bg-secondary/20 text-secondary",
        developer: "bg-primary/15 text-primary",
    };
    return (
        <span className={`rounded-full px-2.5 py-1 text-sm font-medium capitalize ${map[role] ?? "bg-muted text-foreground"}`}>
            {role}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const active = status === "active";
    return (
        <span className={`rounded-full px-2.5 py-1 text-sm font-medium ${active ? "bg-brand/15 text-brand" : "bg-destructive/15 text-destructive"}`}>
            {active ? "Activo" : "Suspendido"}
        </span>
    );
}