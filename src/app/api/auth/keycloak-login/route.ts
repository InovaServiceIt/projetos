import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import { getAuthUrl, isKeycloakConfigured } from "@/lib/keycloak";

/**
 * Inicia o login no Keycloak sem tela intermediária.
 * Precisa ser Route Handler: o signIn grava cookies (PKCE), o que não é
 * permitido durante o render da página de login.
 *
 * O callback sempre volta para o AUTH_URL. Se o fluxo começasse em outro domínio
 * do mesmo app, o cookie PKCE ficaria nele e o callback falharia com InvalidCheck.
 */
export async function GET(request: NextRequest) {
  const authUrl = getAuthUrl();

  if (!isKeycloakConfigured()) {
    return NextResponse.redirect(`${authUrl}/login`);
  }

  const host = (
    request.headers.get("x-forwarded-host") ?? request.headers.get("host")
  )
    ?.split(",")[0]
    ?.trim();
  // `canonical` impede loop caso o proxy não repasse o host público.
  const alreadyRedirected = request.nextUrl.searchParams.has("canonical");

  if (host && host !== new URL(authUrl).host && !alreadyRedirected) {
    return NextResponse.redirect(
      `${authUrl}/api/auth/keycloak-login?canonical=1`,
    );
  }

  await signIn("keycloak", { redirectTo: "/dashboard" });
}
