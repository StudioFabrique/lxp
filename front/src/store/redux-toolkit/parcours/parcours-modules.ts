import { createSlice } from "@reduxjs/toolkit";
import Module from "../../../utils/interfaces/module";
import { toast } from "react-hot-toast";
import { addIdToObject } from "../../../utils/add-id-to-objects";

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
      state.modules = addIdToObject([...modules, module]);
      toast.success("Le module a bien été ajouté");
    },
    updateParcoursModule(state, action) {
      const module: Module = action.payload;
      const modules: Module[] = state.modules;

      state.modules = modules.map((moduleToEdit) =>
        moduleToEdit.id === module.id
          ? { ...moduleToEdit, ...module }
          : moduleToEdit
      );
      toast.success("Le module a bien été modifié");
    },
    deleteParcoursModule(state, action) {
      const id = action.payload;
      const modules = state.modules;
      state.modules = modules.filter((module) => module.id !== id);
      toast.success("Le module a bien été supprimé");
    },
    updateCurrentParcoursModule(state, action) {
      const id = action.payload;
      const modules: Module[] = state.modules;
      state.currentModule = modules.filter((module) => module.id === id)[0];
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
