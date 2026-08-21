import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AbilityContext } from "../../rbac/AbilityProvider";
import { createAppAbility, type AppAction } from "../../rbac/ability";
import { DEFAULT_DEMO_CONFIG, DemoContext } from "../../store/DemoContext";
import PermissionGuard from "./PermissionGuard";

const render = (action: AppAction, demoMode: boolean, allowed = true) =>
  renderToStaticMarkup(
    <DemoContext
      value={{ ...DEFAULT_DEMO_CONFIG, demoMode, isConfigLoaded: true }}
    >
      <AbilityContext
        value={createAppAbility(allowed ? [{ action, subject: "parcours" }] : [])}
      >
        <PermissionGuard action={action} object="parcours">
          <button type="button">Créer un parcours</button>
        </PermissionGuard>
      </AbilityContext>
    </DemoContext>,
  );

describe("PermissionGuard en mode démonstration", () => {
  it.each(["write", "update", "delete"] as const)(
    "montre l'action %s mais la rend inerte",
    (action) => {
      const markup = render(action, true);

      expect(markup).toContain("Créer un parcours");
      expect(markup).toContain("Indisponible en mode démo");
    },
  );

  it("ne verrouille pas une simple lecture", () => {
    const markup = render("read", true);

    expect(markup).toContain("Créer un parcours");
    expect(markup).not.toContain("Indisponible en mode démo");
  });

  it("masque toujours ce que l'ability refuse", () => {
    expect(render("write", true, false)).not.toContain("Créer un parcours");
  });

  it("ne change rien hors démonstration", () => {
    const markup = render("write", false);

    expect(markup).toContain("Créer un parcours");
    expect(markup).not.toContain("Indisponible en mode démo");
  });
});
