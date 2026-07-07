import { configureStore } from "@reduxjs/toolkit";

import tagsSlice from "./tags";
import courseInfosSlice from "./course/course-infos";
import courseObjectivesSlice from "./course/course-objectives";
import courseSkillsSlice from "./course/course-skills";
import courseScenarioSlice from "./course/course-scenario";
import courseDatesSlice from "./course/course-dates";
import lessonSlice from "./lesson/lesson";

const store = configureStore({
  reducer: {
    tags: tagsSlice.reducer,
    courseInfos: courseInfosSlice.reducer,
    courseObjectives: courseObjectivesSlice.reducer,
    courseSkills: courseSkillsSlice.reducer,
    courseScenario: courseScenarioSlice.reducer,
    courseDates: courseDatesSlice.reducer,
    lesson: lessonSlice.reducer,
  },
});

export default store;
