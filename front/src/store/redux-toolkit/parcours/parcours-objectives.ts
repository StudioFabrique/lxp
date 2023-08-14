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
      let objectives = state.objectives;
      const newObjectives = action.payload;
      newObjectives.forEach((newObjective: any) => {
        const objective = objectives.find(
          (item: any) => newObjective.description === item.description
        );
        if (!objective) {
          objectives = [...objectives, newObjective];
        }
      });
      state.objectives = sortArray(objectives, "description");
    },
    setObjectives(state, action) {
      state.objectives = action.payload;
    },
  },
});

export const parcoursObjectivesAction = parcoursObjectivesSlice.actions;

export default parcoursObjectivesSlice;
