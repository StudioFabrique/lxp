import { createSlice } from "@reduxjs/toolkit";
import Module from "../../../utils/interfaces/module";

const initialModuleState = {
  modules: Array<Module>(),
};

const parcoursModuleSlice = createSlice({
  name: "parcoursModule",
  initialState: initialModuleState,
  reducers: {
    addParcoursModule(state, action) {
      const module: Module = action.payload;
      const modules = state.modules;
      module._id = (modules.length + 1).toString();
      state.modules = [...modules, module];
    },
    deleteParcoursModule(state, action) {
      const _id = action.payload;
      const modules = state.modules;
      state.modules = modules.filter((module) => module._id !== _id);
    },
  },
});

export const { addParcoursModule, deleteParcoursModule } =
  parcoursModuleSlice.actions;

export default parcoursModuleSlice;
