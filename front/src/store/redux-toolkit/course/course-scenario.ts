import { createSlice } from "@reduxjs/toolkit";
import Lesson from "../../../utils/interfaces/lesson";
import { sortArray } from "../../../utils/sortArray";

interface CourseScenario {
  scenario: boolean;
  courseLessons: Lesson[] | null;
}

const initialCourseScenarioState: CourseScenario = {
  scenario: true,
  courseLessons: [],
};

const courseScenarioSlice = createSlice({
  name: "courseScenario",
  initialState: initialCourseScenarioState,
  reducers: {
    initData(state, action) {
      state.scenario = action.payload.scenario;
      state.courseLessons = action.payload.lessons;
    },
    setScenario(state, action) {
      state.scenario = action.payload;
    },
    newLesson(state, action) {
      if (state.courseLessons) {
        state.courseLessons = sortArray(
          [...state.courseLessons, action.payload],
          "id",
          false
        );
      }
    },
    deleteLesson(state, action) {
      if (state.courseLessons) {
        state.courseLessons = state.courseLessons?.filter(
          (lesson) => lesson.id !== action.payload
        );
      }
    },
    updateLesson(state, action) {
      if (state.courseLessons) {
        const lesson = state.courseLessons.find(
          (item) => item.id === action.payload.id
        );
        if (lesson) {
          let updatedLessons = state.courseLessons.filter(
            (item) => item.id !== action.payload.id
          );
          updatedLessons = [...updatedLessons, action.payload];
          state.courseLessons = sortArray(updatedLessons, "createdAt", false);
        }
      }
    },
  },
});

export const courseScenarioActions = courseScenarioSlice.actions;

export default courseScenarioSlice;
