"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { getOptimizedCloudinaryUrl } from "@/lib/optimizedCloudinary";

type ProductImageProps = {
  alt: string;
  className?: string;
  emoji?: string;
  priority?: boolean;
  src?: string;
};

export function ProductImage({
  alt,
  className,
  emoji = "🥭",
  priority = false,
  src,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = src?.trim();

  if (!imageSrc || failed) {
    return (
      <div
        aria-label={alt}
        role="img"
        className={cn(
          "flex h-full w-full items-center justify-center bg-brand-muted text-4xl",
          className
        )}
      >
        {emoji}
      </div>
    );
  }

  const optimizedSrc = getOptimizedCloudinaryUrl(src);
  return (
    // Admin images can come from any host, so this intentionally avoids next/image host restrictions.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={optimizedSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("h-full w-full object-cover", className)}
      onError={() => setFailed(true)}
    />
  );
}
