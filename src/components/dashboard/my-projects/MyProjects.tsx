'use client'

import { useState, useMemo } from "react";
import { bucketProjectsByUser } from "@/lib/projects/queries";
import { Project } from "@/lib/projects/types";
import { AuthUser, Technology } from "@/lib/auth/types";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LuFolderKanban } from "react-icons/lu";
import { FaCode } from "react-icons/fa6";
import { FiFileText, FiPlus } from "react-icons/fi";
import ProjectCard from "../ProjectCard";

type TabType = 'created' | 'collaborating' | 'drafts';

interface MyProjectsProps {
    initialProjects: Project[];
    user: AuthUser;
    technologies: Technology[];
}

export default function MyProjects({ initialProjects, user, technologies }: MyProjectsProps) {

    const [activeTab, setActiveTab] = useState<TabType>('created');

    const buckets = useMemo(() =>
        bucketProjectsByUser(initialProjects, user.id),
        [initialProjects, user.id]
    );

    const technologyName = useMemo(() => {
        const map = new Map(technologies.map((t) => [String(t.id), t.name] as const));
        return (id: string) => map.get(String(id)) ?? String(id);
    }, [technologies]);

    const stats = [
        { label: "Proyectos Creados", value: buckets.created.length, icon: LuFolderKanban, color: "text-brand" },
        { label: "Colaboraciones", value: buckets.collaborating.length, icon: FaCode, color: "text-sidebar-primary" },
        { label: "Borradores", value: buckets.drafts.length, icon: FiFileText, color: "text-muted-foreground" },
    ];

    const currentProjects = buckets[activeTab];

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <Card key={i} className="transition-all duration-300 hover:shadow-md border-border/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xl text-muted-foreground font-medium">{stat.label}</span>
                                    <stat.icon size={20} className={stat.color} />
                                </div>
                                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs navigation */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabType)} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full h-14 mb-8 bg-card border border-border p-1">

                        <TabsTrigger
                            value="created"
                            className="gap-2 transition-all data-[state=active]:bg-brand data-[state=active]:text-white shadow-sm"
                        >
                            <LuFolderKanban size={18} />
                            <span className="hidden sm:inline">Mis Proyectos</span>
                            <Badge
                                variant="secondary"
                                className="ml-1 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                            >
                                {buckets.created.length}
                            </Badge>
                        </TabsTrigger>

                        <TabsTrigger
                            value="collaborating"
                            className="gap-2 transition-all data-[state=active]:bg-brand data-[state=active]:text-white shadow-sm"
                        >
                            <FaCode size={18} />
                            <span className="hidden sm:inline">Colaborando</span>
                            <Badge
                                variant="secondary"
                                className="ml-1 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                            >
                                {buckets.collaborating.length}
                            </Badge>
                        </TabsTrigger>

                        <TabsTrigger
                            value="drafts"
                            className="gap-2 transition-all data-[state=active]:bg-brand data-[state=active]:text-white shadow-sm"
                        >
                            <FiFileText size={18} />
                            <span className="hidden sm:inline">Borradores</span>
                            <Badge
                                variant="secondary"
                                className="ml-1 data-[state=active]:bg-white/20 data-[state=active]:text-white"
                            >
                                {buckets.drafts.length}
                            </Badge>
                        </TabsTrigger>

                    </TabsList>

                    {/* Projects Grid Content */}
                    <div >
                        {currentProjects.length === 0 ? (
                            <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
                                <div className="w-30 h-30 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {activeTab === 'created' && <LuFolderKanban size={32} className="text-muted-foreground" />}
                                    {activeTab === 'collaborating' && <FaCode size={32} className="text-muted-foreground" />}
                                    {activeTab === 'drafts' && <FiFileText size={32} className="text-muted-foreground" />}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">
                                    {activeTab === 'created' && 'No has creado proyectos aún'}
                                    {activeTab === 'collaborating' && 'No estás colaborando en ningún proyecto'}
                                    {activeTab === 'drafts' && 'No tienes borradores guardados'}
                                </h3>
                                <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                                    {activeTab === 'created' && 'Crea tu primer proyecto y encuentra colaboradores para darle vida.'}
                                    {activeTab === 'collaborating' && 'Explora el feed para encontrar proyectos que encajen con tu stack.'}
                                    {activeTab === 'drafts' && 'Guarda tus ideas y complétalas cuando estés listo para publicar.'}
                                </p>

                                {activeTab !== 'collaborating' ? (
                                    <Button
                                        className="font-mono w-xs h-14 gap-2 bg-brand text-background hover:brightness-110"
                                    >
                                        <Link href="/dashboard/projects/new" className="flex items-center gap-2 text-lg">
                                            <FiPlus size={20} />
                                            <span>CREAR PROYECTO</span>
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button variant="secondary" className="w-xs h-14 bg-sidebar-primary text-background">
                                        <Link href="/dashboard" className="text-lg">EXPLORAR PROYECTOS</Link>
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {currentProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        technologyName={technologyName}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Tabs>
            </div>
        </div>
    );
}