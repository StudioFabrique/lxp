import { Edit2Icon, Trash2 } from "lucide-react";
import placeholder from "../../../assets/images/cat.webp";
import { ModuleData } from "../../../utils/interfaces/new-module";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";

type Props = {
  id: number;
  title: string;
  thumb: string | null;
  duration?: number;
  description: string;
  quizInstructions?: string;
  contacts: Contact[];
  skills: Skill[];
  onUpdate: (module: ModuleData) => void;
  onDelete: (id: number) => void;
};

export default function ModulesList(props: Props) {
  const handleUpdate = () => {
    const moduleToUpdate: ModuleData = {
      id: props.id,
      title: props.title,
      thumb: props.thumb,
      duration: props.duration,
      description: props.description,
      quizInstructions: props.quizInstructions,
      contacts: props.contacts,
      skills: props.skills,
    };
    props.onUpdate(moduleToUpdate);
  };

  return (
    <div className="card bg-base-100 h-38 image-full w-74 shadow-sm">
      <figure>
        <img
          className="object-cover w-full"
          src={
            props.thumb ? `data:image/jpeg;base64,${props.thumb}` : placeholder
          }
          alt="Shoes"
        />
      </figure>
      <div className="card-body border border-primary/50 rounded-xl">
        <h2 className="card-title">{props.title}</h2>
        <div className="flex-1" />
        <div className="card-actions justify-around gap-x-2">
          <button
            className="btn btn-sm tooltip tooltip-bottom"
            data-tip="Modifier le module"
            aria-label="Modifier le module"
            onClick={handleUpdate}
          >
            <Edit2Icon className="w-4 h-4" />
            Modifier
          </button>
          <button
            className="btn btn-sm tooltip tooltip-bottom"
            type="button"
            data-tip="Supprimer le module"
            aria-label="Supprimer le module"
            onClick={() => props.onDelete(props.id)}
          >
            <Trash2 className="w-4 h-4 text-error" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
