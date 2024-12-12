import { ChangeEvent, ChangeEventHandler, FC } from "react";

const PermissionItem: FC<{
  item: string;
  isDefaultChecked: boolean;
  color?: boolean;
  roundedLeft?: boolean;
  roundedRight?: boolean;
  disabled?: boolean;
  onChangePermission: (ressourceName: string, checked: boolean) => void;
}> = ({
  item,
  isDefaultChecked,
  color,
  roundedLeft,
  roundedRight,
  disabled,
  onChangePermission,
}) => {
  const handleCheck: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    onChangePermission(item, e.currentTarget.checked);
  };

  return (
    <span
      className={`h-full ${
        color ? "bg-base-200" : "bg-base-100"
      } p-2 w-full flex justify-center items-center ${
        roundedLeft && "rounded-l-lg"
      } ${roundedRight && "rounded-r-lg"}`}
    >
      <input
        type="checkbox"
        name="permCheck"
        id={item}
        disabled={["role", "permission", "default"].includes(item) || disabled}
        className="checkbox checkbox-primary checkbox-sm rounded-sm border-2 disabled:opacity-50 disabled:cursor-not-allowed"
        checked={isDefaultChecked}
        onChange={handleCheck}
      />
    </span>
  );
};

export default PermissionItem;
