import { FC } from "react";
import Tag from "../../../utils/interfaces/tag";

const TagItem: FC<{ tag: Tag }> = ({ tag }) => {
  const setTagClass = () => {
    return `btn btn-sm btn-info px-4 py-1 font-normal rounded-lg ${tag.color} hover:brightness-125}`;
  };

  return (
    <div>
      <button className={setTagClass()}>{`#${tag.name}`}</button>
    </div>
  );
};

export default TagItem;
