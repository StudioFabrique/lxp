import { useState, ChangeEvent, useMemo } from "react";
import TagsList from "../../../../src.legacy/components/formation-home/tags-list";
import AddTag from "../../../../src.legacy/components/UI/add-tag";
import useTags from "../../../../src.legacy/hooks/use-tags";
import Tag from "../../../../src.legacy/utils/interfaces/tag";
import toast from "react-hot-toast";

type TagsHomeAddingProps = { onSubmitAllTags: (tags: Tag[]) => void };

const TagsHomeAdding = ({ onSubmitAllTags }: TagsHomeAddingProps) => {
  const [tagError, setTagError] = useState(false);
  const initialTags = useMemo(() => [], []);

  const { currentTags, tag, handleOnChange, handleTagSubmit, handleRemoveTag } =
    useTags(initialTags);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setTagError(false);
    handleOnChange(e);
  };

  const handleSubmitAllTags = () => {
    if (currentTags.length > 0) {
      onSubmitAllTags(currentTags);
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
      <button id="modal-submit-btn" className="hidden" onClick={handleSubmitAllTags} />
      <TagsList tagsList={currentTags} onRemove={handleRemoveTag} />
    </>
  );
};

export default TagsHomeAdding;
