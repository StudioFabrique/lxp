import {
  Dispatch,
  FC,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import RightArrowIcon from "../../UI/svg/right-arrow-icon";
import { IRoleItem } from "../../../views/role/role";
import RoleOptions from "./role-options";
import RoleItemPermissionsQuickView from "./role-item-permissions-quick-view";

const RoleItem: FC<{
  role: IRoleItem;
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
}> = ({ role, setRoles }) => {
  const [isRoleDeleted, setIsRoleDeleted] = useState<boolean>(false);
  const [isEditMode, setEditMode] = useState<boolean>(false);

  const divRef: Ref<HTMLDivElement> = useRef(null);
  const inputRef: Ref<HTMLInputElement> = useRef(null);

  const handleEditRoleName = () => {};

  const handleDoubleClickP = () => {
    setEditMode(true);
    inputRef.current?.focus();
  };

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
      /* onClick={() =>
        !isEditMode && console.log("click to navigate throught permissions")
      } */
      className="flex flex-col capitalize gap-2 bg-secondary p-4 whitespace-nowrap rounded-lg hover:bg-secondary-focus hover:cursor-pointer select-none"
    >
      <span className="flex justify-between gap-10">
        {isEditMode ? (
          <input
            className="input input-xs"
            type="text"
            name=""
            id=""
            /* onChange={} */
          />
        ) : (
          <p
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={handleDoubleClickP}
            className="text-lg"
          >
            {role.role}
          </p>
        )}
        <RoleOptions
          role={role.role}
          setRoles={setRoles}
          setIsRoleDeleted={setIsRoleDeleted}
        />
      </span>
      <div className="flex gap-10">
        <RoleItemPermissionsQuickView permCount={role.permCount} />
        <span className="self-end w-6 h-6 stroke-primary-content">
          <RightArrowIcon />
        </span>
      </div>
    </div>
  );
};

export default RoleItem;
