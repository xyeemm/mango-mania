"use client";

import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/product-gallery";
import { RelatedProducts } from "@/components/related-products";
import { useCartContext } from "@/context/cart-context";
import { useManagedProducts } from "@/hooks/use-managed-products";
import { formatPrice, type MangoProduct } from "@/lib/mangos";
import { cn } from "@/lib/utils";

const tagLabels = {
  bestseller: "Bestseller",
  seasonal: "Seasonal",
  new: "New",
} as const;

const detailLabels: Record<keyof MangoProduct["details"], string> = {
  origin: "Origin",
  season: "Season",
  weight: "Weight",
  ripeness: "Ripeness",
  storage: "Storage",
  delivery: "Delivery",
};

type ProductDetailPageProps = {
  initialProduct?: MangoProduct;
  productId: string;
};

export function ProductDetailPage({
  initialProduct,
  productId,
}: ProductDetailPageProps) {
  const { products } = useManagedProducts();
  const product =
    products.find((item) => item.id === productId) ?? initialProduct;
  const cart = useCartContext();
  const inCart = product
    ? cart.items.find((i) => i.product.id === product.id)
    : undefined;
  const quantity = inCart?.quantity ?? 0;
  const related = product
    ? product.relatedIds
        .map((id) => products.find((item) => item.id === id))
        .filter((item): item is MangoProduct => item !== undefined)
    : [];

  function handleAddToCart() {
    if (!product) {
      return;
    }

    cart.addItem(product);
    toast.success(`${product.name} added to cart`);
  }

  if (!product) {
    return (
      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="font-heading text-2xl font-semibold">Product not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          This item may no longer be available.
        </p>
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-8")}>
          Return to shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <ProductGallery
            images={product.images}
            alt={product.imageAlt}
            emoji={product.emoji}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="flex flex-col"
        >
          {product.tag && (
            <Badge className="w-fit bg-brand text-white hover:bg-brand/90">
              {tagLabels[product.tag]}
            </Badge>
          )}

          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-1 text-lg text-muted-foreground">{product.variety}</p>

          <p className="mt-5 text-2xl font-semibold tabular-nums">
            {formatPrice(product.price)}
            <span className="ml-2 text-base font-normal text-muted-foreground">
              {product.unit}
            </span>
          </p>

          <p className="mt-6 leading-relaxed text-muted-foreground">
            {product.longDescription}
          </p>

          <Separator className="my-8" />

          <h2 className="font-heading text-lg font-semibold">Specifications</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {(Object.keys(product.details) as (keyof MangoProduct["details"])[]).map(
              (key) => (
                <div
                  key={key}
                  className="rounded-lg border bg-muted/40 px-4 py-3"
                >
                  <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {detailLabels[key]}
                  </dt>
                  <dd className="mt-1 text-sm font-medium">{product.details[key]}</dd>
                </div>
              )
            )}
          </dl>

          <div className="mt-8">
            {quantity === 0 ? (
              <Button size="lg" className="w-full sm:w-auto" onClick={handleAddToCart}>
                <ShoppingBag data-icon="inline-start" />
                Add to cart
              </Button>
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
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
                  <span className="min-w-10 text-center font-semibold tabular-nums">
                    {quantity}
                  </span>
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
                <span className="text-lg font-semibold tabular-nums">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <RelatedProducts products={related} excludeId={product.id} />
    </main>
  );
}
