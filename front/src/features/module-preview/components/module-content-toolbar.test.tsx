import { act, createRef, type ComponentProps, type ReactNode } from "react";
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
    progressRef: createRef<HTMLDivElement>(),
    isSidebarCollapsed: false,
    isContentSelected: true,
    canPlanCourses: true,
    isCalendarView: false,
    isCalendarSaving: false,
    canReorderCourses: true,
    isReorderingCourses: false,
    showPublishAll: true,
    isPublishingAll: false,
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
  it("affiche les actions disponibles dans un ordre stable", () => {
    const container = document.createElement("div");
    renderToolbar(container);

    const labels = Array.from(container.querySelectorAll("button")).map(
      (button) => button.getAttribute("aria-label") ?? button.textContent,
    );
    expect(labels).toEqual([
      "Réduire le panneau",
      "Réorganiser les cours",
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
});
