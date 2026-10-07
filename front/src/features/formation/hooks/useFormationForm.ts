import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormField } from "../../../components/form/useFormField";
import { showFormErrors } from "../../../components/form/form-errors";
import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formationApi } from "../api/formation.api";
import { formationSchema, type FormationFormValues } from "../formation.schema";
import type FormationItem from "../interfaces/formation-item";
import type { AxiosError } from "axios";
import {
  addPendingTag,
  partitionTagInput,
} from "../../tags/helpers/tag-selection";

type FormationMutationError = AxiosError<{
  message?: string;
  errors?: Array<{ msg?: string }>;
}>;

const showFormationMutationError = (error: FormationMutationError) => {
  toast.error(
    error.response?.data?.message ??
      error.response?.data?.errors?.[0]?.msg ??
      "La formation n'a pas pu être enregistrée.",
  );
};

type UseFormationFormOptions = {
  onSaved?: () => void;
};

export function useFormationForm(options: UseFormationFormOptions = {}) {
  const queryClient = useQueryClient();
  const form = useForm<FormationFormValues>({
    resolver: zodResolver(formationSchema),
    defaultValues: {
      title: "",
      description: "",
      code: "",
      level: "",
      tags: [],
    },
  });
  const [title, setTitle] = useFormField(form, "title");
  const [description, setDescription] = useFormField(form, "description");
  const [code, setCode] = useFormField(form, "code");
  const [level, setLevel] = useFormField(form, "level");
  const [currentTags, setCurrentTags] = useFormField(form, "tags");
  const [tagInput, setTagInputState] = useState("");
  const [formationToEdit, setFormationToEdit] = useState<FormationItem | null>(
    null,
  );
  const [createdFormation, setCreatedFormation] =
    useState<FormationItem | null>(null);

  const { data: allTags = [], refetch: refetchTags } = useQuery({
    queryKey: ["formation-tags"],
    queryFn: formationApi.queries.getTags,
  });

  const { data: formationsList = [], refetch: refetchFormations } = useQuery({
    queryKey: ["formation-list"],
    queryFn: formationApi.queries.getFormationList,
  });

  const isEditing = formationToEdit !== null;

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setCode("");
    setLevel("");
    setCurrentTags([]);
    setTagInputState("");
    setFormationToEdit(null);
  }, [setTitle, setDescription, setCode, setLevel, setCurrentTags]);

  const selectFormation = useCallback(
    (id: number) => {
      const formation = formationsList.find((f) => f.id === id);
      if (!formation) return;
      setFormationToEdit(formation);
      setTitle(formation.title);
      setDescription(formation.description ?? "");
      setCode(formation.code ?? "");
      setLevel(formation.level);
      if (formation.tags) {
        const matched = allTags.filter((t) => formation.tags!.includes(t.id));
        setCurrentTags(matched);
      }
    },
    [
      formationsList,
      allTags,
      setTitle,
      setDescription,
      setCode,
      setLevel,
      setCurrentTags,
    ],
  );

  const handleTagSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!tagInput.trim()) return;
      setCurrentTags((current) => addPendingTag(current, allTags, tagInput));
      setTagInputState("");
    },
    [tagInput, allTags, setCurrentTags],
  );

  const handleTagInputChange = useCallback(
    (value: string) => {
      const { committed, pending } = partitionTagInput(value);

      if (!committed) {
        setTagInputState(pending);
        return;
      }

      setCurrentTags((current) => addPendingTag(current, allTags, committed));
      setTagInputState(pending);
    },
    [allTags, setCurrentTags],
  );

  const handleRemoveTag = useCallback(
    (id: number) => {
      setCurrentTags((prev) => prev.filter((t) => t.id !== id));
    },
    [setCurrentTags],
  );

  const buildPayload = async (values: FormationFormValues) => {
    const newTags = values.tags.filter(
      (tag) =>
        !allTags.some(
          (existing) => existing.name.toLowerCase() === tag.name.toLowerCase(),
        ),
    );
    const created = newTags.length
      ? await formationApi.mutations.createTags(
          newTags.map(({ name, color }) => ({ name, color })),
        )
      : [];
    if (created.length) void refetchTags();
    return {
      title: values.title,
      description: values.description || undefined,
      code: values.code || undefined,
      level: values.level,
      tags: values.tags.map(
        (tag) =>
          created.find(
            (item) => item.name.toLowerCase() === tag.name.toLowerCase(),
          )?.id ?? tag.id,
      ),
    };
  };

  const createMutation = useMutation({
    mutationFn: async (values: FormationFormValues) =>
      formationApi.mutations.createFormation(await buildPayload(values)),
    onSuccess: (formation) => {
      toast.success("Formation créée avec succès");
      setCreatedFormation(formation);
      resetForm();
      refetchFormations();
      void queryClient.invalidateQueries({ queryKey: ["root-parcours"] });
      options.onSaved?.();
    },
    onError: showFormationMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: formationApi.mutations.deleteFormation,
    onSuccess: () => {
      toast.success("Formation supprimée avec succès");
      resetForm();
      refetchFormations();
      void queryClient.invalidateQueries({ queryKey: ["root-parcours"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data.message ??
          "La formation n'a pas pu être supprimée.",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: FormationFormValues) =>
      formationApi.mutations.updateFormation(
        formationToEdit!.id,
        await buildPayload(values),
      ),
    onSuccess: () => {
      toast.success("Formation mise à jour avec succès");
      resetForm();
      refetchFormations();
      void queryClient.invalidateQueries({ queryKey: ["root-parcours"] });
      options.onSaved?.();
    },
    onError: showFormationMutationError,
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    if (createMutation.isPending || updateMutation.isPending) return;
    if (
      !isEditing &&
      formationsList.some(
        (formation) =>
          formation.title.trim().toLocaleLowerCase("fr") ===
          values.title.toLocaleLowerCase("fr"),
      )
    ) {
      toast.error("Une formation avec ce nom existe déjà.");
      return;
    }
    if (isEditing)
      await updateMutation.mutateAsync(values).catch(() => undefined);
    else await createMutation.mutateAsync(values).catch(() => undefined);
  }, showFormErrors);

  return {
    title,
    setTitle,
    description,
    setDescription,
    code,
    setCode,
    level,
    setLevel,
    currentTags,
    tagInput,
    setTagInput: handleTagInputChange,
    formationToEdit,
    createdFormation,
    dismissCreatedFormation: () => setCreatedFormation(null),
    isEditing,
    allTags,
    formationsList,
    isPending: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    deleteFormation: deleteMutation.mutate,
    selectFormation,
    cancelEdit: resetForm,
    handleTagSubmit,
    handleRemoveTag,
    handleSubmit: () => {
      void handleSubmit();
    },
  };
}
