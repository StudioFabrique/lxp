import { useMemo } from "react";
import { Activity } from "../../utils/interfaces/activity";
import ReactPlayer from "react-player";

type Props = {
  activity: Activity;
  onClose: () => void;
};

export default function PreviewResourceActivity(props: Props) {
  const read = useMemo(() => {
    switch (props.activity.type) {
      case "video":
        return (
          <ReactPlayer
            url={props.activity.url}
            controls
            width="800px"
            height="100%"
          />
        );

      // Add other activity types here as needed
      default:
        return <p>Type d'activité non pris en charge pour l'aperçu.</p>;
    }
  }, [props.activity]);

  return (
    <div className="flex flex-col gap-y-4">
      {read}
      <span className="flex justify-end">
        <button
          className="btn btn-primary"
          type="button"
          onClick={props.onClose}
        >
          Fermer
        </button>
      </span>
    </div>
  );
}
