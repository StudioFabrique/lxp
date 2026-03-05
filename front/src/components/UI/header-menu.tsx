import { useState } from "react";
import GroupIcon from "./svg/group-icon";
import SearchModal from "../search-modal/search-modal";
import Can from "./can/can.component";
import { Link, useLocation } from "react-router-dom";
import { PlayCircleIcon } from "lucide-react";

type HeaderMenuProps = {
  hideResumeCourseButton?: boolean;
  onClickResume?: () => void;
};

const HeaderMenu = ({
  hideResumeCourseButton,
  onClickResume,
}: HeaderMenuProps) => {
  const location = useLocation();
  const [isModalOpen, setModalState] = useState(false);

  return (
    <>
      <SearchModal isModalOpen={isModalOpen} setModalState={setModalState} />
      <div className="absolute flex justify-end w-full h-full p-5 px-10">
        <div className="flex flex-col gap-4 justify-between z-20">
          <span className="flex-1" />
          <div className="self-end flex flex-col gap-4">
            {/* <button type="button" className="btn btn-primary btn-sm py-1">
              <CameraIcon />
            </button> */}
            <Can action="write" object="group">
              <Link
                to={`/${location.pathname.split("/")[1]}/group`}
                className="btn btn-primary btn-sm text-neutral-content py-1"
              >
                <GroupIcon />
              </Link>
            </Can>
          </div>
          {onClickResume ? (
            hideResumeCourseButton ? null : (
              <Can action="component" object="start-lesson-button">
                <button
                  onClick={onClickResume}
                  type="button"
                  className="btn btn-primary text-neutral-content gap-2 self-end"
                >
                  <span className="w-5 h-5">
                    <PlayCircleIcon />
                  </span>
                  <p className="normal-case">Reprendre</p>
                </button>
              </Can>
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
