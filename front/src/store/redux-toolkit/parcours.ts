import { createSlice } from "@reduxjs/toolkit";

import Skill from "../../utils/interfaces/skill";
import { sortArray } from "../../utils/sortArray";

const initialParcoursState = {
  skills: Array<Skill>(),
  badges: Array<any>(),
};

let i = 0;

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
    deleteSkill(state, action) {
      const skillToDelete = action.payload;
      const updatedSkills = state.skills.filter(
        (item) => item.id !== skillToDelete
      );
      state.skills = updatedSkills;
    },
    editSkill(state, action) {
      const newSkill = action.payload;
      let updatedSkills = state.skills;
      updatedSkills = updatedSkills.filter((item) => item.id !== newSkill.id);
      updatedSkills.push(newSkill);
      state.skills = sortArray(updatedSkills, "id");
    },
    addBadge(state, action) {
      const newBadge = action.payload;
      let updatedBadges = state.badges;
      updatedBadges.push(newBadge);
      state.badges = addIdToObject(updatedBadges);
    },
    importBadges(state, action) {
      const importedBadges = addIdToObject(action.payload);
      const badges = state.badges;
      importedBadges.forEach((item) => badges.push(item));
      state.badges = badges;
    },
    validateBadge(state, action) {
      const updatedBadges = state.badges.filter(
        (item) => item.id !== action.payload.id
      );
      updatedBadges.push(action.payload);
      state.badges = addIdToObject(updatedBadges);
    },
    updateBadgeImage(state, action) {
      const badgeToUpdate = state.badges.find(
        (item) => item.id === action.payload.id
      );
      if (badgeToUpdate) {
        let updatedBadges = state.badges.filter(
          (item) => item.id !== action.payload.id
        );
        updatedBadges.push({
          ...badgeToUpdate,
          image: action.payload.image,
        });
        state.badges = updatedBadges;
      }
    },
  },
});

function addIdToObject(items: Array<any>) {
  return items.map((item: any) => {
    i++;
    if (!item.id) {
      return { ...item, id: i };
    } else {
      return item;
    }
  });
}

export const parcoursAction = parcoursSlice.actions;

export default parcoursSlice;
