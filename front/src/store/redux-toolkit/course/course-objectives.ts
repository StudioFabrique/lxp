import { createSlice } from "@reduxjs/toolkit";
import Objective from "../../../utils/interfaces/objective";

interface CourseObjectives {
  parcoursObjectives: Objective[] | null;
  courseObjectives: Objective[] | null;
}

const initialCourseObjectivesState: CourseObjectives = {
  parcoursObjectives: null,
  courseObjectives: null,
};

const courseObjectivesSlice = createSlice({
  name: "courseObjectives",
  initialState: initialCourseObjectivesState,
  reducers: {
    initData(state, action) {
      state.courseObjectives = action.payload.courseObjectives;
      state.parcoursObjectives = action.payload.parcoursObjectives;
    },
    setCourseObjectives(state, action) {
      state.courseObjectives = action.payload;
    },
    updateCoursesObjectives(state, action) {
      if (state.courseObjectives && state.parcoursObjectives) {
        state.parcoursObjectives = [
          ...state.parcoursObjectives,
          action.payload,
        ];
        state.courseObjectives = [...state.courseObjectives, action.payload];
      }
    },
  },
});

export const courseObjectivesActions = courseObjectivesSlice.actions;

export default courseObjectivesSlice;
