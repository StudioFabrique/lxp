import { FC } from "react";
import Tags from "../../../UI/tags/tags.component";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import Tag from "../../../../utils/interfaces/tag";

const GroupTags: FC<{ onSubmitTags: (tags: Array<Tag>) => void }> = ({
  onSubmitTags,
}) => (
  <Wrapper>
    <Tags onSubmitTags={onSubmitTags} />
  </Wrapper>
);

export default GroupTags;
