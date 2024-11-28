import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const JWT_ISSUER = 'claudekeep';
const JWT_AUDIENCE = 'claudekeep-mcp';

export async function verifyToken(token: string): Promise<string | null> {
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
