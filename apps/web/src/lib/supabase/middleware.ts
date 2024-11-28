import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { generateUserToken } from '../jwt/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refreshing the auth token
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
        // Check if user already has a token
        const { data: existingToken } = await supabase
            .from('user_tokens')
            .select('token')
            .eq('user_id', user.id)
            .single()

        console.log('existingToken')
        console.log(existingToken)

        if (!existingToken) {
            console.log('No token found for user')
            // Generate token if user doesn't have one
            await generateUserToken(user.id)
        }
    }

    return supabaseResponse
}