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

const availableGroup = {
  ...group,
  _id: "available-group-id",
  name: "Groupe B",
};

const assignedElsewhere = {
  ...availableGroup,
  _id: "other-parcours-group-id",
  name: "Groupe C",
  parcoursId: 2,
};

let parcoursGroups: (typeof group)[] = [];
let areGroupsFetching = false;
let refreshGroupsOnReturn = false;

const updateGroups = vi.fn();
const navigate = vi.fn();

vi.mock("react-router", () => ({
  useParams: () => ({ id: "1" }),
  useLocation: () => ({
    pathname: "/admin/parcours/edit/1",
    search: "?step=6",
    state: refreshGroupsOnReturn ? { refreshParcoursGroups: true } : null,
  }),
  useNavigate: () => navigate,
}));

vi.mock("../../../../../components/UI/right-side-drawer/right-side-drawer", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("../../../../../../src/components/wrappers/BoxWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("./groups-list.component", () => ({
  default: ({
    groups,
    onAdd,
  }: {
    groups: (typeof group)[];
    onAdd: (groups: (typeof group)[]) => void;
  }) => (
    <>
      {groups.map(({ _id, name }) => (
        <span key={_id}>{name}</span>
      ))}
      <button type="button" onClick={() => onAdd([group])}>
        Ajouter le groupe test
      </button>
    </>
  ),
}));

vi.mock("./students-list", () => ({
  default: () => <div data-testid="students-list" />,
}));
vi.mock("../../../../../components/UI/button-add/button-add", () => ({
  default: () => null,
}));

vi.mock("../../../hooks/useParcoursGroupsQuery", () => ({
  useParcoursGroupsQuery: () => ({
    data: parcoursGroups,
    isFetching: areGroupsFetching,
  }),
}));

vi.mock("../../../hooks/useStudentGroupsQuery", () => ({
  useStudentGroupsQuery: () => ({
    data: [group, availableGroup, assignedElsewhere],
    refetch: vi.fn(),
  }),
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
    parcoursGroups = [];
    areGroupsFetching = false;
    refreshGroupsOnReturn = false;
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

  it("ne propose pas dans le drawer les groupes déjà ajoutés", () => {
    parcoursGroups = [group];
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => root?.render(<ParcoursStudents />));

    expect(container.textContent).not.toContain("Groupe A");
    expect(container.textContent).toContain("Groupe B");
    expect(container.textContent).not.toContain("Groupe C");
  });

  it("garde la liste montée pendant l'actualisation des groupes", () => {
    parcoursGroups = [group];
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => root?.render(<ParcoursStudents />));
    const list = container.querySelector('[data-testid="students-list"]');

    areGroupsFetching = true;
    act(() => root?.render(<ParcoursStudents />));

    const panel = container.querySelector("section:last-child");
    expect(panel?.textContent).toContain("Groupes d'apprenants");
    expect(list).not.toBeNull();
    expect(panel?.querySelector('[data-testid="students-list"]')).toBe(list);
    expect(panel?.querySelector('[role="status"]')).toBeNull();
  });

  it("affiche le squelette au retour du formulaire de création d'un groupe", () => {
    parcoursGroups = [group];
    areGroupsFetching = true;
    refreshGroupsOnReturn = true;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => root?.render(<ParcoursStudents />));

    const panel = container.querySelector("section:last-child");
    expect(panel?.querySelector('[role="status"]')?.getAttribute("aria-label"))
      .toBe("Chargement des groupes du parcours");
    expect(panel?.querySelector('[data-testid="students-list"]')).toBeNull();
    expect(navigate).not.toHaveBeenCalled();

    areGroupsFetching = false;
    act(() => root?.render(<ParcoursStudents />));

    expect(panel?.querySelector('[data-testid="students-list"]')).not.toBeNull();
    expect(navigate).toHaveBeenCalledWith("/admin/parcours/edit/1?step=6", {
      replace: true,
      state: { refreshParcoursGroups: false },
    });
  });
});
