import { NextRequest, NextResponse } from "next/server";

const STATIC_USERNAME = "admin";
const STATIC_PASSWORD = "admin123";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  const username = body?.username ?? "";
  const password = body?.password ?? "";

  if (username !== STATIC_USERNAME || password !== STATIC_PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: "apollo_auth",
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

