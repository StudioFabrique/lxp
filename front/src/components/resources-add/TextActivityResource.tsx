import { useCallback } from "react";
import TiptapActivity from "../lessons-preview/writing/tip-tap-activity";
import useTextActivity from "../../views/resources/hooks/useTextActivity";
import toast from "react-hot-toast";
import { Activity } from "../../utils/interfaces/activity";

type Props = {
  parentId: number;
  mode: "read" | "write" | "edit";
  activity?: Activity;
  activityType: "text" | "video" | "image" | "resource";
  onClose: () => void;
  onSubmit: (message: string) => void;
};

export default function TextActivityResource({
  parentId,
  mode,
  activity,
  //activityType,
  onClose,
  onSubmit,
}: Props) {
  const { createActivity, editActivityContent, content, title, setTitle } =
    useTextActivity(activity);

  const updateActivities = useCallback(
    async (
      id: number,
      title: string,
      content: string,
      isEditing: "read" | "write" | "edit"
    ) => {
      const result = await createActivity(id, title, content, isEditing);
      if (!result)
        toast.error(
          "Une erreur est survenue lors de la mise à jour de l'activité."
        );
      if (result)
        onSubmit(
          `Activité ${mode === "edit" ? "mise à jour" : "créée"} avec succès.`
        );
      return result;
    },
    [createActivity, mode, onSubmit]
  );

  console.log("MODE", mode);

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
