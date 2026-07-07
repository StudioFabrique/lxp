import { useState, ChangeEvent } from "react";
import Tag from "../../../../src.legacy/utils/interfaces/tag";

type TagsHomeEditingProps = {
  tag: Tag;
  onSubmitTag: (id: number, name: string) => void;
};

const TagsHomeEditing = ({ tag, onSubmitTag }: TagsHomeEditingProps) => {
  const [tagName, setTagName] = useState(tag.name);
  const [tagError, setTagError] = useState(false);

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setTagError(false);
    setTagName(e.currentTarget.value);
  };

  const handleSubmitTag = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitTag(tag.id, tagName);
  };

  return (
    <form onSubmit={handleSubmitTag} className="flex flex-col items-center gap-4 py-5 px-1">
      <input
        className={`input ${tagError && "input-error"}`}
        value={tagName}
        onChange={handleChangeValue}
      />
      <button type="submit" id="modal-submit-btn" className="hidden" />
    </form>
  );
};

export default TagsHomeEditing;
