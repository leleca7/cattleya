import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";

const COOKIE_NAME = "cattleya_admin_session";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET não configurada.");
  return value;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createAdminToken(email: string) {
  const encoded = Buffer.from(email, "utf8").toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyAdminToken(token?: string | null) {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return Buffer.from(encoded, "base64url").toString("utf8");
  } catch {
    return null;
  }
}

export async function getAdminUser() {
  const store = await cookies();
  const email = verifyAdminToken(store.get(COOKIE_NAME)?.value);
  if (!email) return null;

  const rows = await sql`
    SELECT id, email, name, role, active
    FROM admin_users
    WHERE LOWER(email) = LOWER(${email}) AND active = TRUE
    LIMIT 1
  `;

  return rows[0] as
    | { id: number; email: string; name: string | null; role: "owner" | "editor"; active: boolean }
    | undefined;
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function setAdminSession(email: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, createAdminToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
