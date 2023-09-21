import { useSelector } from "react-redux";
import Wrapper from "../UI/wrapper/wrapper.component";
import Tag from "../../utils/interfaces/tag";

const ParcoursViewTags = () => {
  const tags = useSelector((state: any) => state.tags.currentTags) as Tag[];

  const tagsList =
    tags.length > 0 ? (
      tags.map((tag) => (
        <p className="bg-secondary py-2 px-5 rounded-lg">{`# ${tag.name}`}</p>
      ))
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

export default ParcoursViewTags;
