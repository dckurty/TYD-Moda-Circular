"use server";

import { get, put } from "@vercel/blob";
import type { Product } from "@/lib/data/products";

const CATALOG_PATH = "tyd/catalog.json";

export type CatalogPayload = {
  updatedAt: number;
  products: Product[];
};

export async function loadCatalogFromServer(): Promise<CatalogPayload | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  try {
    const result = await get(CATALOG_PATH, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    if (!result) return null;
    const text = await new Response(result.stream as ReadableStream<Uint8Array>).text();
    const data = JSON.parse(text) as CatalogPayload;
    if (!Array.isArray(data.products) || typeof data.updatedAt !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

export async function saveCatalogToServer(
  products: Product[],
  updatedAt: number
): Promise<{ ok: boolean }> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { ok: false };
  const payload: CatalogPayload = { products, updatedAt };
  try {
    await put(CATALOG_PATH, JSON.stringify(payload), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: "application/json",
    });
    return { ok: true };
  } catch (err) {
    console.error("saveCatalogToServer:", err);
    return { ok: false };
  }
}
