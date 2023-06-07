import { useEffect } from "react";
import Tag from "../../../utils/interfaces/tag";
//import useHttp from "../../../hooks/use-http";
import TagItem from "../tag-item/tag-item";
import createTag from "../../../utils/tags";
import { sortArray } from "../../../utils/sortArray";
import useItems from "../../../hooks/use-items";
import SearchDropdown from "../search-dropdown/search-dropdown";

const tags = createTag();

const Tags = () => {
  //const { sendRequest } = useHttp();
  const {
    selectedItems,
    filteredItems,
    addItem,
    filterItems,
    resetFilterItems,
    removeItem,
    initItems,
  } = useItems();

  useEffect(() => {
    const applyData = (data: any) => {
      initItems(sortArray(data, "name"));
    };
    //  todo : ajouter la requête pour récupérer les tags de la bdd
    applyData(tags);
  }, [initItems]);

  const handleRemoveTag = (tag: Tag) => {
    removeItem(tag, "name");
  };

  return (
    <div className="flex flex-col p-4 rounded-lg bg-secondary/10 gap-y-4">
      <h2 className="text-xl font-bold">Tags</h2>
      <SearchDropdown
        addItem={addItem}
        filterItems={filterItems}
        resetFilterItems={resetFilterItems}
        filteredItems={filteredItems}
        property="name"
      />
      <ul className="flex flex-wrap gap-2">
        {selectedItems && selectedItems.length > 0
          ? selectedItems.map((tag: Tag) => (
              <li key={tag.id} onClick={() => handleRemoveTag(tag)}>
                <TagItem tag={tag} />
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

export default Tags;
