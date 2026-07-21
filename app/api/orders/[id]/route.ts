import { NextRequest, NextResponse } from "next/server";
import { dbDeleteOrder, dbUpdateOrderStatus, type Order } from "@/lib/repo";
import { isAdminRequest } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

const STATUSES: Order["status"][] = ["new", "processing", "done", "cancelled"];

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  if (!STATUSES.includes(body?.status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }
  const ok = await dbUpdateOrderStatus(id, body.status);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const ok = await dbDeleteOrder(id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
