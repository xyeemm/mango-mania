"use client";

import {
  LayoutDashboard,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import type {
  ChangeEvent,
  FormEvent,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { useEffect, useMemo, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MANGO_PRODUCTS, MangoProduct, formatPrice } from "@/lib/mangos";
import {
  readManagedProducts,
  saveManagedProducts,
} from "@/lib/managed-products";
import { cn } from "@/lib/utils";

type ProductForm = {
  id: string;
  name: string;
  variety: string;
  description: string;
  longDescription: string;
  price: string;
  unit: string;
  emoji: string;
  imageAlt: string;
  images: string;
  tag: "" | NonNullable<MangoProduct["tag"]>;
  origin: string;
  season: string;
  weight: string;
  ripeness: string;
  storage: string;
  delivery: string;
};

type CloudinaryUploadResponse = {
  error?: string | { message?: string };
  secure_url?: string;
  url?: string;
};

type CloudinarySignedUploadResponse = {
  error?: string | { message?: string };
  secure_url?: string;
  url?: string;
};

const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudinaryUploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const cloudinaryFolder = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER;

const emptyForm: ProductForm = {
  id: "",
  name: "",
  variety: "",
  description: "",
  longDescription: "",
  price: "",
  unit: "per dozen",
  emoji: "🥭",
  imageAlt: "",
  images: "",
  tag: "",
  origin: "",
  season: "",
  weight: "",
  ripeness: "",
  storage: "",
  delivery: "",
};

function productToForm(product: MangoProduct): ProductForm {
  return {
    id: product.id,
    name: product.name,
    variety: product.variety,
    description: product.description,
    longDescription: product.longDescription,
    price: String(product.price),
    unit: product.unit,
    emoji: product.emoji,
    imageAlt: product.imageAlt,
    images: product.images.join("\n"),
    tag: product.tag ?? "",
    origin: product.details.origin,
    season: product.details.season,
    weight: product.details.weight,
    ripeness: product.details.ripeness,
    storage: product.details.storage,
    delivery: product.details.delivery,
  };
}

function formToProduct(form: ProductForm, existing?: MangoProduct): MangoProduct {
  const images = form.images
    .split(/\r?\n/)
    .map((image) => image.trim())
    .filter(Boolean);

  return {
    id: form.id.trim(),
    name: form.name.trim(),
    variety: form.variety.trim(),
    description: form.description.trim(),
    longDescription: form.longDescription.trim(),
    price: Number(form.price),
    unit: form.unit.trim(),
    emoji: form.emoji.trim() || "🥭",
    imageAlt: form.imageAlt.trim() || `${form.name.trim()} product image`,
    images:
      images.length > 0
        ? images
        : [`https://picsum.photos/seed/mango-${form.id.trim()}/800/600`],
    details: {
      origin: form.origin.trim(),
      season: form.season.trim(),
      weight: form.weight.trim(),
      ripeness: form.ripeness.trim(),
      storage: form.storage.trim(),
      delivery: form.delivery.trim(),
    },
    relatedIds: existing?.relatedIds ?? [],
    tag: form.tag || undefined,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function TextArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    />
  );
}

function getCloudinaryErrorMessage(
  error: CloudinaryUploadResponse["error"],
  fallback: string
) {
  if (typeof error === "string") {
    return error;
  }

  return error?.message ?? fallback;
}

async function uploadWithSignedRoute(file: File) {
  const uploadData = new FormData();
  uploadData.append("file", file);

  const response = await fetch("/api/cloudinary/upload", {
    method: "POST",
    body: uploadData,
  });

  const result = (await response.json()) as CloudinarySignedUploadResponse;

  if (!response.ok || !result.url) {
    throw new Error(
      getCloudinaryErrorMessage(result.error, "Signed Cloudinary upload failed.")
    );
  }

  return result.url;
}

async function uploadWithUnsignedPreset(file: File) {
  if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local."
    );
  }

  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("upload_preset", cloudinaryUploadPreset);

  if (cloudinaryFolder) {
    uploadData.append("folder", cloudinaryFolder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    {
      method: "POST",
      body: uploadData,
    }
  );

  const result = (await response.json()) as CloudinaryUploadResponse;
  const uploadedUrl = result.secure_url ?? result.url;

  if (!response.ok || !uploadedUrl) {
    throw new Error(
      getCloudinaryErrorMessage(
        result.error,
        "Cloudinary upload failed. Check the upload preset."
      )
    );
  }

  return uploadedUrl;
}

async function uploadImageFile(file: File) {
  if (!cloudinaryUploadPreset) {
    return uploadWithSignedRoute(file);
  }

  try {
    return await uploadWithSignedRoute(file);
  } catch (error) {
    try {
      return await uploadWithUnsignedPreset(file);
    } catch (fallbackError) {
      const signedMessage =
        error instanceof Error ? error.message : "Signed upload failed.";
      const unsignedMessage =
        fallbackError instanceof Error
          ? fallbackError.message
          : "Unsigned upload failed.";

      throw new Error(`${signedMessage} Unsigned fallback: ${unsignedMessage}`);
    }
  }
}

export function AdminProductsPanel() {
  const [products, setProducts] = useState<MangoProduct[]>(readManagedProducts);
  const [selectedId, setSelectedId] = useState<string>("new");
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("Ready to manage the catalog.");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    saveManagedProducts(products);
  }, [products]);

  const selectedProduct = products.find((product) => product.id === selectedId);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.variety, product.description, product.tag]
        .filter((value): value is string => typeof value === "string")
        .some((value) => value.toLowerCase().includes(normalizedQuery))
    );
  }, [products, query]);

  const stats = useMemo(() => {
    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    const averagePrice = products.length ? totalPrice / products.length : 0;

    return {
      productCount: products.length,
      taggedCount: products.filter((product) => product.tag).length,
      averagePrice,
    };
  }, [products]);

  function updateField<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((currentForm) => {
      const nextForm = { ...currentForm, [field]: value };

      if (field === "name" && selectedId === "new") {
        nextForm.id = slugify(String(value));
      }

      return nextForm;
    });
  }

  function appendImageUrls(urls: string[]) {
    setForm((currentForm) => {
      const currentImages = currentForm.images
        .split(/\r?\n/)
        .map((image) => image.trim())
        .filter(Boolean);

      return {
        ...currentForm,
        images: [...currentImages, ...urls].join("\n"),
      };
    });
  }

  async function uploadProductImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    setIsUploading(true);
    setNotice(`Uploading ${files.length} image${files.length === 1 ? "" : "s"}...`);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image file.`);
        }

        uploadedUrls.push(await uploadImageFile(file));
      }

      appendImageUrls(uploadedUrls);
      setNotice(
        `${uploadedUrls.length} image${
          uploadedUrls.length === 1 ? "" : "s"
        } uploaded. Save the product to publish changes.`
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Cloudinary upload failed. Check the upload preset and try again."
      );
    } finally {
      setIsUploading(false);
    }
  }

  function startCreate() {
    setSelectedId("new");
    setForm(emptyForm);
    setNotice("Creating a new product.");
  }

  function startEdit(product: MangoProduct) {
    setSelectedId(product.id);
    setForm(productToForm(product));
    setNotice(`Editing ${product.name}.`);
  }

  function deleteProduct(productId: string) {
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return;
    }

    const confirmed = window.confirm(`Delete ${product.name}?`);

    if (!confirmed) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts
        .filter((item) => item.id !== productId)
        .map((item) => ({
          ...item,
          relatedIds: item.relatedIds.filter((relatedId) => relatedId !== productId),
        }))
    );

    if (selectedId === productId) {
      startCreate();
    }

    setNotice(`${product.name} was deleted.`);
  }

  function resetCatalog() {
    const confirmed = window.confirm("Reset products to the original catalog?");

    if (!confirmed) {
      return;
    }

    setProducts(MANGO_PRODUCTS);
    setSelectedId("new");
    setForm(emptyForm);
    setNotice("Catalog reset to the original products.");
  }

  function submitProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const productId = form.id.trim();
    const productName = form.name.trim();
    const price = Number(form.price);
    const existingProduct = products.find((product) => product.id === selectedId);
    const idAlreadyExists =
      selectedId === "new"
        ? products.some((product) => product.id === productId)
        : products.some(
            (product) => product.id === productId && product.id !== selectedId
          );

    if (!productId || !productName || !Number.isFinite(price) || price < 0) {
      setNotice("Product ID, name, and a valid price are required.");
      return;
    }

    if (idAlreadyExists) {
      setNotice("That product ID is already in use.");
      return;
    }

    const savedProduct = formToProduct(form, existingProduct);

    setProducts((currentProducts) => {
      if (selectedId === "new") {
        return [savedProduct, ...currentProducts];
      }

      return currentProducts.map((product) =>
        product.id === selectedId
          ? savedProduct
          : {
              ...product,
              relatedIds: product.relatedIds.map((relatedId) =>
                relatedId === selectedId ? savedProduct.id : relatedId
              ),
            }
      );
    });

    setSelectedId(savedProduct.id);
    setNotice(`${savedProduct.name} was saved.`);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">Mango Mania</p>
              <h1 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Product admin panel
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Storefront
            </Link>
            <Button type="button" variant="outline" onClick={resetCatalog}>
              <RotateCcw />
              Reset
            </Button>
            <Button type="button" onClick={startCreate}>
              <Plus />
              New product
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Metric label="Products" value={String(stats.productCount)} />
            <Metric label="Tagged" value={String(stats.taggedCount)} />
            <Metric label="Avg." value={formatPrice(stats.averagePrice)} />
          </div>

          <div className="rounded-lg border bg-card">
            <div className="border-b p-3">
              <Label htmlFor="product-search" className="sr-only">
                Search products
              </Label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="product-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products"
                  className="pl-8"
                />
              </div>
            </div>

            <div className="max-h-[660px] overflow-auto p-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => startEdit(product)}
                  className={cn(
                    "mb-2 flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted",
                    selectedId === product.id
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-background"
                  )}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-muted text-lg">
                    {product.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        {product.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatPrice(product.price)}
                      </span>
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {product.variety} · {product.unit}
                    </span>
                  </span>
                </button>
              ))}

              {filteredProducts.length === 0 && (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  No products match this search.
                </div>
              )}
            </div>
          </div>
        </aside>

        <form onSubmit={submitProduct} className="rounded-lg border bg-card">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">
                {selectedProduct ? `Editing ${selectedProduct.name}` : "Create product"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{notice}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={startCreate}>
                <X />
                Clear
              </Button>
              <Button type="submit">
                <Save />
                Save product
              </Button>
            </div>
          </div>

          <div className="grid gap-6 p-4 xl:grid-cols-[1fr_300px]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" htmlFor="name">
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    required
                  />
                </Field>
                <Field label="Product ID" htmlFor="id">
                  <Input
                    id="id"
                    value={form.id}
                    onChange={(event) => updateField("id", slugify(event.target.value))}
                    required
                  />
                </Field>
                <Field label="Variety" htmlFor="variety">
                  <Input
                    id="variety"
                    value={form.variety}
                    onChange={(event) =>
                      updateField("variety", event.target.value)
                    }
                  />
                </Field>
                <Field label="Price" htmlFor="price">
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) => updateField("price", event.target.value)}
                    required
                  />
                </Field>
                <Field label="Unit" htmlFor="unit">
                  <Input
                    id="unit"
                    value={form.unit}
                    onChange={(event) => updateField("unit", event.target.value)}
                  />
                </Field>
                <Field label="Emoji" htmlFor="emoji">
                  <Input
                    id="emoji"
                    value={form.emoji}
                    onChange={(event) => updateField("emoji", event.target.value)}
                    maxLength={4}
                  />
                </Field>
              </div>

              <Field label="Short description" htmlFor="description">
                <TextArea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  required
                />
              </Field>

              <Field label="Long description" htmlFor="long-description">
                <TextArea
                  id="long-description"
                  value={form.longDescription}
                  onChange={(event) =>
                    updateField("longDescription", event.target.value)
                  }
                  className="min-h-32"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Image alt text" htmlFor="image-alt">
                  <Input
                    id="image-alt"
                    value={form.imageAlt}
                    onChange={(event) =>
                      updateField("imageAlt", event.target.value)
                    }
                  />
                </Field>
                <Field label="Tag" htmlFor="tag">
                  <select
                    id="tag"
                    value={form.tag}
                    onChange={(event) =>
                      updateField("tag", event.target.value as ProductForm["tag"])
                    }
                    className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="">None</option>
                    <option value="bestseller">Bestseller</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="new">New</option>
                  </select>
                </Field>
              </div>

              <Field label="Image URLs" htmlFor="images">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-background p-3">
                    <Input
                      id="cloudinary-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isUploading}
                      onChange={uploadProductImages}
                      className="max-w-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isUploading}
                      onClick={() =>
                        document.getElementById("cloudinary-upload")?.click()
                      }
                    >
                      <Upload />
                      {isUploading ? "Uploading" : "Upload"}
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Uploads to Cloudinary and appends URLs below.
                    </span>
                  </div>
                  <TextArea
                    id="images"
                    value={form.images}
                    onChange={(event) =>
                      updateField("images", event.target.value)
                    }
                    placeholder="One image URL per line"
                  />
                </div>
              </Field>
            </div>

            <div className="space-y-5">
              <div className="rounded-lg border bg-background p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium">Preview</p>
                  {form.tag && (
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {form.tag}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-brand-muted text-5xl">
                    {form.images.trim().split(/\r?\n/)[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={form.images.trim().split(/\r?\n/)[0]}
                        alt={form.imageAlt || form.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      form.emoji || "🥭"
                    )}
                  </div>
                  <div>
                    <p className="font-heading text-xl font-semibold tracking-tight">
                      {form.name || "Untitled product"}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {form.variety || "Variety"} · {form.unit || "Unit"}
                    </p>
                  </div>
                  <p className="text-lg font-semibold">
                    {Number.isFinite(Number(form.price))
                      ? formatPrice(Number(form.price || 0))
                      : "$0.00"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {form.description || "No description yet."}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border bg-background p-4">
                <p className="mb-4 text-sm font-medium">Product details</p>
                <div className="space-y-3">
                  <Field label="Origin" htmlFor="origin">
                    <Input
                      id="origin"
                      value={form.origin}
                      onChange={(event) =>
                        updateField("origin", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Season" htmlFor="season">
                    <Input
                      id="season"
                      value={form.season}
                      onChange={(event) =>
                        updateField("season", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Weight" htmlFor="weight">
                    <Input
                      id="weight"
                      value={form.weight}
                      onChange={(event) =>
                        updateField("weight", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Ripeness" htmlFor="ripeness">
                    <Input
                      id="ripeness"
                      value={form.ripeness}
                      onChange={(event) =>
                        updateField("ripeness", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Storage" htmlFor="storage">
                    <Input
                      id="storage"
                      value={form.storage}
                      onChange={(event) =>
                        updateField("storage", event.target.value)
                      }
                    />
                  </Field>
                  <Field label="Delivery" htmlFor="delivery">
                    <Input
                      id="delivery"
                      value={form.delivery}
                      onChange={(event) =>
                        updateField("delivery", event.target.value)
                      }
                    />
                  </Field>
                </div>
              </div>

              {selectedProduct && (
                <Button
                  type="button"
                  variant="destructive"
                  className="w-full"
                  onClick={() => deleteProduct(selectedProduct.id)}
                >
                  <Trash2 />
                  Delete product
                </Button>
              )}
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold">{value}</p>
    </div>
  );
}

function Field({
  children,
  htmlFor,
  label,
}: {
  children: ReactNode;
  htmlFor: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
