import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LessonReaderAndEditor from "./lesson-reader-and-editor";
import { act, type ComponentProps } from "react";
import { createRoot } from "react-dom/client";
vi.mock("../../../lesson/components/edit/activities/video", () => ({ default: ({ parent, parentId }: { parent: string; parentId: number }) => <div data-editor="video" data-parent={parent} data-parent-id={parentId} /> }));
vi.mock("../../../lesson/components/edit/activities/image/image-activity-editor", () => ({ default: ({ parent, parentId }: { parent: string; parentId: number }) => <div data-editor="image" data-parent={parent} data-parent-id={parentId} /> }));
vi.mock("../../../lesson/components/edit/activities/resources/resource-upload", () => ({ default: ({ parent, parentId }: { parent: string; parentId: number }) => <div data-editor="resource" data-parent={parent} data-parent-id={parentId} /> }));
vi.mock("../../../lesson/components/edit/activities/activity-header", () => ({ default: () => <div data-activity-header /> }));
vi.mock("./activity-preview", () => ({ default: () => <div data-activity-preview /> }));
const props = {
  mode: "write", canEdit: true, isLessonCompleted: false, showDeleteModal: false,
  onEditTitle: vi.fn(), onEditContent: vi.fn(), onEditIframeSrc: vi.fn(), onRateActivity: vi.fn(),
  onEditActivity: vi.fn(), onOpenDeleteModal: vi.fn(), onDeleteActivity: vi.fn(), onCloseDeleteModal: vi.fn(),
  onClose: vi.fn(), onBack: vi.fn(), onRefreshActivity: vi.fn(), onSaveActivity: vi.fn(),
} satisfies Omit<ComponentProps<typeof LessonReaderAndEditor>, "activityType">;
describe("Éditeurs communs des activités", () => {
  it("conserve le header monté pendant le chargement d’une autre activité", () => {
    const container = document.createElement("div");
    const root = createRoot(container);
    const render = (isActivityContentLoading: boolean) => act(() => root.render(
      <LessonReaderAndEditor {...props} mode="read" activityType="image"
        isActivityContentLoading={isActivityContentLoading} />,
    ));
    try {
      render(false);
      const header = container.querySelector("[data-activity-header]");
      expect(header).not.toBeNull();
      render(true);
      expect(container.querySelector("[data-activity-header]")).toBe(header);
      expect(container.querySelector('[role="status"]')).not.toBeNull();
      expect(container.querySelector("[data-activity-preview]")).toBeNull();
      render(false);
      expect(container.querySelector("[data-activity-header]")).toBe(header);
      expect(container.querySelector('[role="status"]')).toBeNull();
      expect(container.querySelector("[data-activity-preview]")).not.toBeNull();
    } finally {
      act(() => root.unmount());
    }
  });
  it.each(["video", "image", "resource"] as const)("rattache les nouvelles activités %s à la ressource", (activityType) => {
    const html = renderToStaticMarkup(<LessonReaderAndEditor {...props} activityType={activityType} parent="resource" parentId={7} />);
    expect(html).toContain('data-parent="resource"');
    expect(html).toContain('data-parent-id="7"');
  });
  it.each(["video", "image", "resource"] as const)("conserve le parent leçon par défaut pour %s", (activityType) => {
    const html = renderToStaticMarkup(<LessonReaderAndEditor {...props} activityType={activityType} selectedLesson={{ id: 9 } as ComponentProps<typeof LessonReaderAndEditor>["selectedLesson"]} />);
    expect(html).toContain('data-parent="lesson"');
    expect(html).toContain('data-parent-id="9"');
  });
});
