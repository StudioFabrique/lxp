import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import ActivityHeader from "./activity-header";

describe("ActivityHeader", () => {
  it("affiche Annuler uniquement lorsqu’une action d’annulation est disponible", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    const onCancel = vi.fn();

    try {
      act(() => root.render(<ActivityHeader title="" activityType="text" />));
      expect(container.querySelector("button")).toBeNull();

      act(() => root.render(<ActivityHeader title="Activité" onCancel={onCancel} />));
      const cancelButton = container.querySelector("button");
      expect(cancelButton?.textContent).toBe("Annuler");
      act(() => cancelButton?.click());
      expect(onCancel).toHaveBeenCalledOnce();

      act(() => root.render(<ActivityHeader title="Activité" />));
      expect(container.querySelector("button")).toBeNull();
    } finally {
      act(() => root.unmount());
    }
  });

  it("conserve les contrôles fournis en enfants", () => {
    const container = document.createElement("div");
    const root = createRoot(container);

    try {
      act(() => root.render(
        <ActivityHeader title="Activité" onCancel={vi.fn()}>
          <button type="button">Modifier</button>
        </ActivityHeader>,
      ));
      expect(container.querySelectorAll("button")).toHaveLength(1);
      expect(container.querySelector("button")?.textContent).toBe("Modifier");
    } finally {
      act(() => root.unmount());
    }
  });
});
