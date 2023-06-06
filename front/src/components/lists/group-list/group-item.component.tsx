import { FC } from "react";
import toTitleCase from "../../../utils/toTitleCase";
import { Link } from "react-router-dom";
import Can from "../../UI/can/can.component";
import Group from "../../../utils/interfaces/group";

const GroupItem: FC<{
  onSelectGroup: (groupId: any) => void;
  groupItem: Group;
  onRowCheck: (id: string) => void;
}> = ({ groupItem, onRowCheck, onSelectGroup }) => {
  const handleSelectGroup = () => {
    onSelectGroup(groupItem);
  };

  return (
    <>
      <td className="bg-transparent">
        <input
          className="my-auto checkbox"
          type="checkbox"
          checked={groupItem.isSelected}
          onChange={() => onRowCheck(groupItem._id)}
        />
      </td>
      <td className="font-bold bg-transparent">{groupItem.index}</td>
      <td className="bg-transparent">{toTitleCase(groupItem.name)}</td>
      <td className="bg-transparent">{toTitleCase(groupItem.desc)}</td>
      <td className="bg-transparent font-bold text-xs">
        <div className="flex gap-x-2">
          <Can action="update" subject={groupItem.roles![0].role}>
            <Link to="#">Editer</Link>
          </Can>

          <Can action="delete" subject={groupItem.roles![0].role}>
            <Link to="#">Supprimer</Link>
          </Can>
        </div>
      </td>
      <td>
        <button onClick={handleSelectGroup}>manage users</button>
      </td>
    </>
  );
};

export default GroupItem;
