import { createSlice } from "@reduxjs/toolkit";
import Module from "../../../utils/interfaces/module";
import { sortArray } from "../../../utils/sortArray";

const initialModulesState: {
  modules: Module[] | null;
  currentModule: Module | null;
  isFormOpen: boolean;
} = {
  modules: null,
  currentModule: null,
  isFormOpen: false,
};

const parcoursModulesSlice = createSlice({
  name: "parcoursModules",
  initialState: initialModulesState,
  reducers: {
    setModules(state, action) {
      state.modules = action.payload;
    },
    addNewModule(state, action) {
      if (!state.modules) {
        state.modules = [];
      }
      state.modules = sortArray(
        [...state.modules, { ...action.payload }],
        "id",
        false
      );
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
    setCurrentModule(state, action) {
      state.currentModule = action.payload;
    },
    setIsFormOpen(state, action) {
      state.isFormOpen = action.payload;
    },
    replaceModule(state, action) {
      if (state.modules) {
        state.modules = state.modules.filter(
          (item) => item.id !== action.payload.id
        );
        state.modules = sortArray(
          [...state.modules, action.payload],
          "id",
          false
        );
      }
      console.log("modules", state.modules);
    },
    resetModule(state) {
      state.modules = null;
      state.currentModule = null;
      state.isFormOpen = false;
    },
  },
});

export const parcoursModulesSliceActions = parcoursModulesSlice.actions;

export default parcoursModulesSlice;
