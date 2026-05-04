"use client";

import Image from "next/image";
import Link from "next/link";
import { Product, formatConditionForDisplay } from "@/lib/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { Leaf } from "lucide-react";

export function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick?: () => void;
}) {
  const imageSrc = product.images?.[0]?.trim() || "/Logo.jpeg";

  const innerContent = (
    <Card className="group overflow-hidden border-transparent bg-transparent shadow-none transition-all hover:border-border hover:shadow-sm">
      <CardContent className="p-0 relative text-left">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
          {product.isUnique && (
            <Badge className="absolute left-3 top-3 z-10 bg-primary/90 hover:bg-primary text-primary-foreground font-medium">
              Pieza Única
            </Badge>
          )}
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-contain object-center p-2 transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="mt-4 space-y-2 pb-4">
          <h3 className="font-heading text-lg font-medium tracking-tight text-foreground line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-secondary-foreground font-semibold">
              {formatPrice(product.price)}
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Leaf className="mr-1 h-3 w-3 text-primary" />
              <span>{formatConditionForDisplay(product.condition)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className="group block w-full text-left"
      >
        {innerContent}
      </button>
    );
  }

  return (
    <Link href={`/producto/${product.id}`} className="group block">
      {innerContent}
    </Link>
  );
}
