import { Button } from "@/components/ui/button";

/** Navegação completa: a rota garante que o login comece no domínio do AUTH_URL. */
export function KeycloakLoginButton() {
  return (
    <form action="/api/auth/keycloak-login">
      <Button type="submit" className="w-full">
        Entrar com Service IT
      </Button>
    </form>
  );
}
