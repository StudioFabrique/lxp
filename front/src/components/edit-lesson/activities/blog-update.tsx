/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Import des dépendances nécessaires
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Activity from "../../../utils/interfaces/activity";
import markdownit from "markdown-it";
import { lessonActions } from "../../../store/redux-toolkit/lesson/lesson";
import Editor from "../../markdown-editor/mark-down-editor";
import Markdown from "react-markdown";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { fromHtmlToMarkdown } from "../../../helpers/html-parser";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { ACTIVITIES } from "../../../config/urls";

// Définition des props du composant
type Props = {
  activity: Activity; // L'activité à éditer/afficher
  isEditing: boolean; // État d'édition
  onSubmitted: (newValue: boolean) => void; // Callback après soumission
};

// Initialisation de markdown-it pour le rendu markdown
const md = markdownit();

export const BlogUpdate = ({ activity, isEditing, onSubmitted }: Props) => {
  const dispatch = useDispatch();
  const { sendRequest, error, isLoading } = useHttp();

  // État local pour stocker le contenu en markdown et HTML
  const [content, setContent] = useState({
    markdown: "",
    html: "",
  });

  // Effet pour charger le contenu markdown quand l'activité change
  useEffect(() => {
    const fetchMarkdown = async () => {
      if (!activity?.url) return;

      try {
        const response = await fetch(`${ACTIVITIES}${activity.url}`);
        const mdContent = await response.text();
        setContent((prev) => ({
          ...prev,
          markdown: mdContent,
        }));
      } catch (error) {
        console.error("Error fetching markdown:", error);
        toast.error("Failed to load content");
      }
    };

    fetchMarkdown();
  }, [activity]);

  // Effet pour gérer les erreurs HTTP
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Gestionnaire de mise à jour du contenu
  const handleUpdate = async (
    description: string,
    newValue: string,
    title: string,
    type: string
  ) => {
    try {
      // Conversion du HTML en markdown
      const convertedMarkdown = await fromHtmlToMarkdown(newValue);

      // Envoi de la requête de mise à jour
      const response = await sendRequest({
        path: `/activity/${activity.id!}`,
        method: "put",
        body: {
          value: convertedMarkdown,
          type,
          title,
          description,
        },
      });

      // Gestion de la réponse
      if (response.success) {
        toast.success(response.message);
        onSubmitted(false);
        setContent((prev) => ({
          ...prev,
          html: newValue,
        }));
      }
    } catch (err) {
      console.error("Error updating content:", err);
      toast.error("Failed to update content");
    }
  };

  // Gestionnaire d'annulation de l'édition
  const handleCancelEdition = () => {
    dispatch(lessonActions.setBlogEdition(null));
  };

  return (
    <div className="w-full">
      {isEditing ? (
        // Mode édition : affiche l'éditeur
        <Editor
          title={activity.title}
          description={activity.description}
          content={content.html || md.render(content.markdown)}
          isSubmitting={isLoading}
          onSubmit={handleUpdate}
          onCancel={handleCancelEdition}
        />
      ) : (
        // Mode lecture : affiche le contenu markdown
        <div className="w-full">
          <Wrapper>
            <div className="p-4 flex justify-center">
              <Markdown className="prose prose-h1:text-primary prose-h1:text-center prose-a:text-center prose-img:max-w-4/6 prose-img:text-center prose-p:text-justify prose-ul:ml-8 w-full">
                {content.markdown}
              </Markdown>
            </div>
          </Wrapper>
        </div>
      )}
    </div>
  );
};

export default BlogUpdate;
