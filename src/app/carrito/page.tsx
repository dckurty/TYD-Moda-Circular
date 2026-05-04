"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CarritoPage() {
  const { items, removeItem, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#FFF0F5]" />;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Simple */}
      <div className="bg-[#FFF0F5] border-b border-pink-100/60 pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/productos" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#FF1493] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuar Comprando
          </Link>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-[#0A192F] tracking-tight">Tu Carrito</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-[#0A192F] mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8 max-w-sm text-center">Parece que aún no has agregado prendas únicas a tu carrito de compras.</p>
            <Link href="/productos">
              <Button className="h-12 px-8 bg-[#FF1493] hover:bg-[#DB2777] text-white font-bold rounded-xl shadow-xl shadow-[#FF1493]/20">
                Explorar Catálogo
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Lista de Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-6 p-4 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                  
                  {/* Imagen */}
                  <div className="relative w-28 h-36 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                    <Image 
                      src={item.product.images[0] || "/Logo.jpeg"} 
                      alt={item.product.name}
                      fill
                      className="object-contain object-center p-1"
                    />
                  </div>

                  {/* Detalles */}
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-bold text-[#0A192F] text-lg leading-tight line-clamp-2">
                          {item.product.name}
                        </h3>
                        {/* Botón Eliminar (Desktop) */}
                        <button 
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="hidden sm:flex text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 rounded-full hover:bg-red-50"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-wider">
                        Talla: <span className="text-[#0A192F] font-bold">{item.size}</span>
                      </p>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <span className="font-black text-xl text-[#FF1493]">
                        {formatPrice(item.product.price)}
                      </span>
                      
                      {/* Botón Eliminar (Mobile) */}
                      <button 
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="sm:hidden text-gray-400 hover:text-red-500 transition-colors bg-gray-50 p-2 rounded-full"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen de Compra */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 sticky top-28">
                <h3 className="font-bold text-[#0A192F] text-xl mb-6">Resumen</h3>
                
                <div className="space-y-4 text-sm font-medium text-gray-600 border-b border-gray-200 pb-6 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} prendas)</span>
                    <span>{formatPrice(getTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Costo de Envío</span>
                    <span className="text-emerald-500 font-bold">Por calcular al pago</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-[#0A192F] text-lg">Total</span>
                  <span className="font-black text-2xl text-[#0A192F]">
                    {formatPrice(getTotal())}
                  </span>
                </div>

                <Link href="/checkout" className="block w-full">
                  <Button className="w-full h-14 bg-[#0A192F] hover:bg-[#1E3A8A] text-white font-bold text-lg rounded-xl shadow-xl shadow-[#0A192F]/20 hover:-translate-y-1 transition-all">
                    Proceder al Pago
                  </Button>
                </Link>
                
                <div className="mt-4 text-center items-center">
                  <button onClick={clearCart} className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors decoration-red-500 underline-offset-4 hover:underline">
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
