import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, expect, it, vi } from "vitest";
import { AbilityContext } from "../../../../rbac/AbilityProvider";
import { createAppAbility } from "../../../../rbac/ability";
import type { Activity } from "../../../../utils/interfaces/activity";
import ActivityList from "./activity-list";

vi.mock("../../../../components/guards/PermissionGuard", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

const roots: Root[] = [];
const activities = [
  { id: 1, type: "text", title: "Première activité" },
  { id: 2, type: "text", title: "Deuxième activité" },
] as Activity[];

afterEach(() => {
  roots.splice(0).forEach((root) => act(() => root.unmount()));
});

it("active le déplacement uniquement après le clic sur Réorganiser les activités", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  roots.push(root);
  const onSelectActivity = vi.fn();

  act(() => root.render(
    <AbilityContext value={createAppAbility([{ action: "update", subject: "lesson" }])}>
      <ActivityList
        lessonId={10}
        activities={activities}
        canEdit
        isLoading={false}
        onSelectActivity={onSelectActivity}
        onActivityReorder={vi.fn()}
        onClickCreateActivity={vi.fn()}
      />
    </AbilityContext>,
  ));

  const firstActivity = container.querySelector<HTMLButtonElement>("button.btn-ghost.justify-start")!;
  expect(container.querySelector(".lucide-grip-vertical")).toBeNull();
  act(() => firstActivity.click());
  expect(onSelectActivity).toHaveBeenCalledOnce();

  const reorderButton = container.querySelector<HTMLButtonElement>('button[aria-label="Réorganiser les activités"]')!;
  act(() => reorderButton.click());
  expect(reorderButton.getAttribute("aria-pressed")).toBe("true");
  expect(container.querySelectorAll(".lucide-grip-vertical")).toHaveLength(2);
  expect(container.textContent).not.toContain("Ajouter une activité");

  act(() => firstActivity.click());
  expect(onSelectActivity).toHaveBeenCalledOnce();

  act(() => reorderButton.click());
  expect(container.querySelector(".lucide-grip-vertical")).toBeNull();
  expect(container.textContent).toContain("Ajouter une activité");
});

it("signale le mode de réorganisation à la barre latérale", () => {
  const container = document.createElement("div");
  const root = createRoot(container);
  roots.push(root);
  const onChange = vi.fn();
  const render = (active: boolean) => root.render(
    <AbilityContext value={createAppAbility([{ action: "update", subject: "lesson" }])}>
      <ActivityList
        lessonId={10}
        activities={activities}
        canEdit
        isLoading={false}
        isReorderingActivities={active}
        onReorderingActivitiesChange={onChange}
      />
    </AbilityContext>,
  );

  act(() => render(false));
  act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Réorganiser les activités"]')!.click());
  expect(onChange).toHaveBeenCalledWith(true);

  act(() => render(true));
  expect(container.querySelectorAll(".lucide-grip-vertical")).toHaveLength(2);
  act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Terminer la réorganisation des activités"]')!.click());
  expect(onChange).toHaveBeenLastCalledWith(false);
});
