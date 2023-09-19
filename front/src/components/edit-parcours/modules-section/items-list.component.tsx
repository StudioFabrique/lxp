/**
 * gère la liste d'objets à afficher à partir d'une liste immutable passée en props
 * avec l'aide d'un custom hook
 */

import React, { useEffect } from "react";

import useItems from "../../../hooks/use-items";
import SearchDropdown from "../../UI/search-dropdown/search-dropdown";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import ItemElement from "./item-element.component";

interface ItemsListProps {
  itemsList: unknown[];
  selectedProp?: any[];
  propertyToSearch: string;
  placeHolder: string;
  onUpdateItems: (items: unknown[]) => void;
}

const ItemsList = (props: ItemsListProps) => {
  const {
    initItems,
    addItem,
    filterItems,
    resetFilterItems,
    removeItem,
    filteredItems,
    selectedItems,
  } = useItems();

  // initialise la liste des formateurs inscrits pour le parcours à partirs des props
  useEffect(() => {
    initItems(props.itemsList);
    if (
      props.selectedProp !== undefined &&
      props.selectedProp.length > 0 &&
      ItemsList.length > 0
    ) {
      for (const item of props.selectedProp) {
        addItem(item[props.propertyToSearch], props.propertyToSearch);
      }
    }
  }, [
    props.itemsList,
    initItems,
    addItem,
    props.propertyToSearch,
    props.selectedProp,
  ]);

  // remonte les items de la liste au composant parent
  useEffect(() => {
    props.onUpdateItems(selectedItems);
  }, [props, selectedItems]);

  // retire un formateur de la liste des formateurs du module sans le retirer de la liste initiale
  const handleRemoveItem = (item: unknown) => {
    removeItem(item, props.propertyToSearch);
  };

  return (
    <>
      <SearchDropdown
        addItem={addItem}
        filterItems={filterItems}
        resetFilterItems={resetFilterItems}
        filteredItems={filteredItems}
        property={props.propertyToSearch}
        placeHolder={props.placeHolder}
      />
      <ul className="flex flex-col gap-y-4">
        {selectedItems && selectedItems.length > 0
          ? selectedItems.map((item: any) => (
              <li key={item.id}>
                <SubWrapper>
                  <ItemElement
                    item={item}
                    property={props.propertyToSearch}
                    onRemoveItem={handleRemoveItem}
                  />
                </SubWrapper>
              </li>
            ))
          : null}
      </ul>
    </>
  );
};

const MemoizedItemsList = React.memo(ItemsList);

export default MemoizedItemsList;
