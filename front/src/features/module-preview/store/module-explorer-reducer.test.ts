import { describe, expect, it } from "vitest";
import type Module from "../../../utils/interfaces/module";
import type Lesson from "../../../utils/interfaces/lesson";
import type { Activity } from "../../../utils/interfaces/activity";
import {
  initialModuleExplorerContentState,
  moduleExplorerContentReducer,
  type ModuleExplorerContentState,
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

  it("passe à la première leçon du cours suivant", () => {
    const currentLesson = { id: 2, activities: [] } as unknown as Lesson;
    const nextCourseLesson = { id: 3, activities: [] } as unknown as Lesson;
    const module = {
      id: 2,
      courses: [
        {
          id: 10,
          lessons: [{ id: 1, activities: [] }, currentLesson],
        },
        { id: 11, lessons: [nextCourseLesson] },
      ],
    } as unknown as Module & { parcours: string };

    const state = moduleExplorerContentReducer(
      {
        ...initialModuleExplorerContentState,
        module,
        selectedLesson: currentLesson,
      },
      { type: "go_to_next_lesson" },
    );

    expect(state.selectedLesson?.id).toBe(3);
    expect(state.mode).toBe("read");
  });

  it("ignore une URL iframe inchangée en mode édition", () => {
    const activity = {
      id: 10,
      type: "iframe" as const,
      url: "https://example.com/embed",
    };
    const initialState: ModuleExplorerContentState = {
      ...initialModuleExplorerContentState,
      mode: "edit",
      selectedActivity: activity as unknown as Activity,
    };

    const state = moduleExplorerContentReducer(initialState, {
      type: "update_activity_iframe_src",
      src: activity.url,
    });

    expect(state).toBe(initialState);
  });

  it("ignore une URL iframe inchangée en mode création", () => {
    const initialState = {
      ...initialModuleExplorerContentState,
      mode: "write" as const,
      activityType: "iframe" as const,
      newActivitySrc: "https://example.com/embed",
    };

    const state = moduleExplorerContentReducer(initialState, {
      type: "update_activity_iframe_src",
      src: initialState.newActivitySrc,
    });

    expect(state).toBe(initialState);
  });

  it.each(["image", "video", "resource"] as const)(
    "ouvre l'éditeur inline pour une activité %s",
    (activityType) => {
      const state = moduleExplorerContentReducer(
        initialModuleExplorerContentState,
        { type: "select_mode", mode: "write", activityType },
      );

      expect(state.mode).toBe("write");
      expect(state.mode === "write" && state.activityType === activityType).toBe(
        true,
      );
    },
  );
});
