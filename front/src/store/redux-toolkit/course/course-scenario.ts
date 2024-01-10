import { createSlice } from "@reduxjs/toolkit";
import Lesson from "../../../utils/interfaces/lesson";
import { sortArray } from "../../../utils/sortArray";
import { arrayNoDoublon } from "../../../helpers/array-no-doublon";

interface CourseScenario {
  scenario: boolean;
  courseLessons: Lesson[] | null;
  submit: boolean;
}

const initialCourseScenarioState: CourseScenario = {
  scenario: true,
  courseLessons: [],
  submit: false,
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
          "order"
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
    reorderLessons(state, action) {
      let i = -1;
      const lessons = action.payload.map((item: Lesson) => {
        i += 1;
        return { ...item, order: i };
      });
      state.courseLessons = lessons;
      state.submit = true;
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
          state.courseLessons = sortArray(updatedLessons, "order", false);
        }
      }
    },
    addManyLessons(state, action) {
      if (!state.courseLessons || state.courseLessons.length === 0) {
        state.courseLessons = action.payload;
      } else {
        state.courseLessons = arrayNoDoublon(
          state.courseLessons,
          action.payload
        );
        let i = -1;
        state.courseLessons = state.courseLessons.map((item) => {
          i += 1;
          return { ...item, order: i };
        });
      }
    },
    resetCourseScenario(state) {
      state.scenario = true;
      state.courseLessons = null;
    },
    resetSubmit(state) {
      state.submit = false;
    },
  },
});

export const courseScenarioActions = courseScenarioSlice.actions;

export default courseScenarioSlice;
