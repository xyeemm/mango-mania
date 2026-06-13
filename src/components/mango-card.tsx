"use client";

import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ProductImage } from "@/components/product-image";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCartContext } from "@/context/cart-context";
import { formatPrice} from "@/hooks/currency";
import {MangoProduct} from "@/types/mango"
import { cn } from "@/lib/utils";

const tagLabels = {
  bestseller: "Bestseller",
  seasonal: "Seasonal",
  new: "New",
} as const;

type MangoCardProps = {
  product: MangoProduct;
  index: number;
  compact?: boolean;
};

export function MangoCard({ product, index, compact = false }: MangoCardProps) {
  const cart = useCartContext();
  const inCart = cart.items.find((i) => i.product.id === product.id);
  const quantity = inCart?.quantity ?? 0;
  const href = `/products/${product.id}`;

  function handleAddToCart() {
    cart.addItem(product);
    toast.success(`${product.name} added to cart`);
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 32, scale: 0.96 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            delay: index * 0.06,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}

      className="h-full"
    >
      <Card className="flex h-full flex-col overflow-hidden pt-0 shadow-sm hover:scale-[1.03] hover:shadow-lg">
        <Link href={href} className="group block">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <ProductImage
              src={product.images[0]}
              alt={product.imageAlt}
              emoji={product.emoji}
              className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            {product.tag && (
              <Badge className="absolute top-3 right-3 bg-brand text-white hover:bg-brand/90 transition-all duration-300 ease-out">
              {tagLabels[product.tag]}
              </Badge>
            )}
            </div>
        </Link>

        <CardHeader className={cn("pb-2", compact && "pb-1")}>
          <Link href={href} className="hover:underline">
            <CardTitle className="font-heading text-lg font-semibold">
              {product.name}
            </CardTitle>
          </Link>
          <CardDescription>{product.variety}</CardDescription>
        </CardHeader>

        {!compact && (
          <CardContent className="space-y-3 pt-0">
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <p className="text-lg font-semibold tabular-nums">
              {formatPrice(product.price)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {product.unit}
              </span>
            </p>
          </CardContent>
        )}

        {compact && (
          <CardContent className="pt-0 pb-2">
            <p className="text-lg font-semibold tabular-nums">
              {formatPrice(product.price)}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {product.unit}
              </span>
            </p>
          </CardContent>
        )}

        <CardFooter className="mt-auto flex flex-col items-stretch gap-2 bg-muted/30">
          {quantity === 0 ? (
            <Button type="button" className="w-full" onClick={handleAddToCart}>
              <ShoppingBag data-icon="inline-start" />
              Add to cart
            </Button>
          ) : (
            <div className="flex w-full items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Decrease quantity"
                  onClick={() =>
                    cart.updateQuantity(product.id, quantity - 1)
                  }
                >
                  <Minus />
                </Button>
                <motion.span
                  key={quantity}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="min-w-8 text-center text-sm font-semibold tabular-nums"
                >
                  {quantity}
                </motion.span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  aria-label="Increase quantity"
                  onClick={handleAddToCart}
                >
                  <Plus />
                </Button>
              </div>
              <span className="text-sm font-medium tabular-nums">
                {formatPrice(product.price * quantity)}
              </span>
            </div>
          )}
          <Link
            href={href}
            className={cn(buttonVariants({ variant: "outline", size: "default" }), "w-full")}
          >
            View details
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
