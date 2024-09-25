import { FC, useState } from "react";
import toTitleCase from "../../../utils/toTitleCase";
import Can from "../../UI/can/can.component";
import Group from "../../../utils/interfaces/group";
import { Link } from "react-router-dom";
import DeleteModal from "../../UI/modal/delete-modal";

const GroupItem: FC<{
  groupItem: Group;
  showActions: boolean;
  onRowCheck: (id: string) => void;
  onDeleteGroup: (id: string) => Promise<boolean>;
}> = ({ groupItem, showActions, onRowCheck, onDeleteGroup }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDeleteGroup = async () => {
    if (groupItem._id) {
      setIsLoading(true);
      await onDeleteGroup(groupItem._id);
      setIsLoading(false);
    }
  };

  return (
    <>
      {showModal && (
        <DeleteModal
          isLoading={isLoading}
          onCancel={handleCloseModal}
          onConfirm={handleConfirmDeleteGroup}
          descriptionSubject="ce groupe"
        />
      )}
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
              <Link to={`edit/${groupItem._id}`}>Editer</Link>
            </Can>

            <Can action="delete" object={groupItem.roles![0].role}>
              <button type="button" onClick={handleShowModal}>
                Supprimer
              </button>
            </Can>
          </div>
        </td>
      ) : null}
    </>
  );
};

export default GroupItem;
