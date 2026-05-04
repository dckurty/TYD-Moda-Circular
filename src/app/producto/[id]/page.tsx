"use client";

import { useState, useEffect } from "react";
import { useHydratedCatalog } from "@/lib/store/useHydratedCatalog";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, Check, ZoomIn, ZoomOut } from "lucide-react";
import { useProductStore } from "@/lib/store/productStore";
import { useCartStore } from "@/lib/store/cartStore";
import { Product, Size, formatConditionForDisplay } from "@/lib/data/products";
import { isProductVisibleOnline } from "@/lib/catalogVisibility";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  
  // En la nueva estructura, el ID puede ser string o number
  const productId = params.id as string;

  const { products } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);
  const mounted = useHydratedCatalog();

  const [product, setProduct] = useState<Product | null>(null);

  // Estados interactivos para Cesta
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  /** Zoom solo dentro del panel de imagen (la ficha sigue visible al lado) */
  const [imageScale, setImageScale] = useState(1);

  const ZOOM_MIN = 1;
  const ZOOM_MAX = 3;
  const ZOOM_STEP = 0.25;

  useEffect(() => {
    if (mounted) {
      const found = products.find((p) => p.id.toString() === productId);
      if (found && !isProductVisibleOnline(found)) {
        setProduct(null);
      } else {
        setProduct(found ?? null);
      }
      if (found && found.sizes.length > 0) {
        setSelectedSize(found.sizes[0]);
      }
    }
  }, [mounted, products, productId]);

  useEffect(() => {
    setImageScale(1);
  }, [productId, product?.images?.[0]]);

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addItem(product, selectedSize);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#FFF0F5]" />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFF0F5] flex flex-col items-center justify-center p-8">
        <p className="text-3xl text-red-600 mb-4 font-heading">Producto no encontrado</p>
        <Button onClick={() => router.push('/productos')} className="mt-8 bg-[#FF1493] hover:bg-[#DB2777]">
          Volver al Catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 md:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Botón de volver */}
        <button 
          onClick={() => router.back()} 
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium text-sm md:text-base tracking-wide"
        >
          <ArrowLeft className="w-5 h-5" /> Volver al catálogo
        </button>

        {/* Tarjeta Principal Rosa Pastel */}
        <div className="bg-[#FFF0F5] rounded-[2rem] shadow-2xl shadow-rose-900/10 border border-pink-100 overflow-hidden p-6 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            
            {/* Izquierda: imagen con zoom integrado (no tapa el detalle) */}
            <div className="flex w-full flex-col gap-3">
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-pink-100/80 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-sm">
                    <span className="text-xs font-medium text-[#0A192F]/70">
                      Zoom en la foto
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className="h-8 w-8 border-pink-200/80"
                        aria-label="Alejar"
                        disabled={imageScale <= ZOOM_MIN}
                        onClick={() =>
                          setImageScale((s) =>
                            Math.max(ZOOM_MIN, s - ZOOM_STEP)
                          )
                        }
                      >
                        <ZoomOut className="h-3.5 w-3.5" />
                      </Button>
                      <span className="min-w-[3rem] text-center text-xs tabular-nums text-muted-foreground">
                        {Math.round(imageScale * 100)}%
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        className="h-8 w-8 border-pink-200/80"
                        aria-label="Acercar"
                        disabled={imageScale >= ZOOM_MAX}
                        onClick={() =>
                          setImageScale((s) =>
                            Math.min(ZOOM_MAX, s + ZOOM_STEP)
                          )
                        }
                      >
                        <ZoomIn className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => setImageScale(1)}
                      >
                        Restablecer
                      </Button>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#0A192F]/50">
                    Pasa el ratón sobre la imagen y usa{" "}
                    <kbd className="rounded border border-pink-200/60 bg-white px-1">
                      Ctrl
                    </kbd>{" "}
                    + rueda para zoom. Arrastra para ver la foto ampliada.
                  </p>
                  <div
                    className="relative aspect-[4/3] md:aspect-[16/10] w-full min-h-[280px] md:min-h-[360px] overflow-auto rounded-[2rem] border border-pink-100 bg-pink-50/30 shadow-inner touch-pan-x touch-pan-y"
                    onWheel={(e) => {
                      if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
                        setImageScale((s) =>
                          Math.min(
                            ZOOM_MAX,
                            Math.max(ZOOM_MIN, s + delta)
                          )
                        );
                      }
                    }}
                  >
                    <div className="flex min-h-full w-full justify-center p-4">
                      {/* eslint-disable-next-line @next/next/no-img-element -- data URLs y zoom por ancho */}
                      <img
                        src={product.images[0].trim()}
                        alt={product.name}
                        fetchPriority="high"
                        decoding="async"
                        style={{
                          width: `${imageScale * 100}%`,
                          maxWidth: "none",
                        }}
                        className="h-auto self-center object-contain"
                        draggable={false}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex aspect-[4/3] min-h-[280px] items-center justify-center rounded-[2rem] border border-pink-100 bg-pink-50/30 text-gray-400">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Derecha: Detalles (Estilo Revista Mockup) */}
            <div className="flex flex-col pt-4 md:pt-0">
              <div className="space-y-4">
                
                <p className="text-[#FF1493] font-medium text-sm tracking-wide capitalize">
                  {/* Si el producto es estático, la marca podría no existir, simulamos "Zara" u otro valor según categoría */}
                  {product.category === 'mujer' ? 'Zara' : 'TYD Moda'}
                </p>
                
                <h1 className="text-4xl md:text-5xl font-bold text-[#0A192F] font-heading leading-tight tracking-tight">
                  {product.name}
                </h1>
                
                <p className="text-[2rem] font-bold text-[#FF1493] tracking-tight">
                  ${product.price.toLocaleString('es-CL')}
                </p>

                {/* Badges tipo "Pills" pastel */}
                <div className="flex flex-wrap gap-3 pt-3">
                  <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    {formatConditionForDisplay(product.condition)}
                  </span>
                  <span className="px-4 py-1.5 rounded-full bg-blue-100/70 text-blue-700 text-sm font-medium">
                    Talla {product.sizes.join(', ')}
                  </span>
                </div>

                {/* Descripción */}
                <div className="pt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 font-heading tracking-tight">Descripción</h3>
                  <p className="text-gray-600 leading-relaxed text-[1.05rem]">
                    {product.description || "Prenda única seleccionada con cuidado para dar una segunda vida con estilo y conciencia."}
                  </p>
                </div>

                {/* Talla bloque dinámico */}
                <div className="pt-6 pb-8">
                  <h3 className="text-[0.9rem] text-gray-800 font-medium mb-3">Selecciona tu Talla</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((sizeRaw, index) => {
                      const size = sizeRaw.trim() as Size;
                      return (
                        <button
                          key={size + index}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedSize(size);
                          }}
                          className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all duration-300 ${
                            selectedSize === size
                              ? "bg-[#FF1493] text-white border-[#FF1493] shadow-lg shadow-[#FF1493]/30 scale-105"
                              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Botón principal (Añadir a Carrito) */}
                <Button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart();
                  }}
                  disabled={!selectedSize}
                  className={`w-full h-14 text-lg font-medium rounded-xl shadow-xl transition-all ${
                    isAdded 
                      ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 text-white" 
                      : !selectedSize 
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-[#FF1493] hover:bg-[#DB2777] shadow-[#FF1493]/20 text-white hover:-translate-y-1 active:scale-[0.98]"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5 mr-3" /> 
                  {isAdded ? "¡Agregado al Carrito!" : !selectedSize ? "Elige una Talla" : "Agregar al Carrito"}
                </Button>

                {/* Checklist de beneficios */}
                <div className="pt-8 space-y-3">
                  <p className="flex items-center text-sm text-gray-500 font-medium"><Check className="w-[18px] h-[18px] mr-2 text-[#FF1493] font-bold" /> Envío a todo Chile</p>
                  <p className="flex items-center text-sm text-gray-500 font-medium"><Check className="w-[18px] h-[18px] mr-2 text-[#FF1493] font-bold" /> Retiro gratis en Santiago</p>
                  <p className="flex items-center text-sm text-gray-500 font-medium"><Check className="w-[18px] h-[18px] mr-2 text-[#FF1493] font-bold" /> Pago seguro con Mercado Pago</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}