import type { Product } from "@/lib/data/products";

/** Catálogo legado sin campo: se considera visible. Solo `visibleOnline === false` oculta en el sitio público. */
export function isProductVisibleOnline(product: Product): boolean {
  return product.visibleOnline !== false;
}

export function filterVisibleProducts(products: Product[]): Product[] {
  return products.filter(isProductVisibleOnline);
}
