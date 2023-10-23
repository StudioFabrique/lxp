import { FC } from "react";

const PermissionItem: FC<{ item: string; isDefaultChecked: boolean }> = ({
  item,
  isDefaultChecked,
}) => {
  return (
    <span className="h-full bg-secondary/50 p-2 w-full flex justify-center items-center">
      <input
        type="checkbox"
        name="permCheck"
        id={item}
        className="checkbox checkbox-sm rounded-none"
        defaultChecked={isDefaultChecked}
      />
    </span>
  );
};

export default PermissionItem;
