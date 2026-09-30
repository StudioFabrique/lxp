import { FC } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { descriptionFormSchema } from "../../../parcours.schema";
import { showFormErrors } from "../../../../../components/form/form-errors";
import Objective from "../../../../../../src/utils/interfaces/objective";
import BoxWrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import DrawerFormButtons from "../../../../../components/UI/drawer-form-buttons/drawer-form-buttons.component";
import { cn } from "../../../../../utils/cn";

type Props = {
  objective?: Objective;
  onCloseDrawer: (id: string) => void;
  onSubmit: (objective: Objective) => void;
};

const FormObjective: FC<Props> = ({ objective, onCloseDrawer, onSubmit }) => {
  const form = useForm({ resolver: zodResolver(descriptionFormSchema), defaultValues: { description: objective?.description ?? "" } });
  const error = Boolean(form.formState.errors.description);

  /**
   * ferme le drawer lorsqu'on click sur le bouton annuler
   * le drawer est identifié par la présence ou non de la propriété "skill"
   */
  const handleCancel = () => {
    onCloseDrawer(objective ? "update-objective" : "add-objective");
    if (!objective) {
      form.reset();
    }
  };

  /**
   * soumet la nouvelle compétence, reset le formulaire et ferme le drawer
   * @param event FormEvent
   */
  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({ id: objective?.id, description: values.description });
    form.reset();
    onCloseDrawer(objective ? "update-objective" : "add-objective");
  }, showFormErrors);

  // définit le style du champ du formulaire en fonction de sa validité
  const style = "textarea focus:outline-none bg-secondary/20";
  const textareaStyle = cn(style, error && "textarea-error");

  return (
    <div className="flex flex-col gap-y-4">
      <form className="flex flex-col px-4 gap-y-4" onSubmit={handleSubmit}>
        <BoxWrapper>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="description">Objectif de parcours *</label>
            <textarea
              className={textareaStyle}
              id="description"
              {...form.register("description")}
            />
          </div>
        </BoxWrapper>
        <DrawerFormButtons onCancel={handleCancel} />
      </form>
    </div>
  );
};

export default FormObjective;
