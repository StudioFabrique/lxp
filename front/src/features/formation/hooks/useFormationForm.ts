import { useCallback, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { formationApi } from "../api/formation.api";
import { formationSchema } from "../formation.schema";
import type Tag from "../../../utils/interfaces/tag";
import type FormationItem from "../interfaces/formation-item";
import { getRandomNumber } from "../../../utils/helpers/get-random-number";
import type { AxiosError } from "axios";
import { emitOnboardingEvent } from "../../onboarding/onboarding-events";

const TAG_COLORS = [
  "rgba(255, 0, 0, 0.5)",
  "rgba(0, 255, 0, 0.5)",
  "rgba(0, 0, 255, 0.5)",
  "rgba(255, 255, 0, 0.5)",
  "rgba(255, 0, 255, 0.5)",
  "rgba(0, 255, 255, 0.5)",
  "rgba(128, 0, 0, 0.5)",
  "rgba(0, 128, 0, 0.5)",
  "rgba(0, 0, 128, 0.5)",
  "rgba(128, 128, 0, 0.5)",
  "rgba(128, 0, 128, 0.5)",
  "rgba(0, 128, 128, 0.5)",
  "rgba(255, 165, 0, 0.5)",
  "rgba(139, 69, 19, 0.5)",
  "rgba(220, 20, 60, 0.5)",
  "rgba(46, 139, 87, 0.5)",
  "rgba(255, 215, 0, 0.5)",
  "rgba(139, 0, 139, 0.5)",
  "rgba(0, 100, 0, 0.5)",
  "rgba(0, 0, 139, 0.5)",
];

const makeTag = (name: string, value: number): Tag => ({
  id: value + 1,
  name,
  color: TAG_COLORS[getRandomNumber(0, TAG_COLORS.length - 1)],
});

type FormationMutationError = AxiosError<{
  message?: string;
  errors?: Array<{ msg?: string }>;
}>;

const showFormationMutationError = (error: FormationMutationError) => {
  toast.error(
    error.response?.data?.message ??
      error.response?.data?.errors?.[0]?.msg ??
      "La formation n’a pas pu être enregistrée.",
  );
};

export function useFormationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [level, setLevel] = useState("");
  const [currentTags, setCurrentTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formationToEdit, setFormationToEdit] = useState<FormationItem | null>(
    null,
  );
  const [createdFormation, setCreatedFormation] = useState<FormationItem | null>(
    null,
  );

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
    setTagInput("");
    setFormationToEdit(null);
  }, []);

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
    [formationsList, allTags],
  );

  const handleTagSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!tagInput.trim()) return;
      const existing = allTags.find(
        (t) => t.name.toLowerCase() === tagInput.toLowerCase(),
      );
      if (existing) {
        if (!currentTags.find((t) => t.id === existing.id)) {
          setCurrentTags((prev) => [...prev, existing]);
        }
      } else {
        if (
          !currentTags.find(
            (t) => t.name.toLowerCase() === tagInput.toLowerCase(),
          )
        ) {
          setCurrentTags((prev) => [
            ...prev,
            makeTag(tagInput, allTags.length + prev.length),
          ]);
        }
      }
      setTagInput("");
    },
    [tagInput, allTags, currentTags],
  );

  const handleRemoveTag = useCallback((id: number) => {
    setCurrentTags((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const findNewTags = useCallback(
    () =>
      currentTags.filter(
        (t) =>
          !allTags.find((at) => at.name.toLowerCase() === t.name.toLowerCase()),
      ),
    [currentTags, allTags],
  );

  const createMutation = useMutation({
    mutationFn: async () => {
      const newTags = findNewTags();
      let resolvedTags = currentTags;
      if (newTags.length > 0) {
        const created = await formationApi.mutations.createTags(
          newTags.map((t) => ({ name: t.name, color: t.color })),
        );
        refetchTags();
        resolvedTags = currentTags.map(
          (t) =>
            created.find(
              (c) => c.name.toLowerCase() === t.name.toLowerCase(),
            ) ?? t,
        );
      }
      const tagIds = resolvedTags.map((t) => t.id);
      return formationApi.mutations.createFormation({
        title,
        description: description || undefined,
        code: code || undefined,
        level,
        tags: tagIds,
      });
    },
    onSuccess: (formation) => {
      toast.success("Formation créée avec succès");
      emitOnboardingEvent({ type: "formation_created", id: formation.id });
      setCreatedFormation(formation);
      resetForm();
      refetchFormations();
    },
    onError: showFormationMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: formationApi.mutations.deleteFormation,
    onSuccess: () => {
      toast.success("Formation supprimée avec succès");
      resetForm();
      refetchFormations();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error.response?.data.message ??
          "La formation n'a pas pu être supprimée.",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const newTags = findNewTags();
      let resolvedTags = currentTags;
      if (newTags.length > 0) {
        const created = await formationApi.mutations.createTags(
          newTags.map((t) => ({ name: t.name, color: t.color })),
        );
        refetchTags();
        resolvedTags = currentTags.map(
          (t) =>
            created.find(
              (c) => c.name.toLowerCase() === t.name.toLowerCase(),
            ) ?? t,
        );
      }
      const tagIds = resolvedTags.map((t) => t.id);
      return formationApi.mutations.updateFormation(formationToEdit!.id, {
        title,
        description: description || undefined,
        code: code || undefined,
        level,
        tags: tagIds,
      });
    },
    onSuccess: () => {
      toast.success("Formation mise à jour avec succès");
      resetForm();
      refetchFormations();
    },
    onError: showFormationMutationError,
  });

  const handleSubmit = useCallback(() => {
    const parsed = formationSchema.safeParse({
      title,
      description,
      level,
      code,
    });
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      toast.error(first.message);
      return;
    }
    if (currentTags.length === 0) {
      toast.error("Au moins un tag est requis pour enregistrer la formation.");
      return;
    }
    if (
      !isEditing &&
      formationsList.some(
        (formation) =>
          formation.title.trim().toLocaleLowerCase("fr") ===
          title.trim().toLocaleLowerCase("fr"),
      )
    ) {
      toast.error("Une formation avec ce nom existe déjà.");
      return;
    }
    if (isEditing) {
      updateMutation.mutate();
    } else {
      createMutation.mutate();
    }
  }, [
    title,
    description,
    level,
    code,
    currentTags,
    formationsList,
    isEditing,
    createMutation,
    updateMutation,
  ]);

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
    setTagInput,
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
    handleSubmit,
  };
}
