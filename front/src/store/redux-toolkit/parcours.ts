import { createSlice } from "@reduxjs/toolkit";

import Skill from "../../utils/interfaces/skill";
import { sortArray } from "../../utils/sortArray";
import Role from "../../utils/interfaces/role";
import Tag from "../../utils/interfaces/tag";

type UserItem = {
  _id: string;
  name: string;
  roles: Array<Role>;
};

const initialParcoursState = {
  id: null,
  infos: {
    id: null,
    title: "",
    description: "",
    degree: "",
    startDate: "",
    endDate: "",
    tags: Array<Tag>(),
    image: null,
    contacts: Array<UserItem>(),
  },
  parcoursIsValid: false,
  importedSkills: Array<any>(),
  skills: Array<Skill>(),
  badges: Array<any>(),
  totalBadges: 0,
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
    updateParcoursInfos(state, action) {
      const infos = action.payload;
      console.log({ infos });

      state.infos = {
        ...state.infos,
        id: state.id,
        title: infos.title,
        description: infos.description,
        degree: infos.degree,
        image: infos.file,
      };
    },
    updateParcoursDates(state, action) {
      const dates = action.payload;

      state.infos = {
        ...state.infos,
        id: state.id,
        startDate: dates.startDate,
        endDate: dates.endDate,
      };
    },
    updateParcoursTags(state, action) {
      const tags = action.payload.map((item: Tag) => item.id);
      state.infos = { ...state.infos, id: state.id, tags };
    },
    updateParcoursContacts(state, action) {
      const contacts = action.payload.map((item: UserItem) => item._id);
      state.infos = { ...state.infos, id: state.id, contacts };
    },
    testParcours(state) {
      const infos = state.infos;
      state.parcoursIsValid =
        infos.title.length > 0 &&
        infos.description.length > 0 &&
        infos.degree.length > 0 &&
        infos.startDate.length > 0 &&
        infos.endDate.length > 0 &&
        infos.tags.length > 0 &&
        infos.contacts.length > 0;
    },
    setParcoursId(state, action) {
      state.id = action.payload;
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
