import { NextRequest, NextResponse } from "next/server";
import { dbCreateOrder, dbGetOrders, type OrderCustomer, type OrderItem } from "@/lib/repo";
import { isAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const q = req.nextUrl.searchParams.get("q") ?? undefined;
  return NextResponse.json(await dbGetOrders(q));
}

const REQUIRED_CUSTOMER: (keyof OrderCustomer)[] = [
  "email",
  "firstName",
  "lastName",
  "address",
  "country",
  "region",
  "city",
  "phone",
];

export async function POST(req: NextRequest) {
  const body = await req.json();
  const items: OrderItem[] = Array.isArray(body?.items) ? body.items : [];
  const customer = body?.customer ?? {};

  if (items.length === 0) {
    return NextResponse.json({ error: "cart is empty" }, { status: 400 });
  }
  for (const field of REQUIRED_CUSTOMER) {
    if (!String(customer[field] ?? "").trim()) {
      return NextResponse.json({ error: `missing field: ${field}` }, { status: 400 });
    }
  }

  const order = await dbCreateOrder({
    items: items.map((it) => ({
      productId: String(it.productId),
      slug: String(it.slug),
      name: String(it.name),
      price: Number(it.price),
      size: String(it.size),
      qty: Math.max(1, Number(it.qty)),
    })),
    customer: {
      email: String(customer.email).trim(),
      firstName: String(customer.firstName).trim(),
      lastName: String(customer.lastName).trim(),
      address: String(customer.address).trim(),
      country: String(customer.country).trim(),
      region: String(customer.region).trim(),
      city: String(customer.city).trim(),
      postalCode: String(customer.postalCode ?? "").trim(),
      phone: String(customer.phone).trim(),
    },
  });
  return NextResponse.json(order, { status: 201 });
}
