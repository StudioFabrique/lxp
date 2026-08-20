import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import IndicatorsPrediction from "./IndicatorsPrediction";

const render = (props: { disabled?: boolean } = {}) =>
  renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>
      <IndicatorsPrediction
        studentId="000000000000000000000000"
        range={{ from: "2026-07-21", to: "2026-08-20" }}
        {...props}
      />
    </QueryClientProvider>,
  );

describe("IndicatorsPrediction", () => {
  it("n'interroge pas le modèle tant que le bouton n'est pas actionné", () => {
    const markup = render();

    expect(markup).toContain("Interroger le modèle IA");
    expect(markup).toContain("Aucune analyse pour le moment.");
  });

  it("désactive le bouton tant que les indicateurs ne sont pas chargés", () => {
    // Sans indicateurs, la prédiction porterait sur une fenêtre inconnue.
    expect(render({ disabled: true })).toContain("disabled");
  });
});
