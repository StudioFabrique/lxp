import Contact from "../../../../../../src/utils/interfaces/contact";
import {
  MetadataList,
  Metadatas,
  ModuleData,
  Parcours,
} from "../../../interfaces/new-module";
import Skill from "../../../../../../src/utils/interfaces/skill";

type ModuleUpdate = {
  id: number;
  duration: number;
  contacts: Contact[];
  skills: Skill[];
};

// Centralized state type
type ModuleState = {
  image: string | null;
  showForm: boolean;
  mode: "create" | "edit";
  modules: ModuleData[];
  parcours: Parcours | null;
  currentContacts: Contact[];
  currentSkills: Skill[];
  file: File | null;
  moduleToDelete: ModuleData | null;
  showDuplicateModal: boolean;
  metadataList: MetadataList[] | null;
  moduleToDuplicate: Metadatas | null;
  moduleToUpdate: number | null;
};

// Action types
type ModuleAction =
  | { type: "SET_SHOW_FORM"; payload: boolean }
  | { type: "SET_MODE"; payload: "create" | "edit" }
  | { type: "SET_MODULES"; payload: ModuleData[] }
  | { type: "ADD_MODULE"; payload: ModuleData }
  | { type: "REMOVE_MODULE"; payload: number }
  | { type: "SET_PARCOURS"; payload: Parcours }
  | { type: "SET_CURRENT_CONTACTS"; payload: Contact[] }
  | { type: "SET_CURRENT_SKILLS"; payload: Skill[] }
  | { type: "SET_FILE"; payload: File | null }
  | { type: "SET_MODULE_TO_DELETE"; payload: ModuleData | null }
  | { type: "SET_SHOW_DUPLICATE_MODAL"; payload: boolean }
  | { type: "SET_METADATA_LIST"; payload: MetadataList[] | null }
  | { type: "SET_MODULE_TO_DUPLICATE"; payload: Metadatas | null }
  | { type: "RESET_FORM" }
  | { type: "CANCEL_FORM" }
  | { type: "MODULE_CREATED"; payload: ModuleData }
  | {
      type: "PREPARE_DUPLICATE";
      payload: { metas: Metadatas; image: string | null };
    }
  | { type: "CLOSE_DELETE_MODAL" }
  | { type: "UPDATE_MODULE"; payload: ModuleUpdate }
  | {
      type: "SUCCESSFUL_MODULE_UPDATE";
      payload: {
        id: number;
        contacts: Contact[];
        skills: Skill[];
        duration: number;
        title: string;
        description?: string;
        quizInstructions?: string;
      };
    };

// Initial state
const initialState: ModuleState = {
  image: null,
  showForm: false,
  mode: "create",
  modules: [],
  parcours: null,
  currentContacts: [],
  currentSkills: [],
  file: null,
  moduleToDelete: null,
  showDuplicateModal: false,
  metadataList: null,
  moduleToDuplicate: null,
  moduleToUpdate: null,
};

// Reducer function with all state transitions
function moduleReducer(state: ModuleState, action: ModuleAction): ModuleState {
  switch (action.type) {
    case "SET_SHOW_FORM":
      return { ...state, showForm: action.payload };

    case "SET_MODE":
      return { ...state, mode: action.payload };

    case "SET_MODULES":
      return { ...state, modules: action.payload };

    case "ADD_MODULE":
      return { ...state, modules: [...state.modules, action.payload] };

    case "REMOVE_MODULE":
      return {
        ...state,
        modules: state.modules.filter((m) => m.id !== action.payload),
      };

    case "SET_PARCOURS":
      return { ...state, parcours: action.payload };

    case "SET_CURRENT_CONTACTS":
      return { ...state, currentContacts: action.payload };

    case "SET_CURRENT_SKILLS":
      return { ...state, currentSkills: action.payload };

    case "SET_FILE":
      return { ...state, file: action.payload };

    case "SET_MODULE_TO_DELETE":
      return { ...state, moduleToDelete: action.payload };

    case "SET_SHOW_DUPLICATE_MODAL":
      return { ...state, showDuplicateModal: action.payload };

    case "SET_METADATA_LIST":
      return { ...state, metadataList: action.payload };

    case "SET_MODULE_TO_DUPLICATE":
      return { ...state, moduleToDuplicate: action.payload };

    // Complex action: Reset form completely
    case "RESET_FORM":
      return {
        ...state,
        showForm: false,
        mode: "create",
        currentContacts: [],
        currentSkills: [],
        file: null,
        moduleToDuplicate: null,
        image: null,
      };

    // Complex action: Cancel form editing
    case "CANCEL_FORM":
      return {
        ...state,
        showForm: false,
        mode: "create",
        currentContacts: [],
        currentSkills: [],
        file: null,
        image: null,
        moduleToDuplicate: null,
      };

    // Complex action: Module successfully created
    case "MODULE_CREATED":
      return {
        ...state,
        showForm: false,
        mode: "create",
        modules: [...state.modules, action.payload],
        currentContacts: [],
        currentSkills: [],
        file: null,
        moduleToDuplicate: null,
        metadataList: null,
      };

    // Complex action: Prepare to duplicate a module
    case "PREPARE_DUPLICATE":
      return {
        ...state,
        showForm: true,
        mode: "edit",
        moduleToDuplicate: action.payload.metas,
        image: action.payload.image,
      };

    // Complex action: Close delete modal and reset
    case "CLOSE_DELETE_MODAL":
      return {
        ...state,
        moduleToDelete: null,
        metadataList: null,
      };

    case "UPDATE_MODULE":
      return {
        ...state,
        moduleToUpdate: action.payload.id,
        showForm: true,
        mode: "edit",
        currentContacts: action.payload.contacts,
        currentSkills: action.payload.skills,
        file: null,
        image:
          state.modules.find((m) => m.id === action.payload.id)?.thumb ?? null,
      };

    case "SUCCESSFUL_MODULE_UPDATE":
      return {
        ...state,
        showForm: false,
        mode: "create",
        modules: state.modules.map((module: ModuleData) =>
          module.id === action.payload.id
            ? {
                ...module,
                contacts: action.payload.contacts,
                skills: action.payload.skills,
                duration: action.payload.duration,
                title: action.payload.title,
                description: action.payload.description ?? "",
                quizInstructions: action.payload.quizInstructions,
              }
            : module,
        ),
        currentContacts: [],
        currentSkills: [],
        file: null,
        moduleToUpdate: null,
      };

    default:
      return state;
  }
}

export { moduleReducer, initialState };
export type { ModuleState, ModuleAction };
