"use client";

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useEffect } from 'react';

export function MercadoPagoButton({ preferenceId }: { preferenceId: string }) {
  useEffect(() => {
    // Inicializar MercadoPago. En desarrollo sin token válido puede fallar, 
    // pero el componente debe tener la Key.
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
    if (publicKey) {
      initMercadoPago(publicKey, { locale: 'es-CL' });
    } else {
      console.warn("Falta NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY. Mercado Pago no funcionará correctamente.");
    }
  }, []);

  if (!preferenceId) return null;

  return (
    <div className="w-full mt-4">
      <Wallet 
        initialization={{ preferenceId, redirectMode: 'blank' }} 
      />
    </div>
  );
}
