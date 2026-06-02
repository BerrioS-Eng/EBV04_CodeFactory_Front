import type { AuthUser } from "@/lib/auth/types";

export interface UpdateProfilePayload {
    name: string;
    bio: string | null;
    githubUrl: string | null;
    gitlabUrl: string | null;
    stack: string[];
}

export const BIO_MAX = 500;
export const NAME_MAX = 150;

export type ProfileUser = AuthUser;