import { useEffect, useState } from "react";

import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import { sortArray } from "../../utils/sortArray";
import SubWrapper from "../UI/sub-wrapper/sub-wrapper.component";
import NotSelectedTags from "./not-selected-tags";
import TagItem from "../UI/tag-item/tag-item";
import ButtonAdd from "../UI/button-add/button-add";

interface InheritedContactsProps {
  loading: boolean;
  initialList: unknown[];
  currentItems: unknown[];
  property: string; // propriété utilisée pour trier les listes
  onSubmit: (items: any[]) => void;
}

const InheritedTags = (props: InheritedContactsProps) => {
  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };
  const [currentItems, setCurrentItems] = useState<any[]>(props.currentItems);
  const [notSelected, setNotSelected] = useState<any[]>([]);

  /**
   * ajoute des éléments à la liste des éléments sélectionnés
   * @param contactsIds string[]
   */
  const handleAddItem = (id: number) => {
    const item = props.initialList.find((item: any) => item.id === id);
    if (item) {
      setCurrentItems((prevState) =>
        sortArray([...prevState, item], props.property)
      );
    }
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
    let updatedItems = Array<any>();
    props.initialList.forEach((item: any) => {
      const tag = currentItems.find((element) => element.id === item.id);
      if (!tag) {
        updatedItems = [...updatedItems, item];
      }
    });
    setNotSelected(updatedItems);
    props.onSubmit(currentItems);
  }, [props.initialList, props, currentItems]);

  return (
    <section className="w-full flex flex-col gap-y-8">
      <div className="flex items-center justify-between">
        <span className="w-full flex items-center gap-x-2">
          <h2 className="text-xl font-bold">Tags</h2>
          {props.loading ? (
            <div className="loading loading-spinner text-primary loading-sm"></div>
          ) : null}
        </span>
        <ButtonAdd
          label="Ajouter"
          small={true}
          onClickEvent={() => handleCloseDrawer("add-tags")}
        />
      </div>
      <div className="w-full flex flex-col gap-y-4">
        {currentItems.length > 0 ? (
          <ul className="flex gap-2 flex-wrap">
            {currentItems.map((item) => (
              <li key={item.id} onClick={() => handleRemoveItem(item)}>
                <TagItem tag={item} />
              </li>
            ))}
          </ul>
        ) : (
          <SubWrapper>
            <p className="text-xs">Aucun tag sélectionné</p>
          </SubWrapper>
        )}
      </div>
      <RightSideDrawer
        title="Ajouter des tags"
        id="add-tags"
        visible={false}
        onCloseDrawer={handleCloseDrawer}
      >
        <NotSelectedTags
          list={notSelected}
          onAddTag={handleAddItem}
          onCloseDrawer={handleCloseDrawer}
        />
      </RightSideDrawer>
    </section>
  );
};

export default InheritedTags;
