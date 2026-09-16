import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { parcoursApi } from "../../api/parcours.api";
import ParcoursCreationModal from "./ParcoursCreationModal";

vi.mock("../../../../components/guards/RoleRankGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("../../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("../../helpers/read-parcours-archive-formation", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../helpers/read-parcours-archive-formation")>();
  return {
    ...original,
    readParcoursArchiveFormationTitle: vi.fn().mockResolvedValue("Formation test"),
  };
});

describe("ParcoursCreationModal", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    vi.spyOn(parcoursApi.queries, "getFormations").mockResolvedValue([
      { id: 7, title: "Formation test" },
    ]);
    vi.spyOn(parcoursApi.queries, "getByFormation").mockResolvedValue({
      data: [{ id: 12, title: "Parcours modèle" }],
    });
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  const renderModal = async (root: Root, container: HTMLDivElement) => {
    await act(async () => {
      root.render(
        <MemoryRouter>
          <QueryClientProvider client={new QueryClient()}>
            <ParcoursCreationModal initialFormationId={7} onClose={vi.fn()} />
          </QueryClientProvider>
        </MemoryRouter>,
      );
    });
    expect(container.querySelectorAll("dialog")).toHaveLength(1);
  };

  it("remplace le formulaire par les modèles dans la même modale", async () => {
    await renderModal(root, container);

    expect(container.textContent).toContain("Créer un nouveau parcours");
    const templateButton = [...container.querySelectorAll("button")].find((button) =>
      button.textContent?.includes("Créer un parcours à partir d'un modèle"),
    );
    await act(async () => templateButton?.click());

    expect(container.querySelectorAll("dialog")).toHaveLength(1);
    await vi.waitFor(() => expect(container.textContent).toContain("Parcours modèle"));
    expect(container.textContent).not.toContain("Créer un nouveau parcours");

    const backButton = [...container.querySelectorAll("button")].find((button) =>
      button.textContent === "Retour",
    );
    await act(async () => backButton?.click());
    expect(container.querySelectorAll("dialog")).toHaveLength(1);
    expect(container.textContent).toContain("Créer un nouveau parcours");
  });

  it("remplace le formulaire par l'import après sélection d'une archive", async () => {
    await renderModal(root, container);

    const input = container.querySelector<HTMLInputElement>('input[type="file"]');
    expect(input).not.toBeNull();
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [new File(["archive"], "parcours.zip", { type: "application/zip" })],
    });
    await act(async () => {
      input?.dispatchEvent(new Event("change", { bubbles: true }));
    });

    expect(container.querySelectorAll("dialog")).toHaveLength(1);
    expect(container.textContent).toContain("Archive sélectionnée : parcours.zip");
    expect(container.textContent).not.toContain("Créer un nouveau parcours");
  });
});
