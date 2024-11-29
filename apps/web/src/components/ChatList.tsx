import { Chat } from '@/lib/supabase/queries';
import { format } from 'date-fns';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chat: Chat) => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat }: ChatListProps) {
  return (
    <div className="w-64 shadow h-screen overflow-y-auto">
      <div className="p-4">
        <div className="space-y-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className={`w-full text-left p-3 rounded-lg group ${selectedChatId === chat.id
                ? 'bg-gray-300 hover:bg-gray-300 text-black'
                : 'bg-gray-600 hover:bg-gray-300 text-white'
                }`}
            >
              <div className={`text-sm font-medium group-hover:text-black truncate ${selectedChatId === chat.id
                ? 'text-black' : 'text-white'}`}>
                {chat.chat[0]?.text.substring(0, 30)}...
              </div>
              <div className={`text-xs  mt-1 group-hover:text-black ${selectedChatId === chat.id
                ? 'text-black' : 'text-white'
                }`}>
                {format(new Date(chat.created_at), 'MMM d, yyyy')}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
