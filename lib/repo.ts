import { ObjectId, type Collection as MongoCollection, type Document } from "mongodb";
import { getDb } from "@/lib/db";
import {
  PRODUCTS as SEED_PRODUCTS,
  COLLECTIONS as SEED_COLLECTIONS,
  type Product,
  type Collection,
} from "@/lib/products";

export type OrderItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  qty: number;
};

export type OrderCustomer = {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  region: string;
  city: string;
  postalCode?: string;
  phone: string;
};

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  customer: OrderCustomer;
  delivery: { method: string; cost: number };
  status: "new" | "processing" | "done" | "cancelled";
};

async function col<T extends Document>(name: string): Promise<MongoCollection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

// ---- seeding ----------------------------------------------------------

let seeded: Promise<void> | null = null;

async function seedIfEmpty(): Promise<void> {
  const products = await col("products");
  const collections = await col("collections");
  if ((await collections.estimatedDocumentCount()) === 0) {
    await collections.insertMany(
      SEED_COLLECTIONS.map((c, i) => ({
        slug: c.slug,
        title: c.title,
        custom: false,
        order: i,
      }))
    );
  }
  if ((await products.estimatedDocumentCount()) === 0) {
    await products.insertMany(
      SEED_PRODUCTS.map((p) => {
        const doc: Partial<typeof p> = { ...p };
        delete doc.id;
        return doc;
      })
    );
  }
}

export function ensureSeeded(): Promise<void> {
  if (!seeded) seeded = seedIfEmpty();
  return seeded;
}

// ---- mapping ----------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function toProduct(doc: any): Product {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    name: doc.name,
    price: doc.price,
    type: doc.type,
    sizes: doc.sizes ?? [],
    gender: doc.gender ?? "Unisex",
    colors: doc.colors ?? [],
    collections: doc.collections ?? [],
    description: doc.description ?? "",
    image: doc.image ?? null,
  };
}

function toCollection(doc: any): Collection & { id: string; custom: boolean } {
  return {
    id: doc._id.toString(),
    slug: doc.slug,
    title: doc.title,
    custom: doc.custom ?? false,
  };
}

