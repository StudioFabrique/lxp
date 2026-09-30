import { FC, useEffect, useRef } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newParcoursSchema } from "../../parcours.schema";
import { showFormErrors } from "../../../../components/form/form-errors";
import { Link } from "react-router";
import Selecter from "../../../../components/UI/selecter/selecter.component";
import { cn } from "../../../../utils/cn";

type Item = {
  id: number;
  title: string;
};

type Props = {
  formations: Array<Item>;
  initialFormationId?: number;
  onCreateFormation?: () => void;
  onSubmit: ({
    title,
    formationId,
  }: {
    title: string;
    formationId: number;
  }) => void;
};

const NewParcoursForm: FC<Props> = ({
  formations,
  initialFormationId,
  onCreateFormation,
  onSubmit,
}) => {
  const form = useForm({ resolver: zodResolver(newParcoursSchema), defaultValues: { title: "", formationId: initialFormationId ?? 0 }, mode: "onChange" });
  const formationId = form.watch("formationId");
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formationId) titleInputRef.current?.focus();
  }, [formationId]);

  /**
   * sélectionne la formation
   * @param id number
   */
  const handleFormation = (id: number) => {
    form.setValue("formationId", id, { shouldDirty: true, shouldValidate: true });
  };

  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setInputStyle = (hasError: boolean) => {
    return cn("input input-sm input-bordered focus:outline-none w-full", hasError && "input-error text-error");
  };

  /**
   * soumission du formulaire s'il est valide, affichage d'un message d'erreur dans le cas contraire
   * @param event FormEvent
   */
  const handleSubmit = form.handleSubmit(onSubmit, showFormErrors);

  return (
    <>
      <div className="font-bold">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-4">
            <Selecter
              list={formations}
              title="A quelle formation souhaitez-vous attacher ce parcours ?"
              defaultItem={{ id: initialFormationId ?? 0, title: "" }}
              onSelectItem={handleFormation}
            />
            <Link
              className="text-xs underline font-normal pl-2"
              to="/admin/parcours?createFormation=true"
              onClick={onCreateFormation}
            >
              Formation inexistante ? Créer une formation
            </Link>
          </div>
        </div>
      </div>
      <form
        className="w-full flex flex-col gap-y-8 mt-8"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-y-4">
          <label className="font-bold" htmlFor="title">
            Donner un nom au parcours
          </label>
          <input
            ref={(element) => { form.register("title").ref(element); titleInputRef.current = element; }}
            data-onboarding-field="parcours-title"
            className={setInputStyle(Boolean(form.formState.errors.title))}
            id="title"
            onChange={form.register("title").onChange}
            onBlur={form.register("title").onBlur}
            name="title"
            placeholder="Exemple: CDA - Promo 2023"
            disabled={!formationId}
          />
        </div>
        <div className="w-full flex justify-end">
          <button
            className="btn btn-primary"
            disabled={!formationId || !form.formState.isValid}
          >
            Créer
          </button>
        </div>
      </form>
    </>
  );
};

export default NewParcoursForm;
