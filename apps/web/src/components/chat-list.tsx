'use client';

import { Chat } from '@/lib/supabase/queries';
import { ChatItem } from './chat-item';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  return (
    <div className="space-y-2 p-4">
      {chats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className={`cursor-pointer ${selectedChatId === chat.id ? 'ring-2 ring-primary rounded-xl' : ''}`}
        >
          <ChatItem
            chat={chat}
            showBadge={true}
            featured={false}
          />
        </div>
      ))}
    </div>
  );
}
