import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUrl } from "@/lib/keycloak";

/**
 * Limpa cookies de sessão inválida (ex.: userId antigo após reset do banco).
 * Precisa ser Route Handler — Server Components não podem alterar cookies.
 * Usa a URL pública: atrás do proxy, request.url traz o bind interno (0.0.0.0:3000).
 */
export async function GET() {
  const cookieStore = await cookies();
  const names = cookieStore.getAll().map((c) => c.name);

  const res = NextResponse.redirect(`${getAuthUrl()}/login?session=expired`);

  for (const name of names) {
    if (
      name.includes("authjs") ||
      name.includes("next-auth") ||
      name === "session-token" ||
      name.endsWith(".session-token")
    ) {
      res.cookies.set(name, "", { expires: new Date(0), path: "/" });
    }
  }

  return res;
}
