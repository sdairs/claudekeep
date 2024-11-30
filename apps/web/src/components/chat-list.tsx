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
            id={chat.id}
            title={chat.chat[0]?.text.substring(0, 30) || 'Untitled Chat'}
            lastMessage={chat.chat[0]?.text}
            updatedAt={new Date(chat.created_at)}
            isPublic={chat.public}
            showBadge={true}
          />
        </div>
      ))}
    </div>
  );
}
