/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";
import { regexGeneric } from "../../../utils/constantes";

const initialParcoursState = {
  infos: {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  },
  isValid: false,
  tagsIsValid: false,
  contactsIsValid: false,
  virtualClass: "",
  infosIsValid: false,
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
      state.infosIsValid = false;
      state.isValid = false;
      state.tagsIsValid = false;
      state.contactsIsValid = false;
    },
    isValid(state) {
      const infos = state.infos;
      state.isValid =
        infos.title !== null &&
        infos.title.length > 0 &&
        infos.startDate !== null &&
        infos.startDate.length > 0 &&
        infos.endDate !== null &&
        infos.endDate.length > 0 &&
        state.tagsIsValid;
    },
    setTagsIsValid(state, action) {
      state.tagsIsValid = action.payload;
    },
    setVirtualClass(state, action) {
      state.virtualClass = action.payload;
    },
    infosIsValid(state) {
      state.infosIsValid =
        state.isValid &&
        regexGeneric.test(state.infos.description) &&
        state.contactsIsValid;
    },
    setContactsIsValid(state, action) {
      state.contactsIsValid = action.payload;
    },
  },
});

export const parcoursInformationsAction = parcoursInformationsSlice.actions;

export default parcoursInformationsSlice;
