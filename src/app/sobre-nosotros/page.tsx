"use client";

import { useEffect, useState } from "react";
import { Camera } from 'lucide-react';
import { useSettingsStore } from "@/lib/store/settingsStore";

export default function SobreNosotros() {
  const { teamImages } = useSettingsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#FFF0F5]"></div>;

  return (
    <div className="min-h-screen bg-[#FFF0F5] py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Cabecera / Manifiesto */}
        <div className="text-center mb-16 relative z-10">
          <p className="text-[#FF1493] font-medium tracking-[0.2em] uppercase text-sm mb-4">
            El Origen de la Marca
          </p>
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black text-[#0A192F] mb-6 font-heading tracking-tighter leading-[0.9]">
            Quiénes Somos.
          </h1>
          <p className="max-w-2xl mx-auto text-xl md:text-2xl text-gray-700 font-light leading-relaxed">
            Tres hermanas, unidas por lazos de sangre y por un sueño circular: 
            darle una segunda vida a la moda con <span className="font-medium text-[#FF1493]">estilo</span>, 
            <span className="font-medium text-[#FF1493]"> conciencia</span> y mucho amor.
          </p>
        </div>

        {/* Gran Espacio para la Foto (Editorial) */}
        <div className="flex justify-center mb-24 relative group">
          <div className="relative w-full max-w-4xl bg-[#FFF0F5] rounded-[3rem] overflow-hidden shadow-2xl shadow-rose-900/10 border-4 border-white flex flex-col items-center justify-center transition-all duration-300 group-hover:shadow-rose-900/20">
            
            {/* Foto Editorial Cargada de Revista adaptada a la altura real */}
            <div className="w-full h-full flex items-center justify-center relative z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/foto_grupal_editada.png" 
                alt="Tamara, Dafne e Ylania" 
                className="w-full h-auto object-cover filter hover:brightness-105 hover:scale-[1.02] transition-all duration-700" 
              />
            </div>

          </div>

          {/* Adornos fucsia flotando detrás */}
          <div className="absolute top-1/4 -left-12 w-64 h-64 bg-[#FF1493]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
          <div className="absolute top-1/3 -right-12 w-72 h-72 bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
        </div>

        {/* Las 3 fundadoras - Tarjetas Limpias */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          
          {/* Tamara */}
          <div className="bg-white rounded-[2rem] p-10 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-500 border border-pink-50 flex flex-col items-center text-center">
            <h3 className="text-4xl font-black text-[#0A192F] mb-6 font-heading tracking-tight">Tamara</h3>
            
            <div className="w-32 h-32 md:w-40 md:h-40 bg-pink-50/50 rounded-full mb-6 flex items-center justify-center border-4 border-white shadow-xl shadow-rose-900/5 relative overflow-hidden group-hover:shadow-rose-900/10 transition-all">
               {teamImages.tamaraImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={teamImages.tamaraImage} alt="Tamara" className="w-full h-full object-cover" />
               ) : (
                  <>
                    <Camera size={32} strokeWidth={1} className="text-[#FF1493]/40" />
                    <span className="absolute bottom-4 text-[10px] text-[#FF1493]/40 tracking-widest uppercase">Foto</span>
                  </>
               )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="px-4 py-1.5 rounded-full bg-pink-100/80 text-pink-700 text-sm font-semibold tracking-wide">La Mayor</span>
              <span className="px-4 py-1.5 rounded-full bg-purple-100/70 text-purple-800 text-sm font-semibold tracking-wide">Música</span>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-[1.05rem]">
              La parte más artística del equipo. Con su voz espectacular y su eterna creatividad, le pone el alma (y por supuesto la música) a todo lo que hacemos en TYD.
            </p>
          </div>

          {/* Dafne */}
          <div className="bg-white rounded-[2rem] p-10 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-500 border border-pink-50 flex flex-col items-center text-center md:translate-y-6">
            <h3 className="text-4xl font-black text-[#0A192F] mb-6 font-heading tracking-tight">Dafne</h3>
            
            <div className="w-32 h-32 md:w-40 md:h-40 bg-pink-50/50 rounded-full mb-6 flex items-center justify-center border-4 border-white shadow-xl shadow-rose-900/5 relative overflow-hidden group-hover:shadow-rose-900/10 transition-all">
               {teamImages.dafneImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={teamImages.dafneImage} alt="Dafne" className="w-full h-full object-cover" />
               ) : (
                  <>
                    <Camera size={32} strokeWidth={1} className="text-[#FF1493]/40" />
                    <span className="absolute bottom-4 text-[10px] text-[#FF1493]/40 tracking-widest uppercase">Foto</span>
                  </>
               )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
               <span className="px-4 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-sm font-semibold tracking-wide">La del Medio</span>
               <span className="px-4 py-1.5 rounded-full bg-emerald-100/70 text-emerald-800 text-sm font-semibold tracking-wide">Deportista</span>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-[1.05rem]">
              Amante apasionada del deporte, corre y practica triatlón. Aporta energía vital, movimiento y mucha disciplina a los procesos de TYD Moda Circular.
            </p>
          </div>

          {/* Ylania */}
          <div className="bg-white rounded-[2rem] p-10 shadow-xl shadow-gray-200/50 hover:-translate-y-2 transition-transform duration-500 border border-pink-50 flex flex-col items-center text-center">
            <h3 className="text-4xl font-black text-[#0A192F] mb-6 font-heading tracking-tight">Ylania</h3>
            
            <div className="w-32 h-32 md:w-40 md:h-40 bg-pink-50/50 rounded-full mb-6 flex items-center justify-center border-4 border-white shadow-xl shadow-rose-900/5 relative overflow-hidden group-hover:shadow-rose-900/10 transition-all">
               {teamImages.ylaniaImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={teamImages.ylaniaImage} alt="Ylania" className="w-full h-full object-cover" />
               ) : (
                  <>
                    <Camera size={32} strokeWidth={1} className="text-[#FF1493]/40" />
                    <span className="absolute bottom-4 text-[10px] text-[#FF1493]/40 tracking-widest uppercase">Foto</span>
                  </>
               )}
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <span className="px-4 py-1.5 rounded-full bg-orange-100/80 text-orange-700 text-sm font-semibold tracking-wide">La Menor</span>
              <span className="px-4 py-1.5 rounded-full bg-[#FF1493]/10 text-[#FF1493] text-sm font-semibold tracking-wide">Abogada</span>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-[1.05rem]">
              Aries de tomo y lomo. Aporta claridad, fuerza y orden legal al proyecto. Es la mente estratégica que cuida cada paso del equipo.
            </p>
          </div>

        </div>

        {/* Cierre / Firma Minimalista */}
        <div className="max-w-4xl mx-auto text-center bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl shadow-rose-900/5 border border-pink-100 relative overflow-hidden">
          <div className="absolute top-0 transform -translate-x-1/2 left-1/2 w-32 h-1 bg-[#FF1493] rounded-full"></div>
          
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#0A192F] flex flex-col gap-3">
            Creemos en la moda que cuenta historias.
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 mt-6 leading-relaxed font-light">
            En prendas con alma guardando secretos, y en un mundo infinitamente más consciente y bello.
          </p>
          
          <p className="mt-10 font-bold text-lg md:text-xl text-[#FF1493] tracking-wider uppercase">
            Familia • Estilo • Sostenibilidad
          </p>
        </div>

      </div>
    </div>
  );
}