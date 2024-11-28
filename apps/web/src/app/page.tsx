'use client';

import { useEffect, useState } from 'react';
import { ChatList } from '@/components/ChatList';
import { ChatDisplay } from '@/components/ChatDisplay';
import { Chat, getChats } from '@/lib/db';

export default function Home() {

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChats() {
      const fetchedChats = await getChats();
      console.log(fetchedChats);
      setChats(fetchedChats);
      setLoading(false);
    }
    loadChats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-500">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <ChatList
        chats={chats}
        selectedChatId={selectedChat?.id || null}
        onSelectChat={setSelectedChat}
      />
      <ChatDisplay chat={selectedChat} />
    </div>
  );
}
