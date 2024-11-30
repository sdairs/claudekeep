'use client';

import { createClient } from '@/lib/supabase/client';
import { getUser } from '@/lib/supabase/queries';
import { refreshUserToken } from '@/lib/jwt/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { getURL } from '@/lib/supabase/auth';
import { Loader, RotateCcw, Copy, Check } from 'lucide-react';
import { ModeToggle } from './theme-toggle';
import { RefreshTokenPopover } from './refresh-token-popover';

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
    if (!user) return;
    setIsLoadingToken(true);
    try {
      const newToken = await refreshUserToken(supabase, user.id);
      setToken(newToken);
    } finally {
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
                className="p-2"
              >
                {copying ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
              <input
                type="text"
                value={token || ''}
                readOnly
                disabled={isLoadingToken}
                className={`w-64 px-3 py-1 border rounded`}
              />
              <RefreshTokenPopover
                isLoading={isLoadingToken}
                onRefresh={handleRefreshToken}
              />
            </div>
          )}
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/chats">
                My Chats
              </Link>
              <button
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Login
            </button>
          )}
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
