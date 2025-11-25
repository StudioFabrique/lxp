import { useCallback } from "react";
import TiptapActivity from "../lessons-preview/writing/tip-tap-activity";
import useTextActivity from "../../views/resources/hooks/useTextActivity";
import toast from "react-hot-toast";
import { Activity } from "../../utils/interfaces/activity";

type Props = {
  parentId: number;
  mode: "read" | "write" | "edit";
  activity?: Activity;
  onClose: () => void;
};

export default function TextActivityResource(props: Props) {
  const { createActivity, editActivityContent, content, title, setTitle } =
    useTextActivity();

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
      return result;
    },
    [createActivity]
  );

  return (
    <TiptapActivity
      id={props.activity?.id ?? 0}
      title={title}
      content={content}
      mode={props.mode}
      onClose={props.onClose}
      onEditTitle={setTitle}
      onEditContent={editActivityContent}
      onSave={() =>
        updateActivities(
          props.activity ? props.activity.id : props.parentId,
          title,
          content,
          props.mode
        )
      }
    />
  );
}
