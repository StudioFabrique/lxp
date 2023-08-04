/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const initialParcoursState = {
  infos: {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  },
};

const parcoursInformationsSlice = createSlice({
  name: "parcoursInformations",
  initialState: initialParcoursState,
  reducers: {
    updateParcoursInfos(state, action) {
      const infos = action.payload;
      state.infos = {
        ...state.infos,
        title: infos.title,
        description: infos.description,
      };
    },
    updateParcoursDates(state, action) {
      const dates = action.payload;
      state.infos = {
        ...state.infos,
        startDate: dates.startDate,
        endDate: dates.endDate,
      };
    },
    reset(state) {
      state.infos.title = "";
      state.infos.description = "";
      state.infos.startDate = "";
      state.infos.endDate = "";
    },
  },
});

export const parcoursInformationsAction = parcoursInformationsSlice.actions;

export default parcoursInformationsSlice;
