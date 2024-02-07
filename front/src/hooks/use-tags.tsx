import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Tag from "../utils/interfaces/tag";
import { createTag } from "../helpers/create-tag";

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
      (item) => item.name.toLowerCase() === tag.toLowerCase()
    );
    if (!exisitingTag) {
      const exisitingCurrentTag = currentTags.find(
        (item) => item.name.toLowerCase() === tag.toLowerCase()
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
    console.log({ id, currentTags });
    console.log({ notSelected });

    setCurrentTags((prevState) => prevState.filter((item) => item.id !== id));
    console.log({ currentTags });
  };

  const handleCheckTags = () => {
    let tags = Array<Tag>();
    currentTags.forEach((item) => {
      if (!initialTags.find((elem) => elem.id === item.id))
        tags = [...tags, item];
    });
    return tags;
  };

  const resetTags = () => {
    setCurrentTags([]);
  };

  const updatedTags = (newTags: Tag[]) => {
    let updatedTags = Array<Tag>();
    let updatedCurrentTags = currentTags;

    newTags.forEach((item) => {
      if (
        currentTags.find(
          (elem) => elem.name.toLowerCase() === item.name.toLowerCase()
        )
      ) {
        updatedTags = [...updatedTags, item];
        updatedCurrentTags = updatedCurrentTags.filter(
          (elem) => elem.name.toLowerCase() !== item.name.toLowerCase()
        );
      }
    });
    return [...updatedTags, ...currentTags];
  };

  useEffect(() => {
    let tags = Array<Tag>();
    initialTags.forEach((item) => {
      if (!currentTags.find((elem) => elem.id === item.id))
        tags = [...tags, item];
    });
    setNotSelected(tags);
  }, [currentTags, initialTags]);

  return {
    tag,
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
