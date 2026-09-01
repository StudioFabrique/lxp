import { ChangeEvent, useCallback, useState } from "react";
import type Tag from "../utils/interfaces/tag";
import { addPendingTag } from "../features/tags/helpers/tag-selection";

const useTags = (initialTags: Tag[]) => {
  const [currentTags, setCurrentTags] = useState<Tag[]>([]);
  const [tag, setTag] = useState<string>("");

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const lastSeparatorIndex = value.lastIndexOf(",");

    if (lastSeparatorIndex === -1) {
      setTag(value);
      return;
    }

    setCurrentTags((current) =>
      addPendingTag(
        current,
        initialTags,
        value.slice(0, lastSeparatorIndex),
      ),
    );
    setTag(value.slice(lastSeparatorIndex + 1).trimStart());
  };

  const handleTagSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (tag.trim()) {
      setCurrentTags((current) => addPendingTag(current, initialTags, tag));
      setTag("");
    }
  };

  const handleRemoveTag = (id: number) => {
    setCurrentTags((prevState) => prevState.filter((item) => item.id !== id));
  };

  const handleCheckTags = useCallback((tagsToCheck = currentTags) => {
    return tagsToCheck.filter(
      (item) =>
        !initialTags.find(
          (elem) => elem.name.toLowerCase() === item.name.toLowerCase(),
        ),
    );
  }, [currentTags, initialTags]);

  const getTagsWithPendingInput = useCallback(
    () => addPendingTag(currentTags, initialTags, tag),
    [currentTags, initialTags, tag],
  );

  const resetTags = () => {
    setCurrentTags([]);
  };

  const updatedTags = (newTags: Tag[]) => {
    let updated = currentTags;
    newTags.forEach((item) => {
      updated = updated.filter(
        (elem) => elem.name.toLowerCase() !== item.name.toLowerCase(),
      );
    });
    return [...updated, ...newTags];
  };

  const handleSetCurrentTags = useCallback(
    (ids: number[]) => {
      setCurrentTags(initialTags.filter((item) => ids.includes(item.id)));
    },
    [initialTags],
  );

  return {
    tag,
    handleSetCurrentTags,
    currentTags,
    handleOnChange,
    handleTagSubmit,
    handleRemoveTag,
    handleCheckTags,
    getTagsWithPendingInput,
    resetTags,
    updatedTags,
  };
};

export default useTags;
