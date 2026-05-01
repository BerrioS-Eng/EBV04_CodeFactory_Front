'use client'

import { Brand } from '@/app/page';
import GridBackground from '@/components/GridBackground';
import Link from 'next/link';
import { useState } from 'react';
import { CiLock } from 'react-icons/ci';
import { FaArrowLeft, FaCode } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa6';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { MdMailOutline } from 'react-icons/md';
import { toast } from "sonner"

const TECHNOLOGIES = [
    'React', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django', 'FastAPI',
    'TypeScript', 'JavaScript', 'Java', 'Spring Boot', 'PostgreSQL', 'MongoDB',
    'Redis', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Next.js', 'Tailwind CSS'
];

export default function RegisterNew() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

    const toggleTech = (tech: string) => {
        setSelectedTechs(prev =>
            prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (selectedTechs.length === 0) {
            toast.error('Selecciona al menos una tecnología');
            return;
        }

        setIsLoading(true);
        /*
        try {
            await register({ name, email, password, stack: selectedTechs });
            toast.success('¡Cuenta creada exitosamente!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Error al crear la cuenta');
        } finally {
            setIsLoading(false);
        }
        */
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex items-center justify-center px-4">
            <GridBackground colorMode="green" />

            {/* Glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

            <div className="relative z-10 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-card border border-border rounded-lg p-8 backdrop-blur-sm">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8 animate-in fade-in zoom-in-95 duration-500 delay-200 fill-mode-backwards">
                        <Link
                            href="/"
                        >
                            <FaArrowLeft className="w-4 h-4 text-brand group-hover:translate-x-1 transition-transform" />
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

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-lg mb-2 text-foreground/80">Nombre completo</label>
                                    <div className="relative group">
                                        <MdMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                            placeholder="tu nombre"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg mb-2 text-foreground/80">Correo electrónico</label>
                                    <div className="relative group">
                                        <MdMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                            placeholder="tu@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg mb-2 text-foreground/80">Contraseña</label>
                                    <div className="relative group">
                                        <CiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-10 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            aria-pressed={showPassword}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-lg mb-2 text-foreground/80">Confirmar contraseña</label>
                                    <div className="relative group">
                                        <CiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 pr-10 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            aria-pressed={showPassword}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <FaCode className="w-4 h-4 text-primary" />
                                    <label className="text-sm text-foreground/80">
                                        Stack técnico <span className="text-primary">*</span>
                                    </label>
                                    {selectedTechs.length > 0 && (
                                        <span className="text-xs text-muted-foreground">
                                            ({selectedTechs.length} seleccionadas)
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-2 p-4 bg-input-background border border-border rounded-md max-h-64 overflow-y-auto">
                                    {TECHNOLOGIES.map((tech) => (
                                        <button
                                            key={tech}
                                            type="button"
                                            onClick={() => toggleTech(tech)}
                                            className={`px-3 py-1.5 rounded-md text-sm transition-transform duration-150 hover:scale-105 active:scale-95 flex items-center gap-2 border ${selectedTechs.includes(tech)
                                                ? 'bg-primary/20 text-primary border-primary'
                                                : 'bg-muted/30 text-foreground/70 hover:bg-muted border-border/50'
                                                }`}
                                            style={{ fontFamily: 'var(--font-mono)' }}
                                        >
                                            <span>{tech}</span>
                                            {selectedTechs.includes(tech) && <FiX size={14} />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand px-8 text-sm font-bold uppercase tracking-wider text-background transition-all hover:brightness-110 sm:w-full"
                                style={{ fontFamily: 'var(--font-mono)' }}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>CREAR CUENTA</span>
                                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <div className="text-center pt-4 border-t border-border">
                                <span className="text-sm text-muted-foreground">¿Ya tienes cuenta? </span>
                                <Link
                                    href="/login"
                                    className="text-sm text-brand hover:text-secondary/80 transition-colors font-medium"
                                >
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