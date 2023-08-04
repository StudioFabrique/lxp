import { createSlice } from "@reduxjs/toolkit";

import Skill from "../../../utils/interfaces/skill";
import { addIdToObject } from "../../../utils/add-id-to-objects";
import { sortArray } from "../../../utils/sortArray";

const initialParcoursState = {
  informationsAreValid: false,
  importedSkills: Array<any>(),
  skills: Array<Skill>(),
  badges: Array<any>(),
  totalBadges: 0,
};

const parcoursSkillsSlice = createSlice({
  name: "parcoursSkills",
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
      const updatedBadges = state.badges;
      updatedBadges.push(newBadge);
      state.badges = addIdToObject(updatedBadges);
    },
    importBadges(state, action) {
      const badges = state.badges;
      badges.push(action.payload);
      state.badges = addIdToObject(badges);
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
        const updatedBadges = state.badges.filter(
          (item) => item.id !== action.payload.id
        );
        updatedBadges.push({
          ...badgeToUpdate,
          image: action.payload.image,
        });
        state.badges = updatedBadges;
      }
    },
    importSkills(state, action) {
      const importedSkills = sortArray(action.payload, "title");
      state.importedSkills = addIdToObject(importedSkills);
    },
    addImportedSkillsToSkills(state, action) {
      const skills = state.skills;
      action.payload.forEach((item: any) => {
        const skillToFind = skills.find(
          (skill: Skill) => skill.description === item.description
        );
        if (!skillToFind) {
          skills.push({
            id: item.id,
            description: item.description,
          });
        }
      });
      state.skills = skills;
    },
    getBadgesTotal(state) {
      state.totalBadges = state.badges.length;
    },
    reset(state) {
      state.informationsAreValid = false;
      state.badges = [];
      state.importedSkills = [];
      state.skills = [];
      state.totalBadges = 0;
    },
  },
});

export const parcoursSkillsAction = parcoursSkillsSlice.actions;

export default parcoursSkillsSlice;
