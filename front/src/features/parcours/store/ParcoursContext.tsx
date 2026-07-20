import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import Objective from "../../../utils/interfaces/objective";
import Tag from "../../../utils/interfaces/tag";
import Module from "../../../utils/interfaces/module";
import Group from "../../../utils/interfaces/group";
import User from "../../../utils/interfaces/user";
import { sortArray } from "../../../utils/helpers/sort-array";
import { addIdToObject } from "../../../utils/helpers/add-id-to-objects";

// ------------------------------------------------------------------ //
//  STATE TYPES
// ------------------------------------------------------------------ //

export type ParcoursState = {
  parcours: {
    id: number | null;
    formation: Record<string, unknown> | null;
  };
  parcoursInformations: {
    infos: {
      title: string;
      description: string;
      startDate: string;
      endDate: string;
      virtualClass: string;
      visibility: boolean;
      isPublished: boolean;
    };
    isValid: boolean;
    tagsIsValid: boolean;
    contactsIsValid: boolean;
    infosIsValid: boolean;
  };
  parcoursContacts: {
    initialContacts: Contact[];
    currentContacts: Contact[];
    notSelectedContacts: Contact[];
    filteredContacts: Contact[];
  };
  parcoursSkills: {
    informationsAreValid: boolean;
    importedSkills: Record<string, unknown>[];
    skills: Skill[];
  };
  parcoursObjectives: {
    informationsAreValid: boolean;
    importedObjectives: Objective[];
    objectives: Objective[];
  };
  parcoursModules: {
    modules: Module[] | null;
    currentModule: Module | null;
    isFormOpen: boolean;
  };
  parcoursGroups: {
    groupsIds: Array<{ id: number; idMdb: string }> | null;
    groups: Group[] | null;
    students: User[] | null;
  };
  tags: {
    currentTags: Tag[];
    notSelectedTags: Tag[];
    filteredItems: Tag[];
    initialTags: Tag[];
    parentTags: Tag[];
  };
};

const INITIAL_STATE: ParcoursState = {
  parcours: { id: null, formation: null },
  parcoursInformations: {
    infos: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      virtualClass: "",
      visibility: false,
      isPublished: false,
    },
    isValid: false,
    tagsIsValid: false,
    contactsIsValid: false,
    infosIsValid: false,
  },
  parcoursContacts: {
    initialContacts: [],
    currentContacts: [],
    notSelectedContacts: [],
    filteredContacts: [],
  },
  parcoursSkills: {
    informationsAreValid: false,
    importedSkills: [],
    skills: [],
  },
  parcoursObjectives: {
    informationsAreValid: false,
    importedObjectives: [],
    objectives: [],
  },
  parcoursModules: {
    modules: null,
    currentModule: null,
    isFormOpen: false,
  },
  parcoursGroups: {
    groupsIds: null,
    groups: null,
    students: null,
  },
  tags: {
    currentTags: [],
    notSelectedTags: [],
    filteredItems: [],
    initialTags: [],
    parentTags: [],
  },
};

// ------------------------------------------------------------------ //
//  ACTION TYPES
// ------------------------------------------------------------------ //

