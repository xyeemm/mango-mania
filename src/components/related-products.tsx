"use client";

import { motion } from "framer-motion";
import { MangoCard } from "@/components/mango-card";
import type { MangoProduct } from "@/types/mango";

type RelatedProductsProps = {
  products: MangoProduct[];
  excludeId: string;
};

export function RelatedProducts({ products, excludeId }: RelatedProductsProps) {
  const related = products.filter((p) => p.id !== excludeId);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t pt-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Related products
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pairs well with your selection.
        </p>
      </motion.div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((product, index) => (
          <MangoCard
            key={product.id}
            product={product}
            index={index}
            compact
          />
        ))}
      </div>
    </section>
  );
}
