import { configureStore } from "@reduxjs/toolkit";

import parcoursInformationsSlice from "./parcours/parcours-informations";
import parcoursSkillsSlice from "./parcours/parcours-skills";
import parcoursModuleSlice from "./parcours/parcours-modules";
import parcoursSlice from "./parcours/parcours";
import tagsSlice from "./tags";
import parcoursContactsSlice from "./parcours/parcours-contacts";
import parcoursObjectivesSlice from "./parcours/parcours-objectives";
import parcoursGroupsSlice from "./parcours/parcours-groups";

const store = configureStore({
  reducer: {
    parcours: parcoursSlice.reducer,
    parcoursInformations: parcoursInformationsSlice.reducer,
    parcoursSkills: parcoursSkillsSlice.reducer,
    parcoursModules: parcoursModuleSlice.reducer,
    tags: tagsSlice.reducer,
    parcoursContacts: parcoursContactsSlice.reducer,
    parcoursObjectives: parcoursObjectivesSlice.reducer,
    parcoursGroups: parcoursGroupsSlice.reducer,
  },
});

export default store;
