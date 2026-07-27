import { describe, expect, it } from "vitest";
import type Module from "../../../utils/interfaces/module";
import type Lesson from "../../../utils/interfaces/lesson";
import {
  initialModuleExplorerContentState,
  moduleExplorerContentReducer,
} from "./module-explorer-reducer";

describe("moduleExplorerContentReducer", () => {
  it("preserves loaded activities when a chatbot source targets the selected lesson", () => {
    const loadedActivities = [
      {
        id: 10,
        url: "first.html",
        type: "text" as const,
        order: 1,
        createdAt: "",
        updatedAt: "",
      },
      {
        id: 11,
        url: "second.html",
        type: "text" as const,
        order: 2,
        createdAt: "",
        updatedAt: "",
      },
    ];
    const loadedLesson = {
      id: 5,
      activities: loadedActivities,
    } as Lesson;
    const limitedModule = {
      id: 2,
      courses: [
        {
          lessons: [{ id: 5, activities: [] }],
        },
      ],
    } as unknown as Module & { parcours: string };

    const state = moduleExplorerContentReducer(
      {
        ...initialModuleExplorerContentState,
        module: limitedModule,
        selectedLesson: loadedLesson,
        selectedActivity: loadedActivities[0],
      },
      {
        type: "select_content_by_id",
        lessonId: 5,
        activityId: 11,
      },
    );

    expect(state.selectedLesson).toBe(loadedLesson);
    expect(state.selectedLesson?.activities).toEqual(loadedActivities);
    expect(state.selectedActivity?.id).toBe(11);
  });
});
