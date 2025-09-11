import { Edit, MoreVertical, Trash2 } from "lucide-react";
import Can from "../../UI/can/can.component";
import { Activity } from "../../../utils/interfaces/activity";

type ActivityActionsMenuProps = {
  activity: Activity;
  setOpenMenuId: (id: number | null) => void;
  openMenuId: number | null;
  handleEditActivity: (activity: Activity) => void;
  handleOpenDeleteModal: (activity: Activity) => void;
};

const ActivityActionsMenu = ({
  activity,
  setOpenMenuId,
  openMenuId,
  handleEditActivity,
  handleOpenDeleteModal,
}: ActivityActionsMenuProps) => {
  return (
    <Can action="update" object="lesson">
      <div className="absolute top-3.5 right-12 z-10">
        <button
          type="button"
          className="btn btn-ghost btn-sm hover:bg-base-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Button clicked!", activity.id);
            setOpenMenuId(openMenuId === activity.id ? null : activity.id);
          }}
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {openMenuId === activity.id && (
          <>
            <div
              className="fixed inset-0"
              onClick={() => {
                console.log("Overlay clicked!");
                setOpenMenuId(null);
              }}
            />
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] min-w-[12rem] py-1">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Edit clicked!");
                  setOpenMenuId(null);
                  handleEditActivity(activity);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("Delete clicked!");
                  setOpenMenuId(null);
                  handleOpenDeleteModal(activity);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-red-100 text-red-600 w-full text-left"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </button>
            </div>
          </>
        )}
      </div>
    </Can>
  );
};

export default ActivityActionsMenu;
