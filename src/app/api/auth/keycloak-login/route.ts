import { NextResponse } from "next/server";
import { signIn } from "@/lib/auth";
import { getAuthUrl, isKeycloakConfigured } from "@/lib/keycloak";

/**
 * Inicia o login no Keycloak sem tela intermediária.
 * Precisa ser Route Handler: o signIn grava cookies (state/PKCE), o que não é
 * permitido durante o render da página de login.
 */
export async function GET() {
  if (!isKeycloakConfigured()) {
    return NextResponse.redirect(`${getAuthUrl()}/login`);
  }

  await signIn("keycloak", { redirectTo: "/dashboard" });
}
