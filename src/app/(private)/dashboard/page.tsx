import { requireSession } from "@/lib/auth/session";

export default async function DashboardPage() {
    const { user } = await requireSession();
    return (
        <div className="px-8 py-10">
            <h1 className="text-3xl font-semibold tracking-tight">
                Hola, <span className="text-brand">{user.name}</span>
            </h1>
            <p className="mt-2 text-muted-foreground">
                Bienvenido a DevCollab. Desde aquí podrás gestionar tus proyectos y colaboraciones.
            </p>
        </div>
    );
}
