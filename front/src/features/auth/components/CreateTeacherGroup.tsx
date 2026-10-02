import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import toast from "react-hot-toast";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { groupApi } from "../../group/api/group.api";
import { createGroupSchema } from "../../group/group.schema";
import TeacherGroupFields from "./TeacherGroupFields";
import OnboardingGroupModal from "./OnboardingGroupModal";

function CreateGroupModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [parcoursId, setParcoursId] = useState(0);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [validationError, setValidationError] = useState<string>();
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          group: { name: name.trim(), desc: "" },
          parcoursId,
          users: Object.entries(selected).map(([_id, isActive]) => ({
            _id,
            isActive,
          })),
        }),
      );
      await groupApi.mutations.create(formData);
    },
    onSuccess: () => {
      void client.invalidateQueries({
        queryKey: ["onboarding-student-groups"],
      });
      void client.invalidateQueries({ queryKey: ["/group/student"] });
      toast.success("Groupe créé.");
      onClose();
    },
  });
  const close = () => {
    if (!mutation.isPending) onClose();
  };

  return (
    <OnboardingGroupModal title="Créer un nouveau groupe" onClose={close}>
      <form
        className="flex min-h-0 flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (mutation.isPending) return;
          const result = createGroupSchema.safeParse({
            name,
            desc: "",
            formationId: 0,
            parcoursId,
          });
          if (!result.success) {
            setValidationError(result.error.issues[0].message);
            return;
          }
          setValidationError(undefined);
          mutation.mutate();
        }}
      >
        <fieldset
          disabled={mutation.isPending}
          className="-mx-2 min-h-0 min-w-0 overflow-x-hidden overflow-y-auto p-2"
        >
          <TeacherGroupFields
            name={name}
            setName={setName}
            parcoursId={parcoursId}
            setParcoursId={setParcoursId}
            selected={selected}
            setSelected={setSelected}
          />
        </fieldset>
        {validationError && (
          <p role="alert" className="text-sm text-error">
            {validationError}
          </p>
        )}
        {mutation.isError && (
          <p role="alert" className="text-sm text-error">
            Impossible de créer le groupe. Réessayez.
          </p>
        )}
        <div className="flex shrink-0 justify-end gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={mutation.isPending}
            onClick={close}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={mutation.isPending || !name.trim()}
          >
            {mutation.isPending ? "Création…" : "Créer le groupe"}
          </button>
        </div>
      </form>
    </OnboardingGroupModal>
  );
}

export default function CreateTeacherGroup({
  hasGroups,
}: {
  hasGroups: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <BoxWrapper className="h-auto border-secondary/25 bg-secondary/5">
      <span className="flex size-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
        <Users className="size-6" aria-hidden="true" />
      </span>
      <h2 className="font-semibold">
        {hasGroups
          ? "Créer un nouveau groupe maintenant"
          : "Créer mon groupe maintenant"}
      </h2>
      <button
        type="button"
        className="btn btn-primary mt-auto h-auto min-h-10 self-start py-2"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4 shrink-0" aria-hidden="true" /> Créer un nouveau
        groupe
      </button>
      {open && <CreateGroupModal onClose={() => setOpen(false)} />}
    </BoxWrapper>
  );
}
