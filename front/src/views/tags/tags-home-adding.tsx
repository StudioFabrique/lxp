import { useState, forwardRef, ChangeEvent, useMemo } from "react";
import TagsList from "../../components/formation-home/tags-list";
import AddTag from "../../components/UI/add-tag";
import useTags from "../../hooks/use-tags";
import Tag from "../../utils/interfaces/tag";

type TagsHomeAddingProps = { onSubmitAllTags: (tags: Tag[]) => void };

const TagsHomeAdding = forwardRef<
  HTMLButtonElement | null,
  TagsHomeAddingProps
>((props, ref) => {
  const [tagError, setTagError] = useState<boolean>(false);
  const initialTags = useMemo(() => [], []);

  const { currentTags, tag, handleOnChange, handleTagSubmit, handleRemoveTag } =
    useTags(initialTags);

  // here manage the tagError state while validate input regex
  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // if (regexIncorrect) {
    //   setTagError(true);
    //   return;
    // }

    setTagError(false);

    handleOnChange(e);
  };

  const handleSubmitAllTags = () => {
    props.onSubmitAllTags(currentTags);
  };

  return (
    <div className="flex flex-col gap-4 py-5 px-1">
      <AddTag
        error={tagError}
        tag={tag}
        placeholder="Exemple : artisanal, technologie, industriel"
        onChangeValue={handleChangeValue}
        onSubmit={handleTagSubmit}
      />

      <button ref={ref} className="hidden" onClick={handleSubmitAllTags} />

      <TagsList tagsList={currentTags} onRemove={handleRemoveTag} />
    </div>
  );
});

export default TagsHomeAdding;
