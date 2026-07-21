import { NextRequest, NextResponse } from "next/server";
import {
  dbCreateProduct,
  dbGetProducts,
  dbGetProductsByCollection,
  dbSearchProducts,
} from "@/lib/repo";
import { isAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const collection = req.nextUrl.searchParams.get("collection");
  if (q) return NextResponse.json(await dbSearchProducts(q));
  if (collection) return NextResponse.json(await dbGetProductsByCollection(collection));
  return NextResponse.json(await dbGetProducts());
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body?.name || typeof body.price !== "number") {
    return NextResponse.json({ error: "name and price are required" }, { status: 400 });
  }
  const product = await dbCreateProduct({
    name: String(body.name),
    price: body.price,
    type: String(body.type ?? ""),
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    gender: body.gender ?? "Unisex",
    colors: Array.isArray(body.colors) ? body.colors : [],
    collections: Array.isArray(body.collections) ? body.collections : [],
    description: String(body.description ?? ""),
    image: body.image || null,
    slug: body.slug,
  });
  return NextResponse.json(product, { status: 201 });
}
