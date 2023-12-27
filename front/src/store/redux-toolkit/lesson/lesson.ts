import { createSlice } from "@reduxjs/toolkit";
import Lesson from "../../../utils/interfaces/lesson";
import Activity from "../../../utils/interfaces/activity";

interface LessonsType {
  lesson: Lesson | null;
  currentType: string;
  blogEdition: number | null;
  activityToDelete: Activity | null;
}

const initialLessonsState: LessonsType = {
  lesson: null,
  currentType: "",
  blogEdition: null,
  activityToDelete: null,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState: initialLessonsState,
  reducers: {
    initLesson(state, action) {
      state.lesson = action.payload;
    },
    addActivity(state, action) {
      if (state.lesson && state.lesson.activities !== undefined) {
        state.lesson = {
          ...state.lesson,
          activities: [...state.lesson.activities, action.payload],
        };
      }
    },
    setActivityToDelete(state, action) {
      state.activityToDelete = action.payload;
    },
    setCurrentType(state, action) {
      state.currentType = action.payload;
    },
    setBlogEdition(state, action) {
      state.blogEdition = action.payload;
    },
    updateActivity(state, action) {
      const updatedActivity: Activity = action.payload;
      if (state.lesson && state.lesson.activities !== undefined) {
        const updatedActivities: Activity[] = state.lesson.activities.filter(
          (item) => item.id !== updatedActivity.id
        );
        const updatedLesson: Lesson = {
          ...state.lesson,
          activities: [...updatedActivities, updatedActivity],
        };
        state.lesson = updatedLesson;
        console.log("updated lesson : ", state.lesson);
      }
    },
    removeActivity(state, action) {
      const activities = state.lesson?.activities?.filter(
        (item) => item.id !== action.payload
      );
      if (state.lesson) {
        state.lesson = { ...state.lesson, activities };
      }
    },
    resetCurrentType(state) {
      state.currentType = "";
    },
    resetLesson(state) {
      state.lesson = null;
      state.currentType = "";
      state.blogEdition = null;
    },
  },
});

export const lessonActions = lessonSlice.actions;

export default lessonSlice;
