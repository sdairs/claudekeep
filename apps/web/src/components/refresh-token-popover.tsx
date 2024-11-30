'use client';

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RefreshTokenPopoverProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export function RefreshTokenPopover({ isLoading, onRefresh }: RefreshTokenPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="p-2"
          disabled={isLoading}
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Refresh JWT Token</h4>
            <p className="text-sm text-muted-foreground">
              This action will regenerate your JWT token. You will need to update your Claude Desktop configuration with the new token.
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              variant="default"
              onClick={onRefresh}
              disabled={isLoading}
            >
              {isLoading ? 'Refreshing...' : 'Confirm Refresh'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