type Action =
  | { type: "SET_PARCOURS_ID"; payload: number }
  | { type: "SET_PARCOURS_FORMATION"; payload: Record<string, unknown> }
  | { type: "RESET_PARCOURS" }
  // Informations
  | {
      type: "UPDATE_PARCOURS_INFOS";
      payload: Partial<ParcoursState["parcoursInformations"]["infos"]>;
    }
  | {
      type: "UPDATE_PARCOURS_DATES";
      payload: { startDate: string; endDate: string };
    }
  | { type: "PUBLISH_PARCOURS"; payload: boolean }
  | { type: "SET_TAGS_IS_VALID"; payload: boolean }
  | { type: "SET_VIRTUAL_CLASS"; payload: string }
  | { type: "SET_CONTACTS_IS_VALID"; payload: boolean }
  | { type: "VALIDATE_INFOS" }
  | { type: "VALIDATE_INFOS_FULL" }
  | { type: "RESET_PARCOURS_INFORMATIONS" }
  // Contacts
  | { type: "INIT_CONTACTS"; payload: Contact[] }
  | { type: "SET_CURRENT_CONTACTS"; payload: Contact[] }
  | { type: "SET_NOT_SELECTED_CONTACTS" }
  | { type: "FILTER_CONTACTS"; payload: string }
  | { type: "ADD_CONTACT"; payload: string }
  | { type: "REMOVE_CONTACT"; payload: string }
  | { type: "ADD_NEW_CONTACT"; payload: Contact }
  | { type: "RESET_CONTACTS" }
  | { type: "RESET_FILTER_CONTACTS" }
  // Skills
  | { type: "ADD_SKILL"; payload: Skill }
  | { type: "DELETE_SKILL"; payload: number | undefined }
  | { type: "EDIT_SKILL"; payload: Skill }
  | { type: "SET_SKILLS_LIST"; payload: Skill[] }
  | { type: "IMPORT_SKILLS"; payload: Record<string, unknown>[] }
  | { type: "ADD_IMPORTED_SKILLS"; payload: Skill[] }
  | { type: "RESET_SKILLS" }
  // Objectives
  | { type: "IMPORT_OBJECTIVES"; payload: Objective[] }
  | { type: "ADD_IMPORTED_OBJECTIVES"; payload: Objective[] }
  | { type: "SET_OBJECTIVES"; payload: Objective[] }
  | { type: "DELETE_OBJECTIVE"; payload: number | undefined }
  | { type: "ADD_OBJECTIVE"; payload: Objective }
  | {
      type: "EDIT_OBJECTIVE";
      payload: { id: number | undefined; description: string };
    }
  | { type: "RESET_OBJECTIVES" }
  // Modules
  | { type: "SET_MODULES"; payload: Module[] }
  | { type: "ADD_NEW_MODULE"; payload: Module }
  | { type: "UPDATE_CURRENT_MODULE"; payload: number }
  | { type: "UPDATE_MODULE"; payload: { module: Module; moduleId: number } }
  | { type: "REMOVE_MODULE"; payload: number | undefined }
  | { type: "SET_CURRENT_MODULE"; payload: Module | null }
  | { type: "SET_IS_FORM_OPEN"; payload: boolean }
  | { type: "REPLACE_MODULE"; payload: Module }
  | { type: "RESET_MODULES" }
  // Groups
  | { type: "SET_GROUPS_IDS"; payload: Array<{ id: number; idMdb: string }> }
  | { type: "RESET_GROUPS_IDS" }
  | { type: "SET_GROUPS"; payload: Group[] }
  | { type: "REMOVE_GROUP"; payload: string | undefined }
  | { type: "RESET_GROUPS" }
  // Tags
  | { type: "INIT_TAGS"; payload: Tag[] }
  | { type: "SET_CURRENT_TAGS"; payload: Tag[] }
  | { type: "SET_PARENT_TAGS"; payload: Tag[] }
  | { type: "SET_NOT_SELECTED_TAGS" }
  | { type: "ADD_TAG"; payload: number }
  | { type: "REMOVE_TAG"; payload: number }
  | { type: "FILTER_TAGS"; payload: string }
  | { type: "ADD_NEW_CURRENT_TAGS"; payload: Tag[] }
  | { type: "RESET_FILTERED_TAGS" }
  | { type: "RESET_TAGS" }
  // Global reset
  | { type: "RESET_ALL" };

// ------------------------------------------------------------------ //
//  REDUCER
// ------------------------------------------------------------------ //

