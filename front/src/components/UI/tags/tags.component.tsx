import { FC, useEffect, useMemo } from "react";

import Tag from "../../../utils/interfaces/tag";
import TagItem from "../tag-item/tag-item";
import createTag from "../../../utils/tags";
import useItems from "../../../hooks/use-items";
import SearchDropdown from "../search-dropdown/search-dropdown";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import Wrapper from "../wrapper/wrapper.component";

const tagsFixtures = createTag();
let initialState = true;

const Tags: FC<{
  reduxTags?: Array<Tag>;
  unselectedTags?: Array<Tag>;
  onSubmitTags: (tags: Array<Tag>) => void;
  title?: string;
}> = ({
  reduxTags = [],
  unselectedTags = tagsFixtures,
  onSubmitTags,
  title,
}) => {
  const {
    selectedItems,
    filteredItems,
    addItem,
    filterItems,
    resetFilterItems,
    removeItem,
    initItems,
    initSelectedItems,
  } = useItems();

  useEffect(() => {
    return () => {
      initialState = true;
    };
  }, []);

  useEffect(() => {
    if (initialState) {
      initItems(unselectedTags);
      initSelectedItems(reduxTags);
      initialState = false;
    }
  }, [reduxTags, unselectedTags, initItems, initSelectedItems]);

  const handleRemoveTag = (tag: Tag) => {
    removeItem(tag, "name");
  };

  const selectedTags = useMemo(() => {
    return {
      tags: selectedItems,
    };
  }, [selectedItems]);

  useEffect(() => {
    console.log("tags submitted");

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
        <h2 className="text-xl font-bold">{title ?? "Tags"}</h2>
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
