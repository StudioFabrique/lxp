import { configureStore } from "@reduxjs/toolkit";

import parcoursInformationsSlice from "./parcours/parcours-informations";
import parcoursSkillsSlice from "./parcours/parcours-skills";

const store = configureStore({
  reducer: {
    parcours: parcoursInformationsSlice.reducer,
    parcoursInformations: parcoursInformationsSlice.reducer,
    parcoursSkills: parcoursSkillsSlice.reducer,
  },
});

export default store;
