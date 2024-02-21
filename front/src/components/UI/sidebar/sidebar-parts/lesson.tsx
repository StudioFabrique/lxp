import { Link } from "react-router-dom";
import { FileEditIcon } from "lucide-react";

const Lesson = ({ currentRoute }: { currentRoute: string[] }) => {
  /* const [isHover, setIsHover] = useState(false); */
  const isCurrentPathActive = currentRoute[1] === "lesson";

  return (
    <li
    /* onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)} */
    >
      <div className="flex items-center">
        <Link
          to={`/${currentRoute[0]}/lesson`}
          className="tooltip tooltip-top w-6 h-6 z-10"
          data-tip="Leçons"
        >
          <div className="flex hover justify-center items-center">
            <FileEditIcon />
            <span
              className={`absolute p-5 rounded-lg hover:bg-primary/50 ${
                isCurrentPathActive && "bg-primary/50"
              }`}
            />
          </div>
        </Link>

        {/* <MotionSidebarWrapper isHover={isHover}>
          <Can action="write" object="lesson">
            <Link to={`/${currentRoute[0]}/lesson/add`}>
              <div
                className="tooltip tooltip-top w-6 h-6"
                data-tip="Création d'une nouelle leçon"
              >
                <AddIcon />
              </div>
            </Link>
          </Can>
        </MotionSidebarWrapper> */}
      </div>
    </li>
  );
};

export default Lesson;
