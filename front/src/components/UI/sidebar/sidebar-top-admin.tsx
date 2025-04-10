import Course from "./sidebar-parts/course";
import Formation from "./sidebar-parts/formation";
import Group from "./sidebar-parts/group";
import Home from "./sidebar-parts/home";
import Lesson from "./sidebar-parts/lesson";
import Mediatheque from "./sidebar-parts/mediatheque";
import Module from "./sidebar-parts/module";
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
  const [showMore, setShowMore] = useState(false);
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
    <ul className={`flex flex-col gap-${showAll ? 6 : 4} items-center`}>
      <Home key="home" currentRoute={currentRoute} />
      {showAll
        ? [...initialItems, ...moreItems]
        : showMore
          ? moreItems
          : initialItems}
      {!showAll && (
        <button
          className="btn btn-circle btn-ghost tooltip tooltip-right"
          data-tip={
            showMore ? "Revenir aux vues précédentes" : "Afficher plus de vues"
          }
          onClick={() => setShowMore(!showMore)}
        >
          <Plus
            className={`transition-transform ${showMore ? "rotate-45" : ""}`}
          />
        </button>
      )}
    </ul>
  );
};

export default SidebarTopAdmin;
