import { NextResponse } from "next/server";

/**
 * Healthcheck do container: sem auth e sem redirect.
 * Não usar /login: com Keycloak ativo ele redireciona para o domínio público,
 * que o proxy só libera depois que o container fica healthy (deadlock).
 */
export function GET() {
  return NextResponse.json({ status: "ok" });
}
