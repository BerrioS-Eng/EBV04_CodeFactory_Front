"use client";

import { useState } from "react";
import { FiEdit2, FiUser } from "react-icons/fi";
import type { AuthUser, Technology } from "@/lib/auth/types";
import ProfileCard from "./ProfileCard";
import ProfileEditForm from "./ProfileEditForm";
import ProfileReadOnly from "./ProfileReadOnly";

export interface ProfileViewProps {
    user: AuthUser;
    technologies: Technology[];
}

export default function ProfileView({ user, technologies }: ProfileViewProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="flex h-full items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                            <FiUser className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">Mi Perfil</h2>
                            <p className="text-xs text-muted-foreground">
                                Gestiona tu información personal
                            </p>
                        </div>
                    </div>

                    {!isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-all hover:bg-primary/90"
                            style={{ fontFamily: "var(--font-mono)" }}
                        >
                            <FiEdit2 size={18} />
                            <span>EDITAR</span>
                        </button>
                    )}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-4xl px-6 py-8">
                    <ProfileCard user={user} />

                    {isEditing ? (
                        <ProfileEditForm
                            user={user}
                            technologies={technologies}
                            onCancel={() => setIsEditing(false)}
                            onSuccess={() => setIsEditing(false)}
                        />
                    ) : (
                        <ProfileReadOnly user={user} technologies={technologies} />
                    )}
                </div>
            </div>
        </div>
    );
}