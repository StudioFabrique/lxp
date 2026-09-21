import { describe, expect, it } from "vitest";
import type Module from "../../../utils/interfaces/module";
import type Lesson from "../../../utils/interfaces/lesson";
import type { Activity } from "../../../utils/interfaces/activity";
import {
  initialModuleContentState,
  moduleContentReducer,
  type ModuleContentState,
} from "./module-content-reducer";

describe("moduleContentReducer", () => {
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

    const state = moduleContentReducer(
      {
        ...initialModuleContentState,
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
    expect(state.lessonIdToScroll).toBe(5);
  });

  it("consomme la demande de scroll après avoir affiché la leçon ciblée", () => {
    const state = moduleContentReducer(
      {
        ...initialModuleContentState,
        lessonIdToScroll: 5,
      },
      { type: "acknowledge_lesson_scroll", lessonId: 5 },
    );

    expect(state.lessonIdToScroll).toBeUndefined();
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

    const state = moduleContentReducer(
      {
        ...initialModuleContentState,
        module,
        selectedLesson: currentLesson,
      },
      { type: "go_to_next_lesson" },
    );

    expect(state.selectedLesson?.id).toBe(3);
    expect(state.mode).toBe("read");
  });

  it("réordonne les cours et recalcule leur ordre", () => {
    const module = {
      id: 2,
      courses: [
        { id: 10, order: 0, lessons: [] },
        { id: 11, order: 1, lessons: [] },
        { id: 12, order: 2, lessons: [] },
      ],
    } as unknown as Module & { parcours: string };

    const state = moduleContentReducer(
      { ...initialModuleContentState, module },
      { type: "reorder_course", fromIndex: 0, toIndex: 2 },
    );

    expect(state.module?.courses.map(({ id, order }) => ({ id, order }))).toEqual([
      { id: 11, order: 0 },
      { id: 12, order: 1 },
      { id: 10, order: 2 },
    ]);
  });

  it.each([
    { fromIndex: -1, toIndex: 1 },
    { fromIndex: 3, toIndex: 0 },
    { fromIndex: 0, toIndex: 3 },
  ])("ignore un réordonnancement de cours invalide ($fromIndex → $toIndex)", (action) => {
    const module = {
      id: 2,
      courses: [
        { id: 10, order: 0, lessons: [] },
        { id: 11, order: 1, lessons: [] },
        { id: 12, order: 2, lessons: [] },
      ],
    } as unknown as Module & { parcours: string };
    const initialState = { ...initialModuleContentState, module };

    const state = moduleContentReducer(initialState, {
      type: "reorder_course",
      ...action,
    });

    expect(state).toBe(initialState);
    expect(state.module?.courses.every(Boolean)).toBe(true);
  });

  it("ignore une URL iframe inchangée en mode édition", () => {
    const activity = {
      id: 10,
      type: "iframe" as const,
      url: "https://example.com/embed",
    };
    const initialState: ModuleContentState = {
      ...initialModuleContentState,
      mode: "edit",
      selectedActivity: activity as unknown as Activity,
    };

    const state = moduleContentReducer(initialState, {
      type: "update_activity_iframe_src",
      src: activity.url,
    });

    expect(state).toBe(initialState);
  });

  it("ignore une URL iframe inchangée en mode création", () => {
    const initialState = {
      ...initialModuleContentState,
      mode: "write" as const,
      activityType: "iframe" as const,
      newActivitySrc: "https://example.com/embed",
    };

    const state = moduleContentReducer(initialState, {
      type: "update_activity_iframe_src",
      src: initialState.newActivitySrc,
    });

    expect(state).toBe(initialState);
  });

  it.each(["image", "video", "resource"] as const)(
    "ouvre l'éditeur inline pour une activité %s",
    (activityType) => {
      const state = moduleContentReducer(
        initialModuleContentState,
        { type: "select_mode", mode: "write", activityType },
      );

      expect(state.mode).toBe("write");
      expect(state.mode === "write" && state.activityType === activityType).toBe(
        true,
      );
    },
  );
});
