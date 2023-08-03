import { createSlice } from "@reduxjs/toolkit";
import Module from "../../../utils/interfaces/module";

const initialModuleState: { modules: Module[]; currentModule: Module | null } =
  {
    modules: Array<Module>(),
    /* currentModule est le module temporaire en cours d'édition et permet d'indiquer au formulaire
    si le contenu est en cours d'édition ou si le contenu est nouveau (currentModule sera null) */
    currentModule: null,
  };

const parcoursModuleSlice = createSlice({
  name: "parcoursModule",
  initialState: initialModuleState,
  reducers: {
    addParcoursModule(state, action) {
      const module: Module = action.payload;
      const modules: Module[] = state.modules;
      module._id = (modules.length + 1).toString();
      state.modules = [...modules, module];
    },
    updateParcoursModule(state, action) {
      const module: Module = action.payload;
      const modules: Module[] = state.modules;
      state.modules = modules.map((moduleToEdit) =>
        moduleToEdit._id === module._id
          ? { ...moduleToEdit, module }
          : moduleToEdit
      );
    },
    deleteParcoursModule(state, action) {
      const _id = action.payload;
      const modules = state.modules;
      state.modules = modules.filter((module) => module._id !== _id);
    },
    updateCurrentParcoursModule(state, action) {
      const _id = action.payload;
      const modules: Module[] = state.modules;
      state.currentModule = modules.filter((module) => module._id === _id)[0];
    },
    clearCurrentParcoursModule(state) {
      state.currentModule = null;
    },
  },
});

export const {
  addParcoursModule,
  updateCurrentParcoursModule,
  deleteParcoursModule,
  updateParcoursModule,
  clearCurrentParcoursModule,
} = parcoursModuleSlice.actions;

export default parcoursModuleSlice;
