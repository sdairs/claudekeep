import { supabase } from './supabase';

export interface Message {
  text: string;
  fromUser: boolean;
}

export interface Chat {
  id: string;
  chat: Message[];
  created_at: Date;
  owner: string;
  public: boolean;
}

export async function getChats(userId?: string): Promise<Chat[]> {
  try {
    let query = supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      // For logged-in users, only show their owned chats
      query = query.eq('owner', userId);
    } else {
      // For non-logged-in users, only show public chats
      query = query.eq('public', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching chats:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getChats:', error);
    return [];
  }
}

export async function getChatById(id: string, userId?: string): Promise<Chat | null> {
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

    // Check if user has access to this chat
    if (data) {
      return data;
    }

    return null;
  } catch (error) {
    console.error('Error in getChatById:', error);
    return null;
  }
}

export async function createChat(chat: Omit<Chat, 'id' | 'created_at'>): Promise<Chat | null> {
  try {
    const { data, error } = await supabase
      .from('chats')
      .insert([chat])
      .select()
      .single();

    if (error) {
      console.error('Error creating chat:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createChat:', error);
    return null;
  }
}

export async function updateChat(id: string, userId: string, updates: Partial<Chat>): Promise<Chat | null> {
  try {
    // First check if user owns this chat
    const { data: existingChat } = await supabase
      .from('chats')
      .select('owner')
      .eq('id', id)
      .single();

    if (!existingChat || existingChat.owner !== userId) {
      console.error('User does not have permission to update this chat');
      return null;
    }

    const { data, error } = await supabase
      .from('chats')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating chat:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateChat:', error);
    return null;
  }
}
