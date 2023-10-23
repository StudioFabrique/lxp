import { ChangeEvent, ChangeEventHandler, FC } from "react";

const PermissionItem: FC<{
  item: string;
  isDefaultChecked: boolean;
  onChangePermission: (ressourceName: string, checked: boolean) => void;
}> = ({ item, isDefaultChecked, onChangePermission }) => {
  const handleCheck: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    console.warn("item :", { item }, "check state :", e.currentTarget.checked);
    onChangePermission(item, e.currentTarget.checked);
  };

  return (
    <span className="h-full bg-secondary/50 p-2 w-full flex justify-center items-center">
      <input
        type="checkbox"
        name="permCheck"
        id={item}
        className="checkbox checkbox-sm rounded-none"
        checked={isDefaultChecked}
        onChange={handleCheck}
      />
    </span>
  );
};

export default PermissionItem;
