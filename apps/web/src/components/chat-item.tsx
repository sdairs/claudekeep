'use client';

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { cn } from "@/lib/utils";

interface ChatItemProps {
  id: string;
  title: string;
  lastMessage?: string;
  updatedAt: Date;
  isPublic?: boolean;
  showBadge?: boolean;
}

export function ChatItem({ 
  id, 
  title, 
  lastMessage, 
  updatedAt, 
  isPublic, 
  showBadge = false 
}: ChatItemProps) {
  return (
    <Link href={`/chats/${id}`} className="block hover:no-underline">
      <Card className="hover:bg-accent transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            {showBadge && typeof isPublic !== 'undefined' && (
              <Badge 
                variant="outline"
                className={cn(
                  isPublic 
                    ? "border-green-500 text-green-500 hover:bg-green-500/10" 
                    : "border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                )}
              >
                {isPublic ? 'Public' : 'Private'}
              </Badge>
            )}
          </div>
          {lastMessage && (
            <CardDescription className="line-clamp-2">
              {lastMessage}
            </CardDescription>
          )}
          <CardDescription className="text-xs mt-2">
            Last updated: {formatDistanceToNow(updatedAt, { addSuffix: true })}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}