import { FC } from "react";
import PermissionItem from "./permission-item";

const RessourcesByAction: FC<{
  action: "read" | "write" | "update" | "delete";
  title: string;
  unfilteredPermissions: string[];
  roundedLeft?: boolean;
  roundedRight?: boolean;
  ressources: {
    ressources: string[];
    roles: string[];
  } | null;
  disabled?: boolean;
  onChangePermission: (
    ressourceName: string,
    checked: boolean,
    action: string,
  ) => void;
}> = ({
  action,
  title,
  unfilteredPermissions,
  roundedLeft,
  roundedRight,
  ressources,
  disabled,
  onChangePermission,
}) => {
  const actionPermissions = unfilteredPermissions.filter((perm) =>
    perm.startsWith(`${action}:`),
  );

  return (
    <div className="flex flex-col gap-y-5 items-stretch w-full px-1">
      <p className="bg-secondary text-secondary-content p-2 rounded-lg text-center font-semibold">
        {title}
      </p>
      <div className="flex flex-col gap-y-5 flex-1">
        {ressources?.ressources.map((res, i) => (
          <PermissionItem
            key={res}
            item={res}
            color={i % 2 > 0}
            roundedLeft={roundedLeft}
            roundedRight={roundedRight}
            isDefaultChecked={actionPermissions.includes(`${action}:${res}`)}
            onChangePermission={(ressourceName, isChecked) =>
              onChangePermission(ressourceName, isChecked, action)
            }
          />
        ))}
        <hr className="border-base-300 w-full" />
        {ressources?.roles.map((res, i) => (
          <PermissionItem
            key={res}
            item={res}
            color={i % 2 > 0}
            isDefaultChecked={actionPermissions.includes(`${action}:${res}`)}
            disabled={disabled}
            onChangePermission={(ressourceName, isChecked) =>
              onChangePermission(ressourceName, isChecked, action)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default RessourcesByAction;
