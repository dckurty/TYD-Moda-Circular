"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  PRODUCT_TYPE_LABELS,
  PRODUCT_TYPE_ORDER,
  parseProductTypeParam,
} from "@/lib/data/products";

function TipoPrendaMenuInner() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tipoValido = parseProductTypeParam(searchParams.get("tipo"));
  const menuActivo = pathname === "/productos" && Boolean(tipoValido);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 rounded-md px-1 py-1 text-sm transition-colors hover:text-[#FF1493] ${
          menuActivo ? "font-bold text-[#FF1493]" : "font-normal text-gray-700"
        }`}
      >
        Tipos de prenda
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-[60] mt-2 min-w-[220px] -translate-x-1/2 rounded-xl border border-gray-100 bg-white py-2 shadow-lg shadow-gray-200/60 md:left-0 md:translate-x-0"
        >
          {PRODUCT_TYPE_ORDER.map((tipo) => (
            <Link
              key={tipo}
              role="menuitem"
              href={`/productos?tipo=${tipo}`}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm transition-colors hover:bg-[#FFF0F5] hover:text-[#FF1493] ${
                tipoValido === tipo ? "bg-[#FFF0F5] font-semibold text-[#FF1493]" : "text-gray-700"
              }`}
            >
              {PRODUCT_TYPE_LABELS[tipo]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function TipoPrendaMenu() {
  return (
    <Suspense
      fallback={
        <span className="inline-flex items-center gap-1 text-sm font-normal text-gray-400">
          Tipos de prenda
          <ChevronDown className="h-4 w-4" aria-hidden />
        </span>
      }
    >
      <TipoPrendaMenuInner />
    </Suspense>
  );
}
