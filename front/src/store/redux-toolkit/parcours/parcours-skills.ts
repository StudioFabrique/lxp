import { createSlice } from "@reduxjs/toolkit";

import Skill from "../../../utils/interfaces/skill";
import { addIdToObject } from "../../../utils/add-id-to-objects";
import { sortArray } from "../../../utils/sortArray";
import Badge from "../../../utils/interfaces/badge";

const initialParcoursState = {
  informationsAreValid: false,
  importedSkills: Array<any>(),
  skills: Array<Skill>(),
  badges: Array<Badge>(),
  totalBadges: 0,
  selectedBadge: {},
};

const parcoursSkillsSlice = createSlice({
  name: "parcoursSkills",
  initialState: initialParcoursState,
  reducers: {
    addSkill(state, action) {
      let updatedSkills = state.skills;
      const skill = { ...action.payload, isBonus: true };
      updatedSkills.push(skill);
      state.skills = sortArray(updatedSkills, "description");
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
      console.log("payload", action.payload);

      let updatedSkills = state.skills;
      updatedSkills = updatedSkills.filter((item) => item.id !== newSkill.id);
      updatedSkills.push(newSkill);
      state.skills = sortArray(updatedSkills, "description");
    },
    setSkillsList(state, action) {
      state.skills = sortArray(
        action.payload.map((item: any) => ({
          ...item,
          isBonus: true,
        })),
        "description"
      );
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
      state.importedSkills = sortArray(
        addIdToObject(action.payload),
        "description"
      );
    },
    addImportedSkillsToSkills(state, action) {
      let skills = state.skills;
      const newSkills = action.payload;
      newSkills.forEach((newSkill: any) => {
        const skill = skills.find(
          (item: any) => newSkill.description === item.description
        );
        if (!skill) {
          skills = [...skills, newSkill];
        }
      });
      state.skills = sortArray(skills, "description");
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
