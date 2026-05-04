import Link from 'next/link';

export default function Footer() {
  return (
    <>
      {/* Sección de enlaces - con los mismos colores del footer original */}
      <div className="border-t border-border bg-background py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 text-center md:text-left">
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-primary">TYD Moda Circular</h4>
              <Link 
                href="/sobre-nosotros" 
                className="block text-muted-foreground hover:text-foreground transition-colors py-1.5"
              >
                Quiénes Somos
              </Link>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 text-primary">Servicio</h4>
              <Link 
                href="/despachos" 
                className="block text-muted-foreground hover:text-foreground transition-colors py-1.5"
              >
                Despachos y Envíos
              </Link>
              <Link 
                href="/preguntas-frecuentes" 
                className="block text-muted-foreground hover:text-foreground transition-colors py-1.5"
              >
                Preguntas Frecuentes
              </Link>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4 text-primary">Contacto</h4>
              <p className="text-muted-foreground">Santiago, Chile</p>
              <p className="text-muted-foreground">hola@tydmodacircular.cl</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer original que te gusta - sin cambios */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-12 md:px-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="font-heading text-2xl font-bold text-primary">TYD</div>
          <p className="text-muted-foreground max-w-sm">
            Viste con clase y conciencia ♻️
            <br />Moda circular premium en Chile.
          </p>
          <div className="pt-8 text-sm text-muted-foreground/60">
            © {new Date().getFullYear()} TYD Moda Circular. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}