function toOrder(doc: any): Order {
  return {
    id: doc._id.toString(),
    number: doc.number,
    createdAt:
      doc.createdAt instanceof Date ? doc.createdAt.toISOString() : doc.createdAt,
    items: doc.items ?? [],
    total: doc.total ?? 0,
    customer: doc.customer,
    delivery: doc.delivery ?? { method: "Անվճար առաքում", cost: 0 },
    status: doc.status ?? "new",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ---- products ---------------------------------------------------------

export async function dbGetProducts(): Promise<Product[]> {
  await ensureSeeded();
  const docs = await (await col("products")).find().sort({ _id: -1 }).toArray();
  return docs.map(toProduct);
}

export async function dbGetProduct(slug: string): Promise<Product | null> {
  await ensureSeeded();
  const doc = await (await col("products")).findOne({ slug });
  return doc ? toProduct(doc) : null;
}

export async function dbGetProductsByCollection(slug: string): Promise<Product[]> {
  await ensureSeeded();
  const docs = await (await col("products"))
    .find({ collections: slug })
    .sort({ _id: -1 })
    .toArray();
  return docs.map(toProduct);
}

export async function dbSearchProducts(query: string): Promise<Product[]> {
  await ensureSeeded();
  const q = query.trim();
  if (!q) return [];
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  const docs = await (await col("products"))
    .find({ $or: [{ name: rx }, { type: rx }, { colors: rx }] })
    .limit(12)
    .toArray();
  return docs.map(toProduct);
}

export type ProductInput = Omit<Product, "id" | "slug"> & { slug?: string };

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[«»]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "product"}-${Date.now().toString(36)}`;
}

export async function dbCreateProduct(input: ProductInput): Promise<Product> {
  await ensureSeeded();
  const doc = { ...input, slug: input.slug?.trim() || slugify(input.name) };
  const res = await (await col("products")).insertOne(doc);
  return toProduct({ _id: res.insertedId, ...doc });
}

export async function dbUpdateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<boolean> {
  const res = await (await col("products")).updateOne(
    { _id: new ObjectId(id) },
    { $set: input }
  );
  return res.matchedCount > 0;
}

export async function dbDeleteProduct(id: string): Promise<boolean> {
  const res = await (await col("products")).deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

// ---- collections ------------------------------------------------------

export type CollectionRecord = Collection & { id: string; custom: boolean };

export async function dbGetCollections(): Promise<CollectionRecord[]> {
  await ensureSeeded();
  const docs = await (await col("collections")).find().sort({ order: 1, _id: 1 }).toArray();
  return docs.map(toCollection);
}

export async function dbGetCollection(slug: string): Promise<CollectionRecord | null> {
  await ensureSeeded();
  const doc = await (await col("collections")).findOne({ slug });
  return doc ? toCollection(doc) : null;
}

export async function dbCreateCollection(input: {
  title: string;
  slug?: string;
}): Promise<CollectionRecord | { error: string }> {
  await ensureSeeded();
  const slug =
    input.slug?.trim().toLowerCase().replace(/\s+/g, "-") ||
    slugify(input.title);
  const existing = await (await col("collections")).findOne({ slug });
  if (existing) return { error: "Այս slug-ով հավաքածու արդեն կա" };
  const doc = { slug, title: input.title, custom: true, order: 1000 };
  const res = await (await col("collections")).insertOne(doc);
  return toCollection({ _id: res.insertedId, ...doc });
}

export async function dbUpdateCollection(
  id: string,
  input: { title?: string; slug?: string }
): Promise<boolean> {
  const prev = await (await col("collections")).findOne({ _id: new ObjectId(id) });
  if (!prev) return false;
  const set: Record<string, string> = {};
  if (input.title) set.title = input.title;
  if (input.slug && input.slug !== prev.slug) {
    set.slug = input.slug.trim().toLowerCase().replace(/\s+/g, "-");
    // keep product assignments in sync with the renamed slug
    await (await col("products")).updateMany(
      { collections: prev.slug },
      { $set: { "collections.$[el]": set.slug } },
      { arrayFilters: [{ el: prev.slug }] }
    );
  }
  if (Object.keys(set).length === 0) return true;
  const res = await (await col("collections")).updateOne(
    { _id: new ObjectId(id) },
    { $set: set }
  );
  return res.matchedCount > 0;
}

export async function dbDeleteCollection(id: string): Promise<boolean> {
  const prev = await (await col("collections")).findOne({ _id: new ObjectId(id) });
  if (!prev) return false;
  await (await col("products")).updateMany(
    { collections: prev.slug },
    { $pull: { collections: prev.slug } }
  );
  const res = await (await col("collections")).deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}

// ---- orders -----------------------------------------------------------

export async function dbCreateOrder(input: {
  items: OrderItem[];
  customer: OrderCustomer;
}): Promise<Order> {
  const total = input.items.reduce((n, it) => n + it.price * it.qty, 0);
  const number =
    "DN8-" +
    new Date().toISOString().slice(2, 10).replace(/-/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase();
  const doc = {
    number,
    createdAt: new Date(),
    items: input.items,
    total,
    customer: input.customer,
    delivery: { method: "Անվճար առաքում", cost: 0 },
    status: "new" as const,
  };
  const res = await (await col("orders")).insertOne(doc);
  return toOrder({ _id: res.insertedId, ...doc });
}

export async function dbGetOrders(search?: string): Promise<Order[]> {
  const q = search?.trim();
  let filter = {};
  if (q) {
    const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter = {
      $or: [
        { number: rx },
        { "customer.email": rx },
        { "customer.firstName": rx },
        { "customer.lastName": rx },
        { "customer.phone": rx },
        { "customer.city": rx },
        { "items.name": rx },
      ],
    };
  }
  const docs = await (await col("orders")).find(filter).sort({ createdAt: -1 }).limit(200).toArray();
  return docs.map(toOrder);
}

export async function dbUpdateOrderStatus(id: string, status: Order["status"]): Promise<boolean> {
  const res = await (await col("orders")).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status } }
  );
  return res.matchedCount > 0;
}

export async function dbDeleteOrder(id: string): Promise<boolean> {
  const res = await (await col("orders")).deleteOne({ _id: new ObjectId(id) });
  return res.deletedCount > 0;
}
