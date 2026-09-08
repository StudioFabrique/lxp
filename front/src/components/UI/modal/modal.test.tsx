import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import Modal from "./modal";

describe("Modal", () => {
  it("peut afficher son bouton de fermeture uniquement dans l’en-tête", () => {
    const html = renderToStaticMarkup(
      <Modal
        title="Aperçu"
        leftLabel="Fermer"
        onLeftClick={vi.fn()}
        closeButtonAtTop
      >
        Contenu
      </Modal>,
    );

    expect(html.match(/Fermer/g)).toHaveLength(1);
    expect(html.indexOf("Fermer")).toBeLessThan(html.indexOf("Contenu"));
  });
});
