import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Sube una imagen a Vercel Blob y devuelve una URL pública.
 * Requiere BLOB_READ_WRITE_TOKEN (Vercel Dashboard → Storage → Blob → .env local o proyecto).
 */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Almacenamiento no configurado. Añade BLOB_READ_WRITE_TOKEN en .env (Vercel Blob).",
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Cuerpo de peticion invalido." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No se recibio ningun archivo." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se permiten imagenes." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "El archivo supera el tamano maximo (8 MB)." },
      { status: 400 }
    );
  }

  const safeBase = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "imagen";
  const pathname = `tyd/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeBase}`;

  try {
    const blob = await put(pathname, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("upload blob error:", err);
    return NextResponse.json(
      { error: "No se pudo subir el archivo al almacenamiento." },
      { status: 500 }
    );
  }
}
