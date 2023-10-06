import { FC } from "react";

const RoleItemPermissionsQuickView: FC<{
  permCount: {
    read: number;
    write: number;
    update: number;
    delete: number;
  };
}> = ({ permCount }) => {
  return (
    <div>
      <ul className="flex gap-2">
        <li className="flex gap-1">
          <p className="bg-green-600 px-1 rounded-lg">C</p>
          <p>{permCount?.write}</p>
        </li>
        <li className="flex gap-1">
          <p className="bg-orange-600 px-1 rounded-lg">U</p>
          <p>{permCount?.update}</p>
        </li>
        <li className="flex gap-1">
          <p className="bg-red-600 px-1 rounded-lg">D</p>
          <p>{permCount?.delete}</p>
        </li>
        <li className="flex gap-1">
          <p className="bg-amber-600 px-1 rounded-lg">R</p>
          <p>{permCount?.read}</p>
        </li>
      </ul>
    </div>
  );
};

export default RoleItemPermissionsQuickView;
