export type Category = 'mujer' | 'hombre' | 'unisex';
export type ProductType = 'tops' | 'bottoms' | 'vestidos' | 'accesorios' | 'abrigo';
export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Única';

/** Etiquetas para catálogo y navegación (mismo criterio que el formulario admin). */
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  tops: "Tops / Camisas",
  bottoms: "Pantalones / Faldas",
  vestidos: "Vestidos",
  abrigo: "Abrigos / Chaquetas",
  accesorios: "Accesorios",
};

export const PRODUCT_TYPE_ORDER: ProductType[] = [
  "tops",
  "bottoms",
  "vestidos",
  "abrigo",
  "accesorios",
];

export function parseProductTypeParam(raw: string | null): ProductType | null {
  if (!raw) return null;
  return raw in PRODUCT_TYPE_LABELS ? (raw as ProductType) : null;
}

/** Opciones de condición en catálogo y admin (valores guardados en `product.condition`). */
export const PRODUCT_CONDITION_OPTIONS = [
  "nuevo con etiqueta",
  "nuevo sin etiqueta",
  "en excelente estado",
  "en buen estado",
  "con detalle",
] as const;

export function formatConditionForDisplay(condition: string): string {
  const t = condition.trim();
  if (!t) return condition;
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** Asegura un valor del desplegable; migra textos viejos del catálogo o localStorage. */
export function coerceProductCondition(raw: string): string {
  const t = raw.trim();
  if ((PRODUCT_CONDITION_OPTIONS as readonly string[]).includes(t)) return t;
  const legacy: Record<string, (typeof PRODUCT_CONDITION_OPTIONS)[number]> = {
    "Nuevo con etiquetas": "nuevo con etiqueta",
    "Nuevo con etiqueta": "nuevo con etiqueta",
    "Nuevo sin etiqueta": "nuevo sin etiqueta",
    "Muy bueno - Uso mínimo": "en buen estado",
    "Como nuevo - Sin detalles": "en excelente estado",
    "Excelente": "en excelente estado",
    "Usado en excelente estado": "en excelente estado",
    "Usado en buen estado": "en buen estado",
    "Usado con detalle": "con detalle",
  };
  return legacy[t] ?? PRODUCT_CONDITION_OPTIONS[0];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  type: ProductType;
  sizes: Size[];
  condition: string;
  environmentalImpact: string;
  images: string[];
  isUnique: boolean;
  /** Si es `false`, la prenda no aparece en el sitio público (sí en admin). Ausente o `true` = visible. */
  visibleOnline?: boolean;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Prenda de Autor #1",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 20900,
    category: "hombre",
    type: "bottoms",
    sizes: ["S"],
    condition: "nuevo con etiqueta",
    environmentalImpact: "100% de la prenda reciclada, fomentando la moda circular en Chile.",
    images: ["/catalogo-1/1.png"],
    isUnique: false
  },
  {
    id: "p2",
    name: "Prenda de Autor #2",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 60900,
    category: "unisex",
    type: "vestidos",
    sizes: ["M"],
    condition: "en buen estado",
    environmentalImpact: "Evitamos la contaminación química asociada a tintes nuevos.",
    images: ["/catalogo-1/2.png"],
    isUnique: true
  },
  {
    id: "p3",
    name: "Prenda de Autor #3",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 60900,
    category: "mujer",
    type: "accesorios",
    sizes: ["L"],
    condition: "en excelente estado",
    environmentalImpact: "Upcycling de material procedente de mermas.",
    images: ["/catalogo-1/3.png"],
    isUnique: false
  },
  {
    id: "p4",
    name: "Prenda de Autor #4",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 40900,
    category: "hombre",
    type: "abrigo",
    sizes: ["XL"],
    condition: "en excelente estado",
    environmentalImpact: "Extiende la vida útil, evitando emisiones de carbono.",
    images: ["/catalogo-1/4.png"],
    isUnique: true
  },
  {
    id: "p5",
    name: "Prenda de Autor #5",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 40900,
    category: "unisex",
    type: "tops",
    sizes: ["Única"],
    condition: "nuevo con etiqueta",
    environmentalImpact: "Ahorro de 3,500 litros de agua frente a fabricación nueva.",
    images: ["/catalogo-1/5.png"],
    isUnique: false
  },
  {
    id: "p6",
    name: "Prenda de Autor #6",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 60900,
    category: "mujer",
    type: "bottoms",
    sizes: ["XS"],
    condition: "en buen estado",
    environmentalImpact: "100% de la prenda reciclada, fomentando la moda circular en Chile.",
    images: ["/catalogo-1/6.png"],
    isUnique: true
  },
  {
    id: "p7",
    name: "Prenda de Autor #7",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 50900,
    category: "hombre",
    type: "vestidos",
    sizes: ["S"],
    condition: "en excelente estado",
    environmentalImpact: "Evitamos la contaminación química asociada a tintes nuevos.",
    images: ["/catalogo-1/7.png"],
    isUnique: false
  },
  {
    id: "p8",
    name: "Prenda de Autor #8",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 20900,
    category: "unisex",
    type: "accesorios",
    sizes: ["M"],
    condition: "en excelente estado",
    environmentalImpact: "Upcycling de material procedente de mermas.",
    images: ["/catalogo-1/8.png"],
    isUnique: true
  },
  {
    id: "p9",
    name: "Prenda de Autor #9",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 30900,
    category: "mujer",
    type: "abrigo",
    sizes: ["L"],
    condition: "nuevo con etiqueta",
    environmentalImpact: "Extiende la vida útil, evitando emisiones de carbono.",
    images: ["/catalogo-1/9.png"],
    isUnique: false
  },
  {
    id: "p10",
    name: "Prenda de Autor #10",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 40900,
    category: "hombre",
    type: "tops",
    sizes: ["XL"],
    condition: "en buen estado",
    environmentalImpact: "Ahorro de 3,500 litros de agua frente a fabricación nueva.",
    images: ["/catalogo-1/10.png"],
    isUnique: true
  },
  {
    id: "p11",
    name: "Prenda de Autor #11",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 40900,
    category: "unisex",
    type: "bottoms",
    sizes: ["Única"],
    condition: "en excelente estado",
    environmentalImpact: "100% de la prenda reciclada, fomentando la moda circular en Chile.",
    images: ["/catalogo-1/11.png"],
    isUnique: false
  },
  {
    id: "p12",
    name: "Prenda de Autor #12",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 20900,
    category: "mujer",
    type: "vestidos",
    sizes: ["XS"],
    condition: "en excelente estado",
    environmentalImpact: "Evitamos la contaminación química asociada a tintes nuevos.",
    images: ["/catalogo-1/12.png"],
    isUnique: true
  },
  {
    id: "p13",
    name: "Prenda de Autor #13",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 50900,
    category: "hombre",
    type: "accesorios",
    sizes: ["S"],
    condition: "nuevo con etiqueta",
    environmentalImpact: "Upcycling de material procedente de mermas.",
    images: ["/catalogo-1/13.png"],
    isUnique: false
  },
  {
    id: "p14",
    name: "Prenda de Autor #14",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 20900,
    category: "unisex",
    type: "abrigo",
    sizes: ["M"],
    condition: "en buen estado",
    environmentalImpact: "Extiende la vida útil, evitando emisiones de carbono.",
    images: ["/catalogo-1/14.png"],
    isUnique: true
  },
  {
    id: "p15",
    name: "Prenda de Autor #15",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 50900,
    category: "mujer",
    type: "tops",
    sizes: ["L"],
    condition: "en excelente estado",
    environmentalImpact: "Ahorro de 3,500 litros de agua frente a fabricación nueva.",
    images: ["/catalogo-1/15.png"],
    isUnique: false
  },
  {
    id: "p16",
    name: "Prenda de Autor #16",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 50900,
    category: "hombre",
    type: "bottoms",
    sizes: ["XL"],
    condition: "en excelente estado",
    environmentalImpact: "100% de la prenda reciclada, fomentando la moda circular en Chile.",
    images: ["/catalogo-1/16.png"],
    isUnique: true
  },
  {
    id: "p17",
    name: "Prenda de Autor #17",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 20900,
    category: "unisex",
    type: "vestidos",
    sizes: ["Única"],
    condition: "nuevo con etiqueta",
    environmentalImpact: "Evitamos la contaminación química asociada a tintes nuevos.",
    images: ["/catalogo-1/17.png"],
    isUnique: false
  },
  {
    id: "p18",
    name: "Prenda de Autor #18",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 20900,
    category: "mujer",
    type: "accesorios",
    sizes: ["XS"],
    condition: "en buen estado",
    environmentalImpact: "Upcycling de material procedente de mermas.",
    images: ["/catalogo-1/18.png"],
    isUnique: true
  },
  {
    id: "p19",
    name: "Prenda de Autor #19",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 60900,
    category: "hombre",
    type: "abrigo",
    sizes: ["S"],
    condition: "en excelente estado",
    environmentalImpact: "Extiende la vida útil, evitando emisiones de carbono.",
    images: ["/catalogo-1/19.png"],
    isUnique: false
  },
  {
    id: "p20",
    name: "Prenda de Autor #20",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 50900,
    category: "unisex",
    type: "tops",
    sizes: ["M"],
    condition: "en excelente estado",
    environmentalImpact: "Ahorro de 3,500 litros de agua frente a fabricación nueva.",
    images: ["/catalogo-1/20.png"],
    isUnique: true
  },
  {
    id: "p21",
    name: "Prenda de Autor #21",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 60900,
    category: "mujer",
    type: "bottoms",
    sizes: ["L"],
    condition: "nuevo con etiqueta",
    environmentalImpact: "100% de la prenda reciclada, fomentando la moda circular en Chile.",
    images: ["/catalogo-1/21.png"],
    isUnique: false
  },
  {
    id: "p22",
    name: "Prenda de Autor #22",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 40900,
    category: "hombre",
    type: "vestidos",
    sizes: ["XL"],
    condition: "en buen estado",
    environmentalImpact: "Evitamos la contaminación química asociada a tintes nuevos.",
    images: ["/catalogo-1/22.png"],
    isUnique: true
  },
  {
    id: "p23",
    name: "Prenda de Autor #23",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 20900,
    category: "unisex",
    type: "accesorios",
    sizes: ["Única"],
    condition: "en excelente estado",
    environmentalImpact: "Upcycling de material procedente de mermas.",
    images: ["/catalogo-1/23.png"],
    isUnique: false
  },
  {
    id: "p24",
    name: "Prenda de Autor #24",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 30900,
    category: "mujer",
    type: "abrigo",
    sizes: ["XS"],
    condition: "en excelente estado",
    environmentalImpact: "Extiende la vida útil, evitando emisiones de carbono.",
    images: ["/catalogo-1/24.png"],
    isUnique: true
  },
  {
    id: "p25",
    name: "Prenda de Autor #25",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 40900,
    category: "hombre",
    type: "tops",
    sizes: ["S"],
    condition: "nuevo con etiqueta",
    environmentalImpact: "Ahorro de 3,500 litros de agua frente a fabricación nueva.",
    images: ["/catalogo-1/25.png"],
    isUnique: false
  },
  {
    id: "p26",
    name: "Prenda de Autor #26",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 60900,
    category: "unisex",
    type: "bottoms",
    sizes: ["M"],
    condition: "en buen estado",
    environmentalImpact: "100% de la prenda reciclada, fomentando la moda circular en Chile.",
    images: ["/catalogo-1/26.png"],
    isUnique: true
  },
  {
    id: "p27",
    name: "Prenda de Autor #27",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 50900,
    category: "mujer",
    type: "vestidos",
    sizes: ["L"],
    condition: "en excelente estado",
    environmentalImpact: "Evitamos la contaminación química asociada a tintes nuevos.",
    images: ["/catalogo-1/27.png"],
    isUnique: false
  },
  {
    id: "p28",
    name: "Prenda de Autor #28",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 20900,
    category: "hombre",
    type: "accesorios",
    sizes: ["XL"],
    condition: "en excelente estado",
    environmentalImpact: "Upcycling de material procedente de mermas.",
    images: ["/catalogo-1/28.png"],
    isUnique: true
  },
  {
    id: "p29",
    name: "Prenda de Autor #29",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 30900,
    category: "unisex",
    type: "abrigo",
    sizes: ["Única"],
    condition: "nuevo con etiqueta",
    environmentalImpact: "Extiende la vida útil, evitando emisiones de carbono.",
    images: ["/catalogo-1/29.png"],
    isUnique: false
  },
  {
    id: "p30",
    name: "Prenda de Autor #30",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 20900,
    category: "mujer",
    type: "tops",
    sizes: ["XS"],
    condition: "en buen estado",
    environmentalImpact: "Ahorro de 3,500 litros de agua frente a fabricación nueva.",
    images: ["/catalogo-1/30.png"],
    isUnique: true
  },
  {
    id: "p31",
    name: "Prenda de Autor #31",
    description: "Auténtica prenda de nuestro lote especial de moda circular. Seleccionada y aprobada bajo estrictos estándares de curaduría experta.",
    price: 40900,
    category: "hombre",
    type: "bottoms",
    sizes: ["S"],
    condition: "en excelente estado",
    environmentalImpact: "100% de la prenda reciclada, fomentando la moda circular en Chile.",
    images: ["/catalogo-1/31.png"],
    isUnique: false
  }
];
