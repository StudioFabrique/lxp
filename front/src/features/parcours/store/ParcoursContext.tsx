import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import Module from "../../../utils/interfaces/module";
import Group from "../../../utils/interfaces/group";
import User from "../../../utils/interfaces/user";
import { sortArray } from "../../../utils/helpers/sort-array";

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
  | { type: "SET_VIRTUAL_CLASS"; payload: string }
  | { type: "RESET_PARCOURS_INFORMATIONS" }
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
    case "RESET_PARCOURS_INFORMATIONS":
      return {
        ...state,
        parcoursInformations: INITIAL_STATE.parcoursInformations,
      };

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
