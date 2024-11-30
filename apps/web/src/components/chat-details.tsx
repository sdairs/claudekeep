'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Share2, Lock, LockOpen, Check } from 'lucide-react';
import { Chat } from '@/lib/supabase/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { deleteChat, toggleChatVisibility } from '@/app/actions';
import { PrivacyBadge } from '@/components/privacy-badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChatDetailsProps {
  chat: Chat;
}

export function ChatDetails({ chat }: ChatDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteChat(chat.id);
    } catch (error) {
      console.error('Error deleting chat:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleVisibilityToggle = async () => {
    setIsUpdating(true);
    try {
      await toggleChatVisibility(chat.id);
    } catch (error) {
      console.error('Error updating chat visibility:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/chat/${chat.id}`;
      await navigator.clipboard.writeText(shareUrl);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PrivacyBadge isPublic={chat.public} />
              {chat.created_at && !isNaN(new Date(chat.created_at).getTime()) && (
                <p className="text-sm text-muted-foreground">
                  Saved on {format(new Date(chat.created_at), 'PPP')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleVisibilityToggle}
              disabled={isUpdating}
            >
              {chat.public ? (
                <Lock className="w-4 h-4 mr-2" />
              ) : (
                <LockOpen className="w-4 h-4 mr-2" />
              )}
              {chat.public ? "Make private" : "Make public"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              disabled={!chat.public}
            >
              {isCopying ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Share2 className="w-4 h-4 mr-2" />
              )}
              {isCopying ? "Copied!" : "Copy link"}
            </Button>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this chat
              and all its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
