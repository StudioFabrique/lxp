import { Link, Outlet } from "react-router-dom";
import Can from "../../components/UI/can/can.component";

const ParcoursLayout = () => {
  return (
    <div>
      <Can action="write" subject="parcours">
        <Link to="/admin/parcours/créer-un-parcours">Créer un parcours</Link>
      </Can>
      <Outlet />
    </div>
  );
};

export default ParcoursLayout;
