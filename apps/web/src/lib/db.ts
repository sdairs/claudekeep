import { supabase } from './supabase';

export interface Message {
  text: string;
  fromUser: boolean;
}

export interface Chat {
  id: string;
  chat: Message[];
  created_at: Date;
}

export async function getChats(): Promise<Chat[]> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chats:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching chats:', error);
    return [];
  }
}

export async function getChatById(id: string): Promise<Chat | null> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching chat:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    return null;
  }
}
