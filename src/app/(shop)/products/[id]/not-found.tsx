import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductNotFound() {
  return (
    <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-heading text-2xl font-semibold">Product not found</p>
      <p className="mt-2 text-sm text-muted-foreground">
        This item may no longer be available.
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ size: "lg" }), "mt-8")}
      >
        Return to shop
      </Link>
    </main>
  );
}
