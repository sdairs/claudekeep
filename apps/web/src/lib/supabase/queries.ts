import { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

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

export const getUser = cache(async (supabase: SupabaseClient) => {
    const {
        data: { user }
    } = await supabase.auth.getUser();
    return user;
});

export const getPublicChats = cache(async (supabase: SupabaseClient, limit?: number): Promise<Chat[]> => {
    const { data: chats } = await supabase
        .from('chats')
        .select('*')
        .eq('public', true)
        .order('created_at', { ascending: false })
        .limit(limit ?? 15);
    return chats || [];
});

export async function getUserChats(supabase: SupabaseClient, limit?: number): Promise<Chat[]> {
    const user = await getUser(supabase);
    if (!user) {
        return [];
    }
    const userId = user?.id;
    try {
        let query = supabase
            .from('chats')
            .select('*')
            .order('created_at', { ascending: false })
            .eq('owner', userId)
            .limit(limit ?? 15);

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

export async function getChat(supabase: SupabaseClient, id: string): Promise<Chat | null> {
    try {
        const { data: chat, error } = await supabase
            .from('chats')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return null;
        }

        return chat;
    } catch (error) {
        console.error('Error fetching chat:', error);
        return null;
    }
}
