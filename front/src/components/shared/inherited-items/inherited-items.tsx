/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useMemo, useState } from "react";

import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import ButtonAdd from "../../UI/button-add/button-add";
import SubBoxWrapper from "../../wrappers/SubBoxWrapper";

interface InheritedItemsProps {
  visibleList?: boolean;
  tooltip?: string;
  buttonLabel?: string;
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
  titleSize?: "small" | "medium" | "large";
}

const InheritedItems = (props: InheritedItemsProps) => {
  const visibleList = useMemo(() => {
    return props.visibleList !== undefined ? props.visibleList : true;
  }, [props.visibleList]);

  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };
  const [currentItems, setCurrentItems] = useState<any[]>([]);
  const [notSelected, setNotSelected] = useState<any[]>([]);

  const isDisabled = useMemo(() => {
    return props.isDisabled !== undefined ? props.isDisabled : false;
  }, [props.isDisabled]);

  const sizeClass = useMemo(() => {
    switch (props.titleSize) {
      case "small":
        return "text-sm";
      case "medium":
        return "text-lg";
      case "large":
      default:
        return "text-xl";
    }
  }, [props.titleSize]);

  /**
   * ajoute des éléments à la liste des éléments sélectionnés
   * @param contactsIds string[]
   */
  const handleAddItem = (ids: number[]) => {
    let updatedItems = currentItems;
    (ids ?? []).forEach((item: any) => {
      const foundItem = props.initialList?.find(
        (element: any) => element.id === item
      );
      if (foundItem) {
        updatedItems = [...updatedItems, foundItem];
      }
    });
    setCurrentItems(updatedItems);
    props.onSubmit(updatedItems);
  };

  /**
   * retire un contact de la liste des contacts du cours
   * @param value any (Constact)
   */
  const handleRemoveItem = (value: any) => {
    const updatedItems = currentItems.filter((item) => item.id !== value.id);
    setCurrentItems(updatedItems);
    props.onSubmit(updatedItems);
  };

  /**
   * actualise la liste des contacts non sélectionnés en fonction
   * des contacts sélectionnés
   */
  useEffect(() => {
    let updatedItems = Array<any>();
    (props.initialList ?? []).forEach((item: any) => {
      const foundItem = currentItems.find((element) => element.id === item.id);
      if (!foundItem) {
        updatedItems = [...updatedItems, item];
      }
    });
    setNotSelected(updatedItems);
  }, [props.initialList, currentItems]);

  /**
   * met à jour la liste des objets sélectionnés qd les props sont modifiées
   */
  useEffect(() => {
    setCurrentItems(props.selectedItems ?? []);
  }, [props.selectedItems]);

  return (
    <section className="w-full flex flex-col">
      <div className="flex items-center justify-between">
        {props.title ? (
          <h2
            className={`${
              props.titleSize !== "large" ? sizeClass : sizeClass + " font-bold"
            } p-2`}
          >
            {props.title}
          </h2>
        ) : null}
        <ButtonAdd
          label={props.buttonLabel ?? "Sélectionner"}
          small={true}
          loading={props.loading}
          isDisabled={isDisabled}
          onClickEvent={() => handleCloseDrawer(props.drawerId)}
        />
      </div>
      <div className="w-full flex flex-col gap-y-4 mt-4">
        {currentItems.length ? (
          <>
            {React.cloneElement(props.children[0] as React.ReactElement, {
              list: currentItems,
              property: props.property,
              onRemoveItem: handleRemoveItem,
            } as any)}
          </>
        ) : visibleList ? (
          <SubBoxWrapper>
            <p className="text-xs">Aucun objet ajouté</p>
          </SubBoxWrapper>
        ) : null}
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
          tooltip: props.tooltip,
        } as any)}
      </RightSideDrawer>
    </section>
  );
};

export default InheritedItems;
