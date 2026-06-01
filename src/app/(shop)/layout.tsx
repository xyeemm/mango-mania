import { StoreShell } from "@/components/store-shell";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StoreShell>{children}</StoreShell>;
}
