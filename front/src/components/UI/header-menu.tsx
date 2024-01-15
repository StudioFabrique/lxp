import { useState } from "react";
import BellIcon from "./svg/bell-icon";
import CameraIcon from "./svg/camera-icon";
import GroupIcon from "./svg/group-icon";
import MagnifyIcon from "./svg/magnify-icon";
import PlayIcon from "./svg/play-icon";
import SearchModal from "../search-modal/search-modal";

const HeaderMenu = () => {
  const [isModalOpen, setModalState] = useState(false);

  return (
    <>
      <SearchModal isModalOpen={isModalOpen} setModalState={setModalState} />
      <div className="absolute flex justify-end w-full h-full p-5 px-10">
        <div className="flex flex-col gap-4 justify-between z-20">
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setModalState(true)}
              className="btn btn-primary btn-sm py-1"
            >
              <MagnifyIcon />
            </button>
            <button type="button" className="btn btn-primary btn-sm py-1">
              <BellIcon />
            </button>
          </div>
          <span className="flex-1" />
          <div className="self-end flex flex-col gap-4">
            <button type="button" className="btn btn-primary btn-sm py-1">
              <CameraIcon />
            </button>
            <button type="button" className="btn btn-primary btn-sm py-1">
              <GroupIcon />
            </button>
          </div>
          <button type="button" className="btn btn-primary self-end">
            <span className="w-5 h-5">
              <PlayIcon />
            </span>
            <p className="normal-case">Reprendre le cours</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
