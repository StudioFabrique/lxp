import { Link, Outlet } from "react-router-dom";
import AddIcon from "../../components/UI/svg/add-icon";
import LogoutIcon from "../../components/UI/svg/logout-icon";
import ModeToggle from "../../components/UI/mode-toggle";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import HomeIcon from "../../components/UI/svg/home-icon";
import CourseIcon from "../../components/UI/svg/course-icon";
import { useContext } from "react";
import { Context } from "../../store/context.store";

const LayoutCourse = () => {
  const { logout } = useContext(Context);

  return (
    <div className="flex gap-2 p-2">
      <nav className="w-fit h-fit">
        <Wrapper>
          <ul className="text-primary flex flex-col gap-y-4">
            <li>
              <Link to="/admin/course">
                <div
                  className="tooltip tooltip-right w-6 h-6"
                  data-tip="Accueil Interface de création des cours"
                >
                  <CourseIcon />
                </div>
              </Link>
            </li>
            <li>
              <Link to="/admin/course/add">
                <div
                  className="tooltip tooltip-right w-6 h-6"
                  data-tip="Création d'un nouveau cours"
                >
                  <AddIcon />
                </div>
              </Link>
            </li>
          </ul>
          <div className="divider" />
          <ul className="text-primary flex flex-col gap-y-4">
            <li
              className="tooltip tooltip-right"
              data-tip="Mode Clair / Mode Sombre"
            >
              <ModeToggle />
            </li>
            <div className="divider" />
            <li>
              <Link to="/">
                <div
                  className="tooltip tooltip-right w-6 h-6"
                  data-tip="Accueil LXP"
                >
                  <HomeIcon />
                </div>
              </Link>
            </li>
            <li>
              <div
                className="tooltip tooltip-right w-6 h-6 cursor-pointer"
                data-tip="Déconnexion"
                onClick={() => logout()}
              >
                <LogoutIcon />
              </div>
            </li>
          </ul>
        </Wrapper>
      </nav>
      <Outlet />
    </div>
  );
};

export default LayoutCourse;
