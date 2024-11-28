import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  try {
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }
    
    // Here is where we would take the user UUID from the token
    // but right now the token is just the user UUID for simplicity
    const userUuid = token;
    
    // Get the request body
    const body = await request.json();
    
    if (!body.chat || !Array.isArray(body.chat)) {
      return NextResponse.json(
        { error: 'Invalid chat format. Expected chat array.' },
        { status: 400 }
      );
    }

    // Create the chat entry
    const chatData = {
      chat: body.chat,
      owner: userUuid,
      public: body.public ?? false, // Default to private if not specified
    };

    const { data, error } = await supabase
      .from('chats')
      .insert([chatData]);

    if (error) {
      console.error('Error creating chat:', error);
      return NextResponse.json(
        { error: 'Failed to create chat' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in POST /api/chats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  try {
    const token = request.nextUrl.searchParams.get('token');
    
    let query = supabase
      .from('chats')
      .select('*')
      .order('created_at', { ascending: false });

    if (token) {
      // If token provided, get user's chats
      query = query.eq('owner', token);
    } else {
      // Otherwise, get public chats
      query = query.eq('public', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching chats:', error);
      return NextResponse.json(
        { error: 'Failed to fetch chats' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/chats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
