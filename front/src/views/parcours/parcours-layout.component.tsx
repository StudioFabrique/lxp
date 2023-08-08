import { Link, NavLink, Outlet } from "react-router-dom";

const LayoutAdmin = () => {
  return (
    <div className="w-full flex">
      <ul className="text-xs text-info font-bold px-4 flex flex-col gap-y-2 py-2">
        <li>
          <Link to="/admin/parcours">Parcours</Link>
        </li>
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
      </ul>
      <div className="flex-1 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutAdmin;
