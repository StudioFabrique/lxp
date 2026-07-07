import { ReactNode } from "react";
import Tag from "../../../../../../src.legacy/utils/interfaces/tag";
import TagsList from "./tags-list";

interface Props {
  list?: Tag[];
  onAddItems?: (items: number[]) => void;
  onCloseDrawer?: (id: string) => void;
  children?: ReactNode;
}

const ParcoursTagsSelecter = (props: Props) => {
  //  les tags affichés dans la partie inférieure du drawer, cette liste est filtrée avec le terme de la recherche
  // const [tags, setTags] = useState(props.list);
  //  valeur du champs de formulaire dédié à la recherche de tags

  //  liste des tags affichée dans la partie supérieure du drawer
  //const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  // ajoute des tags à la liste des tags sélectionnés
  const handleAddTag = (id: number) => {
    const ids = [id];
    props.onAddItems!(ids);
  };

  return (
    <div className="w-[35rem] flex flex-col gap-y-4">
      {props.children ? props.children : null}
      {props.list && props.list.length > 0 ? (
        <TagsList list={props.list} onAddTag={handleAddTag} />
      ) : (
        <p>Tous les tags ont été sélectionnés</p>
      )}
    </div>
  );
};
export default ParcoursTagsSelecter;
