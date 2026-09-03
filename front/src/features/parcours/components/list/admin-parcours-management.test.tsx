import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";

import AdminParcoursManagement from "./admin-parcours-management";

const renderPage = (layout: "admin" | "student") => {
  const queryClient = new QueryClient();

  return renderToStaticMarkup(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AdminParcoursManagement formations={[]} layout={layout} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("AdminParcoursManagement", () => {
  it("utilise l’état vide partagé sur la page Gestion des parcours", () => {
    expect(renderPage("admin")).toContain("Aucun parcours disponible");
  });

  it("ne modifie pas l’état vide de la page étudiante", () => {
    const markup = renderPage("student");

    expect(markup).toContain(
      "Aucun parcours ne vous est attribué pour le moment.",
    );
    expect(markup).not.toContain("Aucun parcours disponible");
  });
});
