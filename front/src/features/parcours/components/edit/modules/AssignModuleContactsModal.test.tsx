import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import type { ModuleData } from "../../../interfaces/new-module";
import AssignModuleContactsModal from "./AssignModuleContactsModal";

const module: ModuleData = {
  id: 1,
  title: "Module principal",
  description: "",
  thumb: null,
  contacts: [],
  skills: [],
};

const renderModal = (
  parcoursContacts: Parameters<
    typeof AssignModuleContactsModal
  >[0]["parcoursContacts"],
) =>
  renderToStaticMarkup(
    <MemoryRouter initialEntries={["/admin/parcours/edit/12?step=4"]}>
      <AssignModuleContactsModal
        module={module}
        parcoursContacts={parcoursContacts}
        isSubmitting={false}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    </MemoryRouter>,
  );

describe("AssignModuleContactsModal", () => {
  it("propose d'ajouter une ressource, vers l'étape Informations, quand il n'y en a aucune à affecter", () => {
    const markup = renderModal([]);

    expect(markup).toContain("Ajouter une ressource pédagogique");
    expect(markup).toContain('href="/admin/parcours/edit/12?step=1"');
    expect(markup).not.toContain("déjà affectées");
  });

  it("liste les ressources du parcours non encore affectées", () => {
    const markup = renderModal([
      { id: 5, firstname: "Ada", lastname: "Lovelace" } as Parameters<
        typeof AssignModuleContactsModal
      >[0]["parcoursContacts"][number],
    ]);

    expect(markup).toContain('type="checkbox"');
    expect(markup).not.toContain("Ajouter une ressource pédagogique");
  });
});
