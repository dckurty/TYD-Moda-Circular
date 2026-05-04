import { Suspense } from "react";
import { CatalogoClient } from "./CatalogoClient";

export default function CatalogoPublico() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p>Cargando catálogo estelar...</p>
        </div>
      }
    >
      <CatalogoClient />
    </Suspense>
  );
}
