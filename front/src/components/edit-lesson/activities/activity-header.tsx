import { Link } from "react-router-dom";

type Props = {
  title: string;
  onCancel?: () => void;
};

const ActivityHeader = ({ title, onCancel }: Props) => {
  return (
    <article className="w-full flex justify-between items-center">
      <h1 className="text-xl font-bold">{title}</h1>
      {onCancel ? (
        <button className="btn btn-primary btn-sm" onClick={onCancel}>
          Annuler
        </button>
      ) : (
        <Link className="btn btn-primary btn-sm" to="..">
          Retour
        </Link>
      )}
    </article>
  );
};

export default ActivityHeader;
