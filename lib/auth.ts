import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "./env";

const COOKIE_NAME = "ri-session";
const SESSION_DURATION = "8h";

export interface SessionUser {
  email: string;
  role: "reviewer" | "admin";
}

function getSecret() {
  return new TextEncoder().encode(env.authSecret);
}

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecret());
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (typeof payload.email !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return { email: payload.email, role: payload.role as SessionUser["role"] };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function validateCredentials(
  email: string,
  password: string
): SessionUser | null {
  if (email === env.reviewerEmail && password === env.reviewerPassword) {
    return { email, role: "reviewer" };
  }
  return null;
}

export { COOKIE_NAME };