function parcoursReducer(state: ParcoursState, action: Action): ParcoursState {
  switch (action.type) {
    // ---- Parcours ---- //
    case "SET_PARCOURS_ID":
      return { ...state, parcours: { ...state.parcours, id: action.payload } };
    case "SET_PARCOURS_FORMATION":
      return {
        ...state,
        parcours: { ...state.parcours, formation: action.payload },
      };
    case "RESET_PARCOURS":
      return { ...state, parcours: INITIAL_STATE.parcours };

    // ---- Informations ---- //
    case "UPDATE_PARCOURS_INFOS":
      return {
        ...state,
        parcoursInformations: {
          ...state.parcoursInformations,
          infos: { ...state.parcoursInformations.infos, ...action.payload },
        },
      };
    case "UPDATE_PARCOURS_DATES":
      return {
        ...state,
        parcoursInformations: {
          ...state.parcoursInformations,
          infos: {
            ...state.parcoursInformations.infos,
            startDate: action.payload.startDate,
            endDate: action.payload.endDate,
          },
        },
      };
    case "PUBLISH_PARCOURS":
      return {
        ...state,
        parcoursInformations: {
          ...state.parcoursInformations,
          infos: {
            ...state.parcoursInformations.infos,
            isPublished: action.payload,
          },
        },
      };
    case "VALIDATE_INFOS": {
      const infos = state.parcoursInformations.infos;
      const isValid =
        infos.title.length > 0 &&
        infos.startDate.length > 0 &&
        infos.endDate.length > 0 &&
        state.parcoursInformations.tagsIsValid;
      return {
        ...state,
        parcoursInformations: { ...state.parcoursInformations, isValid },
      };
    }
    case "VALIDATE_INFOS_FULL": {
      const infos = state.parcoursInformations.infos;
      const isValid =
        infos.title.length > 0 &&
        infos.startDate.length > 0 &&
        infos.endDate.length > 0 &&
        state.parcoursInformations.tagsIsValid;
      const infosIsValid =
        isValid &&
        infos.description.length > 0 &&
        state.parcoursInformations.contactsIsValid;
      return {
        ...state,
        parcoursInformations: {
          ...state.parcoursInformations,
          isValid,
          infosIsValid,
        },
      };
    }
    case "SET_TAGS_IS_VALID":
      return {
        ...state,
        parcoursInformations: {
          ...state.parcoursInformations,
          tagsIsValid: action.payload,
        },
      };
    case "SET_VIRTUAL_CLASS":
      return {
        ...state,
        parcoursInformations: {
          ...state.parcoursInformations,
          infos: {
            ...state.parcoursInformations.infos,
            virtualClass: action.payload,
          },
        },
      };
    case "SET_CONTACTS_IS_VALID":
      return {
        ...state,
        parcoursInformations: {
          ...state.parcoursInformations,
          contactsIsValid: action.payload,
        },
      };
    case "RESET_PARCOURS_INFORMATIONS":
      return {
        ...state,
        parcoursInformations: INITIAL_STATE.parcoursInformations,
      };

    // ---- Contacts ---- //
    case "INIT_CONTACTS":
      return {
        ...state,
        parcoursContacts: {
          ...state.parcoursContacts,
          initialContacts: action.payload,
        },
      };
    case "SET_CURRENT_CONTACTS":
      return {
        ...state,
        parcoursContacts: {
          ...state.parcoursContacts,
          currentContacts: action.payload,
        },
      };
    case "SET_NOT_SELECTED_CONTACTS": {
      const currentContacts = state.parcoursContacts.currentContacts;
      let notSelectedContacts = state.parcoursContacts.initialContacts;
      for (const c of currentContacts) {
        notSelectedContacts = notSelectedContacts.filter(
          (nc) => nc.idMdb !== c.idMdb,
        );
      }
      return {
        ...state,
        parcoursContacts: { ...state.parcoursContacts, notSelectedContacts },
      };
    }
    case "FILTER_CONTACTS": {
      if (action.payload.length > 0) {
        const filteredContacts = sortArray(
          state.parcoursContacts.notSelectedContacts.filter((item) =>
            item.name
              .toLocaleLowerCase()
              .includes(action.payload.toLocaleLowerCase()),
          ),
          "name",
        );
        return {
          ...state,
          parcoursContacts: { ...state.parcoursContacts, filteredContacts },
        };
      }
      return state;
    }
    case "ADD_CONTACT": {
      const contact = state.parcoursContacts.notSelectedContacts.find(
        (item) => item.idMdb === action.payload,
      );
      if (contact) {
        const currentContacts = sortArray(
          [...state.parcoursContacts.currentContacts, contact],
          "name",
        );
        return {
          ...state,
          parcoursContacts: { ...state.parcoursContacts, currentContacts },
        };
      }
      return state;
    }
    case "REMOVE_CONTACT": {
      const currentContacts = state.parcoursContacts.currentContacts.filter(
        (item) => item.idMdb !== action.payload,
      );
      return {
        ...state,
        parcoursContacts: { ...state.parcoursContacts, currentContacts },
      };
    }
    case "ADD_NEW_CONTACT": {
      const initialContacts = sortArray(
        [...state.parcoursContacts.initialContacts, action.payload],
        "name",
      );
      return {
        ...state,
        parcoursContacts: { ...state.parcoursContacts, initialContacts },
      };
    }
    case "RESET_CONTACTS":
      return { ...state, parcoursContacts: INITIAL_STATE.parcoursContacts };
    case "RESET_FILTER_CONTACTS":
      return {
        ...state,
        parcoursContacts: { ...state.parcoursContacts, filteredContacts: [] },
      };

    // ---- Skills ---- //
    case "ADD_SKILL": {
      const skill = { ...action.payload, isBonus: true };
      return {
        ...state,
        parcoursSkills: {
          ...state.parcoursSkills,
          skills: [...state.parcoursSkills.skills, skill],
        },
      };
    }
    case "DELETE_SKILL":
      return {
        ...state,
        parcoursSkills: {
          ...state.parcoursSkills,
          skills: state.parcoursSkills.skills.filter(
            (item) => item.id !== action.payload,
          ),
        },
      };
    case "EDIT_SKILL": {
      const updatedSkills = state.parcoursSkills.skills.filter(
        (item) => item.id !== action.payload.id,
      );
      updatedSkills.push(action.payload);
      return {
        ...state,
        parcoursSkills: { ...state.parcoursSkills, skills: updatedSkills },
      };
    }
    case "SET_SKILLS_LIST":
      return {
        ...state,
        parcoursSkills: {
          ...state.parcoursSkills,
          skills: action.payload.map((item) => ({ ...item, isBonus: true })),
        },
      };
    case "IMPORT_SKILLS":
      return {
        ...state,
        parcoursSkills: {
          ...state.parcoursSkills,
          importedSkills: addIdToObject(action.payload),
        },
      };
    case "ADD_IMPORTED_SKILLS": {
      let skills = state.parcoursSkills.skills;
      action.payload.forEach((newSkill) => {
        const exists = skills.find(
          (s) => newSkill.description === s.description,
        );
        if (!exists) {
          skills = [...skills, newSkill];
        }
      });
      return { ...state, parcoursSkills: { ...state.parcoursSkills, skills } };
    }
    case "RESET_SKILLS":
      return { ...state, parcoursSkills: INITIAL_STATE.parcoursSkills };

    // ---- Objectives ---- //
    case "IMPORT_OBJECTIVES":
      return {
        ...state,
        parcoursObjectives: {
          ...state.parcoursObjectives,
          importedObjectives: sortArray(
            addIdToObject(action.payload),
            "description",
          ),
        },
      };
    case "ADD_IMPORTED_OBJECTIVES":
      return {
        ...state,
        parcoursObjectives: {
          ...state.parcoursObjectives,
          objectives: action.payload,
        },
      };
    case "SET_OBJECTIVES":
      return {
        ...state,
        parcoursObjectives: {
          ...state.parcoursObjectives,
          objectives: action.payload,
        },
      };
    case "DELETE_OBJECTIVE":
      return {
        ...state,
        parcoursObjectives: {
          ...state.parcoursObjectives,
          objectives: state.parcoursObjectives.objectives.filter(
            (item) => action.payload !== item.id,
          ),
        },
      };
    case "ADD_OBJECTIVE":
      return {
        ...state,
        parcoursObjectives: {
          ...state.parcoursObjectives,
          objectives: [...state.parcoursObjectives.objectives, action.payload],
        },
      };
    case "EDIT_OBJECTIVE": {
      const objectives = state.parcoursObjectives.objectives.map((item) =>
        item.id !== action.payload.id
          ? item
          : { ...item, description: action.payload.description },
      );
      return {
        ...state,
        parcoursObjectives: { ...state.parcoursObjectives, objectives },
      };
    }
    case "RESET_OBJECTIVES":
      return { ...state, parcoursObjectives: INITIAL_STATE.parcoursObjectives };

    // ---- Modules ---- //
    case "SET_MODULES":
      return {
        ...state,
        parcoursModules: { ...state.parcoursModules, modules: action.payload },
      };
    case "ADD_NEW_MODULE": {
      const modules = state.parcoursModules.modules
        ? sortArray(
            [...state.parcoursModules.modules, action.payload],
            "id",
            false,
          )
        : [action.payload];
      return {
        ...state,
        parcoursModules: { ...state.parcoursModules, modules },
      };
    }
    case "UPDATE_CURRENT_MODULE": {
      const module =
        state.parcoursModules.modules?.find((m) => m.id === action.payload) ??
        null;
      return {
        ...state,
        parcoursModules: { ...state.parcoursModules, currentModule: module },
      };
    }
    case "UPDATE_MODULE": {
      const modules =
        state.parcoursModules.modules?.map((m) =>
          m.id === action.payload.moduleId
            ? { ...m, ...action.payload.module }
            : m,
        ) ?? null;
      return {
        ...state,
        parcoursModules: { ...state.parcoursModules, modules },
      };
    }
    case "REMOVE_MODULE": {
      const modules =
        state.parcoursModules.modules?.filter(
          (item) => item.id !== action.payload,
        ) ?? null;
      return {
        ...state,
        parcoursModules: { ...state.parcoursModules, modules },
      };
    }
    case "SET_CURRENT_MODULE":
      return {
        ...state,
        parcoursModules: {
          ...state.parcoursModules,
          currentModule: action.payload,
        },
      };
    case "SET_IS_FORM_OPEN":
      return {
        ...state,
        parcoursModules: {
          ...state.parcoursModules,
          isFormOpen: action.payload,
        },
      };
    case "REPLACE_MODULE": {
      const currentModules =
        state.parcoursModules.modules?.filter(
          (item) => item.id !== action.payload.id,
        ) ?? [];
      const modules = sortArray(
        [...currentModules, action.payload],
        "id",
        false,
      );
      return {
        ...state,
        parcoursModules: { ...state.parcoursModules, modules },
      };
    }
    case "RESET_MODULES":
      return { ...state, parcoursModules: INITIAL_STATE.parcoursModules };

    // ---- Groups ---- //
    case "SET_GROUPS_IDS": {
      const groupsIds = state.parcoursGroups.groupsIds
        ? [...state.parcoursGroups.groupsIds, ...action.payload]
        : action.payload;
      return {
        ...state,
        parcoursGroups: { ...state.parcoursGroups, groupsIds },
      };
    }
    case "RESET_GROUPS_IDS":
      return {
        ...state,
        parcoursGroups: { ...state.parcoursGroups, groupsIds: null },
      };
    case "SET_GROUPS": {
      const existingIds = state.parcoursGroups.groups?.map((g) => g._id) ?? [];
      const newGroups = action.payload.filter(
        (item) => !existingIds.includes(item._id),
      );
      const groups = state.parcoursGroups.groups
        ? [...state.parcoursGroups.groups, ...newGroups]
        : newGroups;
      return { ...state, parcoursGroups: { ...state.parcoursGroups, groups } };
    }
    case "REMOVE_GROUP": {
      const groups =
        state.parcoursGroups.groups?.filter(
          (item) => item._id !== action.payload,
        ) ?? null;
      return { ...state, parcoursGroups: { ...state.parcoursGroups, groups } };
    }
    case "RESET_GROUPS":
      return { ...state, parcoursGroups: INITIAL_STATE.parcoursGroups };

    // ---- Tags ---- //
    case "INIT_TAGS":
      return { ...state, tags: { ...state.tags, initialTags: action.payload } };
    case "SET_CURRENT_TAGS":
      return {
        ...state,
        tags: { ...state.tags, currentTags: sortArray(action.payload, "name") },
      };
    case "SET_PARENT_TAGS":
      return { ...state, tags: { ...state.tags, parentTags: action.payload } };
    case "SET_NOT_SELECTED_TAGS": {
      let notSelectedTags = state.tags.initialTags;
      for (const currentTag of state.tags.currentTags) {
        notSelectedTags = notSelectedTags.filter(
          (nt) => nt.id !== currentTag.id,
        );
      }
      return { ...state, tags: { ...state.tags, notSelectedTags } };
    }
    case "ADD_TAG": {
      const tag = state.tags.notSelectedTags.find(
        (t) => t.id === action.payload,
      );
      if (tag) {
        const currentTags = sortArray([...state.tags.currentTags, tag], "name");
        return { ...state, tags: { ...state.tags, currentTags } };
      }
      return state;
    }
    case "REMOVE_TAG": {
      const currentTags = state.tags.currentTags.filter(
        (t) => t.id !== action.payload,
      );
      return { ...state, tags: { ...state.tags, currentTags } };
    }
    case "FILTER_TAGS": {
      if (action.payload.length > 0) {
        const filteredItems = sortArray(
          state.tags.notSelectedTags.filter((item) =>
            item.name
              .toLocaleLowerCase()
              .includes(action.payload.toLocaleLowerCase()),
          ),
          "name",
        );
        return { ...state, tags: { ...state.tags, filteredItems } };
      }
      return state;
    }
    case "ADD_NEW_CURRENT_TAGS": {
      const currentTags = [...state.tags.currentTags, ...action.payload];
      return { ...state, tags: { ...state.tags, currentTags } };
    }
    case "RESET_FILTERED_TAGS":
      return { ...state, tags: { ...state.tags, filteredItems: [] } };
    case "RESET_TAGS":
      return { ...state, tags: INITIAL_STATE.tags };

    // ---- Global ---- //
    case "RESET_ALL":
      return INITIAL_STATE;

    default:
      return state;
  }
}

