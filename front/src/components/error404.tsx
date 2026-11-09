import { Link } from "react-router";
import EmptyStatePlaceholder from "./UI/empty-state-placeholder";

type Props = {
  title?: string;
  message?: string;
  /** Destination du bouton ; « .. » renvoie à la liste, qui peut rediriger vers la même page. */
  backTo?: string;
  backLabel?: string;
};

const Error404 = ({
  title = "Parcours introuvable",
  message = "Ce parcours n’existe pas ou n’est pas encore disponible.",
  backTo = "..",
  backLabel = "Voir les parcours",
}: Props) => {
  return (
    <EmptyStatePlaceholder title={title} withBorder={false}>
      <p className="text-center text-base-content/70">{message}</p>
      <Link className="btn btn-primary" to={backTo}>
        {backLabel}
      </Link>
    </EmptyStatePlaceholder>
  );
};

export default Error404;
