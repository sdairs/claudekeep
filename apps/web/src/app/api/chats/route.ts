import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt/verify';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  try {
    const token = request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('Verified token for user:', userId);

    const body = await request.json();
    if (!body.chat || !Array.isArray(body.chat)) {
      return NextResponse.json(
        { error: 'Invalid chat format. Expected chat array.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('chats')
      .insert([
        {
          chat: body.chat,
          owner: userId,
          public: body.public || false,
          chat_session_id: body.chat_session_id,
        },
      ]);

    if (error) {
      console.error('Error inserting chat:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/chats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const supabase = await createClient();
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    let query = supabase.from('chats').select('*').order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('owner', userId);
    } else {
      query = query.eq('public', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching chats:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chats: data || [] });
  } catch (error) {
    console.error('Error in GET /api/chats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
