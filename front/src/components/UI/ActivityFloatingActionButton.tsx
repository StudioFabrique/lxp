import { FileStack, Image, TextInitial, Video } from "lucide-react";

type Props = {
  onTypeSelection: (type: "video" | "text" | "image" | "resource") => void;
};

export default function ActivityFloatingActionButton(props: Props) {
  const style = "tooltip tooltip-left";

  const activitiesTypes = [
    {
      type: "video",
      icon: <Video className={style} />,
      tooltip: "Ajouter une activité de type vidéo",
      //tooltip: "Ajouter une activité de type vidéo",
    },
    {
      type: "text",
      icon: <TextInitial className={style} />,
      tooltip: "Ajouter une activité de type texte",
    },
    {
      type: "image",
      icon: <Image className={style} />,
      tooltip: "Ajouter une activité de type image",
    },
    {
      type: "resource",
      icon: <FileStack className={style} />,
      tooltip: "Ajouter une activité de type fichier",
    },
  ];

  return (
    <div className="fab absolute">
      {/* a focusable div with tabIndex is necessary to work on all browsers. role="button" is necessary for accessibility */}
      <div
        tabIndex={0}
        role="button"
        className="btn btn-circle btn-lg btn-primary"
      >
        <svg
          aria-label="New"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-6"
        >
          <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
        </svg>
      </div>

      {/* Main Action button replaces the original button when FAB is open */}
      <button className="fab-main-action btn btn-circle btn-lg btn-primary">
        <svg
          aria-label="New post"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* buttons that show up when FAB is open */}

      {activitiesTypes.map((activity) => (
        <button
          key={activity.type}
          className="fab-action btn btn-circle btn-lg btn-primary tooltip tooltip-left"
          data-tip={activity.tooltip}
          onClick={() =>
            props.onTypeSelection(
              activity.type as "video" | "text" | "image" | "resource",
            )
          }
          aria-label={`Ajouter une activité de type ${activity.type}`}
        >
          {activity.icon}
        </button>
      ))}
    </div>
  );
}
