import { createSlice } from "@reduxjs/toolkit";
import Lesson from "../../../utils/interfaces/lesson";

interface LessonsType {
  lesson: Lesson | null;
  currentType: string;
}

const initialLessonsState: LessonsType = {
  lesson: null,
  currentType: "",
};

const lessonSlice = createSlice({
  name: "lesson",
  initialState: initialLessonsState,
  reducers: {
    initLesson(state, action) {
      state.lesson = action.payload;
    },
    setCurrentType(state, action) {
      state.currentType = action.payload;
    },
    resetCurrentType(state) {
      state.currentType = "";
    },
    resetLesson(state) {
      state.lesson = null;
      state.currentType = "";
    },
  },
});

export const lessonActions = lessonSlice.actions;

export default lessonSlice;
