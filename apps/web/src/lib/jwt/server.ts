import { SignJWT } from 'jose';
import { createClient } from '../supabase/server';

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
