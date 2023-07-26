import { useCallback, useReducer } from "react";
import { sortArray } from "../utils/sortArray";

const initialState = {
  //list: Array<any>(),
  items: Array<any>(),
  selectedItems: Array<any>(),
  filteredItems: Array<any>(),
};

const setItems = (
  name: string,
  toItems: Array<any>,
  fromItems: Array<any>,
  property: string
) => {
  const itemToMove = fromItems.find((item) => item[property].includes(name));
  return sortArray([...toItems, itemToMove || []], property);
};

const removeItems = (
  id: any,
  toItems: Array<any>,
  fromItems: Array<any>,
  property: string
) => {
  const itemToMove = fromItems.find((item) => item[property] === id);
  return sortArray([...toItems, itemToMove], property);
};

const filterItems = (
  name: string,
  unselectedItems: Array<any>,
  property: string
) => {
  return unselectedItems.filter((item: any) =>
    item[property].toLowerCase().includes(name.toLowerCase())
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
        items: action.value,
      };

    case "ADD_ITEM":
      return {
        ...state,
        selectedItems: setItems(
          action.value,
          state.selectedItems,
          state.items,
          action.property
        ),
        items: state.items.filter(
          (item: any) => !item[action.property].includes(action.value)
        ),
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: removeItems(
          action.value[action.property],
          state.items,
          state.selectedItems,
          action.property
        ),
        selectedItems: state.selectedItems.filter(
          (item: any) => item[action.property] !== action.value[action.property]
        ),
      };

    case "FILTER":
      return {
        ...state,
        filteredItems: filterItems(action.value, state.items, action.property),
      };

    case "RESET_FILTER":
      return { ...state, filterItems: [] };

    /*     case "UPDATE_LIST":
      return {
        ...state,
        list: action.value,
      }; */

    case "INIT_SELECTED_ITEMS":
      return {
        ...state,
        selectedItems: action.value,
      };

    default:
      return state;
  }
};

const useItems = () => {
  const [listState, dispatch] = useReducer(listReducer, initialState);

  const addItem = useCallback((name: string, property: string) => {
    dispatch({ type: "ADD_ITEM", value: name, property });
  }, []);

  const removeItem = useCallback((item: any, property: string) => {
    dispatch({ type: "REMOVE_ITEM", value: item, property });
  }, []);

  /*   const updateList = useCallback((newList: Array<any>) => {
    dispatch({ type: "UPDATE_LIST", value: newList });
  }, []); */

  const initItems = useCallback((itemsList: Array<any>) => {
    dispatch({ type: "INIT", value: itemsList });
  }, []);

  const filterItems = useCallback((name: string, property: string) => {
    dispatch({ type: "FILTER", value: name, property });
  }, []);

  const resetFilterItems = useCallback(() => {
    dispatch({ type: "RESET_FILTER" });
  }, []);

  const initSelectedItems = useCallback((itemsList: Array<any>) => {
    dispatch({ type: "INIT_SELECTED_ITEMS", value: itemsList });
  }, []);

  return {
    unselectedItems: listState.items,
    selectedItems: listState.selectedItems,
    filteredItems: listState.filteredItems,
    addItem,
    removeItem,
    initItems,
    filterItems,
    resetFilterItems,
    initSelectedItems,
    //list: listState.list,
    //updateList,
  };
};

export default useItems;
