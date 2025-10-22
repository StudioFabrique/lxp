import { useState, forwardRef, ChangeEvent, useMemo } from "react";
import TagsList from "../../components/formation-home/tags-list";
import AddTag from "../../components/UI/add-tag";
import useTags from "../../hooks/use-tags";
import Tag from "../../utils/interfaces/tag";

import toast from "react-hot-toast";

type TagsHomeAddingProps = { onSubmitAllTags: (tags: Tag[]) => void };

const TagsHomeAdding = forwardRef<
  HTMLButtonElement | null,
  TagsHomeAddingProps
>((props, ref) => {
  const [tagError, setTagError] = useState<boolean>(false);
  const initialTags = useMemo(() => [], []);

  const { currentTags, tag, handleOnChange, handleTagSubmit, handleRemoveTag } =
    useTags(initialTags);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setTagError(false);

    handleOnChange(e);
  };

  const handleSubmitAllTags = () => {
    if (currentTags.length > 0) {
      props.onSubmitAllTags(currentTags);
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

      <button ref={ref} className="hidden" onClick={handleSubmitAllTags} />

      <TagsList tagsList={currentTags} onRemove={handleRemoveTag} />
    </>
  );
});

export default TagsHomeAdding;
