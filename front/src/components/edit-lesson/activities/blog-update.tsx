/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Activity from "../../../utils/interfaces/activity";
import markdownit from "markdown-it";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import Editor from "../../markdown-editor/mark-down-editor";
import Markdown from "react-markdown";

interface EditorProps {
  activity: Activity;
  isSubmitting: boolean;
  onUpdate: (activity: any) => void;
}

const md = markdownit();

export const BlogUpdate = ({
  activity,
  isSubmitting,
  onUpdate,
}: EditorProps) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState<string>("");
  const blogEdition = useSelector(
    (state: any) => state.lesson.blogEdition
  ) as number;

  /**
   * trigger la mise à jour du document markdown en cours d'édition au niveau
   * du composant parent
   * @param newValue string
   */
  const handleUpdate = async (newValue: string) => {
    onUpdate({
      ...activity,
      value: newValue,
    });
  };

  /**
   * trigger la suppression du document markdown et des ressources
   * qui lui sont associées au niveau du composant parent.
   * on met à jour une propriété dans le state global qui va déclencher
   * l'affichage d'une modal de confirmation
   */
  const setItemToDelete = () => {
    dispatch(lessonActions.setActivityToDelete(activity));
  };

  /**
   * récupère le contenu d'un fichier markdown depuis le serveur
   */
  useEffect(() => {
    if (activity && activity !== undefined) {
      fetch(`http://localhost:5001/activities/${activity.url}`)
        .then((response: any) => response.text())
        //.then((text) => md.render(text))
        .then((mdContent: string) => {
          setValue(mdContent);
        });
    }
  }, [activity, activity.url]);

  /**
   * affiche l'éditeur de texte pour une activité de type texte sélectionnée
   * @param id number
   */
  const handleToggleEditionMode = (id: number) => {
    dispatch(lessonActions.setBlogEdition(id));
  };

  /**
   * annule l'affichage de l'éditeur de texte sans prendre et les
   * mises à jour que le formateur aurait pu y apporter
   */
  const handleCancelEdition = () => {
    dispatch(lessonActions.setBlogEdition(null));
  };

  return (
    <>
      <div className="my-8">
        {blogEdition === activity.id ? (
          <>
            <Editor
              content={md.render(value)}
              isSubmitting={isSubmitting}
              onSubmit={handleUpdate}
              onCancel={handleCancelEdition}
            />
          </>
        ) : (
          <>
            <div className="px-4 py-2 border border-primary/50 rounded-lg shadow-lg">
              <Markdown className="prose">{value}</Markdown>
            </div>
            <div className="flex justify-end items-center gap-x-2 mt-4">
              <button
                className="btn btn-outline btn-warning btn-sm"
                onClick={setItemToDelete}
              >
                Supprimer
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleToggleEditionMode(activity.id!)}
              >
                Editer
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default BlogUpdate;
