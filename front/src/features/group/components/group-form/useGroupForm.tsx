import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type Group from "../../../../../src/utils/interfaces/group";
import {
  createGroupSchema,
  type GroupFormValues,
} from "../../group.schema";
import type { GroupFormDraft } from "../../helpers/group-form-draft";

function useGroupForm({
  group,
  draft,
  sourceParcoursId,
}: {
  group?: Group;
  draft: GroupFormDraft;
  sourceParcoursId?: number;
}) {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      name: draft.values.name ?? "",
      desc: draft.values.desc ?? "",
      formationId: draft.values.formationId ?? 0,
      parcoursId: sourceParcoursId ?? draft.values.parcoursId ?? 0,
    },
  });

  useEffect(() => {
    if (group) {
      form.reset({
        name: draft.values.name ?? group.name ?? "",
        desc: draft.values.desc ?? group.desc ?? "",
        formationId:
          draft.values.formationId ?? group.formationId ?? 0,
        parcoursId:
          sourceParcoursId ??
          draft.values.parcoursId ??
          group.parcoursId ??
          0,
      });
    }
  }, [draft.values, form, group, sourceParcoursId]);

  return form;
}

export default useGroupForm;
