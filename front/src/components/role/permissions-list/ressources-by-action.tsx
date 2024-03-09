/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import PermissionItem from "./permission-item";
import Loader from "../../UI/loader";

const RessourcesByAction: FC<{
  action: "read" | "write" | "update" | "delete";
  title: string;
  unfilteredPermissions: any;
  roundedLeft?: boolean;
  roundedRight?: boolean;
  ressources: {
    ressources: string[];
    roles: string[];
  } | null;
  onChangePermission: (
    ressourceName: string,
    checked: boolean,
    action: string
  ) => void;
}> = ({
  action,
  title,
  unfilteredPermissions,
  roundedLeft,
  roundedRight,
  ressources,
  onChangePermission,
}) => {
  const permissions = unfilteredPermissions.find(
    (perm: any) => perm.action === action
  );

  if (!permissions) return <Loader />;
  return (
    <div className="flex flex-col gap-y-5 items-center w-full">
      <p className="bg-primary-focus text-secondary-content p-2 rounded-lg w-[95%] text-center font-bold">
        {title}
      </p>
      {ressources?.ressources.map((res, i) => (
        <PermissionItem
          key={res}
          item={res}
          color={i % 2 > 0} // boolean value
          roundedLeft={roundedLeft}
          roundedRight={roundedRight}
          isDefaultChecked={permissions.ressources.includes(res)}
          onChangePermission={(ressourceName, isChecked) =>
            onChangePermission(ressourceName, isChecked, action)
          }
        />
      ))}
      <hr className="border-black w-[110%]" />
      {ressources?.roles.map((res, i) => (
        <PermissionItem
          key={res}
          item={res}
          color={i % 2 > 0} // boolean value
          isDefaultChecked={permissions.ressources.includes(res)}
          onChangePermission={(ressourceName, isChecked) =>
            onChangePermission(ressourceName, isChecked, action)
          }
        />
      ))}
    </div>
  );
};

export default RessourcesByAction;
