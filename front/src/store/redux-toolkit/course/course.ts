import { createSlice } from "@reduxjs/toolkit";
import Module from "../../../utils/interfaces/module";

interface CourseType {
  id: number | null;
  title: string | null;
  module: Module | null;
}

const initialCourseState: CourseType = {
  id: null,
  title: null,
  module: null,
};

const courseSlice = createSlice({
  name: "course",
  initialState: initialCourseState,
  reducers: {
    setCourse(state, action) {
      state.id = action.payload.id;
      state.title = action.payload.title;
      state.module = action.payload.module;
    },
  },
});

export const courseAction = courseSlice.actions;

export default courseSlice;
