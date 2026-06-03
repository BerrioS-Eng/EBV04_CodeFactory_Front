import type { AuthUser } from "@/lib/auth/types";

export type AdminUser = AuthUser;

export interface TechnologyStat {
    id: number;
    name: string;
    projectCount: number;
    userCount: number;
}

export interface Statistics {
    totalUsers: number;
    totalProjects: number;
    totalDiscussions: number;
    totalComments: number;
    mostUsedTechnologies: TechnologyStat[];
}