import BellIcon from "../UI/svg/bell-icon";
import CameraIcon from "../UI/svg/camera-icon";
import GroupIcon from "../UI/svg/group-icon";
import MagnifyIcon from "../UI/svg/magnify-icon";
import PlayIcon from "../UI/svg/play-icon";

const ParcoursViewHeaderMenu = () => (
  <div className="absolute flex justify-end w-full h-full p-4">
    <div className="flex flex-col gap-4 justify-between z-20">
      <div className="flex justify-end gap-4">
        <button type="button" className="btn btn-primary btn-sm py-1">
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
      <button type="button" className="btn btn-primary">
        <span className="w-5 h-5">
          <PlayIcon />
        </span>
        <p>Reprendre le cours</p>
      </button>
    </div>
  </div>
);

export default ParcoursViewHeaderMenu;
