"use client";

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Diamond, Shirt } from "lucide-react";
import { useProductStore } from "@/lib/store/productStore";
import { useHydratedCatalog } from "@/lib/store/useHydratedCatalog";
import { filterVisibleProducts } from "@/lib/catalogVisibility";
import { ProductCard } from "@/components/product/ProductCard";

export default function Mujer() {
  const { products } = useProductStore();
  const mounted = useHydratedCatalog();

  const mujerProducts = filterVisibleProducts(products).filter(
    (p) => p.category === "mujer" || p.category === "unisex"
  );

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p>Cargando colección Mujer...</p></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center bg-background">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-mujer-fresh.png"
            alt="Colección Mujer TYD Moda Circular"
            fill
            priority
            className="object-cover object-center md:object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent w-full md:w-3/4 lg:w-2/3" />
        </div>

        <div className="relative z-10 w-full container mx-auto px-4 md:px-8 py-20 flex flex-col items-start justify-center">
          <div className="max-w-2xl space-y-8">
            <Badge className="bg-[#90053D]/10 text-[#90053D] hover:bg-[#90053D]/20 border border-[#90053D]/20 text-xs sm:text-sm px-4 py-1.5 uppercase tracking-[0.2em] font-bold flex items-center w-fit transition-colors">
              <Diamond className="w-4 h-4 mr-2 text-[#C51162] fill-[currentColor]" /> 
              COLECCIÓN MUJER
            </Badge>

            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#90053D] via-[#C51162] to-[#E91E63] font-heading leading-[0.95] drop-shadow-sm pb-2">
              Elegancia <br/>
              femenina.
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 font-medium max-w-lg leading-relaxed tracking-wide">
              Descubre nuestra selección editorial femenina. Piezas premium de alta calidad con un toque sofisticado y sustentable.
            </p>

            <div className="pt-6 flex flex-col sm:flex-row gap-5">
              <Link
                href="#catalogo-mujer"
                className={buttonVariants({ 
                  size: "lg", 
                  className: "h-14 px-8 text-base font-semibold tracking-wide bg-[#90053D] hover:bg-[#60002A] text-white shadow-xl shadow-[#90053D]/20 hover:-translate-y-1 transition-all duration-300 rounded-sm" 
                })}
              >
                Ver Catálogo Mujer <ArrowRight className="ml-2 h-5 w-5" />
              </Link>

              <Link
                href="/hombre"
                className={buttonVariants({ 
                  variant: "outline", 
                  size: "lg", 
                  className: "h-14 px-8 text-base font-semibold tracking-wide border-[#90053D]/20 text-[#90053D] hover:bg-[#90053D]/5 hover:border-[#90053D]/40 transition-all duration-300 rounded-sm" 
                })}
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Hombre & Clásicos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catálogo de Mujer */}
      <section id="catalogo-mujer" className="py-24 container mx-auto px-4 bg-background">
        <div className="flex flex-col sm:flex-row items-end justify-between mb-16 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#90053D]">
              <div className="w-8 h-px bg-current" />
              <span className="text-sm font-bold uppercase tracking-widest text-[#90053D]">Novedades</span>
            </div>
            <h2 className="font-heading text-4xl font-black tracking-tight text-[#90053D]">Prendas Seleccionadas para Mujer</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-12">
          {mujerProducts.length > 0 ? (
            mujerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              <Shirt className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">Aún no hay prendas de mujer.</p>
              <p className="mt-2">Próximamente agregaremos más productos.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}