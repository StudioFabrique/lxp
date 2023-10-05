import { FC, Ref, useEffect, useRef, useState } from "react";
import RightArrowIcon from "../UI/svg/right-arrow-icon";
import { IRoleItem } from "./role";
import RoleOptions from "./role-options";

const RoleItem: FC<{
  role: IRoleItem;
}> = ({ role }) => {
  const [isRoleDeleted, setIsRoleDeleted] = useState<boolean>(false);

  const divRef: Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (isRoleDeleted) {
      divRef.current!.className += " animate-ping";
      setTimeout(() => {
        divRef.current!.className += " hidden";
      }, 500);
    }
  }, [isRoleDeleted]);

  return (
    <div
      ref={divRef}
      /* onClick={handleClick} */
      className="flex flex-col capitalize bg-secondary p-4 whitespace-nowrap rounded-lg hover:bg-secondary-focus hover:cursor-pointer"
    >
      <span className="flex justify-between">
        <p>{role.role}</p>
        <RoleOptions role={role.role} setIsRoleDeleted={setIsRoleDeleted} />
      </span>
      <span className="self-end w-6 h-6 stroke-primary">
        <RightArrowIcon />
      </span>
      <p className="select-none">{role.permCount} Permissions</p>
    </div>
  );
};

export default RoleItem;
