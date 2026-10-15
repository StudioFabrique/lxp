import { act, type ComponentProps, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import ModuleContentToolbar from "./module-content-toolbar";
import SidebarMobile from "../../../components/sidebar/SidebarMobile";
import { MobileHeaderActionsProvider } from "../../../store/MobileHeaderActionsProvider";

vi.mock("../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("../../../components/guards/RoleRankGuard", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("../../../components/sidebar/SidebarWrapper", () => ({ default: () => null }));
vi.mock("../../../components/sidebar/SidebarLogo", () => ({ default: () => <svg /> }));
vi.mock("../../../store/VisualPreferences", () => ({
  useVisualPreferences: () => ({ animations: false }),
}));

vi.mock("../../../hooks/useInstanceBranding", () => ({
  useInstanceBranding: () => ({ logoUrl: null, backgroundColor: undefined, websiteUrl: null }),
}));

const roots: Root[] = [];

const mockViewport = (isMobile: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches: isMobile && query.includes("max-width"),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
};

const renderToolbar = (
  overrides: Partial<ComponentProps<typeof ModuleContentToolbar>> = {},
) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  const props: ComponentProps<typeof ModuleContentToolbar> = {
    progress: <span>Progression</span>,
    isSidebarCollapsed: false,
    isContentSelected: true,
    canPlanCourses: true,
    isCalendarView: false,
    isCalendarSaving: false,
    canReorderCourses: true,
    isReorderingCourses: false,
    showPublishAll: true,
    isPublishingAll: false,
    showCourseVisibility: true,
    areAllCoursesVisible: false,
    isUpdatingCourseVisibility: false,
    onToggleCourseVisibility: vi.fn(),
    onToggleSidebar: vi.fn(),
    onToggleCalendar: vi.fn(),
    onToggleCourseReordering: vi.fn(),
    onPublishAll: vi.fn(),
    onCloseContent: vi.fn(),
    ...overrides,
  };
  act(() => {
    root.render(
      <MemoryRouter initialEntries={["/admin/parcours"]}>
        <MobileHeaderActionsProvider>
          <SidebarMobile interfaceType="admin">{null}</SidebarMobile>
          <div data-testid="page">
            <ModuleContentToolbar {...props} />
          </div>
        </MobileHeaderActionsProvider>
      </MemoryRouter>,
    );
  });
  return { container, props };
};

const drawer = () => document.querySelector('[role="dialog"][aria-label="Actions de la page"]');
const drawerButtons = () =>
  Array.from(drawer()?.querySelectorAll<HTMLButtonElement>(".header-actions button") ?? []);
const drawerLabels = () => drawerButtons().map((button) => button.textContent?.trim());

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
  document.body.innerHTML = "";
});

describe("ModuleContentToolbar sur mobile", () => {
  it("retire la barre d'actions de la page et ne garde que la progression", () => {
    mockViewport(true);
    renderToolbar();

    const page = document.querySelector('[data-testid="page"]')!;
    expect(page.querySelectorAll("button")).toHaveLength(0);
    expect(page.textContent).toBe("Progression");
  });

  it("n'affiche aucune zone vide quand il n'y a pas de progression", () => {
    mockViewport(true);
    renderToolbar({ progress: null });

    expect(document.querySelector('[data-testid="page"]')!.childElementCount).toBe(1);
    expect(document.querySelector('[data-testid="page"] .empty\\:hidden')?.textContent).toBe("");
  });

  it("dépose les actions, avec leur libellé, dans le tiroir de la barre du haut", () => {
    mockViewport(true);
    renderToolbar();

    expect(drawerLabels()).toEqual([
      "Calendrier",
      "Rendre tous les cours visibles",
      "Tout publier",
      "Retour à la présentation du module",
    ]);
    expect(
      document.querySelector('button[aria-label="Ouvrir les actions de la page"]'),
    ).not.toBeNull();
  });

  it("n'y met pas la réorganisation des cours, qui agit sur la liste absente du mobile", () => {
    mockViewport(true);
    renderToolbar({ canReorderCourses: true });

    expect(drawerLabels().join()).not.toContain("Réorganiser");
  });

  it("propose le masquage de la liste des cours seulement en vue calendrier", () => {
    mockViewport(true);
    renderToolbar({ isCalendarView: true, isSidebarCollapsed: false });

    expect(drawerLabels()).toContain("Masquer la liste des cours");
  });

  it("transmet les actions et demande confirmation avant de changer la visibilité", async () => {
    mockViewport(true);
    const onPublishAll = vi.fn();
    const onToggleCourseVisibility = vi.fn().mockResolvedValue(undefined);
    renderToolbar({ onPublishAll, onToggleCourseVisibility });

    const button = (label: string) =>
      drawerButtons().find((candidate) => candidate.textContent?.trim() === label)!;

    act(() => button("Tout publier").click());
    expect(onPublishAll).toHaveBeenCalledOnce();

    act(() => button("Rendre tous les cours visibles").click());
    expect(onToggleCourseVisibility).not.toHaveBeenCalled();
    expect(document.querySelector("dialog")?.textContent).toContain(
      "Êtes-vous sûr de rendre visibles tous les cours ?",
    );
    await act(async () =>
      Array.from(document.querySelectorAll<HTMLButtonElement>("dialog button"))
        .find((candidate) => candidate.textContent === "Confirmer")
        ?.click(),
    );
    expect(onToggleCourseVisibility).toHaveBeenCalledWith(true);
  });

  it("referme le tiroir une fois l'action choisie", () => {
    mockViewport(true);
    renderToolbar();

    act(() =>
      document
        .querySelector<HTMLButtonElement>('button[aria-label="Ouvrir les actions de la page"]')!
        .click(),
    );
    expect(drawer()?.getAttribute("aria-modal")).toBe("true");

    act(() =>
      drawerButtons()
        .find((candidate) => candidate.textContent?.trim() === "Tout publier")!
        .click(),
    );

    expect(drawer()?.getAttribute("aria-modal")).toBe("false");
  });

  it("garde la barre d'outils habituelle hors mobile", () => {
    mockViewport(false);
    renderToolbar();

    const page = document.querySelector('[data-testid="page"]')!;
    expect(page.querySelector('button[aria-label="Réorganiser les cours"]')).not.toBeNull();
    expect(drawerLabels()).toEqual([]);
  });
});
