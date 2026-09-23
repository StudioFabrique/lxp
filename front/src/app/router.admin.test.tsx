import { describe, expect, it } from "vitest";
import { matchRoutes } from "react-router";
import { adminRoutes } from "./router.admin";

describe("routes de l’administration", () => {
  it("associe /admin/dashboard au tableau de bord", () => {
    const matches = matchRoutes(adminRoutes, "/admin/dashboard");
    expect(matches?.[matches.length - 1]?.route.path).toBe("dashboard");
  });

  it("réserve la page 404 aux adresses inconnues", () => {
    const matches = matchRoutes(adminRoutes, "/admin/page-inconnue");
    expect(matches?.[matches.length - 1]?.route.path).toBe("*");
  });
});
