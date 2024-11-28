import { Chat } from '@/lib/db';
import { format } from 'date-fns';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  return (
    <div className="w-64 border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Saved Chats</h2>
        <div className="space-y-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedChatId === chat.id
                  ? 'bg-blue-100 hover:bg-blue-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="text-sm font-medium truncate">
                {chat.chat[0]?.text.substring(0, 30)}...
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {format(new Date(chat.created_at), 'MMM d, yyyy')}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
