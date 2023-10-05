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
    setCourseInfos(state, action) {
      if (state.course) {
        state.course = {
          ...state.course,
          title: action.payload.title,
          description: action.payload.description,
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
    setCourseVisibility(state, action) {
      if (state.course) {
        state.course = {
          ...state.course,
          visibility: action.payload,
        };
      }
    },
  },
});

export const courseInfosAction = courseInfosSlice.actions;

export default courseInfosSlice;
