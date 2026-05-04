"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Settings } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cartStore";
import { TipoPrendaMenu } from "@/components/layout/TipoPrendaMenu";

export default function Navbar() {
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  // Función para determinar si el link está activo (incluso si está dentro de un producto)
  const isActive = (path: string) => {
    if (path === '/productos' && pathname.startsWith('/producto')) return true;
    return pathname === path;
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden shadow-sm border border-pink-100 group-hover:scale-105 transition-transform duration-300">
            <Image 
              src="/Logo.jpeg" 
              alt="TYD Moda Circular" 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </Link>

        {/* Enlaces centrales */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 md:gap-10 text-sm font-normal text-gray-700">
          <Link 
            href="/productos"
            className={`transition-colors hover:text-[#FF1493] ${isActive('/productos') ? 'font-bold text-[#FF1493]' : ''}`}
          >
            Catálogo
          </Link>

          <TipoPrendaMenu />

          <Link 
            href="/hombre"
            className={`transition-colors hover:text-[#FF1493] ${isActive('/hombre') ? 'font-bold text-[#FF1493]' : ''}`}
          >
            Hombre
          </Link>

          <Link 
            href="/mujer"
            className={`transition-colors hover:text-[#FF1493] ${isActive('/mujer') ? 'font-bold text-[#FF1493]' : ''}`}
          >
            Mujer
          </Link>

          <Link 
            href="/sobre-nosotros"
            className={`transition-colors hover:text-[#FF1493] ${isActive('/sobre-nosotros') ? 'font-bold text-[#FF1493]' : ''}`}
          >
            Quiénes Somos
          </Link>
        </div>

        {/* Carrito e Íconos Admin */}
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-gray-300 hover:text-gray-600 transition-colors" title="Panel de Administrador">
            <Settings size={20} />
          </Link>
          <Link href="/carrito" className="relative flex items-center justify-center w-10 h-10 text-gray-700 hover:text-[#FF1493] transition-colors bg-gray-50 hover:bg-pink-50 rounded-full">
            <ShoppingCart size={22} />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF1493] text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md border-2 border-white animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}