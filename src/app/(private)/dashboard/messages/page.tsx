import { requireSession } from "@/lib/auth/session";
import { fetchConversations } from "@/lib/chat/actions";
import { ChatWorkspace } from "@/components/dashboard/chat/ChatWorkspace";

export default async function MessagesPage({
    searchParams,
}: {
    searchParams: Promise<{ c?: string }>;
}) {
    const session = await requireSession();
    const { c } = await searchParams;
    const conversations = await fetchConversations();

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-semibold">Mensajes</h1>
            <ChatWorkspace
                token={session.token}
                currentUserId={session.user.id}
                initialConversations={conversations}
                initialConversationId={c ? Number(c) : null}
            />
        </div>
    );
}