import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { resourcesApi } from "../api/resources.api";
import Resource from "../interfaces/resource";
import { Activity } from "../../../utils/interfaces/activity";
import Tag from "../../../utils/interfaces/tag";
import { z } from "zod";
import { regexGeneric } from "../../../config/constantes";

const resourceSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis.").regex(regexGeneric, "Le titre contient des caractères non autorisés."),
  description: z.string().refine((value) => !value || regexGeneric.test(value), "La description contient des caractères non autorisés.").optional(),
});
import { getApiErrorMessage } from "../../../utils/helpers/api-error-message";

export default function useResource({
  onResourceSaved,
}: {
  onResourceSaved?: () => void;
} = {}) {
  const { resourceId: routeId } = useParams();
  const resourceId = routeId ? Number(routeId) : null;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedActivityId = Number(searchParams.get("activityId"));
  const [resource, setResource] = useState<Resource | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagError, setTagError] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(resourceId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [previewActivity, setPreviewActivityState] = useState<Activity | null>(null);
  const [activityType, setActivityType] = useState<Activity["type"] | null>(null);
  const [activityState, setActivityState] = useState<"read" | "write" | "edit">("read");
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(resourceSchema),
    defaultValues: { title: "", description: "" },
  });

  const selectActivity = useCallback((activity: Activity | null, mode: "read" | "edit" = "read") => {
    setPreviewActivityState(activity);
    setActivityType(activity?.type ?? null);
    setActivityState(mode);
  }, []);

  const loadResource = useCallback(async () => {
    if (!resourceId) return null;
    const data = await resourcesApi.queries.getDetails(resourceId);
    return data.resourceDetails as Resource;
  }, [resourceId]);

  useEffect(() => {
    let active = true;
    setResource(null);
    selectActivity(null);
    setError("");
    setFile(null);
    setTags([]);
    reset({ title: "", description: "" });
    if (!resourceId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    loadResource().then((details) => {
      if (!active || !details) return;
      setResource(details);
      setTags(details.tags ?? []);
      reset({ title: details.title, description: details.description });
      selectActivity(details.activities.find((activity) => activity.id === requestedActivityId) ?? details.activities[0] ?? null);
    }).catch((err) => {
      if (active) setError(getApiErrorMessage(err, "La ressource n'a pas pu être chargée."));
    }).finally(() => {
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, [resourceId, requestedActivityId, loadResource, reset, selectActivity]);

  const refreshActivityList = async (selectLastActivity = false) => {
    try {
      const details = await loadResource();
      if (!details) return false;
      setResource(details);
      const selected = selectLastActivity
        ? details.activities[details.activities.length - 1]
        : details.activities.find((activity) => activity.id === previewActivity?.id);
      selectActivity(selected ?? details.activities[0] ?? null);
      return true;
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Les activités n'ont pas pu être actualisées."));
      return false;
    }
  };

  const handleSubmitForm = handleSubmit(async (values) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const payload = new FormData();
    payload.append("data", JSON.stringify({ ...values, tags: tags.map((tag) => tag.name) }));
    if (file) payload.append("image", file);
    try {
      const result = await resourcesApi.mutations.save(payload, resourceId ?? undefined);
      if (!result.success) throw new Error(result.message);
      toast.success(result.message);
      setFile(null);
      if (!resourceId) {
        onResourceSaved?.();
        navigate(`/admin/resources/edit/${result.resource.id}`, { replace: true });
      } else {
        setResource((current) => current ? { ...current, ...result.resource, activities: current.activities, tags } : current);
        onResourceSaved?.();
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, "La ressource n'a pas pu être enregistrée."));
    } finally {
      setIsSubmitting(false);
    }
  });

  const handleDeleteActivity = async () => {
    if (!activityToDelete || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await resourcesApi.mutations.removeActivity(activityToDelete.type, activityToDelete.id);
      if (!result.success) throw new Error(result.message);
      toast.success(result.message);
      setActivityToDelete(null);
      await refreshActivityList();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "L'activité n'a pas pu être supprimée."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    resourceId, resource, tags, setTags, tagError, setTagError, setFile,
    mode: resourceId ? "update" as const : "create" as const,
    data: { register, errors }, isLoading, isSubmitting, error,
    activityType, activityState, previewActivity, activityToDelete,
    setActivityToDelete, setActivityState, handleSubmitForm, handleDeleteActivity,
    refreshActivityList,
    setPreviewActivity: (activity: Activity | null) => selectActivity(activity),
    setEditActivity: (activity: Activity) => selectActivity(activity, "edit"),
    closePreviewActivity: () => selectActivity(previewActivity),
    createNewActivity: (type: Exclude<Activity["type"], "file">) => {
      if (!resourceId) return;
      setPreviewActivityState(null);
      setActivityType(type);
      setActivityState("write");
    },
  };
}
