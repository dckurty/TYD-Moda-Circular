// src/lib/store/productStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, products as staticProducts } from "@/lib/data/products";
import { saveCatalogToServer } from "@/app/actions/catalog";
import {
  catalogImagesNeedMigration,
  fixLegacyCatalogImageUrls,
} from "@/lib/fixLegacyCatalogImageUrls";

export const CATALOG_STORAGE_KEY = "tyd-admin-products-storage";

let serverSaveTimer: ReturnType<typeof setTimeout> | undefined;

function scheduleServerSync(get: () => ProductStore) {
  if (typeof window === "undefined") return;
  clearTimeout(serverSaveTimer);
  serverSaveTimer = setTimeout(() => {
    const { products, catalogUpdatedAt } = get();
    void saveCatalogToServer(products, catalogUpdatedAt);
  }, 800);
}

// NOTA: Migrar a un store vacío de ser necesario, pero por ahora pre-cargamos con los estáticos.
interface ProductStore {
  products: Product[];
  /** Marca de tiempo para resolver conflictos entre localStorage y respaldo en Blob */
  catalogUpdatedAt: number;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Product) => void;
  deleteProduct: (id: string) => void;
  clearAllProductImages: () => void;
  initializeProductsIfNeeded: () => void;
  /** Reemplaza rutas `/catalogo-1/*.png` rotas y sincroniza Blob si hubo cambios. */
  migrateCatalogImagesIfNeeded: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      catalogUpdatedAt: 0,
      addProduct: (product) => {
        set((state) => ({
          products: [product, ...state.products],
          catalogUpdatedAt: Date.now(),
        }));
        scheduleServerSync(get);
      },
      updateProduct: (id, updatedProduct) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updatedProduct : p)),
          catalogUpdatedAt: Date.now(),
        }));
        scheduleServerSync(get);
      },
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          catalogUpdatedAt: Date.now(),
        }));
        scheduleServerSync(get);
      },
      clearAllProductImages: () => {
        set((state) => ({
          products: state.products.map((p) => ({
            ...p,
            images: [],
          })),
          catalogUpdatedAt: Date.now(),
        }));
        scheduleServerSync(get);
      },
      initializeProductsIfNeeded: () => {
        const state = get();
        // Cargamos los productos iniciales si el store está completamente vacío
        if (!state.products || state.products.length === 0) {
          set({ products: [...staticProducts] });
        }
      },
      migrateCatalogImagesIfNeeded: () => {
        const state = get();
        if (!state.products?.length || !catalogImagesNeedMigration(state.products)) return;
        const fixed = fixLegacyCatalogImageUrls(state.products);
        set({
          products: fixed,
          catalogUpdatedAt: Date.now(),
        });
        scheduleServerSync(get);
      },
    }),
    {
      name: CATALOG_STORAGE_KEY,
      partialize: (state) => ({
        products: state.products,
        catalogUpdatedAt: state.catalogUpdatedAt,
      }),
      merge: (persistedState, currentState) => {
        type PartialPersist = { products?: Product[]; catalogUpdatedAt?: number };
        let fresh: PartialPersist | null = null;
        try {
          if (typeof window !== "undefined") {
            const raw = window.localStorage.getItem(CATALOG_STORAGE_KEY);
            if (raw) {
              const parsed = JSON.parse(raw) as { state?: PartialPersist };
              if (parsed?.state) fresh = parsed.state;
            }
          }
        } catch {
          /* ignore */
        }
        const p = (fresh ?? persistedState) as PartialPersist;
        return {
          ...currentState,
          products: p?.products ?? currentState.products,
          catalogUpdatedAt: p?.catalogUpdatedAt ?? currentState.catalogUpdatedAt,
        };
      },
    }
  )
);
