import { createSlice } from "@reduxjs/toolkit";
import Module from "../../../utils/interfaces/module";

const initialModuleState: {
  modules: Module[] | null;
  currentModule: Module | null;
  editionMode: boolean;
  newModule: boolean;
} = {
  modules: null,
  currentModule: null,
  editionMode: false,
  newModule: false,
};

const parcoursModuleSlice = createSlice({
  name: "parcoursModule",
  initialState: initialModuleState,
  reducers: {
    setModules(state, action) {
      state.modules = action.payload;
    },
    setCurrentModule(state, action) {
      state.currentModule = action.payload;
    },
    toggleEditionMode(state) {
      state.editionMode = !state.editionMode;
    },
    toggleNewModule(state) {
      state.newModule = !state.newModule;
    },
    removeModule(state, action) {
      state.modules = state.modules!.filter(
        (item: Module) => item.id !== action.payload
      );
    },
    addModule(state, action) {
      state.modules = [...state.modules!, { ...action.payload, isCopy: true }];
    },
  },
});

export const {
  toggleNewModule,
  toggleEditionMode,
  setModules,
  setCurrentModule,
  addModule,
  removeModule,
} = parcoursModuleSlice.actions;

export default parcoursModuleSlice;
