'use client';

import { Chat } from '@/lib/supabase/queries';
import { ChatList } from './chat-list';
import { useState } from 'react';

interface ChatListContainerProps {
  chats: Chat[];
}

export function ChatListContainer({ chats }: ChatListContainerProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div className="">
      <ChatList
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={(chat) => setSelectedChatId(chat.id)}
      />
    </div>
  );
}
