import Tag from "../../../../../../src/utils/interfaces/tag";
import { sortArray } from "../../../../../../src/utils/helpers/sort-array";
import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import TagItem from "../../../../../components/UI/tag-item/tag-item";

type Props = {
  list: Tag[];
  onAddTag: (id: number) => void;
};

function TagsList(props: Props) {
  return (
    <div className="flex flex-col gap-y-4">
      <Wrapper>
        <ul className="w-[34rem] flex flex-wrap gap-2">
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
