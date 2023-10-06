import {
  Dispatch,
  FC,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import RightArrowIcon from "../UI/svg/right-arrow-icon";
import { IRoleItem } from "../../views/role/role";
import RoleOptions from "./role-options";

const RoleItem: FC<{
  role: IRoleItem;
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
}> = ({ role, setRoles }) => {
  const [isRoleDeleted, setIsRoleDeleted] = useState<boolean>(false);

  const divRef: Ref<HTMLDivElement> = useRef(null);

  useEffect(() => {
    if (isRoleDeleted) {
      divRef.current!.className += " animate-bounce";
      setTimeout(() => {
        divRef.current!.className += " hidden";
      }, 500);
    }
  }, [isRoleDeleted]);

  return (
    <div
      ref={divRef}
      /* onClick={handleClick} */
      className="flex flex-col capitalize gap-1 bg-secondary p-4 whitespace-nowrap rounded-lg hover:bg-secondary-focus hover:cursor-pointer select-none"
    >
      <span className="flex justify-between gap-10">
        <p className="text-lg">{role.role}</p>
        <RoleOptions
          role={role.role}
          setRoles={setRoles}
          setIsRoleDeleted={setIsRoleDeleted}
        />
      </span>
      <span className="self-end w-6 h-6 stroke-primary">
        <RightArrowIcon />
      </span>
      <p>Permissions</p>
      <ul className="flex gap-2">
        <li className="flex gap-1">
          <p className="bg-primary px-1 rounded-lg">C</p>
          <p>{role.permCount?.write}</p>
        </li>
        <li className="flex gap-1">
          <p className="bg-primary px-1 rounded-lg">U</p>
          <p>{role.permCount?.update}</p>
        </li>
        <li className="flex gap-1">
          <p className="bg-primary px-1 rounded-lg">D</p>
          <p>{role.permCount?.delete}</p>
        </li>
        <li className="flex gap-1">
          <p className="bg-primary px-1 rounded-lg">R</p>
          <p>{role.permCount?.read}</p>
        </li>
      </ul>
    </div>
  );
};

export default RoleItem;
