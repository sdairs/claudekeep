'use client';

import { useEffect, useState } from 'react';
import { Chat, getPublicChats } from '@/lib/supabase/queries';
import { ChatItem } from '@/components/chat-item';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Construction, SquareArrowOutUpRight } from 'lucide-react';

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchChats() {
      const chats = await getPublicChats(supabase);
      setChats(chats);
    }
    fetchChats();
  }, []);

  return (

    <main className="pt-16">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
            <span className="block">Your AI Conversations</span>
            <span className="block text-indigo-600">Organized and Shared</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            ClaudeKeep helps you save, organize, and share your conversations with Claude. Browse public chats or sign in to create your own private collection.
          </p>
          <Card className="mt-5 w-fit mx-auto p-4">
            <Construction className='inline mr-2 h-6 w-6' color='orange' />
            <Construction className='inline mr-2 h-6 w-6' color='red' />
            <Construction className='inline mr-2 h-6 w-6' color='orange' />
            <Construction className='inline mr-2 h-6 w-6' color='red' />
            <Construction className='inline mr-2 h-6 w-6' color='orange' />
            <div className='mb-4'>
              This is a <a target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
                href="https://modelcontextprotocol.io/introduction">
                Model Context Protocol (MCP) </a>
              experiment. It requires a bit of technical setup.
            </div>
            <div>
              <a
                href="https://github.com/sdairs/claudekeep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Read the README
                <SquareArrowOutUpRight className='inline ml-2 h-4 w-4' />
              </a>
            </div>
            <Construction className='inline mr-2 h-6 w-6' color='orange' />
            <Construction className='inline mr-2 h-6 w-6' color='red' />
            <Construction className='inline mr-2 h-6 w-6' color='orange' />
            <Construction className='inline mr-2 h-6 w-6' color='red' />
            <Construction className='inline mr-2 h-6 w-6' color='orange' />
          </Card>
        </div>
      </div>

      {/* Featured Chats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Recent conversations</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 auto-rows-min">
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              featured={true}
              showBadge={false}
            />
          ))}
        </div>
      </div>
    </main >
  );
}
