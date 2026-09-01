import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  emitOnboardingEvent,
  subscribeToOnboardingEvents,
  type OnboardingEventDetail,
} from "../../onboarding/onboarding-events";
import FormationModal from "./FormationModal";

const mocks = vi.hoisted(() => ({
  cancelEdit: vi.fn(),
}));

vi.mock("../hooks/useFormationForm", () => ({
  useFormationForm: () => ({
    title: "",
    setTitle: vi.fn(),
    description: "",
    setDescription: vi.fn(),
    code: "",
    setCode: vi.fn(),
    level: "",
    setLevel: vi.fn(),
    currentTags: [],
    tagInput: "",
    setTagInput: vi.fn(),
    isEditing: false,
    isPending: false,
    isDeleting: false,
    formationToEdit: null,
    deleteFormation: vi.fn(),
    selectFormation: vi.fn(),
    cancelEdit: mocks.cancelEdit,
    handleTagSubmit: vi.fn(),
    handleRemoveTag: vi.fn(),
    handleSubmit: vi.fn(),
  }),
}));

vi.mock("../../../components/UI/modal/modal", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("./FormationForm", () => ({
  default: ({ onCancel }: { onCancel: () => void }) => (
    <button type="button" onClick={onCancel}>
      Annuler
    </button>
  ),
}));

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
  mocks.cancelEdit.mockReset();
});

describe("FormationModal pendant l’onboarding", () => {
  it("se ferme lorsque le tutoriel revient à l’étape précédente", () => {
    const container = document.createElement("div");
    const onClose = vi.fn();
    root = createRoot(container);

    act(() => root?.render(<FormationModal onClose={onClose} />));
    act(() =>
      emitOnboardingEvent({ type: "formation_modal_close_requested" }),
    );

    expect(mocks.cancelEdit).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("prévient le tutoriel lorsque l’utilisateur annule", () => {
    const container = document.createElement("div");
    const onClose = vi.fn();
    const events: OnboardingEventDetail[] = [];
    const unsubscribe = subscribeToOnboardingEvents((event) =>
      events.push(event),
    );
    root = createRoot(container);

    act(() => root?.render(<FormationModal onClose={onClose} />));
    const cancelButton = container.querySelector("button");
    act(() => cancelButton?.click());
    unsubscribe();

    expect(events).toContainEqual({ type: "formation_modal_cancelled" });
    expect(mocks.cancelEdit).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
