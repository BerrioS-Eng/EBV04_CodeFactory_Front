import type { Technology } from "@/lib/auth/types";
import RegisterForm from "./RegisterForm";

// TODO: reemplazar por GET /api/technologies cuando esté disponible.
const TECHNOLOGIES: Technology[] = [
    { id: "1", name: "React" },
    { id: "2", name: "Vue.js" },
    { id: "3", name: "Angular" },
    { id: "4", name: "Node.js" },
    { id: "5", name: "Python" },
    { id: "6", name: "Django" },
    { id: "7", name: "FastAPI" },
    { id: "8", name: "TypeScript" },
    { id: "9", name: "JavaScript" },
    { id: "10", name: "Java" },
    { id: "11", name: "Spring Boot" },
    { id: "12", name: "PostgreSQL" },
    { id: "13", name: "MongoDB" },
    { id: "14", name: "Redis" },
    { id: "15", name: "Docker" },
    { id: "16", name: "Kubernetes" },
    { id: "17", name: "AWS" },
    { id: "18", name: "GraphQL" },
    { id: "19", name: "Next.js" },
    { id: "20", name: "Tailwind CSS" },
];

export default function RegisterPage() {
    return <RegisterForm technologies={TECHNOLOGIES} />;
}
