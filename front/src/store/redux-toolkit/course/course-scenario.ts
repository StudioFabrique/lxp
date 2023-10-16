import { createSlice } from "@reduxjs/toolkit";
import Lesson from "../../../utils/interfaces/lesson";

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
  },
});

export const courseScenarioActions = courseScenarioSlice.actions;

export default courseScenarioSlice;
