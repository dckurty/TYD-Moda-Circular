"use client";

import { useEffect, useState } from "react";
import { loadCatalogFromServer } from "@/app/actions/catalog";
import { useProductStore } from "@/lib/store/productStore";

/**
 * Espera a que zustand/persist termine de hidratar, aplica catálogo por defecto si hace falta,
 * y fusiona con el respaldo en Vercel Blob si es más reciente que lo guardado en el navegador.
 */
export function useHydratedCatalog(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const waitForPersist = () =>
      new Promise<void>((resolve) => {
        if (useProductStore.persist.hasHydrated()) {
          resolve();
          return;
        }
        const unsub = useProductStore.persist.onFinishHydration(() => {
          unsub();
          resolve();
        });
      });

    void (async () => {
      await waitForPersist();
      if (cancelled) return;

      useProductStore.getState().initializeProductsIfNeeded();

      try {
        const server = await loadCatalogFromServer();
        if (!cancelled && server) {
          const { catalogUpdatedAt } = useProductStore.getState();
          if (server.updatedAt > catalogUpdatedAt) {
            useProductStore.setState({
              products: server.products,
              catalogUpdatedAt: server.updatedAt,
            });
          }
        }
      } catch {
        /* ignorar errores de red / blob */
      }

      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
