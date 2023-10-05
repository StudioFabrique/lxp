import { FC, Ref, useRef } from "react";
import RightArrowIcon from "../UI/svg/right-arrow-icon";
import { IRoleItem } from "./role";

const RoleItem: FC<{
  role: IRoleItem;
}> = ({ role }) => {
  const divRef: Ref<HTMLDivElement> = useRef(null);

  const handleClick = () => {
    divRef.current!.className += " animate-ping";
    setTimeout(() => {
      divRef.current!.className += " hidden";
    }, 500);
  };

  return (
    <div
      ref={divRef}
      onClick={handleClick}
      className="flex flex-col capitalize bg-secondary p-4 whitespace-nowrap rounded-lg hover:bg-secondary-focus hover:cursor-pointer"
    >
      <p>{role.role}</p>
      <span className="self-end w-6 h-6 stroke-primary">
        <RightArrowIcon />
      </span>
      <p>{role.permCount} Permissions</p>
    </div>
  );
};

export default RoleItem;
