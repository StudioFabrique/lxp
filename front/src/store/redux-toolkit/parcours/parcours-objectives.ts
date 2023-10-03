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
    },
    deleteObjective(state, action) {
      const updatedObjectives = state.objectives.filter(
        (item: any) => action.payload !== item.id
      );
      state.objectives = updatedObjectives;
    },
    addObjective(state, action) {
      state.objectives = [...state.objectives, action.payload];
    },
    editObjective(state, action) {
      const updatedObjectives = state.objectives.map((item: any) => {
        if (item.id !== action.payload.id) {
          return item;
        } else {
          return { ...item, description: action.payload.description };
        }
      });
      state.objectives = updatedObjectives;
    },
  },
});

export const parcoursObjectivesAction = parcoursObjectivesSlice.actions;

export default parcoursObjectivesSlice;
