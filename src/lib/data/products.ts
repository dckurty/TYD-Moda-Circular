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

/** Slots reservados para fotos locales en `public/catalogo-1/`. */
export const CATALOG_LOCAL_SEED_SLOTS = 22;

/** Catálogo con fotos en `public/catalogo-1/{1..22}.png`. */
export const products: Product[] = [
  {
    id: "p1",
    name: "Vestido Calvin Klein blanco",
    description: "Vestido blanco Calvin Klein con mangas volantes. Talla 8. Pieza seleccionada de moda circular.",
    price: 20000,
    category: "mujer",
    type: "vestidos",
    sizes: ["M"],
    condition: "en excelente estado",
    environmentalImpact: "Extiende la vida útil de una prenda de calidad, evitando emisiones de una producción nueva.",
    images: ["/catalogo-1/1.png"],
    isUnique: true
  },
  {
    id: "p2",
    name: "Vestido Zara lana manga larga",
    description: "Vestido gris de lana Zara, manga larga con botones dorados en puños. Talla L.",
    price: 12000,
    category: "mujer",
    type: "vestidos",
    sizes: ["L"],
    condition: "en buen estado",
    environmentalImpact: "Reutilizamos fibras naturales como la lana, reduciendo residuos textiles.",
    images: ["/catalogo-1/2.png"],
    isUnique: false
  },
  {
    id: "p3",
    name: "Vestido Banana Republic negro",
    description: "Vestido negro sin mangas con escote en V y falda evasé. Banana Republic, talla 8.",
    price: 12000,
    category: "mujer",
    type: "vestidos",
    sizes: ["M"],
    condition: "en excelente estado",
    environmentalImpact: "Moda circular: una segunda vida para prendas en perfecto estado.",
    images: ["/catalogo-1/3.png"],
    isUnique: true
  },
  {
    id: "p4",
    name: "Vestido Calvin Klein rayado",
    description: "Vestido elastizado Calvin Klein con rayas diagonales negro y beige. Tallas M/L.",
    price: 8000,
    category: "mujer",
    type: "vestidos",
    sizes: ["M", "L"],
    condition: "en buen estado",
    environmentalImpact: "Evitamos la contaminación química asociada a tintes y confecciones nuevas.",
    images: ["/catalogo-1/4.png"],
    isUnique: false
  },
  {
    id: "p5",
    name: "Vestido Banana Republic azul oscuro",
    description: "Vestido azul oscuro de lana Banana Republic, manga corta y falda en A. Talla XL.",
    price: 12000,
    category: "mujer",
    type: "vestidos",
    sizes: ["XL"],
    condition: "en excelente estado",
    environmentalImpact: "Upcycling de material de calidad procedente del excedente textil.",
    images: ["/catalogo-1/5.png"],
    isUnique: false
  },
  {
    id: "p6",
    name: "Vestido Rockford Handmade entrelazado",
    description: "Vestido midi tejido a mano Rockford con patrón chevron beige y marrón. Talla M.",
    price: 15000,
    category: "mujer",
    type: "vestidos",
    sizes: ["M"],
    condition: "en excelente estado",
    environmentalImpact: "Valoramos el trabajo artesanal y alargamos la vida de piezas únicas.",
    images: ["/catalogo-1/6.png"],
    isUnique: true
  },
  {
    id: "p7",
    name: "Vestido Calvin Klein naranjo",
    description: "Vestido naranjo Calvin Klein sin mangas, plisado con bolsillos frontales. Talla 6.",
    price: 8000,
    category: "mujer",
    type: "vestidos",
    sizes: ["S"],
    condition: "en buen estado",
    environmentalImpact: "100% moda circular: prenda reutilizada en lugar de desecharse.",
    images: ["/catalogo-1/7.png"],
    isUnique: true
  },
  {
    id: "p8",
    name: "Vestido Calvin Klein top marrón y falda rayada",
    description: "Vestido Calvin Klein con top marrón texturizado y falda plisada a rayas. Talla XL.",
    price: 10000,
    category: "mujer",
    type: "vestidos",
    sizes: ["XL"],
    condition: "en excelente estado",
    environmentalImpact: "Fomentamos consumo responsable al dar nueva oportunidad a esta prenda.",
    images: ["/catalogo-1/8.png"],
    isUnique: false
  },
  {
    id: "p9",
    name: "Vestido Calvin Klein negro",
    description: "Vestido negro Calvin Klein sin mangas, corte recto con bolsillos. Talla M.",
    price: 10000,
    category: "mujer",
    type: "vestidos",
    sizes: ["M"],
    condition: "en excelente estado",
    environmentalImpact: "Reduce la huella ambiental frente a comprar una prenda nueva equivalente.",
    images: ["/catalogo-1/9.png"],
    isUnique: true
  },
  {
    id: "p10",
    name: "Enterizo Index floral",
    description: "Enterizo amarillo mostaza con estampado floral Index. Escote cruzado y cintura elástica. Talla M.",
    price: 5000,
    category: "mujer",
    type: "vestidos",
    sizes: ["M"],
    condition: "en buen estado",
    environmentalImpact: "Moda circular: damos nueva vida a piezas en excelente estado.",
    images: ["/catalogo-1/10.png"],
    isUnique: false
  },
  {
    id: "p11",
    name: "Pantalón Zara wide leg",
    description: "Pantalón de pinzas Zara color camel, tiro alto y pierna ancha. Talla M.",
    price: 10000,
    category: "mujer",
    type: "bottoms",
    sizes: ["M"],
    condition: "en excelente estado",
    environmentalImpact: "Extiende la vida útil de una prenda de calidad.",
    images: ["/catalogo-1/11.png"],
    isUnique: false
  },
  {
    id: "p12",
    name: "Parka Columbia 3 en 1",
    description: "Parka Columbia amarilla desmontable 3 en 1 con forro polar. Talla S.",
    price: 15000,
    category: "mujer",
    type: "abrigo",
    sizes: ["S"],
    condition: "en buen estado",
    environmentalImpact: "Reutilizamos outdoor wear de calidad, reduciendo residuos textiles.",
    images: ["/catalogo-1/12.png"],
    isUnique: true
  },
  {
    id: "p13",
    name: "Parka Decathlon 3 en 1 bicolor",
    description: "Parka Decathlon 3 en 1 con cuerpo amarillo mostaza y hombros azul marino. Talla S.",
    price: 20000,
    category: "mujer",
    type: "abrigo",
    sizes: ["S"],
    condition: "en excelente estado",
    environmentalImpact: "Prenda outdoor reutilizada en lugar de nueva producción.",
    images: ["/catalogo-1/13.png"],
    isUnique: true
  },
  {
    id: "p14",
    name: "Parka Under Armour acolchada",
    description: "Parka acolchada Under Armour color oliva con capucha. Tallas M/L.",
    price: 15000,
    category: "hombre",
    type: "abrigo",
    sizes: ["M", "L"],
    condition: "en buen estado",
    environmentalImpact: "Fomentamos consumo responsable con prendas de segunda vida.",
    images: ["/catalogo-1/14.png"],
    isUnique: false
  },
  {
    id: "p15",
    name: "Parka Decathlon verde",
    description: "Parka Decathlon verde sage con capucha y cierre frontal. Talla XS.",
    price: 12000,
    category: "unisex",
    type: "abrigo",
    sizes: ["XS"],
    condition: "en buen estado",
    environmentalImpact: "100% moda circular: prenda reutilizada en perfecto estado.",
    images: ["/catalogo-1/15.png"],
    isUnique: false
  },
  {
    id: "p16",
    name: "Parka Mizuno Outdoor",
    description: "Parka outdoor Mizuno color crema con capucha forrada. Talla S.",
    price: 15000,
    category: "mujer",
    type: "abrigo",
    sizes: ["S"],
    condition: "en excelente estado",
    environmentalImpact: "Upcycling de material outdoor de calidad.",
    images: ["/catalogo-1/16.png"],
    isUnique: true
  },
  {
    id: "p17",
    name: "Chaqueta Coreana rosa",
    description: "Chaqueta puffer estilo coreano color rosa con capucha. Talla XS.",
    price: 15000,
    category: "mujer",
    type: "abrigo",
    sizes: ["XS"],
    condition: "en excelente estado",
    environmentalImpact: "Evitamos emisiones asociadas a confecciones nuevas.",
    images: ["/catalogo-1/17.png"],
    isUnique: true
  },
  {
    id: "p18",
    name: "Parka Coreana azul celeste",
    description: "Parka acolchada estilo coreano azul celeste con borde de piel en capucha. Talla M.",
    price: 15000,
    category: "mujer",
    type: "abrigo",
    sizes: ["M"],
    condition: "en buen estado",
    environmentalImpact: "Moda circular con piezas seleccionadas a mano.",
    images: ["/catalogo-1/18.png"],
    isUnique: false
  },
  {
    id: "p19",
    name: "Parka Coreana negra",
    description: "Parka negra estilo coreano con capucha de piel sintética. Talla S.",
    price: 15000,
    category: "mujer",
    type: "abrigo",
    sizes: ["S"],
    condition: "en excelente estado",
    environmentalImpact: "Reduce la huella ambiental frente a comprar nueva.",
    images: ["/catalogo-1/19.png"],
    isUnique: true
  },
  {
    id: "p20",
    name: "Parka Coreana gris",
    description: "Parka acolchada gris oscuro estilo coreano con capucha de piel. Talla M.",
    price: 15000,
    category: "mujer",
    type: "abrigo",
    sizes: ["M"],
    condition: "en buen estado",
    environmentalImpact: "Segunda vida para prendas en excelente estado.",
    images: ["/catalogo-1/20.png"],
    isUnique: false
  },
  {
    id: "p21",
    name: "Chaqueta Coreana rosa larga",
    description: "Chaqueta puffer larga rosa estilo coreano con bordado Parisian. Talla S.",
    price: 15000,
    category: "mujer",
    type: "abrigo",
    sizes: ["S"],
    condition: "en excelente estado",
    environmentalImpact: "Valoramos piezas únicas de moda circular.",
    images: ["/catalogo-1/21.png"],
    isUnique: true
  },
  {
    id: "p22",
    name: "Chaqueta Coreana roja",
    description: "Chaqueta puffer roja estilo coreano con capucha de piel. Talla XS.",
    price: 15000,
    category: "mujer",
    type: "abrigo",
    sizes: ["XS"],
    condition: "en buen estado",
    environmentalImpact: "Moda circular: prenda reutilizada con estilo.",
    images: ["/catalogo-1/22.png"],
    isUnique: true
  }
];
