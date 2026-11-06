import { Users } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import EmptyStatePlaceholder from "./empty-state-placeholder";

describe("EmptyStatePlaceholder", () => {
  it("affiche un titre personnalisable", () => {
    const markup = renderToStaticMarkup(
      <EmptyStatePlaceholder title="Aucun parcours disponible" />,
    );

    expect(markup).toContain("Aucun parcours disponible");
  });

  it("affiche les actions optionnelles", () => {
    const markup = renderToStaticMarkup(
      <EmptyStatePlaceholder title="Aucune activité">
        <button type="button">Leçon suivante</button>
      </EmptyStatePlaceholder>,
    );

    expect(markup).toContain("Aucune activité");
    expect(markup).toContain("Leçon suivante");
  });

  it("peut être affiché sans bordure ni ombre", () => {
    const markup = renderToStaticMarkup(
      <EmptyStatePlaceholder title="Aucune activité" withBorder={false} />,
    );

    expect(markup).not.toContain("border-base-300");
    expect(markup).not.toContain("shadow-sm");
  });

  it("affiche la description et l'illustration fournies", () => {
    const markup = renderToStaticMarkup(
      <EmptyStatePlaceholder
        title="Aucun groupe disponible"
        description="Créez votre premier groupe pour y rattacher des apprenants."
        icon={Users}
      />,
    );

    expect(markup).toContain("Créez votre premier groupe");
    expect(markup).toContain("lucide-users");
    expect(markup).toContain('aria-hidden="true"');
  });

  it("utilise une illustration neutre et stable par défaut", () => {
    const first = renderToStaticMarkup(
      <EmptyStatePlaceholder title="Aucune activité" />,
    );
    const second = renderToStaticMarkup(
      <EmptyStatePlaceholder title="Aucune activité" />,
    );

    expect(first).toContain("lucide-inbox");
    expect(second).toBe(first);
  });
});
