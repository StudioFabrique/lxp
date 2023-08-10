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
      updatedSkills.push(action.payload);
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
      let updatedSkills = state.skills;
      updatedSkills = updatedSkills.filter((item) => item.id !== newSkill.id);
      updatedSkills.push(newSkill);
      state.skills = sortArray(updatedSkills, "description");
    },
    setSkillsList(state, action) {
      state.skills = action.payload.map((item: any) => ({
        ...item,
        isBonus: true,
      }));
    },
    addBadge(state, action) {
      const badge = { ...action.payload, isSelected: true };
      state.badges.push(badge);
      state.badges = addIdToObject(state.badges);
    },
    importBadges(state, action) {
      action.payload.forEach((item: string) => {
        const badge = state.badges.find((badge) => badge.image === item);
        if (!badge) {
          state.badges = [...state.badges, { image: item, isSelected: false }];
        }
      });
      state.badges = addIdToObject(state.badges);
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
      state.importedSkills = addIdToObject(sortArray(action.payload, "title"));
    },
    addImportedSkillsToSkills(state, action) {
      const skills = state.skills;
      action.payload.forEach((item: any) => {
        const skillToFind = skills.find(
          (skill: Skill) => skill.description === item.description
        );
        if (!skillToFind) {
          skills.push(item);
        }
      });
      state.skills = sortArray([...state.skills, ...skills], "description");
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
    setSelectedBadge(state, action) {
      let updatedBadges = state.badges;
      updatedBadges.map((item) => (item.isSelected = false));
      let badge = updatedBadges.find((item) => item.id === action.payload);
      if (badge) {
        state.selectedBadge = badge;
        updatedBadges = updatedBadges.filter(
          (item) => item.id !== action.payload
        );
        state.badges = sortArray(
          [...updatedBadges, { ...badge, isSelected: true }],
          "id"
        );
      }
    },
    unselectBadge(state) {
      state.badges = state.badges.map((item) => ({
        ...item,
        isSelected: false,
      }));
    },
  },
});

export const parcoursSkillsAction = parcoursSkillsSlice.actions;

export default parcoursSkillsSlice;
