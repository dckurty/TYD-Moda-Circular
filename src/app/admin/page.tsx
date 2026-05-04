"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { Plus, PackageSearch, Settings, Users, Shirt, Image as ImageIcon, Trash2, Images, ImageOff, EyeOff, LogOut } from "lucide-react";
import { CATALOG_STORAGE_KEY, useProductStore } from "@/lib/store/productStore";
import { useHydratedCatalog } from "@/lib/store/useHydratedCatalog";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { Product } from "@/lib/data/products";
import { ProductModal } from "@/components/product/ProductModal";
import { uploadImageToBlob } from "@/lib/clientImageUpload";

// Sub-componente para gestionar las fotos
function EquipoSettings() {
  const { teamImages, updateTeamImage } = useSettingsStore();

  const handleImageUpload = async (key: keyof typeof teamImages, file: File) => {
    try {
      const url = await uploadImageToBlob(file);
      updateTeamImage(key, url);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "No se pudo subir la imagen.");
    }
  };

  const uploaders = [
    { key: "heroImage", title: "Foto Grupal (Principal)", desc: "Aparece en gigante al inicio de Quiénes Somos" },
    { key: "tamaraImage", title: "Tarjeta: Tamara", desc: "Se muestra en el círculo bajo su nombre" },
    { key: "dafneImage", title: "Tarjeta: Dafne", desc: "Se muestra en el círculo bajo su nombre" },
    { key: "ylaniaImage", title: "Tarjeta: Ylania", desc: "Se muestra en el círculo bajo su nombre" },
  ];

  return (
    <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-bold font-heading text-[#0A192F] tracking-tight">Fotografías del Equipo</h2>
        <p className="text-gray-500 mt-2 text-lg">Sube las fotos desde aquí y se publicarán instantáneamente en la sección 'Quiénes Somos'.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {uploaders.map((up) => {
          const currentImg = teamImages[up.key as keyof typeof teamImages];
          return (
            <div key={up.key} className="p-6 bg-[#FFF0F5]/50 rounded-3xl border border-pink-100 hover:border-pink-200 transition-colors">
              <h3 className="font-bold text-[#0A192F] text-lg">{up.title}</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">{up.desc}</p>
              
              <div className="flex items-center gap-6">
                <div className="shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white border-2 border-dashed border-pink-200 flex items-center justify-center overflow-hidden relative shadow-sm">
                  {currentImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={currentImg} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-pink-300 w-8 h-8 opacity-50" />
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-center gap-3">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="w-full text-sm text-gray-600 file:mr-3 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#FF1493]/10 file:text-[#FF1493] hover:file:bg-[#FF1493]/20 cursor-pointer transition-colors"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        void handleImageUpload(up.key as keyof typeof teamImages, f);
                        e.target.value = "";
                      }
                    }}
                  />
                  {currentImg && (
                    <button 
                      onClick={() => updateTeamImage(up.key as any, "")}
                      className="text-xs text-red-500 self-start font-bold uppercase tracking-wider hover:text-red-700 transition-colors bg-red-50 px-3 py-1.5 rounded-md"
                    >
                       Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AdminPage() {
  const { products, clearAllProductImages } = useProductStore();
  const mounted = useHydratedCatalog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Estado para el manejo de Pestañas
  const [activeTab, setActiveTab] = useState<'inventario' | 'equipo'>('inventario');

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleClearLocalCatalog = () => {
    if (!window.confirm("Esto borrará el catálogo guardado en este navegador. ¿Deseas continuar?")) {
      return;
    }

    window.localStorage.removeItem(CATALOG_STORAGE_KEY);
    window.alert("Catálogo local eliminado. Se recargará la página.");
    window.location.reload();
  };

  const handleClearTeamImages = () => {
    if (!window.confirm("Esto borrará las fotos del equipo guardadas en este navegador. ¿Deseas continuar?")) {
      return;
    }

    window.localStorage.removeItem("tyd-admin-settings");
    window.alert("Fotos del equipo eliminadas. Se recargará la página.");
    window.location.reload();
  };

  const handleClearCatalogImages = () => {
    if (!window.confirm("Esto quitará las fotos de TODAS las prendas, manteniendo el resto de información. ¿Deseas continuar?")) {
      return;
    }

    clearAllProductImages();
    window.alert("Se quitaron las fotos del catálogo.");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    } catch {
      /* seguir igual */
    }
    window.location.href = "/admin/login";
  };

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p>Cargando panel...</p></div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pt-8 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header del Admin */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 px-8 py-10 bg-zinc-900 rounded-[2.5rem] mb-8 shadow-2xl shadow-zinc-900/10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Settings className="h-5 w-5 text-[#FF1493]" />
              <span className="text-sm font-bold uppercase tracking-widest text-[#FF1493]">Zona Privada Central</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-black tracking-tight text-white">
              Panel de Control
            </h1>
            <p className="text-zinc-400 font-medium max-w-lg text-[1.05rem]">
              Administra tu inventario de prendas o gestiona las fotografías oficiales de la marca desde un solo lugar.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleLogout()}
            className="shrink-0 border-zinc-600 bg-zinc-800 text-zinc-100 hover:bg-zinc-700 hover:text-white"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>

        {/* Sistema de Pestañas (Tabs) */}
        <div className="flex space-x-2 mb-8 bg-zinc-100/50 p-1.5 rounded-2xl w-fit sm:mx-0">
          <button 
            onClick={() => setActiveTab('inventario')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'inventario' ? 'bg-white text-[#0A192F] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <Shirt className="w-5 h-5" /> Prendas / Catálogo
          </button>
          <button 
            onClick={() => setActiveTab('equipo')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'equipo' ? 'bg-white text-[#0A192F] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <Users className="w-5 h-5" /> Fotos 'Quiénes Somos'
          </button>
        </div>

        {/* CONTENIDO PESTAÑA 1: INVENTARIO */}
        {activeTab === 'inventario' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-end mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleClearCatalogImages}
                  size="lg"
                  variant="outline"
                  className="h-14 px-6 text-base font-bold tracking-wide border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 rounded-xl"
                >
                  <ImageOff className="mr-2 h-5 w-5" /> Quitar fotos del catálogo
                </Button>
                <Button
                  onClick={handleClearTeamImages}
                  size="lg"
                  variant="outline"
                  className="h-14 px-6 text-base font-bold tracking-wide border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800 rounded-xl"
                >
                  <Images className="mr-2 h-5 w-5" /> Limpiar fotos del equipo
                </Button>
                <Button
                  onClick={handleClearLocalCatalog}
                  size="lg"
                  variant="outline"
                  className="h-14 px-6 text-base font-bold tracking-wide border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl"
                >
                  <Trash2 className="mr-2 h-5 w-5" /> Limpiar almacenamiento local
                </Button>
                <Button 
                  onClick={handleAddProduct}
                  size="lg" 
                  className="h-14 px-8 text-base font-bold tracking-wide bg-[#FF1493] hover:bg-[#DB2777] text-white shadow-xl shadow-[#FF1493]/30 hover:-translate-y-1 transition-all duration-300 rounded-xl"
                >
                  <Plus className="mr-2 h-6 w-6" /> Añadir Nueva Prenda
                </Button>
              </div>
            </div>
          
            {/* Grilla de productos para Editar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 gap-y-12">
              {products.map((product) => (
                <div key={product.id} className="relative group cursor-pointer">
                  {product.visibleOnline === false && (
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-[#0A192F]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-md">
                      <EyeOff className="h-3.5 w-3.5" aria-hidden />
                      Oculta en la web
                    </div>
                  )}
                  {/* Etiqueta superpuesta para destacar el estado modo 'Editar' */}
                  <div className="absolute top-3 right-3 z-10 bg-[#FF1493] text-white text-xs font-bold px-4 py-1.5 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none shadow-lg">Editar Prenda</div>
                  <div className="transition-transform duration-300 group-hover:scale-[1.02]">
                    <ProductCard 
                      product={product} 
                      onClick={() => handleEditProduct(product)} 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {products.length === 0 && (
              <div className="text-center py-24 text-muted-foreground bg-zinc-50/50 rounded-3xl border border-dashed border-zinc-200 mt-8">
                <PackageSearch className="h-12 w-12 mx-auto mb-4 opacity-30 text-[#0A192F]" />
                <p className="text-xl font-medium text-[#0A192F]/60">Aún no hay prendas en el catálogo.</p>
                <p className="mt-2 text-sm">Haz clic en "Añadir Prenda" arriba a la derecha para comenzar.</p>
              </div>
            )}
          </div>
        )}

        {/* CONTENIDO PESTAÑA 2: FOTOS DE EQUIPO */}
        {activeTab === 'equipo' && <EquipoSettings />}

      </div>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={editingProduct}
      />
    </div>
  );
}
