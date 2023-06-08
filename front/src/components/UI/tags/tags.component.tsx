import React, { FC, useEffect, useMemo } from "react";
import Tag from "../../../utils/interfaces/tag";
//import useHttp from "../../../hooks/use-http";
import TagItem from "../tag-item/tag-item";
import createTag from "../../../utils/tags";
import { sortArray } from "../../../utils/sortArray";
import useItems from "../../../hooks/use-items";
import SearchDropdown from "../search-dropdown/search-dropdown";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

const tags = createTag();

const Tags: FC<{ onSubmitTags: (tags: Array<Tag>) => void }> = ({
  onSubmitTags,
}) => {
  console.log("tag is rendering");
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

  const selectedTags = useMemo(() => {
    return {
      tags: selectedItems,
    };
  }, [selectedItems]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedTags.tags.length > 0) {
        onSubmitTags(selectedTags.tags);
      }
    }, autoSubmitTimer);
    return () => {
      clearTimeout(timer);
    };
  }, [selectedTags.tags, onSubmitTags]);

  return (
    <div className="flex flex-col p-4 rounded-lg bg-secondary/10 gap-y-4">
      <h2 className="text-xl font-bold">Tags</h2>
      <SearchDropdown
        addItem={addItem}
        filterItems={filterItems}
        resetFilterItems={resetFilterItems}
        filteredItems={filteredItems}
        property="name"
        placeHolder="Ajouter un nouveau tag..."
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z"
            clipRule="evenodd"
          />
        </svg>
      </SearchDropdown>
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

const MemoizedTagsComponent = React.memo(Tags);

export default MemoizedTagsComponent;
