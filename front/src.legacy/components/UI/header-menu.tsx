import { useState } from "react";
import GroupIcon from "./svg/group-icon";
import SearchModal from "../search-modal/search-modal";
import { Link, useLocation } from "react-router";
import { PlayCircleIcon } from "lucide-react";
import PermissionGuard from "../../../src/components/guards/PermissionGuard";

type HeaderMenuProps = {
  hideResumeCourseButton?: boolean;
  onClickResume?: () => void;
  isStudent?: boolean;
};

const HeaderMenu = ({
  hideResumeCourseButton,
  onClickResume,
  isStudent,
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
            <PermissionGuard action="write" object="group">
              <Link
                to={`/${location.pathname.split("/")[1]}/group`}
                className="btn btn-primary btn-sm text-base-100 py-1"
              >
                <GroupIcon />
              </Link>
            </PermissionGuard>
          </div>
          {onClickResume && !hideResumeCourseButton && isStudent ? (
            <button
              onClick={onClickResume}
              type="button"
              className="btn btn-primary text-base-100 gap-2 self-end"
            >
              <span className="w-5 h-5">
                <PlayCircleIcon />
              </span>
              <p className="normal-case">Reprendre</p>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
