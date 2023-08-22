import { createSlice } from "@reduxjs/toolkit";

import Objective from "../../../utils/interfaces/objective";
import { sortArray } from "../../../utils/sortArray";
import { addIdToObject } from "../../../utils/add-id-to-objects";

const initialObjectivesState = {
  informationsAreValid: false,
  importedObjectives: Array<Objective>(),
  objectives: Array<Objective>(),
};

const parcoursObjectivesSlice = createSlice({
  name: "parcoursObjectives",
  initialState: initialObjectivesState,
  reducers: {
    reset(state) {
      state.objectives = [];
      state.importedObjectives = [];
      state.informationsAreValid = false;
    },
    importObjectives(state, action) {
      state.importedObjectives = sortArray(
        addIdToObject(action.payload),
        "description"
      );
    },
    addImportedObjectivesToObjectives(state, action) {
      state.objectives = action.payload;
    },
    setObjectives(state, action) {
      state.objectives = action.payload;
      console.log("hello", state.objectives);
    },
    deleteObjective(state, action) {
      const updatedObjectives = state.objectives.filter(
        (item: any) => action.payload !== item.id
      );
      state.objectives = updatedObjectives;
    },
    addObjective(state, action) {
      console.log("toto", action.payload);

      state.objectives = [...state.objectives, action.payload];
    },
  },
});

export const parcoursObjectivesAction = parcoursObjectivesSlice.actions;

export default parcoursObjectivesSlice;
