import { FC, useEffect, useMemo } from "react";

import Tag from "../../../utils/interfaces/tag";
import TagItem from "../tag-item/tag-item";
import createTag from "../../../utils/tags";
import { sortArray } from "../../../utils/sortArray";
import useItems from "../../../hooks/use-items";
import SearchDropdown from "../search-dropdown/search-dropdown";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import Wrapper from "../wrapper/wrapper.component";

const tags = createTag();

const Tags: FC<{ onSubmitTags: (tags: Array<Tag>) => void }> = ({
  onSubmitTags,
}) => {
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
    <div className="h-fit">
      <Wrapper>
        <h2 className="text-xl font-bold">Tags</h2>
        <SearchDropdown
          addItem={addItem}
          filterItems={filterItems}
          resetFilterItems={resetFilterItems}
          filteredItems={filteredItems}
          property="name"
          placeHolder="Ajouter un nouveau tag..."
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
      </Wrapper>
    </div>
  );
};

export default Tags;
