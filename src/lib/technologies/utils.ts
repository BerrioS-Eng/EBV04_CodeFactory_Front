import type { Technology } from "@/lib/auth/types";

export function makeTechnologyName(technologies: Technology[]): (id: string | number) => string {
    const map = new Map(technologies.map((t) => [String(t.id), t.name] as const));
    return (id: string | number) => map.get(String(id)) ?? String(id);
}
