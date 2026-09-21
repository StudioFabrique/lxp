import { Link } from "react-router";
import EmptyStatePlaceholder from "./UI/empty-state-placeholder";

const Error404 = () => {
  return (
    <EmptyStatePlaceholder title="Parcours introuvable" withBorder={false}>
      <p className="text-center text-base-content/70">
        Ce parcours n’existe pas ou n’est plus disponible.
      </p>
      <Link className="btn btn-primary" to="..">
        Voir les parcours
      </Link>
    </EmptyStatePlaceholder>
  );
};

export default Error404;
