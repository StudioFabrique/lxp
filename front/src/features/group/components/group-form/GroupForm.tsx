import type { ReactNode } from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { Link } from "react-router";
import { LoaderCircle } from "lucide-react";

import Informations from "./GroupFormInformations";
import Details from "./GroupFormDetails";
import FromParcoursWarning from "./GroupFormParcoursWarning";
import Header from "../../../../../src/components/headers/Header";
import PageWrapper from "../../../../components/wrappers/PageWrapper";
import type { GroupFormValues } from "../../group.schema";
import { cn } from "../../../../utils/cn";
import type Group from "../../../../utils/interfaces/group";
import GroupTeachers from "./GroupTeachers";
import GroupCreationTeachers from "./GroupCreationTeachers";

type Props = {
  form: UseFormReturn<GroupFormValues>;
  existingGroup?: Group;
  onSubmitForm: (data: GroupFormValues) => void;
  isLoading: boolean;
  isEditing: boolean;
  gridType?: "cols" | "rows";
  fromParcours?: string;
  children?: ReactNode;
};

const GroupForm = ({
  form,
  existingGroup,
  onSubmitForm,
  isLoading,
  isEditing,
  gridType,
  fromParcours,
  children,
}: Props) => {
  const cancelTo = fromParcours
    ? `/admin/parcours/edit/${fromParcours}?step=6`
    : "/admin/group";

  return (
    <FormProvider {...form}>
      <PageWrapper
        as="form"
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmitForm)}
        data-recommended-tour="group-form"
      >
        <Header
          title={isEditing ? "Modifier un groupe" : "Créer un groupe"}
          description="Renseignez les informations du groupe et choisissez les apprenants qui le composent"
        >
          <div className="flex gap-2">
            <Link to={cancelTo} className="btn btn-outline md:w-32 normal-case">
              Annuler
            </Link>

            <button
              type="submit"
              className="btn btn-primary min-w-32 normal-case"
              disabled={isLoading}
              data-recommended-tour="group-save"
            >
              {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
              {isLoading ? "Sauvegarde…" : "Sauvegarder"}
            </button>
          </div>
        </Header>

        <div
          className={cn("grid", gridType === "rows" ? "grid-rows-2" : "grid-cols-2", "max-lg:grid-cols-1 gap-5")}
        >
          <div data-recommended-tour="group-informations">
            <Informations isLoading={isLoading} />
          </div>
          {!fromParcours ? (
            <Details />
          ) : (
            <FromParcoursWarning parcoursId={Number(fromParcours)} />
          )}
        </div>
        {isEditing ? <GroupTeachers group={existingGroup} /> : <GroupCreationTeachers />}
      </PageWrapper>
      {children}
    </FormProvider>
  );
};

export default GroupForm;
