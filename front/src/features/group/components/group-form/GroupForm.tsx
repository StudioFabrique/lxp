import type { ReactNode } from "react";
import { FormProvider, type UseFormReturn } from "react-hook-form";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";

import Informations from "./GroupFormInformations";
import Details from "./GroupFormDetails";
import FromParcoursWarning from "./GroupFormParcoursWarning";
import Header from "../../../../../src/components/headers/Header";
import type { GroupFormValues } from "../../group.schema";

type Props = {
  form: UseFormReturn<GroupFormValues>;
  onSubmitForm: (data: GroupFormValues) => void;
  isLoading: boolean;
  isEditing: boolean;
  gridType?: "cols" | "rows";
  fromParcours?: string;
  children?: ReactNode;
};

const GroupForm = ({
  form,
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
      <form
        className="flex flex-col gap-y-10"
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmitForm)}
        data-recommended-tour="group-form"
      >
        <Header
          title={isEditing ? "Modifier un groupe" : "Créer un groupe"}
          description="Renseignez les informations du groupe et choisissez les étudiants qui le composent."
        >
          <div className="flex gap-2">
            <Link
              to={cancelTo}
              className="btn btn-outline md:w-32 normal-case"
            >
              Annuler
            </Link>

            <button
              type="submit"
              className="btn btn-primary min-w-32 normal-case"
              disabled={isLoading}
              data-recommended-tour="group-save"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? "Sauvegarde…" : "Sauvegarder"}
            </button>
          </div>
        </Header>

        <div
          className={`grid ${
            gridType === "rows" ? "grid-rows-2" : "grid-cols-2"
          } max-lg:grid-cols-1 gap-5`}
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

      </form>
      {children}
    </FormProvider>
  );
};

export default GroupForm;
