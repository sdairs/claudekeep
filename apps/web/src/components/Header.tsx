'use client';

import { createClient } from '@/lib/supabase/client';
import { getUser } from '@/lib/supabase/queries';
import { refreshUserToken } from '@/lib/jwt/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { getURL } from '@/lib/supabase/auth';
import { Loader, RotateCcw, Copy } from 'lucide-react';

export function Header() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
        router.push('/');
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

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
        redirectTo: `${getURL()}auth/callback`
      }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header>
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-400">
          ClaudeKeep
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyToken}
                disabled={isLoadingToken}
                className="p-2 text-white hover:text-gray-300"
              >
                <Copy className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={token || ''}
                readOnly
                disabled={isLoadingToken}
                className={`w-64 px-3 py-1 border rounded text-black bg-gray-300`}
              />
              <button
                onClick={handleRefreshToken}
                disabled={isLoadingToken}
                className="p-2 text-white hover:text-gray-300"
              >
                {isLoadingToken ? (
                  <Loader className="animate-spin w-5 h-5" />
                ) : (
                  <RotateCcw className="w-5 h-5" />
                )}
              </button>
              {copying && (
                <span className="text-green-500 text-sm">Copied!</span>
              )}
            </div>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/chats" className="text-white hover:text-gray-900">
                My Chats
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-900"
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
