import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.41-5.46.02-2.33 1.4-4.46 3.48-5.55 1.44-.75 3.12-1.01 4.7-.6v4.06c-.66-.18-1.4-.1-2.01.19-.74.34-1.28 1.05-1.36 1.86-.06.88.29 1.8 1 2.39.73.6 1.75.76 2.66.45.62-.22 1.14-.68 1.4-1.28.24-.55.27-1.16.27-1.76l-.01-13.04z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#FFF0F5] pt-12 pb-8 border-t border-pink-100">
      <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center gap-10 mb-8">
        
        {/* Lema Centrado y Redes Sociales */}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-center">
            <h3 className="text-sm md:text-base font-black tracking-[0.2em] text-[#FF1493] uppercase mb-4">
              TYD Moda Circular
            </h3>
            <p className="text-[#0A192F] text-xl md:text-2xl font-heading font-medium leading-relaxed max-w-2xl px-4">
              "Creemos en la moda que cuenta historias. En prendas con alma y en un mundo infinitamente más consciente y bello."
            </p>
          </div>
          
          <div className="flex space-x-6 pt-2">
            <a href="#" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0A192F]/5 border border-[#0A192F]/10 flex items-center justify-center text-[#0A192F] hover:bg-[#FF1493] hover:text-white hover:border-[#FF1493] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF1493]/20 transition-all duration-300">
              <InstagramIcon className="w-[18px] h-[18px]" />
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#0A192F]/5 border border-[#0A192F]/10 flex items-center justify-center text-[#0A192F] hover:bg-[#FF1493] hover:text-white hover:border-[#FF1493] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF1493]/20 transition-all duration-300">
              <TikTokIcon className="w-[18px] h-[18px]" />
            </a>
            <a href="mailto:contacto@tyd.cl" className="w-10 h-10 rounded-full bg-[#0A192F]/5 border border-[#0A192F]/10 flex items-center justify-center text-[#0A192F] hover:bg-[#FF1493] hover:text-white hover:border-[#FF1493] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF1493]/20 transition-all duration-300">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Links Internos: Ayuda y Colecciones agrupados al centro en fila para desktop */}
        <div className="flex flex-col sm:flex-row justify-center gap-12 md:gap-24 w-full">
          
          {/* Ayuda y Soporte */}
          <div className="flex flex-col items-center">
            <h4 className="text-[#0A192F] font-bold tracking-widest text-xs uppercase mb-4">Ayuda y Soporte</h4>
            <ul className="space-y-3 flex flex-col items-center">
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#FF1493] font-medium transition-colors text-sm relative group">
                  <span className="relative z-10 w-full">Despacho y Envíos</span>
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#FF1493] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#FF1493] font-medium transition-colors text-sm relative group">
                  <span className="relative z-10 w-full">Preguntas Frecuentes</span>
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#FF1493] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-[#FF1493] font-medium transition-colors text-sm relative group">
                  <span className="relative z-10 w-full">Contáctanos</span>
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#FF1493] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Colecciones */}
          <div className="flex flex-col items-center">
            <h4 className="text-[#0A192F] font-bold tracking-widest text-xs uppercase mb-4">Colecciones</h4>
            <ul className="space-y-3 flex flex-col items-center">
              <li>
                <Link href="/mujer" className="text-gray-600 hover:text-[#FF1493] font-medium transition-colors text-sm relative group">
                  <span className="relative z-10 w-full">Ropa de Mujer</span>
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#FF1493] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/hombre" className="text-gray-600 hover:text-[#FF1493] font-medium transition-colors text-sm relative group">
                  <span className="relative z-10 w-full">Ropa de Hombre</span>
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#FF1493] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                </Link>
              </li>
              <li>
                <Link href="/productos" className="text-gray-600 hover:text-[#FF1493] font-medium transition-colors text-sm relative group">
                  <span className="relative z-10 w-full">Catálogo Completo</span>
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#FF1493] scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full"></span>
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="border-t border-pink-100/60 pt-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-500 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} TYD Moda Circular. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 text-[11px] text-gray-500 font-semibold tracking-wide">
            <Link href="#" className="hover:text-[#FF1493] transition-colors decoration-[#FF1493] underline-offset-4 hover:underline">Políticas de Privacidad</Link>
            <Link href="#" className="hover:text-[#FF1493] transition-colors decoration-[#FF1493] underline-offset-4 hover:underline">Términos del Servicio</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
