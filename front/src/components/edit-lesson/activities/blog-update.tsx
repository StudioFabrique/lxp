/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Import des dépendances nécessaires pour le composant
import { useEffect, useState } from "react";
import Activity from "../../../utils/interfaces/activity"; // Interface définissant la structure d'une activité
import markdownit from "markdown-it"; // Bibliothèque pour parser le markdown
import Editor from "../../markdown-editor/mark-down-editor"; // Composant éditeur personnalisé
import toast from "react-hot-toast"; // Notifications toast
import Wrapper from "../../UI/wrapper/wrapper.component"; // Composant wrapper UI
import { ACTIVITIES } from "../../../config/urls"; // URLs de l'API
import { useNavigate } from "react-router-dom"; // Hook de navigation
import { marked } from "marked";

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
        const htmlFromMarkdown = await marked(mdContent);
        // Met à jour l'état avec le contenu markdown
        setContent((prev) => ({
          ...prev,
          markdown: mdContent,
          html: htmlFromMarkdown,
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

  console.log({ content });

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
            <article className="max-w-4xl mx-auto px-4 py-8">
              <div
                className="prose prose-lg mx-auto
                  prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8
                  prose-h2:text-2xl prose-h2:mt-8
                  prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-accent
                  prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:w-full prose-img:h-auto
                  prose-ul:ml-8 prose-ul:list-disc
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: content.html }}
              />
            </article>
          </Wrapper>
        </div>
      )}
    </div>
  );
};

export default BlogUpdate;
