import { useCallback, useEffect } from "react";
import TiptapActivity from "../lessons-preview/writing/tip-tap-activity";
import useTextActivity from "../../views/resources/hooks/useTextActivity";
import toast from "react-hot-toast";
import { Activity } from "../../utils/interfaces/activity";

/**
 * Props for the TextActivityResource component
 */
type Props = {
  /** ID of the parent resource */
  parentId: number;
  /** Current mode for the activity editor (read/write/edit) */
  mode: "read" | "write" | "edit";
  /** Existing activity to edit (optional, undefined when creating new activity) */
  activity?: Activity;
  /** Type of activity being created or edited */
  activityType: "text" | "video" | "image" | "resource";
  /** Callback to close the activity editor */
  onClose: () => void;
  /** Callback executed after successful activity creation/update */
  onSubmit: (message: string) => void;
};

/**
 * Text Activity Resource Component
 *
 * This component provides a rich text editor interface for creating and editing
 * text-based activities within a resource. It supports three modes:
 * - "write": Create a new text activity
 * - "edit": Modify an existing text activity
 * - "read": View an existing text activity (read-only)
 *
 * The component:
 * - Loads existing activity content when editing
 * - Manages title and content state via the useTextActivity hook
 * - Handles creation and update operations
 * - Provides success/error feedback via toast notifications
 * - Delegates the actual editing UI to the TiptapActivity component
 *
 * @param props Component props containing parent ID, mode, activity data, and callbacks
 * @returns JSX.Element - Rich text editor for activity management
 */
export default function TextActivityResource({
  parentId,
  mode,
  activity,
  onClose,
  onSubmit,
}: Props) {
  const {
    createActivity,
    editActivityContent,
    content,
    title,
    setTitle,
    getActivityContent,
  } = useTextActivity();

  /**
   * Creates or updates a text activity
   *
   * Handles both creation (new activity) and update (existing activity) operations.
   * Shows appropriate success/error notifications and calls the onSubmit callback.
   *
   * @param id - Activity ID (for edit) or parent resource ID (for create)
   * @param title - Activity title
   * @param content - Rich text content in HTML format
   * @param isEditing - Current mode to determine operation type
   * @returns Promise resolving to the operation result
   */
  const updateActivities = useCallback(
    async (
      id: number,
      title: string,
      content: string,
      isEditing: "read" | "write" | "edit"
    ) => {
      const result = await createActivity(id, title, content, isEditing);

      // Handle error case
      if (!result) {
        toast.error(
          "Une erreur est survenue lors de la mise à jour de l'activité."
        );
      }

      // Handle success case with appropriate message
      if (result) {
        onSubmit(
          `Activité ${mode === "edit" ? "mise à jour" : "créée"} avec succès.`
        );
      }

      return result;
    },
    [createActivity, mode, onSubmit]
  );

  /**
   * Initialize: Load existing activity content when in edit mode
   * Fetches and populates the editor with the activity's current title and content
   */
  useEffect(() => {
    if (activity) {
      getActivityContent(activity);
    }
  }, [activity, getActivityContent]);

  return (
    <TiptapActivity
      id={activity?.id ?? 0}
      title={title}
      content={content}
      mode={mode}
      onClose={onClose}
      onEditTitle={setTitle}
      onEditContent={editActivityContent}
      onSave={() =>
        updateActivities(
          activity ? activity.id : parentId,
          title,
          content,
          mode
        )
      }
    />
  );
}
