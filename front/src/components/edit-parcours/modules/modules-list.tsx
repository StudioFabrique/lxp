import { Edit2Icon, Trash2 } from "lucide-react";
import placeholder from "../../../assets/images/cat.webp";

type Props = {
  id: number;
  title: string;
  thumb?: string;
};

export default function ModulesList(props: Props) {
  return (
    <div className="card bg-base-100 h-38 image-full w-70 shadow-sm">
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
          >
            <Edit2Icon className="w-4 h-4" />
            Modifier
          </button>
          <button
            className="btn btn-sm tooltip tooltip-bottom"
            data-tip="Supprimer le module"
            aria-label="Supprimer le module"
          >
            <Trash2 className="w-4 h-4 text-error" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
