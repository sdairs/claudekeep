'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deleteChat(chatId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId);

  if (error) {
    throw error;
  }

  revalidatePath('/chats');
  redirect('/chats');
}

export async function toggleChatVisibility(chatId: string) {
  const supabase = await createClient();

  // First get the current state
  const { data: chat } = await supabase
    .from('chats')
    .select('public')
    .eq('id', chatId)
    .single();

  if (!chat) {
    throw new Error('Chat not found');
  }

  // Toggle the public state
  const { error } = await supabase
    .from('chats')
    .update({ public: !chat.public })
    .eq('id', chatId);

  if (error) {
    throw error;
  }

  revalidatePath(`/chats/${chatId}`);
}
