import { useCallback, useMemo } from "react";
import TiptapActivity from "../lessons-preview/writing/tip-tap-activity";
import useTextActivity from "../../views/resources/hooks/useTextActivity";
import toast from "react-hot-toast";

type Props = {
  parentId: number;
  mode: "read" | "write" | "edit";
  activityType: "video" | "text" | "image" | "resource";
  showTipTapEditor?: boolean;
  onSubmit: (result: boolean) => void;
  textData?: {
    title: string;
    content: string;
    handleCloseTextEditor: () => void;
    setTitle: (title: string) => void;
    editActivityContent: (content: string) => void;
  };
};

export default function CreateResourceActivity(props: Props) {
  const {
    createActivity,
    editActivityContent,
    content,
    title,
    setTitle,
    resetActivityDatas,
    //resetStorage,
  } = useTextActivity();

  const updateActivities = useCallback(
    async (
      id: number,
      title: string,
      content: string,
      isEditing: "read" | "write" | "edit"
    ) => {
      const result = await createActivity(
        isEditing === "write" ? props.parentId : id,
        title,
        content,
        isEditing
      );
      if (!result)
        toast.error(
          "Une erreur est survenue lors de la mise à jour de l'activité."
        );
      return result;
    },
    [createActivity, props.parentId]
  );

  const display = useMemo(() => {
    switch (props.activityType) {
      case "video":
        return <div>Video Activity Creation Form</div>;
      case "text":
        return (
          <TiptapActivity
            id={props.parentId}
            title={props.textData!.title}
            content={props.textData!.content}
            mode={props.mode}
            onClose={props.textData!.handleCloseTextEditor}
            onEditTitle={props.textData!.setTitle}
            onEditContent={props.textData!.editActivityContent}
            onSave={() =>
              updateActivities(props.parentId, title, content, props.mode)
            }
          />
        );

      case "image":
        return <div>Image Activity Creation Form</div>;
      case "resource":
        return <div>File Activity Creation Form</div>;
      default:
        return <div>Unknown Activity Type</div>;
    }
  }, [
    content,
    props.activityType,
    props.mode,
    props.parentId,
    props.textData,
    title,
    updateActivities,
  ]);
  return <div>{display}</div>;
}