// ------------------------------------------------------------------ //
//  CONTEXT
// ------------------------------------------------------------------ //

type ParcoursContextValue = {
  state: ParcoursState;
  dispatch: React.Dispatch<Action>;
};

const ParcoursContext = createContext<ParcoursContextValue | null>(null);

// ------------------------------------------------------------------ //
//  PROVIDER
// ------------------------------------------------------------------ //

type ParcoursProviderProps = {
  children: ReactNode;
};

export function ParcoursProvider({ children }: ParcoursProviderProps) {
  const [state, dispatch] = useReducer(parcoursReducer, INITIAL_STATE);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch({ type: "RESET_ALL" });
    };
  }, []);

  return (
    <ParcoursContext.Provider value={{ state, dispatch }}>
      {children}
    </ParcoursContext.Provider>
  );
}

// ------------------------------------------------------------------ //
//  HOOKS
// ------------------------------------------------------------------ //

export function useParcoursContext(): ParcoursContextValue {
  const ctx = useContext(ParcoursContext);
  if (!ctx) {
    throw new Error(
      "useParcoursContext must be used within a ParcoursProvider",
    );
  }
  return ctx;
}

export function useParcoursSelector<T>(
  selector: (state: ParcoursState) => T,
): T {
  const { state } = useParcoursContext();
  return selector(state);
}

export function useParcoursDispatch(): React.Dispatch<Action> {
  const { dispatch } = useParcoursContext();
  return dispatch;
}
