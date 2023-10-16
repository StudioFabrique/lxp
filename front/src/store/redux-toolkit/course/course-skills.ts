import { createSlice } from "@reduxjs/toolkit";
import Skill from "../../../utils/interfaces/skill";

interface CourseSKills {
  moduleSkills: Skill[] | null;
  courseSkills: Skill[] | null;
}

const initialCourseSkillsState: CourseSKills = {
  moduleSkills: null,
  courseSkills: null,
};

const courseSkillsSlice = createSlice({
  name: "courseSkills",
  initialState: initialCourseSkillsState,
  reducers: {
    initData(state, action) {
      console.log("payload", action.payload);

      state.courseSkills = action.payload.courseSkills;
      state.moduleSkills = action.payload.moduleSkills;
    },
    setCourseSkills(state, action) {
      state.courseSkills = action.payload;
    },
  },
});

export const courseSkillsActiions = courseSkillsSlice.actions;

export default courseSkillsSlice;
