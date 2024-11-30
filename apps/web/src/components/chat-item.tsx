'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Chat } from '@/lib/supabase/queries';
import { PrivacyBadge } from '@/components/privacy-badge';

interface ChatItemProps {
  chat: Chat;
  showBadge?: boolean;
  featured?: boolean;
}

export function ChatItem({
  chat,
  showBadge = true,
  featured = false
}: ChatItemProps) {
  // Get first message content for preview
  const firstMessage = chat.chat[0]?.text || '';
  const preview = firstMessage.length > 120 ? firstMessage.substring(0, 120) + '...' : firstMessage;

  return (
    <Link href={featured ? `/chats/shared/${chat.id}` : `/chats/${chat.id}`} className="block hover:no-underline">
      <Card className={`h-full transition-colors hover:bg-accent/50 ${featured ? 'flex flex-col' : ''}`}>
        <CardHeader>
          <div>
            {/* <CardTitle className="line-clamp-1">{chat.title}</CardTitle> */}
            {showBadge && (
              <PrivacyBadge isPublic={chat.public} />
            )}
          </div>
          <CardDescription>
            {chat.created_at && !isNaN(new Date(chat.created_at).getTime())
              ? format(new Date(chat.created_at), 'PPP')
              : 'Date not available'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className={featured ? 'flex-1 overflow-hidden' : ''}>
          <p className={`text-sm text-muted-foreground ${featured ? 'line-clamp-6' : 'line-clamp-2'}`}>
            {preview}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}