import BellIcon from "../UI/svg/bell-icon";
import CameraIcon from "../UI/svg/camera-icon";
import GroupIcon from "../UI/svg/group-icon";
import MagnifyIcon from "../UI/svg/magnify-icon";
import PlayIcon from "../UI/svg/play-icon";

const ParcoursViewHeaderMenu = () => (
  <div className="absolute flex justify-end w-full h-full p-4">
    <div className="flex flex-col gap-4 justify-between">
      <div className="flex justify-end gap-4">
        <span>
          <button type="button" className="btn btn-primary">
            <span className="w-10 h-10">
              <MagnifyIcon />
            </span>
          </button>
        </span>
        <span className="flex justify-end">
          <button type="button" className="btn btn-primary">
            <span className="w-10 h-10">
              <BellIcon />
            </span>
          </button>
        </span>
      </div>
      <span className="flex justify-end">
        <button type="button" className="btn btn-primary">
          <span className="w-10 h-10">
            <CameraIcon />
          </span>
        </button>
      </span>
      <span className="flex justify-end">
        <button type="button" className="btn btn-primary ">
          <span className="w-10 h-10">
            <GroupIcon />
          </span>
        </button>
      </span>

      <button type="button" className="btn btn-primary">
        <span className="w-10 h-10">
          <PlayIcon />
        </span>
        <p>Reprendre le cours</p>
      </button>
    </div>
  </div>
);

export default ParcoursViewHeaderMenu;
