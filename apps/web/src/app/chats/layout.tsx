import { createClient } from '@/lib/supabase/server';
import { getUserChats } from '@/lib/supabase/queries';
import { ChatListContainer } from '@/components/chat-list-container';

export default async function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const chats = await getUserChats(supabase);

    return (
        <div className="flex h-[calc(100vh-4rem)]">
            {/* Sidebar */}
            <div className="w-80">
                <div className="p-4">
                    <h2 className="text-lg font-semibold">Your Chats</h2>
                </div>
                <div className="overflow-y-auto h-[calc(100vh-8rem)]">
                    <ChatListContainer chats={chats} />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
