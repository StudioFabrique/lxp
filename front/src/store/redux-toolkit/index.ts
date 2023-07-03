import { configureStore } from "@reduxjs/toolkit";
import parcoursSlice from "./parcours";

const store = configureStore({
  reducer: {
    parcours: parcoursSlice.reducer,
  },
});

export default store;
