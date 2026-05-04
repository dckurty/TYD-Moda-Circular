"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { Tag } from "lucide-react";
import { useProductStore } from "@/lib/store/productStore";
import { useHydratedCatalog } from "@/lib/store/useHydratedCatalog";
import { filterVisibleProducts } from "@/lib/catalogVisibility";
import {
  PRODUCT_TYPE_LABELS,
  parseProductTypeParam,
} from "@/lib/data/products";

export function CatalogoClient() {
  const { products } = useProductStore();
  const mounted = useHydratedCatalog();
  const searchParams = useSearchParams();
  const tipoFiltro = parseProductTypeParam(searchParams.get("tipo"));

  const visibleProducts = filterVisibleProducts(products);
  const listado = tipoFiltro
    ? visibleProducts.filter((p) => p.type === tipoFiltro)
    : visibleProducts;

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Cargando catálogo estelar...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pt-12 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto py-16 mb-8 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-[#FF1493]/10 px-4 py-2 rounded-full border border-[#FF1493]/20">
            <Tag className="h-4 w-4 text-[#FF1493]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF1493]">
              {tipoFiltro ? PRODUCT_TYPE_LABELS[tipoFiltro] : "Selección completa"}
            </span>
          </div>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-[#0A192F] leading-[0.95]">
            El Vestidor <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1493] to-[#FF8C00]">
              Circular.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 font-medium max-w-xl leading-relaxed tracking-wide mt-4">
            Piezas de diseño y clásicos atemporales seleccionados a mano. Renueva tu clóset con un impacto positivo.
          </p>
          {tipoFiltro && (
            <Link
              href="/productos"
              className="text-sm font-semibold text-[#FF1493] underline-offset-4 hover:underline"
            >
              Ver todo el catálogo
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-16 mt-8">
          {listado.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {listado.length === 0 && (
          <div className="text-center py-24 text-muted-foreground border border-dashed border-zinc-200 mt-8 rounded-3xl bg-zinc-50/50">
            <p className="text-xl font-medium text-[#0A192F]/60">
              {tipoFiltro
                ? `No hay prendas en «${PRODUCT_TYPE_LABELS[tipoFiltro]}» por ahora.`
                : "Catálogo vacío."}
            </p>
            {tipoFiltro && (
              <Link
                href="/productos"
                className="mt-4 inline-block text-sm font-semibold text-[#FF1493] hover:underline"
              >
                Ver todas las categorías
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
