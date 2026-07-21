import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "dn8_admin";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "dn8admin";
}

// Session token derived from the password: changing the password
// invalidates existing sessions.
export function adminToken(): string {
  return createHash("sha256").update(`dn8-admin:${adminPassword()}`).digest("hex");
}

export function checkPassword(password: string): boolean {
  return password === adminPassword();
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}

export function isAdminRequest(req: NextRequest): boolean {
  return req.cookies.get(ADMIN_COOKIE)?.value === adminToken();
}
