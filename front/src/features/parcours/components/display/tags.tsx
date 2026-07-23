import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import TagItem from "../../../../components/UI/tag-item/tag-item";
import { useParams } from "react-router";
import { useParcoursQuery } from "../../hooks/useParcoursQuery";
import type Tag from "../../../../utils/interfaces/tag";

const Tags = () => {
  const { id } = useParams();
  const { data: parcours } = useParcoursQuery(id ? Number(id) : undefined);
  const tags = (parcours?.tags ?? []).map((item) =>
    "tag" in item ? (item.tag as Tag) : item,
  );

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
