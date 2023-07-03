import { createSlice } from "@reduxjs/toolkit";

import Skill from "../../utils/interfaces/skill";

const initialParcoursState = {
  skills: Array<Skill>(),
};

const parcoursSlice = createSlice({
  name: "parcours",
  initialState: initialParcoursState,
  reducers: {
    addSkill(state) {},
    deleteSkill(state, action) {},
    editSkillBadge(state, action) {},
  },
});

export const paginationActions = parcoursSlice.actions;

export default parcoursSlice;
