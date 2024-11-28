'use client';

import { useEffect, useState } from 'react';
import { ChatList } from '@/components/ChatList';
import { ChatDisplay } from '@/components/ChatDisplay';
import { Chat } from '@/lib/db';
import { Header } from '@/components/Header';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ChatsPage() {
  // const router = useRouter();
  const supabase = createClient();
  const [session, setSession] = useState<any>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        // Removed redirect logic here
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        // Removed redirect logic here
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    async function loadChats() {
      let query = supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: false });

      if (session) {
        // For logged-in users, show their private chats
        console.log('Fetching private chats');
        console.log(session.user.id);
        query = query.eq('owner', session.user.id);
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
  }, [session, supabase]);

  if (!session) {
    // Removed null return here
  }

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
              {session ? 'Your Chats' : 'Public Chats'}
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
