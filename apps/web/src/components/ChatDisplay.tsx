import { Chat } from '@/lib/supabase/queries';

interface ChatDisplayProps {
  chat: Chat | null;
}

export function ChatDisplay({ chat }: ChatDisplayProps) {
  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat to view
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {chat.chat.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.fromUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.fromUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
