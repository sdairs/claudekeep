'use client';

import { useRouter } from 'next/navigation';
import { Chat } from '@/lib/supabase/queries';
import { ChatDetails } from './chat-details';

interface ChatDetailsContainerProps {
  chat: Chat;
}

export function ChatDetailsContainer({ chat }: ChatDetailsContainerProps) {
  const router = useRouter();

  return (
    <ChatDetails 
      chat={chat}
      onDelete={() => router.push('/chats')}
      onVisibilityChange={() => router.refresh()}
    />
  );
}
