import { Dispatch, FC, SetStateAction } from "react";
import toTitleCase from "../../../utils/toTitleCase";
import Can from "../../UI/can/can.component";
import Group from "../../../utils/interfaces/group";
import { EditUsersModalContent } from "../../../views/group/group-home.component";

const GroupItem: FC<{
  groupItem: Group;
  showActions: boolean;
  onRowCheck: (id: string) => void;
  onSetModalContent: Dispatch<
    SetStateAction<EditUsersModalContent | undefined>
  >;
}> = ({ groupItem, showActions, onRowCheck, onSetModalContent }) => {
  return (
    <>
      <td className="bg-transparent">
        <input
          className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
          type="checkbox"
          checked={groupItem.isSelected}
          onChange={() => onRowCheck(groupItem._id!)}
        />
      </td>
      <td className="font-bold bg-transparent">{groupItem.index}</td>
      <td className="bg-transparent">{toTitleCase(groupItem.name)}</td>
      <td className="bg-transparent">{toTitleCase(groupItem.desc)}</td>
      {showActions ? (
        <td className="bg-transparent font-bold text-xs">
          <div className="flex gap-x-2">
            <Can action="update" object={groupItem.roles![0].role}>
              <button
                type="button"
                onClick={() =>
                  groupItem._id &&
                  onSetModalContent({
                    groupId: groupItem._id,
                    isModalOpen: true,
                    groupName: groupItem.name,
                  })
                }
              >
                Editer
              </button>
            </Can>

            {/* <Can action="delete" object={groupItem.roles![0].role}>
              <Link to="#">Supprimer</Link>
            </Can> */}
          </div>
        </td>
      ) : null}
    </>
  );
};

export default GroupItem;
