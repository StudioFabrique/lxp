import { createSlice } from "@reduxjs/toolkit";

import Course from "../../../utils/interfaces/course";

interface CourseType {
  course: Course | null;
}

const initialCourseInfosState: CourseType = {
  course: null,
};

const courseInfosSlice = createSlice({
  name: "courseInfos",
  initialState: initialCourseInfosState,
  reducers: {
    setCourse(state, action) {
      state.course = action.payload;
    },
  },
});

export const courseInfosAction = courseInfosSlice.actions;

export default courseInfosSlice;
