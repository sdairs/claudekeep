'use client';

import { createClient } from '@/lib/supabase/client';
import { getUser } from '@/lib/supabase/queries';
import { refreshUserToken } from '@/lib/jwt/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { getURL } from '@/lib/supabase/auth';

export function Header() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser(supabase);
      setUser(user);
      if (user) {
        setIsLoadingToken(true);
        let attempts = 0;
        const maxAttempts = 10; // Try for 10 seconds
        const interval = setInterval(async () => {
          const { data } = await supabase
            .from('user_tokens')
            .select('token')
            .eq('user_id', user.id)
            .single();

          if (data?.token) {
            setToken(data.token);
            setIsLoadingToken(false);
            clearInterval(interval);
          } else if (++attempts >= maxAttempts) {
            setIsLoadingToken(false);
            clearInterval(interval);
            console.error('Failed to load token after multiple attempts');
          }
        }, 1000); // Check every second

        // Cleanup
        return () => clearInterval(interval);
      }
    };
    fetchUser();
  }, [supabase]);

  const handleCopyToken = async () => {
    if (token) {
      await navigator.clipboard.writeText(token);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    }
  };

  const handleRefreshToken = async () => {
    if (user) {
      setIsLoadingToken(true);
      const newToken = await refreshUserToken(supabase, user.id);
      setToken(newToken);
      setIsLoadingToken(false);
    }
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${getURL()}chats`
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-800">
          ClaudeKeep
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={token || ''}
                  readOnly
                  disabled={isLoadingToken}
                  className={`w-64 px-3 py-1 border rounded ${isLoadingToken ? 'bg-gray-100' : 'bg-gray-50'}`}
                />
                <button
                  onClick={handleCopyToken}
                  disabled={isLoadingToken || !token}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 ${isLoadingToken ? 'text-gray-400' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {isLoadingToken ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : copying ? (
                    <span className="text-green-500">Copied!</span>
                  ) : (
                    'Copy'
                  )}
                </button>
              </div>
              <button
                onClick={handleRefreshToken}
                disabled={isLoadingToken}
                className={`p-2 ${isLoadingToken ? 'text-gray-400' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/chats" className="text-gray-600 hover:text-gray-900">
                My Chats
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
