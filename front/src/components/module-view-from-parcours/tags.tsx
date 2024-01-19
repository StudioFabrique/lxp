import Tag from "../../utils/interfaces/tag";
import Wrapper from "../UI/wrapper/wrapper.component";

type TagsProps = {
  tags: Tag[];
};

const Tags = ({ tags }: TagsProps) => {
  return (
    <Wrapper>
      <div className="flex flex-col gap-2 p-2">
        <h3 className="text-xl font-bold">Ressources & Contacts</h3>
        <ul className="list-disc pl-5">
          {tags.map((tag) => (
            <li>{tag.name}</li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
};

export default Tags;
