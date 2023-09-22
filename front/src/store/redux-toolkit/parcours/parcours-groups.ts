import { createSlice } from "@reduxjs/toolkit";

import Group from "../../../utils/interfaces/group";
import User from "../../../utils/interfaces/user";

const initialGroupsState: {
  groups: Group[] | null;
  students: User[] | null;
} = {
  groups: null,
  students: null,
};

const parcoursGroupsSlice = createSlice({
  name: "parcoursGroups",
  initialState: initialGroupsState,
  reducers: {
    setGroups(state, action) {
      if (!state.groups) {
        state.groups = [];
      }
      let payload = action.payload;
      const groupsIds = state.groups.map((item) => item._id);
      payload = payload.filter((item: Group) => !groupsIds.includes(item._id));
      state.groups = [...state.groups, ...payload];
    },
    removeGroup(state, action) {
      if (state.groups) {
        state.groups = state.groups?.filter(
          (item) => item._id !== action.payload
        );
      }
    },
  },
});

export const parcoursGroupsAction = parcoursGroupsSlice.actions;

export default parcoursGroupsSlice;
