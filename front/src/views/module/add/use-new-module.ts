export type Item = {
  id: number;
  title: string;
};

export type NewMddule = {
  id: number;
  title: string;
  description: string;
  thumb: string | null;
};

type State = {
  parcoursId: number | null;
  formationId: number | null;
  mode: "create" | "edit";
  formationList: Item[];
  parcoursList: Item[];
  newModuleData: NewMddule | null;
  showMetadataForm: boolean;
};

type Action =
  | { type: "SET_FORMATION_LIST"; payload: Item[] }
  | { type: "SET_PARCOURS_LIST"; payload: Item[] }
  | { type: "SET_PARCOURS_ID"; payload: number | null }
  | { type: "SET_FORMATION_ID"; payload: number | null }
  | { type: "SET_MODE"; payload: "create" | "edit" }
  | { type: "SET_NEW_MODULE_DATA"; payload: NewMddule | null }
    | { type: "SET_SHOW_METADATA_FORM"; payload: boolean };
  
const initialState: State = {
  parcoursId: null,
  formationId: null,
  mode: "create",
  formationList: [],
  parcoursList: [],
  newModuleData: null,
  showMetadataForm: false,
};

const newModuleReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FORMATION_LIST":
      return { ...state, formationList: action.payload };
    case "SET_PARCOURS_LIST":
      return { ...state, parcoursList: action.payload };
    case "SET_PARCOURS_ID":
      return { ...state, parcoursId: action.payload };
    case "SET_FORMATION_ID":
      return { ...state, formationId: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_NEW_MODULE_DATA":
      return { ...state, newModuleData: action.payload };

const useNewModule = () => {};

export default useNewModule;
