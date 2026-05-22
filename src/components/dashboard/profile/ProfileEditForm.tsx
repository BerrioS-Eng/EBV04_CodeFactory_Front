"use client";

import { useActionState, useEffect, useState } from "react";
import { FiGithub, FiGitlab, FiSave, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { FormField } from "@/components/ui/form-field";
import TechnologyPicker from "@/components/dashboard/TechnologyPicker";
import type { AuthUser, Technology } from "@/lib/auth/types";
import { updateProfileAction } from "@/lib/profile/actions";
import { BIO_MAX, NAME_MAX } from "@/lib/profile/types";

export interface ProfileEditFormProps {
    user: AuthUser;
    technologies: Technology[];
    onCancel: () => void;
    onSuccess: () => void;
}

export default function ProfileEditForm({
    user,
    technologies,
    onCancel,
    onSuccess,
}: ProfileEditFormProps) {
    const [state, formAction, pending] = useActionState(updateProfileAction, undefined);
    const [fullName, setFullName] = useState(user.name);
    const [bio, setBio] = useState(user.bio ?? "");
    const [githubUrl, setGithubUrl] = useState(user.githubUrl ?? "");
    const [gitlabUrl, setGitlabUrl] = useState(user.gitlabUrl ?? "");
    const [selectedTechs, setSelectedTechs] = useState<string[]>(user.stack);

    const errors = state && !state.ok ? state.fieldErrors : undefined;
    const message = state && !state.ok ? state.message : undefined;

    useEffect(() => {
        if (state?.ok) {
            toast.success("Perfil actualizado");
            onSuccess();
        }
    }, [state, onSuccess]);

    useEffect(() => {
        if (message) toast.error(message);
    }, [message]);

    const toggleTech = (id: string) =>
        setSelectedTechs((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
        );

    return (
        <form action={formAction} className="space-y-6">
            <section className="rounded-lg border border-border bg-card p-8">
                <h3 className="mb-6 text-lg font-semibold">Información Personal</h3>

                <div className="space-y-6">
                    <FormField
                        label="Nombre completo"
                        required
                        error={errors?.fullName}
                        count={`${fullName.length}/${NAME_MAX}`}
                    >
                        <input
                            name="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            maxLength={NAME_MAX}
                            className="w-full rounded-md border border-border bg-input-background px-4 py-2.5 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </FormField>

                    <div>
                        <p className="mb-2 text-sm text-foreground/80">Correo electrónico</p>
                        <p className="rounded-md bg-muted/30 px-4 py-2.5 text-muted-foreground">
                            {user.email}{" "}
                            <span className="text-xs">(no modificable)</span>
                        </p>
                    </div>

                    <FormField
                        label="Biografía"
                        error={errors?.bio}
                        hint="Cuéntanos sobre ti, tus intereses y experiencia"
                        count={`${bio.length}/${BIO_MAX}`}
                    >
                        <textarea
                            name="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={BIO_MAX}
                            rows={4}
                            placeholder="Cuéntanos sobre ti..."
                            className="w-full resize-none rounded-md border border-border bg-input-background px-4 py-2.5 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </FormField>

                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField label="GitHub URL" error={errors?.githubUrl}>
                            <IconInput
                                name="githubUrl"
                                value={githubUrl}
                                onChange={setGithubUrl}
                                placeholder="https://github.com/tu-usuario"
                                icon={<FiGithub size={16} />}
                            />
                        </FormField>

                        <FormField label="GitLab URL" error={errors?.gitlabUrl}>
                            <IconInput
                                name="gitlabUrl"
                                value={gitlabUrl}
                                onChange={setGitlabUrl}
                                placeholder="https://gitlab.com/tu-usuario"
                                icon={<FiGitlab size={16} />}
                            />
                        </FormField>
                    </div>
                </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-8">
                <TechnologyPicker
                    technologies={technologies}
                    selectedIds={selectedTechs}
                    onToggle={toggleTech}
                    inputName="technologyIds"
                    label="Stack Técnico"
                />
            </section>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={pending}
                    className="flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-foreground transition-all hover:bg-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FiX size={18} />
                    <span>Cancelar</span>
                </button>
                <button
                    type="submit"
                    disabled={pending}
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ fontFamily: "var(--font-mono)" }}
                >
                    {pending ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                    ) : (
                        <>
                            <FiSave size={18} />
                            <span>GUARDAR</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

function IconInput({
    name,
    value,
    onChange,
    placeholder,
    icon,
}: {
    name: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {icon}
            </span>
            <input
                name={name}
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border border-border bg-input-background py-2.5 pl-10 pr-4 transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
        </div>
    );
}