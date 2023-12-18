import Tag from "../../../utils/interfaces/tag";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import TagItem from "../../UI/tag-item/tag-item";

interface LessonTagsProps {
  list: Tag[];
  onAddItems?: (tag: Tag) => void;
}

const LessonTags = (props: LessonTagsProps) => {
  // ajoute un tag au formulaire de création de leçon
  const handleAddTag = (tag: Tag) => {
    props.onAddItems!(tag);
    handleToggleDrawer("add-tag");
  };

  /**
   * gère l'ouverture et la fermeture du drawer
   * @param id string
   */
  const handleToggleDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  return (
    <RightSideDrawer
      title="Ajouter un tag"
      id="add-tag"
      onCloseDrawer={handleToggleDrawer}
      buttonTitle="Ajouter un tag"
    >
      {props.list && props.list.length > 0 ? (
        <>
          <p className="mb-4">Choisissez un tag :</p>
          <ul className="w-[30rem] flex flex-wrap gap-2">
            {props.list.map((tag) => (
              <div key={tag.id} onClick={() => handleAddTag(tag)}>
                <TagItem tag={tag} noIcon={true} />
              </div>
            ))}
          </ul>
        </>
      ) : null}
    </RightSideDrawer>
  );
};
export default LessonTags;
