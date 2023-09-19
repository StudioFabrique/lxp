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
    toggleEditionMode(state, action) {
      state.editionMode = action.payload;
    },
    toggleNewModule(state) {
      state.newModule = !state.newModule;
    },
    addNewModule(state, action) {
      state.modules = state.modules!.filter((item) => item.id === "0");
      state.modules = [...state.modules, action.payload];
    },
  },
});

export const {
  addNewModule,
  toggleNewModule,
  toggleEditionMode,
  setModules,
  setCurrentModule,
} = parcoursModuleSlice.actions;

export default parcoursModuleSlice;
