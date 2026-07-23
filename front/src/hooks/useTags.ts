import { ChangeEvent, useCallback, useEffect, useState } from "react";
import type Tag from "../utils/interfaces/tag";
import { createTag } from "../features/tags/hooks/create-tag";

const useTags = (initialTags: Tag[]) => {
  const [notSelected, setNotSelected] = useState<Tag[]>([]);
  const [currentTags, setCurrentTags] = useState<Tag[]>([]);
  const [tag, setTag] = useState<string>("");

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTag(event.currentTarget.value);
  };

  const handleTagSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const exisitingTag = notSelected.find(
      (item) => item.name.toLowerCase() === tag.toLowerCase(),
    );
    if (!exisitingTag) {
      const exisitingCurrentTag = currentTags.find(
        (item) => item.name.toLowerCase() === tag.toLowerCase(),
      );
      if (!exisitingCurrentTag) {
        setCurrentTags((prevState) => [
          ...prevState,
          createTag(tag, initialTags.length + currentTags.length),
        ]);
        setTag("");
      }
    } else {
      setCurrentTags((prevState) => [...prevState, exisitingTag]);
      setTag("");
    }
  };

  const handleRemoveTag = (id: number) => {
    setCurrentTags((prevState) => prevState.filter((item) => item.id !== id));
  };

  const handleCheckTags = useCallback(() => {
    return currentTags.filter(
      (item) =>
        !initialTags.find(
          (elem) => elem.name.toLowerCase() === item.name.toLowerCase(),
        ),
    );
  }, [currentTags, initialTags]);

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

  useEffect(() => {
    const tags = initialTags.filter(
      (item) => !currentTags.find((elem) => elem.id === item.id),
    );
    setNotSelected(tags);
  }, [currentTags, initialTags]);

  return {
    tag,
    handleSetCurrentTags,
    currentTags,
    handleOnChange,
    handleTagSubmit,
    handleRemoveTag,
    handleCheckTags,
    resetTags,
    updatedTags,
  };
};

export default useTags;
