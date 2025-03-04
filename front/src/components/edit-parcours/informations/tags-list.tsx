import Tag from "../../../utils/interfaces/tag";
import { sortArray } from "../../../utils/sortArray";
import TagItem from "../../UI/tag-item/tag-item";
import Wrapper from "../../UI/wrapper/wrapper.component";

type Props = {
  list: Tag[];
  onAddTag: (id: number) => void;
};

function TagsList(props: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <Wrapper>
        <ul className="w-[30rem] flex flex-wrap gap-2">
          {sortArray(props.list, "name").map((tag) => (
            <div key={tag.id} onClick={() => props.onAddTag(tag.id)}>
              <TagItem tag={tag} noIcon={true} />
            </div>
          ))}
        </ul>
      </Wrapper>
    </div>
  );
}

export default TagsList;
