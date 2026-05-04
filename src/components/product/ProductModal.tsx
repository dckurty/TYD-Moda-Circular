"use client";

import { useEffect, useState } from "react";
import {
  Product,
  Category,
  ProductType,
  Size,
  PRODUCT_TYPE_ORDER,
  PRODUCT_TYPE_LABELS,
  PRODUCT_CONDITION_OPTIONS,
  coerceProductCondition,
  formatConditionForDisplay,
} from "@/lib/data/products";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATALOG_STORAGE_KEY, useProductStore } from "@/lib/store/productStore";
import { uploadImageToBlob } from "@/lib/clientImageUpload";
import { isProductVisibleOnline } from "@/lib/catalogVisibility";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

type ProductFormData = {
  id: string;
  name: string;
  price: string;
  imagesUrl: string;
  category: Category;
  type: ProductType;
  sizes: string;
  condition: string;
  description: string;
};

const MAX_UPLOAD_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

function wasProductPersisted(productId: string): boolean {
  try {
    const raw = window.localStorage.getItem(CATALOG_STORAGE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as { state?: { products?: Array<{ id: string }> } };
    return Boolean(parsed?.state?.products?.some((p) => p.id === productId));
  } catch (error) {
    console.error("No se pudo verificar el guardado en localStorage:", error);
    return false;
  }
}

function isQuotaExceededError(error: unknown): boolean {
  if (!(error instanceof DOMException)) return false;
  return (
    error.name === "QuotaExceededError" ||
    error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
    error.code === 22 ||
    error.code === 1014
  );
}

export function ProductModal({ isOpen, onClose, productToEdit }: ProductModalProps) {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  
  const defaultFormState: ProductFormData = {
    id: "",
    name: "",
    price: "",
    imagesUrl: "",
    category: "mujer",
    type: "tops",
    sizes: "M",
    condition: PRODUCT_CONDITION_OPTIONS[0],
    description: "",
  };

  const [formData, setFormData] = useState<ProductFormData>(defaultFormState);
  const [imageUploading, setImageUploading] = useState(false);
  const [visibleOnline, setVisibleOnline] = useState(true);

  // Cuando se abre el modal, si hay un producto a editar, llenamos el formulario.
  // Si no, lo reseteamos para uno nuevo.
  useEffect(() => {
    if (productToEdit && isOpen) {
      setFormData({
        id: productToEdit.id,
        name: productToEdit.name,
        price: productToEdit.price.toString(),
        imagesUrl: productToEdit.images.join(", "),
        category: productToEdit.category,
        type: productToEdit.type,
        sizes: productToEdit.sizes.join(", "),
        condition: coerceProductCondition(productToEdit.condition),
        description: productToEdit.description,
      });
    } else if (isOpen) {
      setFormData({ ...defaultFormState, id: `p-new-${Date.now()}` });
    }
  }, [productToEdit, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (productToEdit) {
      setVisibleOnline(isProductVisibleOnline(productToEdit));
    } else {
      setVisibleOnline(true);
    }
  }, [productToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Transformar los datos del formulario a un objeto Product
    const newProduct: Product = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      price: parseInt(formData.price) || 0,
      category: formData.category as Category,
      type: formData.type as ProductType,
      sizes: formData.sizes.split(",").map(s => s.trim() as Size),
      condition: coerceProductCondition(formData.condition),
      environmentalImpact: "Procesado manual (Moda Circular)",
      images: formData.imagesUrl.startsWith('data:image') 
        ? [formData.imagesUrl] 
        : formData.imagesUrl.split(",").map(url => url.trim()).filter(Boolean),
      isUnique: true, // Por defecto marcamos que es único
      visibleOnline,
    };

    try {
      if (productToEdit) {
        updateProduct(productToEdit.id, newProduct);
      } else {
        addProduct(newProduct);
      }
    } catch (error) {
      console.error("Error al guardar la prenda:", error);
      if (isQuotaExceededError(error)) {
        window.alert(
          "No se pudo guardar: el almacenamiento del navegador llego al limite. Elimina algunas prendas o usa imagenes mas livianas."
        );
      } else {
        window.alert("No se pudo guardar la prenda por un error inesperado.");
      }
      return;
    }

    // persist escribe en localStorage en el mismo turno; un microtask evita falsos negativos si el motor difiere el flush
    queueMicrotask(() => {
      if (!wasProductPersisted(newProduct.id)) {
        window.alert(
          "La prenda se agrego en pantalla, pero no se pudo guardar en el navegador. Prueba con una imagen mas liviana o elimina prendas antiguas."
        );
        return;
      }
      onClose();
    });
  };

  const handleDelete = () => {
    if (productToEdit && window.confirm("¿Estás segura de eliminar esta prenda permanentemente?")) {
      deleteProduct(productToEdit.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{productToEdit ? "Editar Prenda" : "Añadir Nueva Prenda"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Código identificador</Label>
              <Input id="id" name="id" value={formData.id} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio (CLP)</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la prenda</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUpload">Foto principal</Label>
            <p className="text-xs text-muted-foreground">
              Se comprime y sube a almacenamiento en la nube (Vercel Blob). Las URLs ocupan poco espacio en el navegador.
            </p>
            <div className="flex items-center gap-4">
              {formData.imagesUrl && (
                <div className="relative shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={formData.imagesUrl.startsWith('data:image') ? formData.imagesUrl : formData.imagesUrl.split(',')[0].trim()} 
                    alt="Preview" 
                    className="object-contain object-center w-full h-full" 
                  />
                </div>
              )}
              <Input 
                id="imageUpload"
                type="file"
                accept="image/*"
                disabled={imageUploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > MAX_UPLOAD_FILE_SIZE_BYTES) {
                    window.alert("La imagen es demasiado grande. Sube una foto de hasta 8 MB.");
                    e.currentTarget.value = "";
                    return;
                  }

                  setImageUploading(true);
                  try {
                    const url = await uploadImageToBlob(file);
                    setFormData((prev) => ({ ...prev, imagesUrl: url }));
                  } catch (error) {
                    console.error("Error al subir imagen:", error);
                    window.alert(
                      error instanceof Error
                        ? error.message
                        : "No pudimos subir la imagen. Revisa BLOB_READ_WRITE_TOKEN en .env (ver env.example)."
                    );
                  } finally {
                    setImageUploading(false);
                    e.currentTarget.value = "";
                  }
                }}
                className="cursor-pointer flex-1 disabled:opacity-50"
                required={!formData.imagesUrl}
              />
            </div>
            {imageUploading && (
              <p className="text-xs font-medium text-[#FF1493]">Subiendo imagen…</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mujer">Mujer</SelectItem>
                  <SelectItem value="hombre">Hombre</SelectItem>
                  <SelectItem value="unisex">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Condición</Label>
              <Select value={formData.condition} onValueChange={(val) => handleSelectChange('condition', val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_CONDITION_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {formatConditionForDisplay(c)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
              <Label>Tipo de Prenda</Label>
              <Select value={formData.type} onValueChange={(val) => handleSelectChange('type', val as string)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPE_ORDER.map((t) => (
                    <SelectItem key={t} value={t}>
                      {PRODUCT_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sizes">Talla(s) (separadas por coma)</Label>
              <Input id="sizes" name="sizes" placeholder="S, M" value={formData.sizes} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea 
              id="description" 
              name="description" 
              rows={3} 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Ej: Chaqueta vintage en perfecto estado..."
            />
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-muted/30 p-4">
            <input
              id="visibleOnline"
              type="checkbox"
              checked={visibleOnline}
              onChange={(e) => setVisibleOnline(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-input accent-[#FF1493]"
            />
            <div className="space-y-1">
              <Label htmlFor="visibleOnline" className="cursor-pointer font-semibold text-foreground">
                Mostrar en la web
              </Label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Si lo desmarcas, la prenda sigue en inventario (admin) pero no aparece en inicio, catálogo ni ficha pública.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t flex flex-col sm:flex-row sm:justify-between items-center gap-4">
            <div className="w-full sm:w-auto flex justify-start">
              {productToEdit && (
                <Button type="button" variant="destructive" onClick={handleDelete} className="bg-red-500 hover:bg-red-600 font-bold whitespace-nowrap">
                  Eliminar Prenda
                </Button>
              )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <Button type="button" variant="outline" onClick={onClose} className="font-bold">Cancelar</Button>
              <Button
                type="submit"
                disabled={imageUploading}
                className="bg-[#0A192F] hover:bg-[#1E3A8A] font-bold text-white whitespace-nowrap disabled:opacity-50"
              >
                {productToEdit ? "Guardar Cambios" : "Añadir Prenda"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
