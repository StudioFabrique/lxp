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
      console.log("payload", action.payload);

      state.course = action.payload;
      console.log("state", state.course);
    },
    setCourseInfos(state, action) {
      if (state.course) {
        state.course = {
          ...state.course,
          title: action.payload.title,
          description: action.payload.description,
          visibility: action.payload.visibility,
        };
      }
    },
    setCourseTags(state, action) {
      if (state.course) {
        state.course = {
          ...state.course,
          tags: action.payload,
        };
      }
    },
    setCourseContacts(state, action) {
      if (state.course) {
        state.course = {
          ...state.course,
          contacts: action.payload,
        };
      }
    },
    setCourseVirtualClass(state, action) {
      if (state.course) {
        state.course = {
          ...state.course,
          virtualClass: action.payload,
        };
      }
    },
    resetCourse(state) {
      state.course = null;
    },
  },
});

export const courseInfosAction = courseInfosSlice.actions;

export default courseInfosSlice;
