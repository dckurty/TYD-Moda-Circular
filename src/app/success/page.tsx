"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { buttonVariants } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const clearCart = useCartStore(state => state.clearCart);
  
  useEffect(() => {
    // Cuando el pago es exitoso, limpiamos el carrito
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <CheckCircle className="h-24 w-24 text-green-500 mb-6" />
      <h1 className="font-heading text-4xl font-bold mb-4">¡Pago Exitoso!</h1>
      <p className="text-lg text-muted-foreground max-w-lg mb-8">
        Tu pedido ha sido procesado correctamente. Revisa tu correo electrónico para los detalles del envío y la confirmación. 
        Gracias por apoyar la moda circular 🌍.
      </p>
      <Link href="/" className={buttonVariants({ size: "lg", className: "px-8" })}>
        Volver al Inicio
      </Link>
    </div>
  );
}
