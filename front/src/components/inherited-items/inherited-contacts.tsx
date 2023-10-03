import { useEffect, useState } from "react";

import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import NotSelectedContacts from "./not-selected-contacts";
import { sortArray } from "../../utils/sortArray";
import SubWrapper from "../UI/sub-wrapper/sub-wrapper.component";
import InheritedTextList from "./inherited-text-list";

interface InheritedContactsProps {
  initialList: unknown[];
  currentItems: unknown[];
  property: string; // propriété utilisée pour trier les listes
}

const InheritedItems = (props: InheritedContactsProps) => {
  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };
  const [currentItems, setCurrentItems] = useState<any[]>(props.currentItems);
  const [notSelected, setNotSelected] = useState<any[]>(props.initialList);

  /**
   * ajoute des éléments à la liste des éléments sélectionnés
   * @param contactsIds string[]
   */
  const handleAddItem = (itemsIds: number[]) => {
    let items = Array<any>();
    itemsIds.forEach((id) => {
      const item = props.initialList.find((item: any) => item.id === id);
      if (item) {
        items = [...items, item];
      }
    });
    setCurrentItems((prevState) =>
      sortArray([...prevState, ...items], props.property)
    );
  };

  /**
   * retire un contact de la liste des contacts du cours
   * @param value any (Constact)
   */
  const handleRemoveItem = (value: any) => {
    setCurrentItems((prevState) =>
      prevState.filter((item) => item.id !== value.id)
    );
  };

  /**
   * actualise la liste des contacts non sélectionnés en fonction
   * des contacts sélectionnés
   */
  useEffect(() => {
    const updatedItems = props.initialList.filter(
      (item) => !currentItems.includes(item)
    );
    setNotSelected(updatedItems);
  }, [props.initialList, currentItems]);

  return (
    <section className="w-full flex flex-col gap-y-8">
      <h2 className="text-xl font-bold">Ressources et Contacts</h2>

      <div className="w-full flex flex-col gap-y-4">
        {currentItems.length > 0 ? (
          <InheritedTextList
            list={currentItems}
            onRemoveItem={handleRemoveItem}
          />
        ) : (
          <SubWrapper>
            <p className="text-xs">Aucun contact sélectionné</p>
          </SubWrapper>
        )}
        <div className="w-full flex justify-center">
          <button
            className="btn btn-primary"
            onClick={() => handleCloseDrawer("add-contacts")}
          >
            Ajouter des contacts
          </button>
        </div>
      </div>

      <RightSideDrawer
        title="Ajouter des contacts"
        id="add-contacts"
        visible={false}
        onCloseDrawer={handleCloseDrawer}
      >
        <NotSelectedContacts
          list={notSelected}
          onAddContact={handleAddItem}
          onCloseDrawer={handleCloseDrawer}
        />
      </RightSideDrawer>
    </section>
  );
};

export default InheritedItems;
