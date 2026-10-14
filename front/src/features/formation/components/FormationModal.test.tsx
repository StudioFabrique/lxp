import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import FormationModal from "./FormationModal";

const mocks = vi.hoisted(() => ({
  cancelEdit: vi.fn(),
  dismissCreatedFormation: vi.fn(),
  createdFormation: null as { id: number; title: string } | null,
  importParcours: vi.fn(),
  invalidateQueries: vi.fn(),
  navigate: vi.fn(),
  readArchiveTitle: vi.fn(),
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const original = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...original,
    useMutation: () => ({
      mutate: mocks.importParcours,
      isPending: false,
    }),
    useQueryClient: () => ({
      invalidateQueries: mocks.invalidateQueries,
    }),
  };
});

vi.mock("react-router", async (importOriginal) => {
  const original = await importOriginal<typeof import("react-router")>();
  return {
    ...original,
    useNavigate: () => mocks.navigate,
  };
});

vi.mock("../../parcours/helpers/read-parcours-archive-formation", () => ({
  readParcoursArchiveFormationTitle: mocks.readArchiveTitle,
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
    createdFormation: mocks.createdFormation,
    dismissCreatedFormation: mocks.dismissCreatedFormation,
    deleteFormation: vi.fn(),
    selectFormation: vi.fn(),
    cancelEdit: mocks.cancelEdit,
    handleTagSubmit: vi.fn(),
    handleRemoveTag: vi.fn(),
    handleSubmit: vi.fn(),
    formationsList: [],
  }),
}));

vi.mock("../../../components/UI/modal/modal", () => ({
  default: ({
    children,
    title,
    leftLabel,
    rightLabel,
    onLeftClick,
    onRightClick,
  }: {
    children: React.ReactNode;
    title?: string;
    leftLabel?: string;
    rightLabel?: string;
    onLeftClick?: () => void;
    onRightClick?: () => void;
  }) => (
    <div>
      <h3>{title}</h3>
      {children}
      {onLeftClick && <button onClick={onLeftClick}>{leftLabel}</button>}
      {onRightClick && <button onClick={onRightClick}>{rightLabel}</button>}
    </div>
  ),
}));

vi.mock("../../parcours/components/create/ParcoursCreationModal", () => ({
  default: ({
    initialFormationId,
    onClose,
  }: {
    initialFormationId?: number;
    onClose: () => void;
  }) => (
    <button type="button" onClick={onClose}>
      Parcours pour la formation {initialFormationId}
    </button>
  ),
}));

vi.mock("./FormationForm", () => ({
  default: ({
    onCancel,
    alternativeCreation,
  }: {
    onCancel: () => void;
    alternativeCreation?: React.ReactNode;
  }) => (
    <>
      <button type="button" onClick={onCancel}>
        Annuler
      </button>
      {alternativeCreation}
    </>
  ),
}));

let root: Root | null = null;

afterEach(() => {
  if (root) act(() => root?.unmount());
  root = null;
  mocks.cancelEdit.mockReset();
  mocks.dismissCreatedFormation.mockReset();
  mocks.createdFormation = null;
  mocks.importParcours.mockReset();
  mocks.invalidateQueries.mockReset();
  mocks.navigate.mockReset();
  mocks.readArchiveTitle.mockReset();
});

describe("FormationModal", () => {
  it("annule l'édition et ferme la modale lorsque l'utilisateur annule", () => {
    const container = document.createElement("div");
    const onClose = vi.fn();
    root = createRoot(container);

    act(() => root?.render(<FormationModal onClose={onClose} />));
    const cancelButton = container.querySelector("button");
    act(() => cancelButton?.click());

    expect(mocks.cancelEdit).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("propose de créer une formation depuis un parcours ZIP", () => {
    const container = document.createElement("div");
    root = createRoot(container);

    act(() => root?.render(<FormationModal onClose={vi.fn()} />));

    expect(container.textContent).toContain("Créer depuis un parcours (.zip)");
    expect(container.querySelector('input[accept*=".zip"]')).not.toBeNull();
  });

  it("affiche la modale d'import avec la création de formation présélectionnée", async () => {
    const container = document.createElement("div");
    root = createRoot(container);
    mocks.readArchiveTitle.mockResolvedValue("Formation de destination");

    act(() => root?.render(<FormationModal onClose={vi.fn()} />));
    const input = container.querySelector('input[accept*=".zip"]');
    const archive = new File(["archive"], "parcours.zip", {
      type: "application/zip",
    });
    Object.defineProperty(input, "files", { value: [archive] });

    await act(async () => {
      input?.dispatchEvent(new Event("change", { bubbles: true }));
    });

    const formationSelect = container.querySelector(
      "#import-formation",
    ) as HTMLSelectElement | null;
    expect(formationSelect?.value).toBe("create");
    expect(container.textContent).toContain(
      "Créer automatiquement « Formation de destination »",
    );
    expect(mocks.importParcours).not.toHaveBeenCalled();
  });

  it("propose de créer le premier parcours après la création de la formation", () => {
    const container = document.createElement("div");
    const onClose = vi.fn();
    mocks.createdFormation = { id: 7, title: "Formation test" };
    root = createRoot(container);

    act(() => root?.render(<FormationModal onClose={onClose} />));

    expect(container.textContent).toContain("Formation test");
    expect(container.textContent).toContain("premier parcours");
    expect(onClose).not.toHaveBeenCalled();

    const acceptButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Créer le parcours",
    );
    act(() => acceptButton?.click());

    expect(container.textContent).toContain("Parcours pour la formation 7");
  });

  it("ferme la modale sans créer de parcours lorsque l'utilisateur reporte", () => {
    const container = document.createElement("div");
    const onClose = vi.fn();
    mocks.createdFormation = { id: 7, title: "Formation test" };
    root = createRoot(container);

    act(() => root?.render(<FormationModal onClose={onClose} />));
    const laterButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Plus tard",
    );
    act(() => laterButton?.click());

    expect(mocks.dismissCreatedFormation).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
