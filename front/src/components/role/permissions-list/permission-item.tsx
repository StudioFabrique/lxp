import { ChangeEvent, ChangeEventHandler, FC } from "react";

const PermissionItem: FC<{
  item: string;
  isDefaultChecked: boolean;
  color?: boolean;
  roundedLeft?: boolean;
  roundedRight?: boolean;
  onChangePermission: (ressourceName: string, checked: boolean) => void;
}> = ({
  item,
  isDefaultChecked,
  color,
  roundedLeft,
  roundedRight,
  onChangePermission,
}) => {
  const handleCheck: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    onChangePermission(item, e.currentTarget.checked);
  };

  return (
    <span
      className={`h-full ${
        color ? "bg-secondary-focus" : "bg-secondary-focus/50"
      } p-2 w-full flex justify-center items-center ${
        roundedLeft && "rounded-l-lg"
      } ${roundedRight && "rounded-r-lg"}`}
    >
      <input
        type="checkbox"
        name="permCheck"
        id={item}
        disabled={["role", "permission"].includes(item)}
        className="checkbox checkbox-primary checkbox-sm rounded-sm border-2  disabled:cursor-default"
        checked={isDefaultChecked}
        onChange={handleCheck}
      />
    </span>
  );
};

export default PermissionItem;
