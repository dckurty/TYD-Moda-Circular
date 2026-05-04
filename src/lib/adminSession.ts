export const ADMIN_COOKIE = "tyd_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 14; // 14 días

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  let t = s.replace(/-/g, "+").replace(/_/g, "/");
  while (t.length % 4) t += "=";
  const bin = atob(t);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function signingKeyMaterial(): Promise<ArrayBuffer> {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  if (!pw) {
    throw new Error("ADMIN_PASSWORD no configurada");
  }
  return crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${pw}|tyd-admin-session-v1`)
  );
}

async function importHmacKey(): Promise<CryptoKey> {
  const raw = await signingKeyMaterial();
  return crypto.subtle.importKey("raw", raw, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

/** Crea el valor de cookie (payload firmado). */
export async function createAdminSessionToken(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = new TextEncoder().encode(JSON.stringify({ exp }));
  const key = await importHmacKey();
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, payload as BufferSource));
  return `${b64urlEncode(new Uint8Array(payload))}.${b64urlEncode(sig)}`;
}

/** Verifica token (middleware Edge o rutas Node). */
export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token || !process.env.ADMIN_PASSWORD?.trim()) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  try {
    const payloadBytes = new Uint8Array(b64urlDecode(parts[0]!));
    const sigBytes = new Uint8Array(b64urlDecode(parts[1]!));
    const key = await importHmacKey();
    const ok = await crypto.subtle.verify("HMAC", key, sigBytes, payloadBytes);
    if (!ok) return false;
    const { exp } = JSON.parse(new TextDecoder().decode(payloadBytes)) as { exp: number };
    if (typeof exp !== "number") return false;
    return Math.floor(Date.now() / 1000) < exp;
  } catch {
    return false;
  }
}

export async function isAdminSessionValidFromHeader(cookieHeader: string | null): Promise<boolean> {
  if (!cookieHeader) return false;
  const m = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=([^;]*)`));
  const raw = m?.[1] ? decodeURIComponent(m[1]) : undefined;
  return verifyAdminSessionToken(raw);
}
