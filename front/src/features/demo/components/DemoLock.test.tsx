import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DemoContext, DEFAULT_DEMO_CONFIG } from "../../../store/DemoContext";
import DemoLock from "./DemoLock";

const render = (demoMode: boolean, onClick = () => {}) =>
  renderToStaticMarkup(
    <DemoContext
      value={{ ...DEFAULT_DEMO_CONFIG, demoMode, isConfigLoaded: true }}
    >
      <DemoLock>
        <button type="button" onClick={onClick}>
          Créer un parcours
        </button>
      </DemoLock>
    </DemoContext>,
  );

describe("DemoLock", () => {
  it("laisse l'enfant intact hors démonstration", () => {
    const markup = render(false);

    expect(markup).toContain("Créer un parcours");
    expect(markup).not.toContain("Indisponible en mode démo");
  });

  it("garde le bouton visible et actif en démonstration", () => {
    const markup = render(true);

    expect(markup).toContain("Créer un parcours");
    // Pas de `disabled` : un élément désactivé n'émet plus d'événement de
    // survol, et le tooltip qui explique l'inaction ne s'afficherait jamais.
    expect(markup).not.toContain("disabled");
  });

  it("annonce l'indisponibilité par un tooltip", () => {
    expect(render(true)).toContain("Indisponible en mode démo");
  });

  it("accepte un message adapté à l'action", () => {
    const markup = renderToStaticMarkup(
      <DemoContext
        value={{ ...DEFAULT_DEMO_CONFIG, demoMode: true, isConfigLoaded: true }}
      >
        <DemoLock tip="Import indisponible en mode démo">
          <button type="button">Importer</button>
        </DemoLock>
      </DemoContext>,
    );

    expect(markup).toContain("Import indisponible en mode démo");
  });

  it("n'appelle pas le gestionnaire de l'enfant", () => {
    const onClick = vi.fn();
    render(true, onClick);

    expect(onClick).not.toHaveBeenCalled();
  });
});
