import { Link, Outlet } from "react-router-dom";
import Can from "../../components/UI/can/can.component";

const ParcoursLayout = () => {
  return (
    <div>
      <Can action="write" subject="parcours">
        <Link to="/admin/parcours/créer-un-parcours">Créer un parcours</Link>
      </Can>
      <div className="flex">
        <div className="w-[150px]"></div>
        <Outlet />
        <div className="w-[50px]"></div>
      </div>
    </div>
  );
};

export default ParcoursLayout;
