import { createSlice } from "@reduxjs/toolkit";
import Module from "../../../utils/interfaces/module";

const initialModuleState: {
  modules: Module[] | null;
  currentModule: Module | null;
  editionMode: boolean;
  newModule: boolean;
  initialRender: boolean;
} = {
  modules: null,
  currentModule: null,
  editionMode: false,
  newModule: false,
  initialRender: true,
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
    toggleNewModule(state, action) {
      state.newModule = action.payload;
    },
    addNewModule(state, action) {
      console.log("modules", state.modules);

      state.modules = state.modules!.filter((item) => item.id !== "0");
      state.modules = [...state.modules, { ...action.payload }];
    },
    toggleInitialRender(state, action) {
      state.initialRender = action.payload;
    },
  },
});

export const {
  toggleInitialRender,
  addNewModule,
  toggleNewModule,
  toggleEditionMode,
  setModules,
  setCurrentModule,
} = parcoursModuleSlice.actions;

export default parcoursModuleSlice;
