/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import Tag from "../../utils/interfaces/tag";
import TagItem from "../UI/tag-item/tag-item";

const Tags = () => {
  const tags = useSelector((state: any) => state.tags.currentTags) as Tag[];

  const tagsList =
    tags.length > 0 ? (
      tags.map((tag) => <TagItem key={tag.id} tag={tag} noIcon />)
    ) : (
      <p>Aucun tags</p>
    );

  return (
    <Wrapper>
      <h2 className="text-xl font-bold text-primary">Tags</h2>
      <div className="flex gap-4 flex-wrap overflow-y-auto">{tagsList}</div>
    </Wrapper>
  );
};

export default Tags;
