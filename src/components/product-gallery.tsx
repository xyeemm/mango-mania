"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ProductImage } from "@/components/product-image";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  emoji?: string;
};

export function ProductGallery({ images, alt, emoji }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const galleryImages = images.length > 0 ? images : [undefined];

  return (
    <div className="space-y-3">
      <motion.div
        key={activeIndex}
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-square overflow-hidden rounded-xl border bg-muted"
      >
        <ProductImage
          src={galleryImages[activeIndex]}
          alt={`${alt} — image ${activeIndex + 1}`}
          emoji={emoji}
          priority
        />
      </motion.div>

      <div className="grid grid-cols-4 gap-2">
        {galleryImages.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "relative aspect-square overflow-hidden rounded-md border-2 transition-all",
              activeIndex === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent opacity-60 hover:opacity-100"
            )}
          >
            <ProductImage
              src={src}
              alt={`${alt} thumbnail ${index + 1}`}
              emoji={emoji}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
