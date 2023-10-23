import { FC } from "react";
import PermissionItem from "./permission-item";

const RessourcesByAction: FC<{
  action: "read" | "write" | "update" | "delete";
  title: string;
  unfilteredPermissions: any;
  ressources: {
    ressources: string[];
    roles: string[];
  } | null;
}> = ({ action, title, unfilteredPermissions, ressources }) => {
  const permissions = unfilteredPermissions.filter(
    (perm: any) => perm.action === action
  )[0];

  if (!permissions) return <p>error</p>;
  return (
    <div className="flex flex-col gap-y-5 items-center w-full">
      <p className="bg-secondary p-2 rounded-lg w-[95%] text-center">{title}</p>
      {ressources?.ressources.map((res) => (
        <PermissionItem
          key={res}
          item={res}
          isDefaultChecked={permissions.ressources.includes(res)}
        />
      ))}
      <hr className="border-black w-[110%]" />
      {ressources?.roles.map((res: any) => (
        <PermissionItem
          key={res}
          item={res}
          isDefaultChecked={permissions.ressources.includes(res)}
        />
      ))}
    </div>
  );
};

export default RessourcesByAction;
