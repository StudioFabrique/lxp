import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tagSelectionSchema, tagDraftSchema } from "../features/tags/tag.schema";
import { useFormField } from "../components/form/useFormField";
import { showFormErrors } from "../components/form/form-errors";
import { ChangeEvent, useCallback } from "react";
import type Tag from "../utils/interfaces/tag";
import {
  addPendingTag,
  partitionTagInput,
} from "../features/tags/helpers/tag-selection";

const useTags = (initialTags: Tag[]) => {
  const form = useForm({ resolver: zodResolver(tagSelectionSchema), defaultValues: { tags: [] as Tag[] } });
  const [currentTags, setCurrentTags] = useFormField(form, "tags");
  const draftForm = useForm({ resolver: zodResolver(tagDraftSchema), defaultValues: { tag: "" } });
  const [tag, setTag] = useFormField(draftForm, "tag");

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const { committed, pending } = partitionTagInput(value);

    if (!committed) {
      setTag(pending);
      return;
    }

    setCurrentTags((current) =>
      addPendingTag(current, initialTags, committed),
    );
    setTag(pending);
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
    [initialTags, setCurrentTags],
  );

  const submitTags = async (onSubmit: (tags: Tag[]) => void | Promise<void>) => {
    form.setValue("tags", handleCheckTags(getTagsWithPendingInput()), { shouldDirty: true });
    await form.handleSubmit(async ({ tags }) => onSubmit(tags), showFormErrors)();
  };
  return {
    submitTags,
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
