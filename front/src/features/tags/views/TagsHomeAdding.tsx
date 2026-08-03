import { useState, ChangeEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import TagsList from "../../../components/tags/TagsList";
import AddTag from "../../../components/UI/add-tag";
import useTags from "../../../hooks/useTags";
import Tag from "../../../../src/utils/interfaces/tag";
import toast from "react-hot-toast";
import apiClient from "../../../lib/axios";

type TagsHomeAddingProps = {
  onSubmitAllTags: (tags: Tag[]) => Promise<void> | void;
  onCanSubmitChange: (canSubmit: boolean) => void;
};

const TagsHomeAdding = ({
  onSubmitAllTags,
  onCanSubmitChange,
}: TagsHomeAddingProps) => {
  const [tagError, setTagError] = useState(false);
  const { data: initialTags = [] } = useQuery({
    queryKey: ["tags", "all", "create-validation"],
    queryFn: async (): Promise<Tag[]> => {
      const response = await apiClient.get<Tag[]>("/tag");
      return response.data;
    },
  });

  const {
    currentTags,
    tag,
    getTagsWithPendingInput,
    handleCheckTags,
    handleOnChange,
    handleTagSubmit,
    handleRemoveTag,
  } = useTags(initialTags);

  const tagsToSubmit = handleCheckTags(getTagsWithPendingInput());
  const canSubmit = tagsToSubmit.length > 0;
  const duplicateName =
    (tag.trim().length > 0 &&
      initialTags.some(
        (item) =>
          item.name.toLocaleLowerCase() === tag.trim().toLocaleLowerCase(),
      )) ||
    currentTags.some(
      (item) =>
        initialTags.some(
          (existingTag) =>
            existingTag.name.toLocaleLowerCase() ===
            item.name.toLocaleLowerCase(),
        ),
    );

  useEffect(() => {
    onCanSubmitChange(canSubmit);
  }, [canSubmit, onCanSubmitChange]);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setTagError(false);
    handleOnChange(e);
  };

  const handleSubmitAllTags = async () => {
    if (tagsToSubmit.length > 0) {
      await onSubmitAllTags(tagsToSubmit);
    } else {
      toast("Aucun tag n'a été ajouté");
    }
  };

  return (
    <>
      <AddTag
        error={tagError}
        tag={tag}
        placeholder="Exemple : artisanal, technologie, industriel"
        onChangeValue={handleChangeValue}
        onSubmit={handleTagSubmit}
      />
      {duplicateName && (
        <p className="text-sm text-error">
          Ce nom de tag est déjà utilisé.
        </p>
      )}
      <button
        id="modal-submit-btn"
        className="hidden"
        onClick={handleSubmitAllTags}
        type="button"
      />
      <TagsList tagsList={currentTags} onRemove={handleRemoveTag} />
    </>
  );
};

export default TagsHomeAdding;
