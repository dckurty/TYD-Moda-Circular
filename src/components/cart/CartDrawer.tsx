"use client";

import { useState, useEffect } from 'react';
import { ShoppingBag, X, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useCartStore } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export function CartDrawer() {
  const [isMounted, setIsMounted] = useState(false);
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingBag className="h-5 w-5" />
      </Button>
    );
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
            {itemCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl">Tu Carrito ({itemCount})</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">Tu carrito está vacío</p>
              <Link 
                href="/productos"
                onClick={() => setIsOpen(false)}
                className={buttonVariants({ variant: "outline" })}
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4">
                  <div className="relative h-24 w-20 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-contain object-center p-0.5"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium line-clamp-1">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">Talla: {item.size}</p>
                      </div>
                      <p className="font-medium">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-md border border-border">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          className="px-2 py-1 text-muted-foreground hover:text-foreground"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          className="px-2 py-1 text-muted-foreground hover:text-foreground"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.size)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-4 border-t border-border pt-6">
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(getTotal())}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Los costos de envío se calculan en el checkout.
            </p>
            <Link 
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className={buttonVariants({ className: "w-full text-lg h-12" })}
            >
              Ir al Checkout
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
