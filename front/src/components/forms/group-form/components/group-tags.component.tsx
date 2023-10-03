import { FC } from "react";
import Tags from "../../../UI/tags/tags.component";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import Tag from "../../../../utils/interfaces/tag";
import { useSelector } from "react-redux";

const GroupTags: FC<{ onSubmitTags: (tags: Array<Tag>) => void }> = ({
  onSubmitTags,
}) => {
  const tagsList = useSelector((state: any) => state.tags);

  console.log(tagsList.initialTags);

  return (
    <Wrapper>
      <Tags onSubmitTags={onSubmitTags} />
    </Wrapper>
  );
};

export default GroupTags;
