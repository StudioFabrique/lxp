import { useState, forwardRef, ChangeEvent } from "react";
import Tag from "../../utils/interfaces/tag";

type TagsHomeEditingProps = {
  tag: Tag;
  onSubmitTag: (id: number, name: string) => void;
};

const TagsHomeEditing = forwardRef<
  HTMLButtonElement | null,
  TagsHomeEditingProps
>((props, ref) => {
  const [tagName, setTagName] = useState<string>(props.tag.name);
  const [tagError, setTagError] = useState<boolean>(false);

  // here manage the tagError state while validate input regex
  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    // if (regexIncorrect) {
    //   setTagError(true);
    //   return;
    // }

    setTagError(false);

    setTagName(e.currentTarget.value);
  };

  const handleSubmitTag = (e: React.FormEvent) => {
    e.preventDefault();
    props.onSubmitTag(props.tag.id, tagName);
  };

  return (
    <form
      onSubmit={handleSubmitTag}
      className="flex flex-col items-center gap-4 py-5 px-1"
    >
      <input
        className={`input ${tagError && "input-error"}`}
        value={tagName}
        onChange={handleChangeValue}
      />
      <button type="submit" ref={ref} className="hidden" />
    </form>
  );
});

export default TagsHomeEditing;
