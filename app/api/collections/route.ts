import { NextRequest, NextResponse } from "next/server";
import { dbCreateCollection, dbGetCollections } from "@/lib/repo";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await dbGetCollections());
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body?.title) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  const result = await dbCreateCollection({ title: String(body.title), slug: body.slug });
  if ("error" in result) return NextResponse.json(result, { status: 409 });
  return NextResponse.json(result, { status: 201 });
}
