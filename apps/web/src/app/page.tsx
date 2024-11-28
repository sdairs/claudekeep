'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Chat, getChats } from '@/lib/db';
import Link from 'next/link';
import { format } from 'date-fns';

export default function Home() {
  const [publicChats, setPublicChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPublicChats() {
      const fetchedChats = await getChats();
      console.log(fetchedChats);
      setPublicChats(fetchedChats.slice(0, 6)); // Show only first 6 chats
      setLoading(false);
    }
    loadPublicChats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Your AI Conversations</span>
              <span className="block text-indigo-600">Organized and Shared</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              ClaudeKeep helps you save, organize, and share your conversations with Claude. Browse public chats or sign in to create your own private collection.
            </p>
          </div>
        </div>

        {/* Featured Chats Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Conversations</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-500">Loading conversations...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {publicChats.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chats?id=${chat.id}`}
                  className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {format(new Date(chat.created_at), 'MMM d, yyyy')}
                    </div>
                    <div className="text-lg font-medium text-gray-900 mb-2">
                      {chat.chat[0]?.text.slice(0, 100)}...
                    </div>
                    <div className="text-sm text-gray-600">
                      {chat.chat.length} messages
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
