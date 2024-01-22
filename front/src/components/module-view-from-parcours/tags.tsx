import Tag from "../../utils/interfaces/tag";
import Wrapper from "../UI/wrapper/wrapper.component";

type TagsProps = {
  tags: Tag[];
};

const Tags = ({ tags }: TagsProps) => {
  return (
    <Wrapper>
      <div className="flex flex-col gap-2 p-2">
        <h3 className="text-xl font-bold">Tags</h3>
        {tags.length > 0 ? (
          <ul className="list-disc pl-5">
            {tags.map((tag) => (
              <li>{tag.name}</li>
            ))}
          </ul>
        ) : (
          <p>Aucun tags</p>
        )}
      </div>
    </Wrapper>
  );
};

export default Tags;
