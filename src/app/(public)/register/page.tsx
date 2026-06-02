import { tryOr } from "@/lib/api/safe";
import { listTechnologies } from "@/lib/auth/api";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
    const technologies = await tryOr(listTechnologies(), []);

    return <RegisterForm technologies={technologies} />;
}
