import { createClient } from '@/lib/supabase/server';
import { getChat } from '@/lib/supabase/queries';
import { MessageItem } from '@/components/message-item';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatPage({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const chat = await getChat(supabase, id);

  if (!chat) {
    return (
      <div className="p-8">
        Chat not found
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {chat.chat.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
      </div>
    </div>
  );
}
