import { createClient } from '@/lib/supabase/server';
import { getChat } from '@/lib/supabase/queries';
import { MessageItem } from '@/components/message-item';
import { ChatDetails } from '@/components/chat-details';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatsPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const chat = await getChat(supabase, id);

  if (!chat) {
    notFound();
  }

  return (
    <div className="h-full flex flex-col">
      <ChatDetails chat={chat} />
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {chat.chat.map((message, index) => (
            <MessageItem key={index} message={message} />
          ))}
        </div>
      </div>
    </div>
  );
}
