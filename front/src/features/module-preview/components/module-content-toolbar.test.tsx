import { act, type ComponentProps, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import ModuleContentToolbar from "./module-content-toolbar";

vi.mock("../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

vi.mock("../../../components/guards/RoleRankGuard", () => ({
  default: ({ children }: { children: ReactNode }) => children,
}));

const roots: Root[] = [];

const renderToolbar = (
  container: HTMLDivElement,
  overrides: Partial<ComponentProps<typeof ModuleContentToolbar>> = {},
) => {
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

  act(() => root.render(<ModuleContentToolbar {...props} />));
  return props;
};

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
});

describe("ModuleContentToolbar", () => {
  it.each([false, true])("demande confirmation avant de changer la visibilité (visible : %s)", async (visible) => {
    const container = document.createElement("div");
    const onToggleCourseVisibility = vi.fn().mockResolvedValue(undefined);
    renderToolbar(container, { areAllCoursesVisible: visible, onToggleCourseVisibility });
    const label = visible ? "Rendre tous les cours invisibles" : "Rendre tous les cours visibles";
    act(() => container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)?.click());
    expect(onToggleCourseVisibility).not.toHaveBeenCalled();
    expect(container.querySelector("dialog")?.textContent).toContain(
      visible ? "Êtes-vous sûr de rendre invisibles tous les cours ?" : "Êtes-vous sûr de rendre visibles tous les cours ?",
    );
    act(() => Array.from(container.querySelectorAll("dialog button")).find((button) => button.textContent === "Annuler")?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(container.querySelector("dialog")).toBeNull();
    expect(onToggleCourseVisibility).not.toHaveBeenCalled();
    act(() => container.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)?.click());
    await act(async () => Array.from(container.querySelectorAll<HTMLButtonElement>("dialog button")).find((button) => button.textContent === "Confirmer")?.click());
    expect(onToggleCourseVisibility).toHaveBeenCalledWith(!visible);
    expect(container.querySelector("dialog")).toBeNull();
  });

  it("affiche les actions disponibles dans un ordre stable", () => {
    const container = document.createElement("div");
    renderToolbar(container);

    const labels = Array.from(container.querySelectorAll("button")).map(
      (button) => button.getAttribute("aria-label") ?? button.textContent,
    );
    expect(labels).toEqual([
      "Réduire le panneau",
      "Réorganiser les cours",
      "Rendre tous les cours visibles",
      "Calendrier",
      "Tout publier",
      "Tout réduire",
    ]);
  });

  it("masque les actions qui ne sont pas disponibles", () => {
    const container = document.createElement("div");
    renderToolbar(container, {
      canPlanCourses: false,
      canReorderCourses: false,
      showPublishAll: false,
      showCourseVisibility: false,
      isContentSelected: false,
    });

    expect(container.querySelectorAll("button")).toHaveLength(1);
  });

  it("transmet les interactions sans porter la logique métier", () => {
    const container = document.createElement("div");
    const onToggleCourseReordering = vi.fn();
    renderToolbar(container, { onToggleCourseReordering });

    act(() => {
      container
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Réorganiser les cours"]',
        )
        ?.click();
    });

    expect(onToggleCourseReordering).toHaveBeenCalledOnce();
  });

  it("conserve l'icône de réorganisation dans l'état actif", () => {
    const container = document.createElement("div");
    renderToolbar(container, { isReorderingCourses: true });

    const button = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Terminer la réorganisation"]',
    );

    expect(button).not.toBeNull();
    expect(button?.classList.contains("btn-primary")).toBe(true);
    expect(
      button
        ?.querySelector("svg")
        ?.classList.contains("lucide-arrow-down-up"),
    ).toBe(true);
    expect(button?.querySelector(".lucide-check")).toBeNull();
  });

  it("désactive Tout réduire lorsque le calendrier est ouvert", () => {
    const container = document.createElement("div");
    const onCloseContent = vi.fn();
    renderToolbar(container, { isCalendarView: true, onCloseContent });

    const button = container.querySelector<HTMLButtonElement>('button[aria-label="Tout réduire"]');
    expect(button?.disabled).toBe(true);
    act(() => button?.click());
    expect(onCloseContent).not.toHaveBeenCalled();
  });
});
