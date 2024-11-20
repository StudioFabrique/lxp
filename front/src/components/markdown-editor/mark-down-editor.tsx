/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Import des dépendances externes
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import QuillToolbar, { formats } from "./editor-toolbar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { ZodError } from "zod";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

// Import des composants personnalisés
import Wrapper from "../UI/wrapper/wrapper.component";
import Field from "../UI/forms/field";
import FieldArea from "../UI/forms/field-area";

// Import des hooks personnalisés
import useHttp from "../../hooks/use-http";
import useForm from "../UI/forms/hooks/use-form";

// Import des utilitaires et interfaces
import { activiteMetaDataSchema } from "../../lib/validation/lesson/activite-video";
import { validationErrors } from "../../helpers/validate";
import Activity from "../../utils/interfaces/activity";
import { fromHtmlToMarkdown } from "../../helpers/html-parser";

// Définition des props du composant Editor
type EditorProps = {
  activity?: Activity; // L'activité à éditer (optionnel)
  content?: string; // Le contenu initial de l'éditeur (optionnel)
  onCancel: () => void; // Fonction appelée lors de l'annulation
};

export const Editor = ({ activity, content, onCancel }: EditorProps) => {
  // Récupération de la leçon depuis le store Redux
  const { lesson } = useSelector((state: any) => state.lesson);
  const [isLoading, setIsLoading] = useState(false);

  // États et refs
  const [editorContent, setEditorContent] = useState<string>();
  const quillRef = useRef<ReactQuill>(null);
  const { sendRequest } = useHttp();

  // Hook de formulaire personnalisé pour la gestion des champs
  const { errors, values, onChangeValue, onValidationErrors } = useForm();

  // Initialisation du contenu de l'éditeur et des champs du formulaire
  useEffect(() => {
    if (content) {
      setEditorContent(content);
    }
    if (activity?.title) {
      onChangeValue("title", activity.title);
    }
    if (activity?.description) {
      onChangeValue("description", activity.description);
    }
  }, [content, activity?.description, activity?.title, onChangeValue]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async () => {
    try {
      // Récupération du contenu HTML de l'éditeur
      const cleanHtml = quillRef.current?.getEditor().root.innerHTML || "";
      // Conversion du HTML en Markdown
      const markdownContent = await fromHtmlToMarkdown(cleanHtml);
      // Validation des données du formulaire
      activiteMetaDataSchema.parse(values);

      const applyData = (_data: Activity) => {
        toast.success("Activité créée avec succès");
        onCancel();
        setIsLoading(false);
      };

      // Envoi de la requête au serveur
      sendRequest(
        {
          path: `/activity/text/${activity?.id ?? lesson.id}`,
          method: activity?.title ? "put" : "post",
          body: {
            description: values.description,
            value: markdownContent,
            title: values.title,
          },
        },
        applyData
      );
    } catch (error) {
      if (error instanceof ZodError) {
        onValidationErrors(validationErrors(error));
        toast.error("Veuillez remplir tous les champs obligatoires");
      } else {
        toast.error("Une erreur est survenue");
        setIsLoading(false);
      }
    }
  };

  // Gestionnaire pour l'upload d'images
  const imageHandler = useCallback(async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      try {
        // Upload de l'image
        const response = await sendRequest({
          path: "/activity/blog-image",
          method: "post",
          body: formData,
        });

        // Insertion de l'image dans l'éditeur
        if (response?.response && quillRef.current) {
          const range = quillRef.current.getEditor().getSelection();
          quillRef.current
            .getEditor()
            .insertEmbed(
              range?.index || 0,
              "image",
              process.env.NODE_ENV === "development"
                ? "http://localhost:5001/" + response.response
                : response.response
            );
        }
      } catch (error) {
        toast.error("Échec du téléchargement de l'image");
      }
    };

    input.click();
  }, [sendRequest]);

  // Configuration des modules de l'éditeur
  const modules = useMemo(
    () => ({
      toolbar: {
        container: "#toolbar",
        handlers: { image: imageHandler },
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
    }),
    [imageHandler]
  );

  return (
    <div className="my-8 flex flex-col gap-y-4">
      {/* Section des informations de l'activité */}
      <Wrapper>
        <span className="flex flex-col gap-y-2">
          <h2 className="text-lg font-bold">Informations</h2>
          <form className="flex flex-col gap-y-4">
            <Field
              name="title"
              label="Titre *"
              data={{ values, errors, onChangeValue }}
            />
            <FieldArea
              name="description"
              label="Description *"
              data={{ values, errors, onChangeValue }}
            />
          </form>
        </span>
      </Wrapper>

      {/* Éditeur de texte riche */}
      <Wrapper>
        <div className="text-editor text-black bg-white">
          <QuillToolbar />
          <ReactQuill
            ref={quillRef}
            className="min-h-[50vh]"
            theme="snow"
            value={editorContent}
            onChange={setEditorContent}
            placeholder="Écrivez quelque chose..."
            modules={modules}
            formats={formats}
          />
        </div>
      </Wrapper>

      {/* Boutons d'action */}
      <div className="flex justify-between mt-4">
        <button
          type="button"
          className="btn btn-sm btn-outline btn-primary"
          onClick={onCancel}
        >
          Annuler
        </button>
        <button
          type="button"
          className="btn btn-sm btn-primary flex items-center gap-x-2"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading && <Loader2 className="animate-spin" />}
          Valider
        </button>
      </div>
    </div>
  );
};

export default Editor;
