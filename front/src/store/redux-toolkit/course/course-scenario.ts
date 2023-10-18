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
    addManyLessons(state, action) {
      if (!state.courseLessons || state.courseLessons.length === 0) {
        console.log(action.payload);

        state.courseLessons = action.payload;
      } else {
        let updatedLesson = Array<Lesson>();
        state.courseLessons.forEach((stateLesson) => {
          const lesson = action.payload.find(
            (item: Lesson) => (item.id = stateLesson.id)
          );
          if (!lesson) updatedLesson = [...updatedLesson, lesson];
        });
        state.courseLessons = sortArray(
          [...state.courseLessons, ...updatedLesson],
          "id"
        );
      }
    },
  },
});

export const courseScenarioActions = courseScenarioSlice.actions;

export default courseScenarioSlice;
