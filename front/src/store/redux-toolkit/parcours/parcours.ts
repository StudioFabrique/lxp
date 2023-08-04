import { createSlice } from "@reduxjs/toolkit";

const initialParcoursState = {
  id: null,
  formation: null,
};

const parcoursSlice = createSlice({
  name: "parcours",
  initialState: initialParcoursState,
  reducers: {
    setParcoursId(state, action) {
      state.id = action.payload;
    },
    setParcoursFormation(state, action) {
      state.formation = action.payload;
    },
    reset(state) {
      state.id = null;
      state.formation = null;
    },
  },
});

export const parcoursAction = parcoursSlice.actions;

export default parcoursSlice;
