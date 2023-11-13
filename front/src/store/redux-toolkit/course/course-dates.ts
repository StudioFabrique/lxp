import { createSlice } from "@reduxjs/toolkit";

import CourseDates from "../../../utils/interfaces/course-dates";

interface CourseDatesState {
  courseDates: CourseDates[] | null;
  currentDates: CourseDates | null;
}

const initialCourseDates: CourseDatesState = {
  courseDates: null,
  currentDates: null,
};

const courseDatesSlice = createSlice({
  name: "courseDates",
  initialState: initialCourseDates,
  reducers: {
    setCourseDates(state, action) {
      state.courseDates = action.payload;
    },
    setCurrentDates(state, action) {
      console.log(action.payload);

      if (state.courseDates) {
        state.currentDates = {
          ...action.payload,
          id: state.courseDates[state.courseDates.length + 1],
        };
      } else {
        state.courseDates = { ...action.payload, id: 1 };
      }
    },
    deleteCourseDates(state, action) {
      if (state.courseDates) {
        state.courseDates = state.courseDates.filter(
          (item: CourseDates) => item.id !== action.payload
        );
      }
    },
    resetDates(state) {
      state.currentDates = null;
      state.courseDates = null;
    },
  },
});

export const courseDatesActions = courseDatesSlice.actions;

export default courseDatesSlice;
