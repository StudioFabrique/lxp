import { useFormContext, useWatch } from "react-hook-form";
import { useParcoursQuery } from "../../../parcours/hooks/useParcoursQuery";
import type { GroupFormValues } from "../../group.schema";
import GroupTeachers from "./GroupTeachers";

export default function GroupCreationTeachers() {
  const { control } = useFormContext<GroupFormValues>();
  const parcoursId = useWatch({ control, name: "parcoursId" });
  const parcours = useParcoursQuery(parcoursId > 0 ? parcoursId : undefined);

  return (
    <GroupTeachers
      isCreating
      parcoursId={parcoursId > 0 ? parcoursId : undefined}
      teachers={parcours.data?.contacts.map((contact) => ({
        _id: contact.idMdb,
        firstname: contact.firstname,
        lastname: contact.lastname,
      }))}
      isLoading={parcours.isLoading}
      isError={parcours.isError}
      onRetry={() => void parcours.refetch()}
    />
  );
}
