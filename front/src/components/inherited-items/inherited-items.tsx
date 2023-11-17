/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useMemo, useState } from "react";

import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import ButtonAdd from "../UI/button-add/button-add";

interface InheritedItemsProps {
  children: ReactNode[];
  drawerId: string;
  drawerTitle: string;
  title?: string;
  loading: boolean;
  initialList: unknown[];
  selectedItems: unknown[];
  isDisabled?: boolean;
  property: string; // propriété utilisée pour trier les listes
  onSubmit: (items: any[]) => void;
}

const InheritedItems = (props: InheritedItemsProps) => {
  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };
  const [currentItems, setCurrentItems] = useState<any[]>(props.selectedItems);
  const [notSelected, setNotSelected] = useState<any[]>([]);

  const isDisabled = useMemo(() => {
    return props.isDisabled !== undefined ? props.isDisabled : false;
  }, [props.isDisabled]);

  /**
   * ajoute des éléments à la liste des éléments sélectionnés
   * @param contactsIds string[]
   */
  const handleAddItem = (ids: number[]) => {
    let updatedItems = Array<any>();
    ids.forEach((item: any) => {
      const foundItem = props.initialList.find(
        (element: any) => element.id === item
      );
      if (foundItem) {
        updatedItems = [...updatedItems, foundItem];
      }
    });
    setCurrentItems((prevState) => [...prevState, ...updatedItems]);
    props.onSubmit(currentItems);
  };

  /**
   * retire un contact de la liste des contacts du cours
   * @param value any (Constact)
   */
  const handleRemoveItem = (value: any) => {
    setCurrentItems((prevState) =>
      prevState.filter((item) => item.id !== value.id)
    );
    props.onSubmit(currentItems);
  };

  /**
   * actualise la liste des contacts non sélectionnés en fonction
   * des contacts sélectionnés
   */
  useEffect(() => {
    let updatedItems = Array<any>();
    props.initialList.forEach((item: any) => {
      const foundItem = currentItems.find((element) => element.id === item.id);
      if (!foundItem) {
        updatedItems = [...updatedItems, item];
      }
    });
    setNotSelected(updatedItems);
  }, [props.initialList, currentItems]);

  return (
    <section className="w-full flex flex-col gap-y-8">
      <div className="flex items-center justify-between">
        {props.title ? (
          <h2 className="text-xl font-bold">{props.title}</h2>
        ) : null}
        <ButtonAdd
          label="Ajouter"
          small={true}
          loading={props.loading}
          isDisabled={isDisabled}
          onClickEvent={() => handleCloseDrawer(props.drawerId)}
        />
      </div>
      <div className="w-full flex flex-col gap-y-4">
        {currentItems.length ? (
          <>
            {React.cloneElement(props.children[0] as React.ReactElement, {
              list: currentItems,
              onRemoveItem: handleRemoveItem,
            })}
          </>
        ) : (
          <p>Aucun élément sélectionné</p>
        )}
      </div>
      <RightSideDrawer
        title={props.drawerTitle}
        id={props.drawerId}
        visible={false}
        onCloseDrawer={handleCloseDrawer}
      >
        {React.cloneElement(props.children[1] as React.ReactElement, {
          list: notSelected,
          onAddItems: handleAddItem,
          onCloseDrawer: handleCloseDrawer,
        })}
      </RightSideDrawer>
    </section>
  );
};

export default InheritedItems;
