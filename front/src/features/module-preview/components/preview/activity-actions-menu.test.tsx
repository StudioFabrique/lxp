import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import ActivityActionsMenu from "./activity-actions-menu";
import { AbilityContext } from "../../../../rbac/AbilityProvider";
import { createAppAbility } from "../../../../rbac/ability";
import { DemoContext, DEFAULT_DEMO_CONFIG } from "../../../../store/DemoContext";
import type { Activity } from "../../../../../src/utils/interfaces/activity";

const renderMenu = (type: Activity["type"]) =>
  renderToStaticMarkup(
    <DemoContext
      value={{ ...DEFAULT_DEMO_CONFIG, demoMode: false, isConfigLoaded: true }}
    >
      <AbilityContext
        value={createAppAbility([
          { action: "update", subject: "lesson" },
          { action: "delete", subject: "lesson" },
        ])}
      >
        <ActivityActionsMenu
          activity={{ type } as Activity}
          onEditActivity={vi.fn()}
          onOpenDeleteModal={vi.fn()}
        />
      </AbilityContext>
    </DemoContext>,
  );

describe("ActivityActionsMenu", () => {
  it.each(["image", "video", "resource"] as const)(
    "propose la modification inline pour %s",
    (type) => {
      expect(renderMenu(type)).toContain('data-tip="Modifier"');
    },
  );
});
