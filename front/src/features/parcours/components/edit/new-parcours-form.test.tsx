import { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import NewParcoursForm from "./new-parcours-form";

const formations = [{ id: 7, title: "Formation test" }];

async function renderForm(initialFormationId?: number) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => {
    root.render(
      <MemoryRouter>
        <NewParcoursForm
          formations={formations}
          initialFormationId={initialFormationId}
          onSubmit={vi.fn()}
        />
      </MemoryRouter>,
    );
  });
  return {
    container,
    cleanup: async () => {
      await act(async () => root.unmount());
      container.remove();
    },
  };
}

describe("NewParcoursForm", () => {
  it("place le focus sur le nom si la formation est présélectionnée", async () => {
    const { container, cleanup } = await renderForm(7);
    expect(document.activeElement).toBe(
      container.querySelector('[data-onboarding-field="parcours-title"]'),
    );
    await cleanup();
  });

  it("place le focus sur le nom après la sélection d'une formation", async () => {
    const { container, cleanup } = await renderForm();
    const select = container.querySelector<HTMLSelectElement>("select[name=menu]");
    const title = container.querySelector<HTMLInputElement>(
      '[data-onboarding-field="parcours-title"]',
    );
    expect(title?.disabled).toBe(true);

    await act(async () => {
      if (select) {
        select.value = "7";
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    expect(title?.disabled).toBe(false);
    expect(document.activeElement).toBe(title);
    await cleanup();
  });
});
