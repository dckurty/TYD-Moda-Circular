import type { Product } from "@/lib/data/products";

/** Rutas que usamos como parche temporal; se normalizan a `/catalogo-1/{n}.png`. */
const TEMP_PUBLIC_PATHS = new Set([
  "/hero-casual.png",
  "/hero-mujer-fresh.png",
  "/hero-hombre.png",
  "/parka-kenzo-como-referencia.png",
  "/parka-kenzo-3-vistas-1360x768.png",
  "/hero-mujer-casual.png",
  "/foto_grupal_editada.png",
  "/parka-kenzo-como-referencia-1360x768.png",
]);

function catalogSlotForProduct(p: Product, index: number): string {
  const idNum = parseInt(String(p.id).replace(/\D/g, ""), 10);
  const n = Number.isFinite(idNum) ? idNum : index + 1;
  const slot = ((n - 1) % 31) + 1; // 1..31 encaja con archivos en public/catalogo-1/
  return `/catalogo-1/${slot}.png`;
}

/**
 * - Rellena `images` vacías con la ficha del catálogo (`/catalogo-1/{n}.png`).
 * - Sustituye rutas de respaldo temporal (`/hero-...`, etc.) por la ficha correspondiente.
 * No toca URLs absolutas (p. ej. Blob) ni rutas que ya son `/catalogo-1/`.
 */
export function fixLegacyCatalogImageUrls(products: Product[]): Product[] {
  return products.map((p, index) => {
    const slotUrl = catalogSlotForProduct(p, index);
    const urls = (p.images ?? []).map((u) => u.trim()).filter(Boolean);

    if (urls.length === 0) {
      return { ...p, images: [slotUrl] };
    }

    const onlyTemp = urls.every((u) => u.startsWith("/") && TEMP_PUBLIC_PATHS.has(u));
    if (onlyTemp) {
      return { ...p, images: [slotUrl] };
    }

    return p;
  });
}

export function catalogImagesNeedMigration(products: Product[]): boolean {
  const fixed = fixLegacyCatalogImageUrls(products);
  return JSON.stringify(products) !== JSON.stringify(fixed);
}
