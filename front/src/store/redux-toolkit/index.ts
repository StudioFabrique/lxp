import { configureStore } from "@reduxjs/toolkit";

import parcoursInformationsSlice from "./parcours/parcours-informations";
import parcoursSkillsSlice from "./parcours/parcours-skills";
import parcoursModuleSlice from "./parcours/parcours-modules";
import parcoursSlice from "./parcours/parcours";
import tagsSlice from "./tags";
import parcoursContactsSlice from "./parcours/parcours-contacts";

const store = configureStore({
  reducer: {
    parcours: parcoursSlice.reducer,
    parcoursInformations: parcoursInformationsSlice.reducer,
    parcoursSkills: parcoursSkillsSlice.reducer,
    parcoursModule: parcoursModuleSlice.reducer,
    tags: tagsSlice.reducer,
    parcoursContacts: parcoursContactsSlice.reducer,
  },
});

export default store;
