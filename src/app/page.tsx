"use client";

import Image from "next/image";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight, Recycle, ShieldCheck, Sparkles, Diamond } from "lucide-react";
import { useProductStore } from "@/lib/store/productStore";
import { useHydratedCatalog } from "@/lib/store/useHydratedCatalog";
import { filterVisibleProducts } from "@/lib/catalogVisibility";

export default function Home() {
  const { products } = useProductStore();
  const mounted = useHydratedCatalog();
  const featuredProducts = filterVisibleProducts(products).slice(0, 4);

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p>Cargando inicio...</p></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center bg-background">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-casual.png"
            alt="TYD Moda Circular Lujo"
            fill
            priority
            className="object-cover object-center md:object-right"
          />
          {/* Elegant gradient fade from left to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent w-full md:w-3/4 lg:w-2/3" />
        </div>
        
        <div className="relative z-10 w-full container mx-auto px-4 md:px-8 py-20 flex flex-col items-start justify-center">
          <div className="max-w-2xl space-y-8">
            <Badge className="bg-[#FFD700]/10 text-[#B8860B] hover:bg-[#FFD700]/20 border-none text-xs sm:text-sm px-4 py-1.5 uppercase tracking-[0.2em] font-bold flex items-center w-fit transition-colors">
              <Diamond className="w-4 h-4 mr-2 fill-current" /> Ropa Fashion Circular
            </Badge>
            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-foreground font-heading leading-[0.95] drop-shadow-sm">
              Viste a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF1493] to-[#FF69B4]">a la moda</span> <br /> 
              y con conciencia.
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 font-medium max-w-sm leading-relaxed tracking-wide">
              “Creemos en la moda que cuenta historias.
              <br />
              En prendas con alma y en un mundo
              <br />
              infinitamente más consciente y bello.”
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-5">
              <Link 
                href="/productos"
                className={buttonVariants({ size: "lg", className: "h-14 px-8 text-base font-semibold tracking-wide shadow-xl shadow-[#FF1493]/20 hover:-translate-y-1 transition-all duration-300 rounded-sm" })}
              >
                Explorar Colección <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/nosotros"
                className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 text-base font-semibold tracking-wide border-foreground/20 hover:bg-foreground/5 hover:border-foreground/40 transition-all duration-300 rounded-sm" })}
              >
                Nuestra Filosofía
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Editorial Style */}
      <section className="bg-white py-24 border-y border-border/40 relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-[#FF1493]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-5 p-4 transition-transform hover:-translate-y-2 duration-300">
              <div className="h-16 w-16 rounded-2xl bg-[#FF1493]/5 border border-[#FF1493]/10 flex items-center justify-center text-[#FF1493] mb-2 shadow-inner">
                <Recycle className="h-8 w-8 stroke-[1.5]" />
              </div>
              <h3 className="font-heading font-bold text-xl tracking-tight">Cero Desperdicio</h3>
              <p className="text-muted-foreground text-base leading-relaxed">Rescatamos recortes y prendas premium, dándoles una segunda vida llena de estilo y propósito.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-5 p-4 transition-transform hover:-translate-y-2 duration-300">
              <div className="h-16 w-16 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center text-[#B8860B] mb-2 shadow-inner">
                <Sparkles className="h-8 w-8 stroke-[1.5]" />
              </div>
              <h3 className="font-heading font-bold text-xl tracking-tight">100% Calidad</h3>
              <p className="text-muted-foreground text-base leading-relaxed">Cada prenda es cuidadosamente seleccionada, revisada y aprobada bajo estrictos estándares de diseño.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-5 p-4 transition-transform hover:-translate-y-2 duration-300">
              <div className="h-16 w-16 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center text-foreground mb-2 shadow-inner">
                <ShieldCheck className="h-8 w-8 stroke-[1.5]" />
              </div>
              <h3 className="font-heading font-bold text-xl tracking-tight">Experiencia Segura</h3>
              <p className="text-muted-foreground text-base leading-relaxed">Transacciones encriptadas con Mercado Pago y empaques sustentables directo a tu puerta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 container mx-auto px-4 bg-background">
        <div className="flex flex-col sm:flex-row items-end justify-between mb-16 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[#FF1493]">
              <div className="w-8 h-px bg-current" />
              <span className="text-sm font-bold uppercase tracking-widest">Novedades</span>
            </div>
            <h2 className="font-heading text-4xl font-black tracking-tight text-foreground">Últimas Adiciones</h2>
          </div>
          <Link 
            href="/productos"
            className={buttonVariants({ variant: "ghost", className: "group text-foreground hover:text-[#FF1493] hover:bg-transparent tracking-wide font-semibold" })}
          >
            Ver catálogo completo 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-16 text-center sm:hidden">
          <Link 
            href="/productos"
            className={buttonVariants({ variant: "outline", className: "w-full h-12 text-base rounded-sm" })}
          >
            Ver todos los productos
          </Link>
        </div>
      </section>
    </div>
  );
}
