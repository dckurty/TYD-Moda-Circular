import { type Product } from "@/lib/data/products";

/** Rutas de respaldo temporal usadas antes del catálogo en `public/catalogo-1/`. */
const LEGACY_TEMP_PATHS = new Set([
  "/hero-casual.png",
  "/hero-mujer-fresh.png",
  "/hero-hombre.png",
  "/parka-kenzo-como-referencia.png",
  "/parka-kenzo-3-vistas-1360x768.png",
  "/hero-mujer-casual.png",
  "/foto_grupal_editada.png",
  "/parka-kenzo-como-referencia-1360x768.png",
]);

function isLegacyTempImage(url: string): boolean {
  const u = url.trim();
  return u.startsWith("/") && LEGACY_TEMP_PATHS.has(u);
}

/** Quita solo rutas temporales antiguas; conserva `/catalogo-1/*` y URLs de Blob. */
export function fixLegacyCatalogImageUrls(products: Product[]): Product[] {
  return products.map((p) => {
    const urls = (p.images ?? []).map((u) => u.trim()).filter(Boolean);
    if (urls.length === 0) return p;

    const kept = urls.filter((u) => !isLegacyTempImage(u));
    if (kept.length === urls.length) return p;

    return { ...p, images: kept };
  });
}

export function catalogImagesNeedMigration(products: Product[]): boolean {
  const fixed = fixLegacyCatalogImageUrls(products);
  return JSON.stringify(products) !== JSON.stringify(fixed);
}
