import { Link } from "react-router-dom";

const ParcoursHome = () => {
  return (
    <Link className="p-8" to="/admin/parcours/créer-un-parcours">
      Créer un parcours
    </Link>
  );
};

export default ParcoursHome;
