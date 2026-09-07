import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import type { ModuleData } from "../../../interfaces/new-module";
import ModuleCard from "./ModuleCard";
import ModuleGrid from "./ModuleGrid";

vi.mock("../../../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../../../../../components/UI/cursor-glow-card", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const module: ModuleData = {
  id: 1,
  title: "Module illustré",
  description: "Description",
  duration: 2,
  thumb: "data:image/png;base64,module-image",
  contacts: [
    {
      id: 3,
      idMdb: "contact-3",
      firstname: "Ada",
      lastname: "Lovelace",
      role: "Formateur",
    },
  ],
  skills: [
    {
      id: 5,
      description: "Compétence avec badge",
      badge: "data:image/png;base64,skill-badge",
    },
    { id: 6, description: "Compétence sans badge" },
  ],
};

describe("ModuleGrid", () => {
  it("affiche l'image, les actions en pied de liste et toutes les compétences", () => {
    const markup = renderToStaticMarkup(
      <ModuleGrid
        modules={[module]}
        parcoursContacts={module.contacts}
        parcoursSkills={module.skills}
        isAssigningContacts={false}
        isAssigningSkills={false}
        removingContact={null}
        removingSkill={null}
        highlightedModuleId={module.id}
        emptyMessage="Aucun module"
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onAssignContacts={vi.fn()}
        onAssignSkills={vi.fn()}
        onRemoveContact={vi.fn()}
        onRemoveSkill={vi.fn()}
      />,
    );

    expect(markup).toContain("module-image");
    expect(markup).toContain("Affecter des ressources pédagogiques");
    expect(markup).toContain("Ajouter des compétences");
    expect(markup).toContain('data-tip="Compétence avec badge"');
    expect(markup).toContain('data-tip="Compétence sans badge"');
    expect(markup).toContain("skill-badge");
    expect(markup).toContain('id="parcours-module-1"');
    expect(markup).toContain('data-highlighted="true"');
    expect(markup).toContain("min-h-24");
    expect(markup).toContain("py-2");
    expect(markup).toContain("after:hidden");
    expect(markup).toContain(
      "Retirer la ressource pédagogique Ada Lovelace du module Module illustré",
    );
    expect(markup).toContain(
      "Retirer la compétence Compétence avec badge du module Module illustré",
    );
    expect(markup).toContain("group/skill");
    expect(markup).toContain("group-hover/skill:opacity-100");
    expect(markup).toContain("backdrop-blur-sm");

    const contactPosition = markup.indexOf("Ada Lovelace");
    const contactButtonPosition = markup.indexOf(
      "Affecter des ressources pédagogiques",
    );
    const skillPosition = markup.indexOf("Compétence avec badge");
    const skillButtonPosition = markup.indexOf("Ajouter des compétences");

    expect(contactButtonPosition).toBeGreaterThan(contactPosition);
    expect(skillButtonPosition).toBeGreaterThan(skillPosition);
  });

  it("permet de réutiliser la carte avec les affectations en lecture seule", () => {
    const markup = renderToStaticMarkup(<ModuleCard module={module} />);

    expect(markup).toContain("Ada Lovelace");
    expect(markup).toContain('data-tip="Compétence avec badge"');
    expect(markup).not.toContain("Affecter des ressources pédagogiques");
    expect(markup).not.toContain("Ajouter des compétences");
    expect(markup).not.toContain("Retirer la ressource pédagogique");
    expect(markup).not.toContain("Retirer la compétence");
  });

  it("identifie les modules incomplets dans les modules associés", () => {
    const markup = renderToStaticMarkup(
      <ModuleGrid
        modules={[module, { ...module, id: 2, contacts: [] }]}
        parcoursContacts={module.contacts}
        parcoursSkills={module.skills}
        isAssigningContacts={false}
        isAssigningSkills={false}
        removingContact={null}
        removingSkill={null}
        emptyMessage="Aucun module"
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
        onAssignContacts={vi.fn()}
        onAssignSkills={vi.fn()}
        onRemoveContact={vi.fn()}
        onRemoveSkill={vi.fn()}
      />,
    );

    expect(markup.match(/>Incomplet</g)).toHaveLength(1);
  });

  it("retire une ressource ou une compétence depuis leurs actions dédiées", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const onRemoveContact = vi.fn(async () => true);
    const onRemoveSkill = vi.fn(async () => true);

    await act(async () => {
      root.render(
        <ModuleGrid
          modules={[module]}
          parcoursContacts={module.contacts}
          parcoursSkills={module.skills}
          isAssigningContacts={false}
          isAssigningSkills={false}
          removingContact={null}
          removingSkill={null}
          emptyMessage="Aucun module"
          onUpdate={vi.fn()}
          onDelete={vi.fn()}
          onAssignContacts={vi.fn()}
          onAssignSkills={vi.fn()}
          onRemoveContact={onRemoveContact}
          onRemoveSkill={onRemoveSkill}
        />,
      );
    });

    const removeContactButton = container.querySelector<HTMLButtonElement>(
      '[aria-label="Retirer la ressource pédagogique Ada Lovelace du module Module illustré"]',
    );
    const removeSkillButton = container.querySelector<HTMLButtonElement>(
      '[aria-label="Retirer la compétence Compétence avec badge du module Module illustré"]',
    );

    await act(async () => removeContactButton?.click());
    await act(async () => removeSkillButton?.click());

    expect(onRemoveContact).toHaveBeenCalledWith(1, 3);
    expect(onRemoveSkill).toHaveBeenCalledWith(1, 5);

    await act(async () => root.unmount());
    container.remove();
  });
});
