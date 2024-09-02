import { ReactNode, useEffect, useState } from "react";
import Tag from "../../../utils/interfaces/tag";
import { sortArray } from "../../../utils/sortArray";
import TagItem from "../../UI/tag-item/tag-item";
import SearchTag from "./search-tag";

interface Props {
  list?: Tag[];
  onAddItems?: (items: number[]) => void;
  onCloseDrawer?: (id: string) => void;
  formationTags: Tag[];
  children?: ReactNode;
}

const ParcoursTagsSelecter = (props: Props) => {
  const [tags, setTags] = useState(props.list);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  const handleAddTag = (id: number) => {
    const ids = [id];
    props.onAddItems!(ids);
  };

  useEffect(() => {
    let updatedTags: Tag[] = [];
    props.formationTags.forEach((elem) => {
      const newTag = tags?.find((item) => item.id === elem.id);
      if (newTag) updatedTags = [...updatedTags, newTag];
    });
    setFilteredTags(updatedTags);
  }, [props.formationTags, tags]);

  useEffect(() => {
    if (searchTerm.length > 0)
      setTags(
        props.list?.filter((item) =>
          item.name.toLocaleLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    else setTags(props.list);
  }, [searchTerm, props.list]);

  return (
    <div className="flex flex-col gap-y-4">
      {(filteredTags && filteredTags.length > 0) ||
      (tags && tags?.length > 0) ? (
        <>
          {filteredTags.length > 0 ? (
            <ul className="w-[30rem] flex flex-wrap gap-2">
              {sortArray(filteredTags, "name").map((tag) => (
                <div key={tag.id} onClick={() => handleAddTag(tag.id)}>
                  <TagItem tag={tag} noIcon={true} />
                </div>
              ))}
            </ul>
          ) : props.children ? (
            props.children
          ) : null}
          <p className="divider">Tous les tags</p>
          <SearchTag searchTerm={searchTerm} onSetSearchTerm={setSearchTerm} />
          {tags && tags.length > 0 ? (
            <ul className="w-[30rem] flex flex-wrap gap-2 overflow-auto">
              {sortArray(tags, "name").map((tag) => (
                <div key={tag.id} onClick={() => handleAddTag(tag.id)}>
                  <TagItem tag={tag} noIcon={true} />
                </div>
              ))}
            </ul>
          ) : (
            <p>Aucun tag de disponible</p>
          )}
        </>
      ) : (
        <p>Tous les tags ont été sélectionnés</p>
      )}
    </div>
  );
};
export default ParcoursTagsSelecter;
