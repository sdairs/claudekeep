// import { jwtVerify } from 'jose';

// const JWT_SECRET = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const JWT_ISSUER = 'claudekeep';
// const JWT_AUDIENCE = 'claudekeep-mcp';
import { SupabaseClient } from "@supabase/supabase-js";

export async function refreshUserToken(supabase: SupabaseClient, userId: string): Promise<string | null> {
  try {
    // Delete existing token
    await supabase.from('user_tokens').delete().eq('user_id', userId);
    
    // Call the API to generate a new token
    const response = await fetch('/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { token } = await response.json();
    return token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}
