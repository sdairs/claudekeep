'use client';

import { Message } from '@/lib/supabase/queries';
import { cn } from '@/lib/utils';

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.fromUser;

  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative max-w-[80%] rounded-lg px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
          "shadow-sm",
          isUser ? "rounded-br-none" : "rounded-bl-none"
        )}
      >
        <div className="break-words">
          {message.text}
        </div>
        <div
          className={cn(
            "absolute bottom-0 h-4 w-4",
            isUser
              ? "-right-2 border-primary"
              : "-left-2 border-muted",
            isUser
              ? "border-r border-t bg-primary"
              : "border-l border-t bg-muted",
            "transform rotate-45"
          )}
        />
      </div>
    </div>
  );
}
