import type { Product } from "@/lib/data/products";

/** Rutas reales bajo `public/` (reemplazan `/catalogo-1/*.png` que no existe en el deploy). */
const PUBLIC_FALLBACK_IMAGES = [
  "/hero-casual.png",
  "/hero-mujer-fresh.png",
  "/hero-hombre.png",
  "/parka-kenzo-como-referencia.png",
  "/parka-kenzo-3-vistas-1360x768.png",
  "/hero-mujer-casual.png",
  "/foto_grupal_editada.png",
  "/parka-kenzo-como-referencia-1360x768.png",
] as const;

const LEGACY_CATALOG = /^\/catalogo-1\/(\d+)\.png$/i;

function pickFallback(seed: number): string {
  const i = ((seed % PUBLIC_FALLBACK_IMAGES.length) + PUBLIC_FALLBACK_IMAGES.length) % PUBLIC_FALLBACK_IMAGES.length;
  return PUBLIC_FALLBACK_IMAGES[i];
}

/**
 * Corrige URLs rotas del catálogo legado (localStorage / Blob) para que las imágenes carguen en Vercel.
 */
export function fixLegacyCatalogImageUrls(products: Product[]): Product[] {
  return products.map((p, index) => {
    const idNum = parseInt(String(p.id).replace(/\D/g, ""), 10);
    const seed = Number.isFinite(idNum) ? idNum : index + 1;

    let images = (p.images ?? []).map((raw) => {
      const url = raw.trim();
      if (!url) return url;
      const m = url.match(LEGACY_CATALOG);
      if (m) {
        const n = parseInt(m[1], 10);
        return pickFallback(Number.isFinite(n) ? n - 1 : seed - 1);
      }
      return url;
    });

    if (images.length === 0 || images.every((u) => !u)) {
      images = [pickFallback(seed - 1)];
    }

    return { ...p, images };
  });
}

export function catalogImagesNeedMigration(products: Product[]): boolean {
  const hasLegacy = products.some((p) =>
    (p.images ?? []).some((raw) => LEGACY_CATALOG.test(raw.trim()))
  );
  const hasEmpty = products.some((p) => !(p.images ?? []).some((raw) => raw.trim()));
  if (hasLegacy || hasEmpty) return true;
  const fixed = fixLegacyCatalogImageUrls(products);
  return JSON.stringify(products) !== JSON.stringify(fixed);
}
