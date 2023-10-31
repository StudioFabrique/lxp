import { Ref, useRef, useState } from "react";
import BellIcon from "../UI/svg/bell-icon";
import CameraIcon from "../UI/svg/camera-icon";
import GroupIcon from "../UI/svg/group-icon";
import MagnifyIcon from "../UI/svg/magnify-icon";
import PlayIcon from "../UI/svg/play-icon";
import { motion } from "framer-motion";

const ParcoursViewHeaderMenu = () => {
  const inputRef: Ref<HTMLInputElement> = useRef(null);

  const [inputVisible, setInputVisible] = useState<boolean>(false);

  const handleClickActivateInput = () => {
    setInputVisible(true);
    inputRef.current?.focus();
  };

  const MotionInput = () => (
    <motion.input
      ref={inputRef}
      animate={{
        width: inputVisible ? "auto" : 0,
      }}
      className={`h-full ${
        inputVisible ? "input input-primary visible" : "hidden"
      }`}
      type="text"
      name="search"
      id="search"
    />
  );

  return (
    <div className="absolute flex justify-end w-full h-full p-5 px-10">
      <div className="flex flex-col gap-4 justify-between z-20">
        <div className="flex justify-end gap-4">
          <button
            onClick={handleClickActivateInput}
            type="button"
            className="btn btn-primary btn-sm py-1"
          >
            <span className="flex w-full h-full gap-2">
              <MagnifyIcon />
              <MotionInput />
            </span>
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
  );
};

export default ParcoursViewHeaderMenu;
