"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ProductImage } from "@/components/product-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CartApi } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/mangos";

type CartSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cart: CartApi;
};

type CheckoutForm = {
  name: string;
  phone: string;
  address: string;
};

export function CartSheet({ open, onOpenChange, cart }: CartSheetProps) {
  const [step, setStep] = useState<"cart" | "checkout" | "confirmed">("cart");
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    phone: "",
    address: "",
  });
  const [orderTotal, setOrderTotal] = useState(0);

  function resetAndClose() {
    setStep("cart");
    setForm({ name: "", phone: "", address: "" });
    setOrderTotal(0);
    onOpenChange(false);
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Please fill in all delivery details.");
      return;
    }
    setOrderTotal(cart.total);
    setStep("confirmed");
    cart.clearCart();
    toast.success("Order confirmed. We'll be in touch shortly.");
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          if (step === "confirmed") resetAndClose();
          else onOpenChange(false);
        } else {
          onOpenChange(true);
        }
      }}
    >
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            {step === "confirmed" ? "Order confirmed" : "Your cart"}
          </SheetTitle>
          <SheetDescription>
            {step === "confirmed"
              ? "We'll contact you before delivery."
              : "Review items and complete checkout."}
          </SheetDescription>
        </SheetHeader>

        <AnimatePresence mode="wait">
          {step === "confirmed" ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-2xl">
                ✓
              </div>
              <p className="text-lg font-medium">Thank you, {form.name}</p>
              <p className="text-sm text-muted-foreground">
                Your order total is {formatPrice(orderTotal)}. Payment is due on
                delivery when your order arrives.
              </p>
              <Button className="mt-4 w-full" onClick={resetAndClose}>
                Continue shopping
              </Button>
            </motion.div>
          ) : step === "checkout" ? (
            <motion.form
              key="checkout"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              onSubmit={handlePlaceOrder}
              className="flex flex-1 flex-col gap-4 overflow-y-auto px-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Delivery address</Label>
                <Input
                  id="address"
                  placeholder="123 Orchard Lane, Apt 4"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  required
                />
              </div>
              <p className="rounded-lg border bg-muted/50 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
                Payment method: cash on delivery. No online payment is required.
              </p>
              <SheetFooter className="mt-auto flex-col gap-2 p-0 sm:flex-col">
                <Button type="submit" className="w-full">
                  Place order · {formatPrice(cart.total)}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep("cart")}
                >
                  Back to cart
                </Button>
              </SheetFooter>
            </motion.form>
          ) : (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 flex-col overflow-hidden"
            >
              {cart.items.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
                  <p className="text-sm">Your cart is empty.</p>
                  <Link
                    href="/#shop"
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    onClick={() => onOpenChange(false)}
                  >
                    Browse collection
                  </Link>
                </div>
              ) : (
                <ul className="flex-1 space-y-3 overflow-y-auto px-4">
                  {cart.items.map((item) => (
                    <motion.li
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-3 rounded-lg border bg-card p-3"
                    >
                      <Link
                        href={`/products/${item.product.id}`}
                        className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted"
                      >
                        <ProductImage
                          src={item.product.images[0]}
                          alt={item.product.imageAlt}
                          emoji={item.product.emoji}
                        />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.product.price)} {item.product.unit}
                        </p>
                        <div className="mt-2 flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon-xs"
                            aria-label="Decrease"
                            onClick={() =>
                              cart.updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus />
                          </Button>
                          <span className="min-w-6 text-center text-xs font-medium tabular-nums">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon-xs"
                            aria-label="Increase"
                            onClick={() => cart.addItem(item.product)}
                          >
                            <Plus />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="ml-auto text-destructive"
                            aria-label="Remove"
                            onClick={() => cart.removeItem(item.product.id)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                      <p className="shrink-0 text-sm font-semibold tabular-nums">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              )}

              {cart.items.length > 0 && (
                <SheetFooter className="border-t pt-4">
                  <div className="flex w-full flex-col gap-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold tabular-nums">
                        {formatPrice(cart.total)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="text-lg font-semibold tabular-nums">
                        {formatPrice(cart.total)}
                      </span>
                    </div>
                    <Button className="w-full" onClick={() => setStep("checkout")}>
                      Proceed to checkout
                    </Button>
                  </div>
                </SheetFooter>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
