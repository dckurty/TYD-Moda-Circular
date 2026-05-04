"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";
  const misconfigured = searchParams.get("misconfigured") === "1";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(misconfigured ? "Falta ADMIN_PASSWORD en Vercel (.env) o en .env.local." : null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "No se pudo iniciar sesión.");
        return;
      }
      router.replace(from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Error de red. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF0F5] px-4">
      <div className="w-full max-w-md rounded-[2rem] border border-pink-100 bg-white p-10 shadow-xl shadow-rose-900/10">
        <h1 className="font-heading text-2xl font-black text-[#0A192F] mb-2">Acceso admin</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Introduce la clave configurada en <code className="text-xs bg-muted px-1 rounded">ADMIN_PASSWORD</code>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Clave</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12"
            />
          </div>
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#0A192F] hover:bg-[#1E3A8A] font-bold text-white"
          >
            {loading ? "Entrando…" : "Entrar"}
          </Button>
        </form>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link href="/" className="text-[#FF1493] font-semibold hover:underline">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFF0F5]">
          <p className="text-muted-foreground">Cargando…</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
