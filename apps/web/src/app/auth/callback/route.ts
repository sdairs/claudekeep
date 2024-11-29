import { createClient } from '@/lib/supabase/server'
import { generateUserToken } from '@/lib/jwt/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code)

    if (user) {
      // Check if user already has a token
      const { data: existingToken } = await supabase
        .from('user_tokens')
        .select('token')
        .eq('user_id', user.id)
        .single()

      if (!existingToken) {
        // Generate token for new users
        await generateUserToken(user.id)
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/chats', requestUrl.origin))
}
