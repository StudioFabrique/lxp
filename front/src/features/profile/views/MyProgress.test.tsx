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

afterEach(() => {
  if (root) act(() => root?.unmount());
  container?.remove();
  root = undefined;
  container = undefined;
  vi.clearAllMocks();
});

it("ouvre le parcours demandé et filtre les sections lors du changement", () => {
  vi.mocked(useQuery).mockReturnValue({
    data: [
      { id: 1, title: "Parcours A", modules: [{ id: 11, title: "Module A", stats: { progress: 25 } }] },
      { id: 2, title: "Parcours B", modules: [{ id: 22, title: "Module B", stats: { progress: 75 } }] },
    ],
    isLoading: false,
    isError: false,
  } as never);
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

  act(() => {
    select.value = "1";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });

  expect(container.textContent).toContain("Module A");
  expect(container.textContent).not.toContain("Module B");
  expect(container.querySelector("[data-search='?parcoursId=1']")).not.toBeNull();
});

it("masque le filtre lorsqu'un seul parcours est associé", () => {
  vi.mocked(useQuery).mockReturnValue({
    data: [{ id: 1, title: "Parcours A", modules: [] }],
    isLoading: false,
    isError: false,
  } as never);
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
