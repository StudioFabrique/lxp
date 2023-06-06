import { useCallback, useReducer } from "react";
import { sortArray } from "../utils/sortArray";
import Tag from "../utils/interfaces/tag";

const initialState = {
  //list: Array<any>(),
  tags: Array<Tag>(),
  selectedTags: Array<Tag>(),
  filteredTags: Array<Tag>(),
};

const setTags = (name: string, toTags: Array<Tag>, fromTags: Array<Tag>) => {
  const tagToMove = fromTags.find((tag) => tag.name.includes(name));
  return sortArray(toTags.concat(tagToMove || []), "name");
};

const filterTags = (name: string, unselectedTags: Array<Tag>) => {
  return unselectedTags.filter((tag: Tag) =>
    tag.name.toLowerCase().includes(name.toLowerCase())
  );
};

/* const updateItem = (
  item: any,
  selectedTags: Array<Tag> = [],
  listIds: any = []
) => {}; */

const listReducer = (state: any, action: any) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        tags: action.value,
      };

    case "ADD_TAG":
      return {
        ...state,
        selectedTags: setTags(action.value, state.selectedTags, state.tags),
        tags: state.tags.filter((tag: Tag) => !tag.name.includes(action.value)),
      };

    case "REMOVE_TAG":
      return {
        ...state,
        tags: setTags(action.value.name, state.tags, state.selectedTags),
        selectedTags: state.selectedTags.filter(
          (tag: Tag) => tag.id !== action.value.id
        ),
      };

    case "FILTER":
      return {
        ...state,
        filteredTags: filterTags(action.value, state.tags),
      };

    case "RESET_FILTER":
      return { ...state, filteredTags: [] };

    /*     case "UPDATE_LIST":
      return {
        ...state,
        list: action.value,
      }; */

    default:
      return state;
  }
};

const useTags = () => {
  const [listState, dispatch] = useReducer(listReducer, initialState);

  const addTag = useCallback((name: string) => {
    dispatch({ type: "ADD_TAG", value: name });
  }, []);

  const removeTag = (tag: Tag) => {
    dispatch({ type: "REMOVE_TAG", value: tag });
  };

  /*   const updateList = useCallback((newList: Array<any>) => {
    dispatch({ type: "UPDATE_LIST", value: newList });
  }, []); */

  const initTags = useCallback((tagsList: Array<Tag>) => {
    dispatch({ type: "INIT", value: tagsList });
  }, []);

  const filterTags = useCallback((name: string) => {
    dispatch({ type: "FILTER", value: name });
  }, []);

  const resetFilterTags = useCallback(() => {
    dispatch({ type: "RESET_FILTER" });
  }, []);

  return {
    unselectedTags: listState.tags,
    selectedTags: listState.selectedTags,
    filteredTags: listState.filteredTags,
    addTag,
    removeTag,
    initTags,
    filterTags,
    resetFilterTags,
    //list: listState.list,
    //updateList,
  };
};

export default useTags;
