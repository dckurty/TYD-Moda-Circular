"use client";

import { buttonVariants } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function FailurePage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <XCircle className="h-24 w-24 text-destructive mb-6" />
      <h1 className="font-heading text-4xl font-bold mb-4">Pago Rechazado</h1>
      <p className="text-lg text-muted-foreground max-w-lg mb-8">
        Hubo un inconveniente al procesar tu pago. Por favor, intenta nuevamente con otro método de pago o revisa tus credenciales bancarias.
      </p>
      <div className="flex gap-4">
        <Link href="/checkout" className={buttonVariants({ size: "lg" })}>
          Intentar de nuevo
        </Link>
        <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
