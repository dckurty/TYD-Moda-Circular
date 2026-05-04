import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSessionToken } from "@/lib/adminSession";

const MAX_AGE_SEC = 60 * 60 * 24 * 14;

export async function POST(request: Request) {
  const pwd = process.env.ADMIN_PASSWORD?.trim();
  if (!pwd) {
    return NextResponse.json(
      { error: "Falta ADMIN_PASSWORD en el servidor." },
      { status: 503 }
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  if (body.password !== pwd) {
    return NextResponse.json({ error: "Clave incorrecta." }, { status: 401 });
  }

  const token = await createAdminSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
  return res;
}
