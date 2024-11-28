import { SignJWT, jwtVerify } from 'jose';
import { createClient } from './supabase/server';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const JWT_ISSUER = 'claudekeep';
const JWT_AUDIENCE = 'claudekeep-mcp';

export async function generateUserToken(userId: string): Promise<string> {
  const jwt = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .sign(new TextEncoder().encode(JWT_SECRET));
  
  // Store the token in Supabase
  const supabase = await createClient();
  await supabase.from('user_tokens').upsert({
    user_id: userId,
    token: jwt,
  });

  return jwt;
}

export async function verifyUserToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET),
      {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }
    );
    return payload.sub || null;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function refreshUserToken(userId: string): Promise<string> {
  const supabase = await createClient();
  
  // Delete existing token
  await supabase.from('user_tokens').delete().eq('user_id', userId);
  
  // Generate and store new token
  return generateUserToken(userId);
}
