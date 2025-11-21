import { ChangeEvent, useState } from "react";
import Field from "../UI/forms/field";
import QuestionMarkTooltip from "../UI/question-mark-tooltip/question-mark-tooltip";
import { HelpCircle, Loader } from "lucide-react";
import CustomError from "../../utils/interfaces/custom-error";
import TagsList from "../formation-home/tags-list";
import FieldArea from "../UI/forms/field-area";
import FormUploadImage from "../UI/form-upload-image";
import useImageUpload from "../../hooks/use-image-upload";
import Tag from "../../utils/interfaces/tag";

type Props = {
  mode: "create" | "update";
  data: {
    values: Record<string, unknown>;
    errors: CustomError[];
    onChangeValue: (field: string, value: string) => void;
  };
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  tags: { id: number; name: string; color: string }[];
  setTags: (tags: Tag[]) => void;

  tagError: boolean;
  onTagError: (tagError: boolean) => void;
  onSetFile: (file: File | null) => void;
};

let i = 0;

export default function ResourceForm({
  mode = "create",
  data,
  onSubmit,
  isLoading,
  tags,
  setTags,
  tagError,
  onTagError,
  onSetFile,
}: Props) {
  const [inputTag, setInputTag] = useState<string>("");
  const { handleFileChange } = useImageUpload(5000000, onSetFile);

  const getSoftColor = () => {
    // Plage entre 40 et 180 pour chaque composante
    const min = 40,
      max = 180;
    const r = Math.floor(Math.random() * (max - min) + min);
    const g = Math.floor(Math.random() * (max - min) + min);
    const b = Math.floor(Math.random() * (max - min) + min);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const style = tagError
    ? "input input-sm input-error focus:outline-none w-full"
    : "input input-sm focus:outline-none w-full";

  const handleSubmit = () => {
    // Génère une couleur RGB aléatoire
    const color = getSoftColor();

    const result = {
      name: inputTag,
      color,
      id: i++,
    };

    setTags([...tags, result]);
    onTagError(false);
  };

  const handleUpdateTag = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInputTag(value);
  };

  // Detecte qd la touche enter est pressée
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSubmit();
      setInputTag("");
    }
  };

  const removeTag = (id: number) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  return (
    <>
      <h2 className="text-lg font-bold">Ressource</h2>
      <form className="flex flex-col gap-y-4">
        <Field
          placeholder="Titre de la ressource"
          label="Titre"
          name="title"
          type="text"
          data={data}
        />
        <label>Tags</label>
        <span className="flex items-center gap-x-2 w-full">
          <input
            className={style}
            type="text"
            name="tag"
            placeholder="Ajouter un tag"
            value={inputTag}
            onChange={handleUpdateTag}
            onKeyDown={handleKeyDown} // Ajouté ici
          />
          <QuestionMarkTooltip
            tooltipValue="Les tags aident à trouver du contenu par mots clés."
            tooltipPosition="left"
          >
            <HelpCircle className="w-6 h-6 text-primary" />
          </QuestionMarkTooltip>
        </span>
        <p className="text-xs text-secondary pl-1">
          Appuyer sur la touche "Entrée" après avoir saisi un nom de tag pour
          l'ajouter à la liste.
        </p>
        <TagsList tagsList={tags} onRemove={removeTag} />
        <FieldArea
          placeholder="Description de la ressource"
          label="Description"
          name="description"
          data={data}
        />
        <FormUploadImage onSetFile={handleFileChange} />
        <div className="w-full flex justify-end">
          <button
            disabled={isLoading}
            className="btn btn-primary"
            type="button"
            onClick={onSubmit}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin" />
                <p>Envoi...</p>
              </>
            ) : mode === "create" ? (
              "Ajouter la ressource"
            ) : (
              "Mettre à jour la ressource"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
