import { useCallback, useReducer } from "react";
import Tag from "../utils/interfaces/tag";
import Role from "../utils/interfaces/role";

type UserItem = {
  _id: string;
  name: string;
  roles: Array<Role>;
};

const initialState = {
  title: "",
  description: "",
  degree: "",
  file: {},
  startDate: "",
  endDate: "",
  tags: Array<Tag>(),
  contacts: Array<UserItem>(),
};

const infosReducer = (state: any, action: any) => {
  switch (action.type) {
    case "UPDATE_INFOS":
      return {
        ...state,
        title: action.value.title,
        description: action.value.description,
        degree: action.value.degree,
        file: action.value.file,
      };
    case "UPDATE_DATES":
      return {
        ...state,
        startDate: action.dates.startDate,
        endDate: action.dates.endDate,
      };

    case "UPDATE_TAGS":
      return {
        ...state,
        tags: action.value,
      };

    case "UPDATE_CONTACTS":
      return {
        ...state,
        contacts: action.value,
      };

    default:
      return { ...state };
  }
};

const useParcours = () => {
  const [infosState, dispatch] = useReducer(infosReducer, initialState);

  const updateInfos = useCallback(
    (infos: {
      infos: string;
      description: string;
      degree: string;
      file: File | null;
    }) => {
      console.log("infos");
      dispatch({ type: "UPDATE_INFOS", value: infos });
    },
    []
  );

  const updateDates = useCallback(
    (dates: { startDate: string; endDate: string }) => {
      console.log("dates");

      dispatch({ type: "UPDATE_DATES", dates });
    },
    []
  );

  const updateTags = useCallback((tags: Array<Tag>) => {
    console.log("tags");
    dispatch({ type: "UPDATE_TAGS", value: tags });
  }, []);

  const updateContacts = useCallback((contacts: Array<UserItem>) => {
    dispatch({ type: "UPDATE_CONTACTS", value: contacts });
  }, []);

  return {
    formInfos: {
      title: infosState.title,
      description: infosState.description,
      degree: infosState.degree,
      file: infosState.file,
      startDate: infosState.startDate,
      endDate: infosState.endDate,
      tags: infosState.tags,
      contacts: infosState.contacts,
    },
    updateInfos,
    updateDates,
    updateTags,
    updateContacts,
  };
};

export default useParcours;
