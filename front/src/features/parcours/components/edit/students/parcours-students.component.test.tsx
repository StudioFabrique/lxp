import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";

import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import ParcoursStudents from "./parcours-students.component";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const group = {
  _id: "group-id",
  name: "Groupe A",
  desc: "",
  formation: "Formation A",
  nbStudents: 12,
  users: [],
  isActive: true,
  isSelected: true,
};

const updateGroups = vi.fn();

vi.mock("react-router", () => ({
  useParams: () => ({ id: "1" }),
}));

vi.mock("../../../../../components/UI/right-side-drawer/right-side-drawer", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../../../../../../src/components/wrappers/BoxWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("./groups-list.component", () => ({
  default: ({ onAdd }: { onAdd: (groups: (typeof group)[]) => void }) => (
    <button type="button" onClick={() => onAdd([group])}>
      Ajouter le groupe test
    </button>
  ),
}));

vi.mock("./students-list", () => ({ default: () => null }));
vi.mock("../../../../../components/UI/button-add/button-add", () => ({
  default: () => null,
}));

vi.mock("../../../hooks/useParcoursGroupsQuery", () => ({
  useParcoursGroupsQuery: () => ({ data: [] }),
}));

vi.mock("../../../hooks/useStudentGroupsQuery", () => ({
  useStudentGroupsQuery: () => ({ data: [group], refetch: vi.fn() }),
}));

vi.mock("../../../hooks/useParcoursStudentsQuery", () => ({
  useParcoursStudentsQuery: () => ({ data: [] }),
}));

vi.mock("../../../hooks/useUpdateParcoursGroups", () => ({
  // L'objet du hook est volontairement recréé à chaque rendu, comme celui
  // de React Query lorsque le statut d'une mutation évolue.
  useUpdateParcoursGroups: () => ({ mutate: updateGroups }),
}));

describe("ParcoursStudents", () => {
  let root: Root | undefined;
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    if (root) act(() => root?.unmount());
    container?.remove();
    root = undefined;
    container = undefined;
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("ne relance pas l'autosauvegarde quand l'objet mutation change", () => {
    vi.useFakeTimers();
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => root?.render(<ParcoursStudents />));
    act(() => {
      container?.querySelector<HTMLButtonElement>("button")?.click();
    });
    act(() => vi.advanceTimersByTime(autoSubmitTimer));

    expect(updateGroups).toHaveBeenCalledTimes(1);
    expect(updateGroups).toHaveBeenCalledWith(
      ["group-id"],
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );

    act(() => root?.render(<ParcoursStudents />));
    act(() => vi.advanceTimersByTime(autoSubmitTimer * 2));

    expect(updateGroups).toHaveBeenCalledTimes(1);
  });
});
