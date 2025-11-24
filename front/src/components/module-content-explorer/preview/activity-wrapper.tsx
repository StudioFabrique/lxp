import { ReactNode, useCallback, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import Can from "../../UI/can/can.component";
import Modal from "../../UI/modal/modal";
import { Activity } from "../../../utils/interfaces/activity";

type ActivityWrapperProps = {
  children: ReactNode;
  activity: Activity;
  onDeleteActivity?: (activityId: number) => void;
  onEditActivity?: (activity: Activity) => void;
  showEditButton?: boolean;
};

const ActivityWrapper = ({
  children,
  activity,
  onDeleteActivity,
  onEditActivity,
  showEditButton = true,
}: ActivityWrapperProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = useCallback(() => {
    if (onDeleteActivity && activity.id) {
      onDeleteActivity(activity.id);
    }
    setShowDeleteModal(false);
  }, [activity.id, onDeleteActivity]);

  const handleEdit = () => {
    if (onEditActivity) {
      onEditActivity(activity);
    }
  };

  return (
    <>
      {showDeleteModal && (
        <Modal
          title="Supprimer l'activité"
          leftLabel="Annuler"
          onMinimizeClick={() => setShowDeleteModal(false)}
        >
          <div className="flex flex-col gap-4 items-center pt-10 px-5">
            <p className="text-center">
              Êtes-vous sûr de vouloir supprimer cette activité ? Cette action
              est irréversible.
            </p>
            <div className="flex gap-4">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button className="btn btn-sm btn-error" onClick={confirmDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </Modal>
      )}

      <div className="relative">
        {children}

        <div className="absolute top-4 right-4 flex gap-2">
          {onDeleteActivity && (
            <Can action="delete" object="lesson">
              <button
                type="button"
                className="btn btn-ghost btn-sm tooltip tooltip-left"
                data-tip="Supprimer l'activité"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4 text-error" />
              </button>
            </Can>
          )}

          {showEditButton && onEditActivity && (
            <Can action="update" object="lesson">
              <button
                type="button"
                className="btn btn-ghost btn-sm tooltip tooltip-left"
                data-tip="Modifier l'activité"
                onClick={handleEdit}
              >
                <Edit className="w-4 h-4" />
              </button>
            </Can>
          )}
        </div>
      </div>
    </>
  );
};

export default ActivityWrapper;
