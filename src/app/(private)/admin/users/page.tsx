import { tryOr } from "@/lib/api/safe";
import { requireRole } from "@/lib/auth/session";
import { ELEVATED_ROLES } from "@/lib/auth/types";
import { listUsers } from "@/lib/admin/api";
import UsersTable from "@/components/dashboard/admin/UserTable";

export default async function AdminUsersPage() {
    const session = await requireRole(ELEVATED_ROLES);
    const users = await tryOr(listUsers(session.token), []);
    return (
        <UsersTable
            users={users}
            currentUserId={session.user.id}
            canManageRoles={session.user.role === "admin"}
        />
    );
}