import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminSessionValidFromHeader } from "@/lib/adminSession";

const LOGIN = "/admin/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === LOGIN || pathname.startsWith(`${LOGIN}/`)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/admin/")) {
    return NextResponse.next();
  }

  const configured = Boolean(process.env.ADMIN_PASSWORD?.trim());

  if (pathname.startsWith("/api/upload")) {
    if (!configured) {
      return NextResponse.json(
        { error: "Admin no configurado (falta ADMIN_PASSWORD)." },
        { status: 503 }
      );
    }
    const ok = await isAdminSessionValidFromHeader(request.headers.get("cookie"));
    if (!ok) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!configured) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN;
      url.searchParams.set("misconfigured", "1");
      return NextResponse.redirect(url);
    }
    const ok = await isAdminSessionValidFromHeader(request.headers.get("cookie"));
    if (!ok) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN;
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload"],
};
