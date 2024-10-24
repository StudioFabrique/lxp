import { useDispatch } from "react-redux";
import { lessonActions } from "../../store/redux-toolkit/lesson/lesson";
import Activity from "../../utils/interfaces/activity";

interface ActionsBtnsGroupProps {
  activity: Activity;
}

export default function ActionsButtonsGroup(props: ActionsBtnsGroupProps) {
  const dispatch = useDispatch();

  /**
   * trigger la suppression du document markdown et des ressources
   * qui lui sont associées au niveau du composant parent.
   * on met à jour une propriété dans le state global qui va déclencher
   * l'affichage d'une modal de confirmation
   */
  const setItemToDelete = () => {
    dispatch(lessonActions.setActivityToDelete(props.activity));
  };

  /**
   * affiche l'éditeur de texte pour une activité de type texte sélectionnée
   */
  const handleToggleEditionMode = () => {
    dispatch(lessonActions.setBlogEdition(props.activity.id));
  };

  return (
    <div className="flex justify-end items-center gap-x-2 mt-4">
      <button
        className="btn btn-outline btn-warning btn-sm"
        onClick={setItemToDelete}
      >
        Supprimer
      </button>
      <button
        className="btn btn-sm btn-primary"
        onClick={handleToggleEditionMode}
      >
        Editer
      </button>
    </div>
  );
}
