import { createSlice } from "@reduxjs/toolkit";
import Lesson from "../../../utils/interfaces/lesson";

type LessonState = {
  lesson: Lesson | null;
};

const initialLessonsState: LessonState = {
  lesson: null,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState: initialLessonsState,
  reducers: {
    setLesson(state, action) {
      state.lesson = action.payload;
    },
  },
});

export const lessonActions = lessonSlice.actions;

export default lessonSlice;
