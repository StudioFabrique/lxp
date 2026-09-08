import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LessonReaderAndEditor from "../../../module-preview/components/preview/lesson-reader-and-editor";
import { Activity } from "../../../../utils/interfaces/activity";
import { ACTIVITIES } from "../../../../config/urls";
import { regexGeneric } from "../../../../config/constantes";
import { getApiErrorMessage } from "../../../../utils/helpers/api-error-message";
import { resourcesApi } from "../../api/resources.api";

type Props = {
  parentId: number;
  activity?: Activity;
  activityType: Activity["type"];
  mode: "read" | "write" | "edit";
  canEdit: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: (selectLast?: boolean) => Promise<boolean>;
};

export default function ActivityContent({ parentId, activity, activityType, mode, canEdit, onClose, onEdit, onDelete, onRefresh }: Props) {
  const [title, setTitle] = useState(activity?.title ?? "");
  const [content, setContent] = useState("");
  const [src, setSrc] = useState(activity?.url ?? "");
  const [titleError, setTitleError] = useState("");
  const [loading, setLoading] = useState(activityType === "text" && Boolean(activity));
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activityType !== "text" || !activity) return;
    const controller = new AbortController();
    fetch(`${ACTIVITIES}${activity.url}`, { credentials: "include", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Le contenu n'a pas pu être chargé.");
        return response.text();
      })
      .then(setContent)
      .catch((error) => { if (!controller.signal.aborted) setLoadError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [activity, activityType]);

  const saveActivity = async (_id?: number, newTitle = title, newContent = content) => {
    if (saving || !canEdit) return false;
    if (!newTitle.trim() || !regexGeneric.test(newTitle)) {
      setTitleError("Saisissez un titre valide.");
      return false;
    }
    setTitleError("");
    setSaving(true);
    try {
      const id = activity?.id ?? parentId;
      const result = activityType === "text"
        ? await resourcesApi.mutations.saveTextActivity(id, { title: newTitle.trim(), value: newContent, description: activity?.description ?? "", parent: "resource" }, mode === "edit")
        : activityType === "iframe"
          ? await resourcesApi.mutations.saveIframeActivity(id, { title: newTitle.trim(), url: src }, mode === "edit")
          : await resourcesApi.mutations.saveActivityTitle(id, newTitle.trim());
      if (!result.success) throw new Error(result.message);
      toast.success(result.message);
      return true;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "L'activité n'a pas pu être enregistrée."));
      return false;
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div role="status" className="skeleton h-64">Chargement de l'activité…</div>;
  if (loadError) return <div role="alert" className="alert alert-error">{loadError}</div>;

  return <LessonReaderAndEditor
    parent="resource"
    parentId={parentId}
    mode={mode}
    canEdit={canEdit}
    isLessonCompleted={false}
    selectedActivity={activity}
    activityType={activityType}
    textActivityTitle={title}
    textActivityTitleError={titleError}
    textActivityContent={content}
    iframeActivitySrc={src}
    showDeleteModal={false}
    isLoading={saving}
    onEditTitle={setTitle}
    onEditContent={setContent}
    onEditIframeSrc={setSrc}
    onRateActivity={() => {}}
    onEditActivity={onEdit}
    onOpenDeleteModal={onDelete}
    onDeleteActivity={onDelete}
    onCloseDeleteModal={() => {}}
    onClose={() => { void onRefresh(mode === "write"); }}
    onBack={onClose}
    onRefreshActivity={onRefresh}
    onSaveActivity={saveActivity}
  />;
}
