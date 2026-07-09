import { useParcoursSelector } from "../../store/ParcoursContext";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import TagItem from "../../../../components/UI/tag-item/tag-item";

const Tags = () => {
  const tags = useParcoursSelector((state) => state.tags.currentTags);

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
