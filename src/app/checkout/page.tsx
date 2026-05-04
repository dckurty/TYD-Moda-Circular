"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MercadoPagoButton } from "@/components/checkout/MercadoPagoButton";
import Link from "next/link";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  surname: z.string().min(2, "Apellido requerido"),
  email: z.string().email("Correo inválido"),
  rut: z.string().min(8, "RUT requerido"),
  shipping: z.enum(["retiro", "envio"]),
  address: z.string().optional(),
  city: z.string().optional(),
}).refine(data => {
  if (data.shipping === "envio" && (!data.address || !data.city)) {
    return false;
  }
  return true;
}, {
  message: "Dirección y ciudad requeridas para envío",
  path: ["address"]
});

export default function CheckoutPage() {
  const { items, getTotal } = useCartStore();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      rut: "",
      shipping: "retiro",
      address: "",
      city: "",
    },
  });

  const shippingCost = form.watch("shipping") === "envio" ? 4500 : 0;
  const finalTotal = getTotal() + shippingCost;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.product.id,
            title: item.product.name,
            quantity: item.quantity,
            unit_price: item.product.price,
          })),
          payer: {
            name: values.name,
            surname: values.surname,
            email: values.email,
          }
        }),
      });

      const data = await res.json();
      if (data.id) {
        setPreferenceId(data.id);
      } else {
        throw new Error(data.error || "Error al crear pago");
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al iniciar el pago. Verifica las credenciales de MercadoPago.");
    } finally {
      setIsLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <Link href="/productos" className={buttonVariants({ variant: "default" })}>
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl font-bold mb-8">Finalizar Compra</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Datos de Contacto y Envío</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl><Input placeholder="Juan" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="surname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido</FormLabel>
                        <FormControl><Input placeholder="Pérez" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl><Input type="email" placeholder="juan@ejemplo.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rut"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>RUT</FormLabel>
                        <FormControl><Input placeholder="12.345.678-9" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="font-medium mb-4">Método de Entrega</h3>
                  <FormField
                    control={form.control}
                    name="shipping"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`cursor-pointer border rounded-lg p-4 flex flex-col gap-1 transition-colors ${field.value === "retiro" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">Retiro en Taller</span>
                                <input type="radio" value="retiro" checked={field.value === "retiro"} onChange={field.onChange} className="sr-only" />
                                {field.value === "retiro" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                              </div>
                              <span className="text-xs text-muted-foreground">Gratis (Santiago Centro)</span>
                            </label>

                            <label className={`cursor-pointer border rounded-lg p-4 flex flex-col gap-1 transition-colors ${field.value === "envio" ? "border-primary bg-primary/5" : "hover:border-primary/50"}`}>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-sm">Envío a Domicilio</span>
                                <input type="radio" value="envio" checked={field.value === "envio"} onChange={field.onChange} className="sr-only" />
                                {field.value === "envio" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                              </div>
                              <span className="text-xs text-muted-foreground">Tarifa fija a todo Chile</span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("shipping") === "envio" && (
                  <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Dirección</FormLabel>
                          <FormControl><Input placeholder="Av. Providencia 1234, Depto 5" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Ciudad / Comuna</FormLabel>
                          <FormControl><Input placeholder="Santiago" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="border-t border-border pt-6 mt-6">
                  {!preferenceId ? (
                    <Button type="submit" size="lg" className="w-full text-base h-12" disabled={isLoading}>
                      {isLoading ? "Procesando..." : "Confirmar Datos e Ir a Pagar"}
                    </Button>
                  ) : (
                    <div className="p-4 bg-muted/50 rounded-lg text-center text-sm mb-4">
                      Datos confirmados. Haz clic abajo para pagar de forma segura.
                    </div>
                  )}
                </div>
              </form>
            </Form>
            
            {preferenceId && (
              <div className="mt-4">
                <MercadoPagoButton preferenceId={preferenceId} />
                <Button 
                  variant="ghost" 
                  className="w-full mt-2" 
                  onClick={() => setPreferenceId(null)}
                >
                  Modificar datos de compra
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-medium mb-6">Resumen del Pedido</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain object-center p-0.5" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                    <span className="text-xs text-muted-foreground">Talla: {item.size} x {item.quantity}</span>
                  </div>
                  <span className="text-sm font-medium my-auto">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-border text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border text-base font-bold">
                <span>Total a Pagar</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
