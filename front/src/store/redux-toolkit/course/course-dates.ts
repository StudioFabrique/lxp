import { createSlice } from "@reduxjs/toolkit";

interface CourseDates {
  courseDates: CourseDates[] | null;
  currentDates: CourseDates | null;
}

const initialCourseDates: CourseDates = {
  courseDates: null,
  currentDates: null,
};

const courseDatesSlice = createSlice({
  name: "courseDates",
  initialState: initialCourseDates,
  reducers: {},
});

export const courseDatesActions = courseDatesSlice.actions;

export default courseDatesSlice;
