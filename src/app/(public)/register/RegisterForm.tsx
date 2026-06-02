"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Brand } from "@/app/page";
import GridBackground from "@/components/GridBackground";
import { registerAction } from "@/lib/auth/actions";
import { PASSWORD_RULES } from "@/lib/auth/validation";
import type { Technology } from "@/lib/auth/types";
import { FormField } from "@/components/ui/form-field";
import { CiLock } from "react-icons/ci";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdMailOutline } from "react-icons/md";
import TechnologyPicker from "@/components/dashboard/TechnologyPicker";

export default function RegisterForm({ technologies }: { technologies: Technology[] }) {
    const [state, action, pending] = useActionState(registerAction, undefined);
    const [showPassword, setShowPassword] = useState(false);
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
    const errors = state && !state.ok ? state.fieldErrors : undefined;
    const message = state && !state.ok ? state.message : undefined;

    const toggleTech = (id: string) =>
        setSelectedTechs((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex items-center justify-center px-4 py-8">
            <GridBackground colorMode="green" />

            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-card border border-border rounded-lg p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-8 animate-in fade-in zoom-in-95 duration-500 delay-200 fill-mode-backwards">
                        <Link href="/" aria-label="Volver al inicio">
                            <FaArrowLeft className="w-4 h-4 text-brand transition-transform hover:-translate-x-1" />
                        </Link>
                        <div>
                            <Brand />
                            <p className="text-xl text-muted-foreground">Developer Collaboration Network</p>
                        </div>
                    </div>

                    <div className="animate-in fade-in duration-500 delay-300 fill-mode-backwards">
                        <h2 className="text-xl mb-2">Crear cuenta</h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            Únete a la red de desarrolladores colaborativos
                        </p>

                        <form action={action} className="space-y-4" noValidate>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField label="Nombre completo" error={errors?.name}>
                                    <Input name="name" type="text" autoComplete="name" placeholder="Tu nombre" />
                                </FormField>

                                <FormField label="Correo electrónico" error={errors?.email}>
                                    <IconInput
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="tu@email.com"
                                        icon={<MdMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />}
                                    />
                                </FormField>

                                <FormField
                                    label="Contraseña"
                                    error={errors?.password}
                                    hint={errors?.password ? undefined : PASSWORD_RULES}
                                >
                                    <PasswordInput
                                        name="password"
                                        autoComplete="new-password"
                                        visible={showPassword}
                                        onToggle={() => setShowPassword((v) => !v)}
                                    />
                                </FormField>

                                <FormField label="Confirmar contraseña" error={errors?.confirmPassword}>
                                    <PasswordInput
                                        name="confirmPassword"
                                        autoComplete="new-password"
                                        visible={showPassword}
                                        onToggle={() => setShowPassword((v) => !v)}
                                    />
                                </FormField>
                            </div>

                            <TechnologyPicker
                                technologies={technologies}
                                selectedIds={selectedTechs}
                                onToggle={toggleTech}
                                inputName="stack"
                                label="Stack técnico"
                                required
                                showIcon={false}
                                error={errors?.stack}
                                emptyMessage="No fue posible cargar el catálogo de tecnologías. Intenta más tarde."
                                variant="toggle"
                            />

                            {message && (
                                <p className="text-sm text-destructive" role="alert">{message}</p>
                            )}

                            <button
                                type="submit"
                                disabled={pending}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand px-8 text-sm font-bold uppercase tracking-wider text-background transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontFamily: "var(--font-mono)" }}
                            >
                                {pending ? (
                                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>CREAR CUENTA</span>
                                        <FaArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <div className="text-center pt-4 border-t border-border">
                                <span className="text-sm text-muted-foreground">¿Ya tienes cuenta? </span>
                                <Link href="/login" className="text-sm text-brand hover:text-brand/80 transition-colors font-medium">
                                    Inicia sesión
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className="w-full px-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            required={props.required ?? true}
        />
    );
}

function IconInput({ icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode }) {
    return (
        <div className="relative group">
            {icon}
            <input
                {...props}
                className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required={props.required ?? true}
            />
        </div>
    );
}

function PasswordInput({
    name,
    autoComplete,
    visible,
    onToggle,
}: {
    name: string;
    autoComplete: string;
    visible: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="relative group">
            <CiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input
                name={name}
                type={visible ? "text" : "password"}
                autoComplete={autoComplete}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                required
            />
            <button
                type="button"
                onClick={onToggle}
                aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
                aria-pressed={visible}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
                {visible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
        </div>
    );
}
