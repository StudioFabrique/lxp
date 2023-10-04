import { Link, NavLink, Outlet } from "react-router-dom";
import Can from "../../components/UI/can/can.component";
import CanAccessPage from "../../components/UI/can/can-access-page.component";

const LayoutAdmin = () => {
  return (
    <div className="w-full flex">
      <ul className="text-xs text-info font-bold px-4 flex flex-col gap-y-2 py-2">
        <li>
          <Link to="../parcours">Parcours</Link>
        </li>
        <Can action="write" object="parcours">
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-accent" : "hover:underline"
              }
              to="/admin/parcours/créer-un-parcours"
            >
              Nouveau
            </NavLink>
          </li>
        </Can>
      </ul>
      <div className="flex-1 min-h-screen">
        <CanAccessPage action="read" subject="parcours">
          <Outlet />
        </CanAccessPage>
      </div>
    </div>
  );
};

export default LayoutAdmin;
