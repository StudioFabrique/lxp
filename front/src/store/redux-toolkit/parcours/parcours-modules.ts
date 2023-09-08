import { createSlice } from "@reduxjs/toolkit";
import Module from "../../../utils/interfaces/module";

const initialModuleState: {
  modules: Module[] | null;
  currentModule: Module | null;
} = {
  modules: null,
  currentModule: null,
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
  },
});

export const { setModules, setCurrentModule } = parcoursModuleSlice.actions;

export default parcoursModuleSlice;
