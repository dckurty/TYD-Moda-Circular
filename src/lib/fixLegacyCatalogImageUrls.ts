import { type Product } from "@/lib/data/products";

/** Rutas locales antiguas que ya no se usan; se quitan del catálogo al migrar. */
const LEGACY_LOCAL_PATHS = new Set([
  "/hero-casual.png",
  "/hero-mujer-fresh.png",
  "/hero-hombre.png",
  "/parka-kenzo-como-referencia.png",
  "/parka-kenzo-3-vistas-1360x768.png",
  "/hero-mujer-casual.png",
  "/foto_grupal_editada.png",
  "/parka-kenzo-como-referencia-1360x768.png",
]);

function isLegacyLocalImage(url: string): boolean {
  const u = url.trim();
  if (u.startsWith("/catalogo-1/")) return true;
  if (u.startsWith("/") && LEGACY_LOCAL_PATHS.has(u)) return true;
  return false;
}

/** Quita referencias a fotos locales antiguas (`/catalogo-1/*`, heroes temporales). */
export function fixLegacyCatalogImageUrls(products: Product[]): Product[] {
  return products.map((p) => {
    const urls = (p.images ?? []).map((u) => u.trim()).filter(Boolean);
    if (urls.length === 0) return p;

    const kept = urls.filter((u) => !isLegacyLocalImage(u));
    if (kept.length === urls.length) return p;

    return { ...p, images: kept };
  });
}

export function catalogImagesNeedMigration(products: Product[]): boolean {
  const fixed = fixLegacyCatalogImageUrls(products);
  return JSON.stringify(products) !== JSON.stringify(fixed);
}
