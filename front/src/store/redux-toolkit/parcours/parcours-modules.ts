import { createSlice } from "@reduxjs/toolkit";
import Module from "../../../utils/interfaces/module";
import { sortArray } from "../../../utils/sortArray";

const initialModulesState: {
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

const parcoursModulesSlice = createSlice({
  name: "parcoursModules",
  initialState: initialModulesState,
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
      if (!state.modules) {
        state.modules = [];
      }
      state.modules = [...state.modules, { ...action.payload }];
    },
    editModule(state, action) {
      const module = action.payload;
      let modules = state.modules;
      modules = modules!.filter((item) => item.id !== module.id);
      modules = sortArray([...modules, module], "id");
      state.modules = modules;
      console.log(state.modules);
    },
    toggleInitialRender(state, action) {
      state.initialRender = action.payload;
    },
    updateCurrentParcoursModule(state, action) {
      const id = action.payload;
      const modules: Module[] = state.modules!;
      state.currentModule = modules.filter((module) => module.id === id)[0];
    },
    updateParcoursModule(state, action) {
      const module: Module = action.payload.module;
      const moduleId: number = action.payload.moduleId;
      const modules: Module[] = state.modules!;

      state.modules = modules.map((moduleToEdit) =>
        moduleToEdit.id === moduleId
          ? { ...moduleToEdit, ...module }
          : moduleToEdit
      );
    },
    removeModule(state, action) {
      state.modules = state.modules!.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const parcoursModulesSliceActions = parcoursModulesSlice.actions;

export default parcoursModulesSlice;
