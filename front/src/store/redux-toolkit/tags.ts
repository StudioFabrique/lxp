import { createSlice } from "@reduxjs/toolkit";

import { sortArray } from "../../utils/sortArray";
import Tag from "../../utils/interfaces/tag";

const initialTagsState = {
  currentTags: Array<Tag>(),
  notSelectedTags: Array<Tag>(),
  filteredItems: Array<Tag>(),
  initialTags: Array<Tag>(),
};

const tagsSlice = createSlice({
  name: "tags",
  initialState: initialTagsState,
  reducers: {
    initTags(state, action) {
      state.initialTags = action.payload;
    },
    setCurrentTags(state, action) {
      state.currentTags = sortArray(action.payload, "name");
    },
    setNotSelectedTags(state) {
      const currentTags = state.currentTags;
      let notSelectedTags = state.initialTags;
      for (const currentTag of currentTags) {
        notSelectedTags = notSelectedTags.filter(
          (notSelectedTag: Tag) => notSelectedTag.id !== currentTag.id
        );
      }
      state.notSelectedTags = notSelectedTags;
    },
    addTag(state, action) {
      const tagId = action.payload;
      const tag = state.notSelectedTags.find((item: Tag) => item.id === tagId);
      if (tag) {
        state.currentTags.push(tag);
        state.currentTags = sortArray(state.currentTags, "name");
      }
    },
    removeTag(state, action) {
      const tagId = action.payload;
      state.currentTags = state.currentTags.filter(
        (item: Tag) => item.id !== tagId
      );
    },
    filterItems(state, action) {
      if (action.payload.length > 0) {
        state.filteredItems = sortArray(
          state.notSelectedTags.filter((item: Tag) =>
            item.name
              .toLocaleLowerCase()
              .includes(action.payload.toLocaleLowerCase())
          ),
          "name"
        );
      }
    },
    resetFilteredItems(state) {
      state.filteredItems = [];
    },
    reset(state) {
      state.currentTags = [];
      state.notSelectedTags = [];
      state.filteredItems = [];
      state.initialTags = [];
    },
  },
});

export const tagsAction = tagsSlice.actions;

export default tagsSlice;
