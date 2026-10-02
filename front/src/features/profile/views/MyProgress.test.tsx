import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { useQuery } from "@tanstack/react-query";
import { MemoryRouter, useLocation } from "react-router";
import { afterEach, expect, it, vi } from "vitest";
import MyProgress from "./MyProgress";

vi.mock("@tanstack/react-query", () => ({ useQuery: vi.fn() }));
vi.mock("../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock("../components/journal/journal", () => ({
  default: ({ parcoursId }: { parcoursId: number }) => <div data-journal={parcoursId} />,
}));
vi.mock("../components/awards/awards", () => ({
  default: ({ parcours }: { parcours: { id: number } }) => <div data-awards={parcours?.id} />,
}));

function CurrentSearch() {
  return <span data-search={useLocation().search} />;
}

let root: Root | undefined;
let container: HTMLDivElement | undefined;

function mockProgressQuery(
  data: unknown,
  hasAvailableContent: boolean,
  status: "not_started" | "in_progress" | "completed" = "completed",
) {
  vi.mocked(useQuery).mockImplementation(({ queryKey }) =>
    queryKey[0] === "my-progress"
      ? { data, isLoading: false, isError: false } as never
      : { data: { hasAvailableContent, profile: { status } } } as never,
  );
}

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
  vi.clearAllMocks();
});

it("ouvre le parcours demandé et filtre les sections lors du changement", () => {
  mockProgressQuery(
    [
      { id: 1, title: "Parcours A", modules: [{ id: 11, title: "Module A", stats: { progress: 25 } }] },
      { id: 2, title: "Parcours B", modules: [{ id: 22, title: "Module B", stats: { progress: 75 } }] },
    ],
    true,
  );
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  act(() => root?.render(
    <MemoryRouter initialEntries={["/student/mon-avancement?parcoursId=2"]}>
      <MyProgress />
      <CurrentSearch />
    </MemoryRouter>,
  ));

  const select = container.querySelector<HTMLSelectElement>("#progress-parcours")!;
  expect(select.value).toBe("2");
  expect(container.textContent).toContain("Module B");
  expect(container.textContent).not.toContain("Module A");
  expect(container.querySelector("[data-journal='2']")).not.toBeNull();
  expect(container.querySelector("[data-awards='2']")).not.toBeNull();
  expect(container.textContent).toContain("Mes préférences et niveaux");

  act(() => {
    select.value = "1";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });

  expect(container.textContent).toContain("Module A");
  expect(container.textContent).not.toContain("Module B");
  expect(container.querySelector("[data-search='?parcoursId=1']")).not.toBeNull();
});

it("masque le filtre lorsqu'un seul parcours est associé", () => {
  mockProgressQuery([{ id: 1, title: "Parcours A", modules: [] }], true);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  act(() => root?.render(
    <MemoryRouter initialEntries={["/student/mon-avancement"]}>
      <MyProgress />
    </MemoryRouter>,
  ));

  expect(container.querySelector("#progress-parcours")).toBeNull();
  expect(container.textContent).toContain("Parcours A");
});

it("masque les préférences et niveaux quand aucun contenu n'est rattaché", () => {
  mockProgressQuery([], false);
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);

  act(() => root?.render(
    <MemoryRouter initialEntries={["/student/mon-avancement"]}>
      <MyProgress />
    </MemoryRouter>,
  ));

  expect(container.textContent).toContain("Aucun parcours disponible.");
  expect(container.textContent).not.toContain("Mes préférences et niveaux");
});

it.each(["not_started", "in_progress"] as const)(
  "masque les préférences et niveaux tant que l'onboarding n'est pas terminé (%s)",
  (status) => {
    mockProgressQuery([{ id: 1, title: "Parcours A", modules: [] }], true, status);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);

    act(() => root?.render(
      <MemoryRouter initialEntries={["/student/mon-avancement"]}>
        <MyProgress />
      </MemoryRouter>,
    ));

    expect(container.textContent).toContain("Parcours A");
    expect(container.textContent).not.toContain("Mes préférences et niveaux");
  },
);
