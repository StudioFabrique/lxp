import { createSlice } from "@reduxjs/toolkit";

import Skill from "../../utils/interfaces/skill";

const initialParcoursState = {
  skills: Array<Skill>(),
};

const parcoursSlice = createSlice({
  name: "parcours",
  initialState: initialParcoursState,
  reducers: {
    addSkill(state, action) {
      let updatedSkills = state.skills;
      updatedSkills.push(action.payload);
      updatedSkills = addIdToObject(updatedSkills);
      state.skills = updatedSkills;
    },
    deleteSkill(state, action) {},
    editSkillBadge(state, action) {},
  },
});

function addIdToObject(items: Array<any>) {
  let i = 0;
  return items.map((item: any) => {
    i++;
    return { ...item, id: i };
  });
}

export const parcoursAction = parcoursSlice.actions;

export default parcoursSlice;
