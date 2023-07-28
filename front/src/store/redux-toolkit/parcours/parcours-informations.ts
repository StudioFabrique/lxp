/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

import Role from "../../../utils/interfaces/role";
import Tag from "../../../utils/interfaces/tag";
import { sortArray } from "../../../utils/sortArray";

type UserItem = {
  _id: string;
  name: string;
  roles: Array<Role>;
};

const initialParcoursState = {
  infos: {
    title: "",
    description: "",
    degree: "",
    startDate: "",
    endDate: "",
    tags: Array<Tag>(),
    contacts: Array<UserItem>(),
  },
  selectedTags: Array<Tag>(),
  unselectedTags: Array<Tag>(),
  informationsAreValid: false,
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
        degree: infos.degree,
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
    updateParcoursTags(state, action) {
      const tags = action.payload.map((item: Tag) => item.id);
      state.infos = { ...state.infos, tags };
    },
    updateParcoursContacts(state, action) {
      const contacts = action.payload.map((item: UserItem) => item._id);
      state.infos = { ...state.infos, contacts };
    },
    testParcours(state) {
      const infos = state.infos;
      state.informationsAreValid =
        infos.title.length > 0 &&
        infos.description.length > 0 &&
        infos.degree.length > 0 &&
        infos.startDate.length > 0 &&
        infos.endDate.length > 0 &&
        infos.tags.length > 0 &&
        infos.contacts.length > 0;
    },
    setTag(state, action) {
      state.infos.tags = setItems(
        action.payload,
        state.infos.tags,
        state.unselectedTags
      );
      state.unselectedTags.filter((item) => item.id === action.payload);
    },
    removeTag(state, action) {
      state.unselectedTags = removeItems(
        action.payload,
        state.infos.tags,
        state.unselectedTags
      );
      state.infos.tags.filter((item) => item.id === action.payload);
    },
  },
});

const setItems = (id: number, toItems: Array<any>, fromItems: Array<any>) => {
  const itemToMove = fromItems.find((item) => item.id === id);
  return sortArray([...toItems, itemToMove || []], "id");
};

const removeItems = (
  id: number,
  toItems: Array<any>,
  fromItems: Array<any>
) => {
  const itemToMove = fromItems.find((item) => item.id === id);
  return sortArray([...toItems, itemToMove], "id");
};

export const parcoursInformationsAction = parcoursInformationsSlice.actions;

export default parcoursInformationsSlice;
