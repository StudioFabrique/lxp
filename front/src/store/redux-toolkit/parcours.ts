import { createSlice } from "@reduxjs/toolkit";

import Skill from "../../utils/interfaces/skill";
import { sortArray } from "../../utils/sortArray";
import { getFixturesBadges } from "../../utils/fixtures/badges";

const initialParcoursState = {
  skills: Array<Skill>(),
  badges: getFixturesBadges(),
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
    editSkill(state, action) {
      const newSkill = action.payload;
      let updatedSkills = state.skills;
      updatedSkills = updatedSkills.filter((item) => item.id !== newSkill.id);
      updatedSkills.push(newSkill);
      state.skills = sortArray(updatedSkills, "id");
    },
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
