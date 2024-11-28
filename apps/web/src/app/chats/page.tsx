'use client';

import { useEffect, useState } from 'react';
import { ChatList } from '@/components/ChatList';
import { ChatDisplay } from '@/components/ChatDisplay';
import { Chat } from '@/lib/supabase/queries';
import { Header } from '@/components/Header';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { getUser } from '@/lib/supabase/queries';

export default function ChatsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const user = await getUser(supabase);
      setUser(user);
    }
    loadUser();
  }, [supabase]);

  useEffect(() => {
    async function loadChats() {
      let query = supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: false });

      if (user) {
        // For logged-in users, show their private chats
        console.log('Fetching private chats');
        console.log(user.id);
        query = query.eq('owner', user.id);
      } else {
        // For non-logged-in users, only show public chats
        console.log('Fetching public chats');
        query = query.eq('public', true);
      }

      const { data: chats, error } = await query;
      console.log(chats);

      if (error) {
        console.error('Error loading chats:', error);
        return;
      }

      setChats(chats || []);
      setLoading(false);
    }

    loadChats();
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] pt-16">
          <div className="text-xl text-gray-500">Loading chats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <div className="w-64 border-r border-gray-200 bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {user ? 'Your Chats' : 'Public Chats'}
            </h2>
          </div>
          <ChatList
            chats={chats}
            selectedChatId={selectedChat?.id || null}
            onSelectChat={setSelectedChat}
          />
        </div>
        <div className="flex-1 bg-white">
          <ChatDisplay chat={selectedChat} />
        </div>
      </div>
    </div>
  );
}
