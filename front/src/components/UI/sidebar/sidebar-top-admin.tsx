import Course from "./sidebar-parts/course";
import Formation from "./sidebar-parts/formation";
import Group from "./sidebar-parts/group";
import Home from "./sidebar-parts/home";
import Lesson from "./sidebar-parts/lesson";
import Mediatheque from "./sidebar-parts/mediatheque";
import Module from "./sidebar-parts/module";
import MotionSidebarWrapper from "./sidebar-parts/motion-sidebar-wrapper";
import Parcours from "./sidebar-parts/parcours";
import Roles from "./sidebar-parts/roles";
import Tags from "./sidebar-parts/tags";
import User from "./sidebar-parts/user";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";

type SharedSideBarProps = {
  currentRoute: string[];
};

const SidebarTopAdmin = ({ currentRoute }: SharedSideBarProps) => {
  const [isHover, setIsHover] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const checkScreenHeight = () => {
      const screenHeight = window.innerHeight;
      setShowAll(screenHeight > 900);
    };

    checkScreenHeight();
    window.addEventListener("resize", checkScreenHeight);
    return () => window.removeEventListener("resize", checkScreenHeight);
  }, []);

  const initialItems = [
    <Formation key="formation" currentRoute={currentRoute} />,
    <Parcours key="parcours" currentRoute={currentRoute} />,
    <Module key="module" currentRoute={currentRoute} />,
    <Course key="course" currentRoute={currentRoute} />,
    <Lesson key="lesson" currentRoute={currentRoute} />,
    <User key="user" currentRoute={currentRoute} />,
    <Group key="group" currentRoute={currentRoute} />,
  ];

  const moreItems = [
    <Roles key="roles" currentRoute={currentRoute} />,
    <Tags key="tags" currentRoute={currentRoute} />,
    <Mediatheque key="mediatheque" currentRoute={currentRoute} />,
  ];

  return (
    <ul className={`flex flex-col gap-6 items-center`}>
      <Home key="home" currentRoute={currentRoute} />
      {showAll ? (
        [...initialItems, ...moreItems]
      ) : (
        <>
          {initialItems}
          <li
            onMouseOver={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <div className="flex items-center">
              <Plus />

              <MotionSidebarWrapper isHover={isHover}>
                {moreItems}
              </MotionSidebarWrapper>
            </div>
          </li>
        </>
      )}
    </ul>
  );
};

export default SidebarTopAdmin;
