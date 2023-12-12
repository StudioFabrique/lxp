import { createSlice } from "@reduxjs/toolkit";
import Lesson from "../../../utils/interfaces/lesson";

interface LessonsType {
  lesson: Lesson | null;
}

const initialLessonsState: LessonsType = {
  lesson: null,
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState: initialLessonsState,
  reducers: {
    initLesson(state, action) {
      state.lesson = action.payload;
    },
  },
});

export const lessonActions = lessonSlice.actions;

export default lessonSlice;
