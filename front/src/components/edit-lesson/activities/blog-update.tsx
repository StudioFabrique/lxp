/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Import des dépendances nécessaires pour le composant
import "react-quill/dist/quill.snow.css"; // Styles CSS pour l'éditeur React Quill
import { useEffect, useState } from "react";
import Activity from "../../../utils/interfaces/activity"; // Interface définissant la structure d'une activité
import markdownit from "markdown-it"; // Bibliothèque pour parser le markdown
import Editor from "../../markdown-editor/mark-down-editor"; // Composant éditeur personnalisé
import Markdown from "react-markdown"; // Composant pour rendre le markdown
import toast from "react-hot-toast"; // Notifications toast
import Wrapper from "../../UI/wrapper/wrapper.component"; // Composant wrapper UI
import { ACTIVITIES } from "../../../config/urls"; // URLs de l'API
import { useNavigate } from "react-router-dom"; // Hook de navigation

// Définition des props du composant BlogUpdate
type Props = {
  activity: Activity; // L'activité à éditer/afficher
  isEditing: boolean; // État d'édition (true = mode édition, false = mode lecture)
  onSubmitted: (newValue: boolean) => void; // Callback appelé après la soumission réussie
};

// Initialisation du parser markdown-it avec les options par défaut
const md = markdownit();

export const BlogUpdate = ({ activity, isEditing }: Props) => {
  // Hook de navigation pour la redirection
  const navigate = useNavigate();

  // État local pour gérer le contenu de l'activité
  const [content, setContent] = useState({
    markdown: "", // Contenu au format markdown
    html: "", // Contenu au format HTML (utilisé par l'éditeur)
  });

  // Effet pour charger le contenu markdown initial de l'activité
  useEffect(() => {
    const fetchMarkdown = async () => {
      // Vérifie si l'URL de l'activité existe
      if (!activity?.url) return;

      try {
        // Récupère le contenu markdown depuis l'API
        const response = await fetch(`${ACTIVITIES}${activity.url}`);
        const mdContent = await response.text();
        // Met à jour l'état avec le contenu markdown
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
  }, [activity]); // Se déclenche quand l'activité change

  // Gestionnaire pour annuler l'édition et revenir à la page précédente
  const handleCancelEdition = () => {
    navigate(-1);
  };

  return (
    <div className="w-full">
      {isEditing ? (
        // Mode édition : affiche l'éditeur WYSIWYG
        <Editor
          activity={activity}
          content={content.html || md.render(content.markdown)}
          onCancel={handleCancelEdition}
        />
      ) : (
        // Mode lecture : affiche le contenu markdown avec le style prose
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
