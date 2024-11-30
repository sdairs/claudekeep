'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PrivacyBadgeProps {
  isPublic: boolean;
}

export function PrivacyBadge({ isPublic }: PrivacyBadgeProps) {
  return (
    <Badge 
      variant="outline"
      className={cn(
        isPublic 
          ? "border-green-500 text-green-500 hover:bg-green-500/10" 
          : "border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
      )}
    >
      {isPublic ? "Public" : "Private"}
    </Badge>
  );
}
