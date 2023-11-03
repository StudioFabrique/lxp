import { Ref, useRef } from "react";
import BellIcon from "../UI/svg/bell-icon";
import CameraIcon from "../UI/svg/camera-icon";
import GroupIcon from "../UI/svg/group-icon";
import MagnifyIcon from "../UI/svg/magnify-icon";
import PlayIcon from "../UI/svg/play-icon";
import Portal from "../UI/portal/portal";
// import { motion } from "framer-motion";

const ParcoursViewHeaderMenu = () => {
  const inputRef: Ref<HTMLInputElement> = useRef(null);

  const handleClickActivateInput = () => {
    inputRef.current?.focus();
  };

  const modal = (
    <>
      <input type="checkbox" id="modal_1" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <div className="flex flex-col gap-4 h-full w-full justify-between">
            <span className="flex justify-between">
              <h3>Recherche :</h3>
              <label htmlFor="modal_1" className="btn btn-xs">
                x
              </label>
            </span>
            <span className="flex justify-center">
              <input
                ref={inputRef}
                type="text"
                name="search_input"
                id="input_1"
                className="input input-bordered w-full"
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="absolute flex justify-end w-full h-full p-5 px-10">
      <div className="flex flex-col gap-4 justify-between z-20">
        <div className="flex justify-end gap-4">
          <label
            onClick={handleClickActivateInput}
            htmlFor="modal_1"
            className="btn btn-primary btn-sm py-1"
          >
            <span className="flex w-full h-full gap-2">
              <MagnifyIcon />
              <Portal children={modal} />
              {/* <motion.input
                ref={inputRef}
                animate={{
                  width: inputVisible ? "auto" : 0,
                }}
                type="text"
                name="search"
                id="search"
                className="w-0 hidden"
              /> */}
            </span>
          </label>
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
