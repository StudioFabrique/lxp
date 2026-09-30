import { FC, useCallback, useState } from "react";

import Skill from "../../../../../../src/utils/interfaces/skill";
import Badge from "../../../interfaces/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { descriptionFormSchema } from "../../../parcours.schema";
import { showFormErrors } from "../../../../../components/form/form-errors";
import DrawerFormButtons from "../../../../../components/UI/drawer-form-buttons/drawer-form-buttons.component";
import BoxWrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import BadgeList from "./badge/badge-list.component";
import { cn } from "../../../../../utils/cn";

type Props = {
  skill?: Skill;
  onSubmit: (skill: Skill) => void;
  onCloseDrawer: (id: string) => void;
};

const SkillForm: FC<Props> = ({ skill, onSubmit, onCloseDrawer }) => {
  const [badge, setBadge] = useState<Badge | null>(null);

  const form = useForm({ resolver: zodResolver(descriptionFormSchema), defaultValues: { description: skill?.description ?? "" } });
  const error = Boolean(form.formState.errors.description);

  /**
   * ferme le drawer lorsqu'on click sur le bouton annuler
   * le drawer est identifié par la présence ou non de la propriété "skill"
   */
  const handleCancel = () => {
    onCloseDrawer(skill ? "update-skill" : "badge-drawer");
    if (!skill) {
      form.reset();
    }
  };

  // test la validité du formulaire


  // définit le style du champ du formulaire en fonction de sa validité
  const style = "textarea focus:outline-none bg-secondary/20";
  const textareaStyle = cn(style, error && "textarea-error");

  /**
   * ajoute le badge sélectionné lors d'une importation d'image ou d'un click sur un badge dans la liste des badges
   */
  const addBadge = useCallback((newBadge: Badge) => {
    setBadge(newBadge);
  }, []);

  /**
   * soumet la nouvelle compétence, reset le formulaire et ferme le drawer
   * @param event FormEvent
   */
  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({ id: skill?.id, description: values.description , badge: badge?.image, isBonus: skill?.isBonus });
    form.reset();
    onCloseDrawer("badge-drawer");
  }, showFormErrors);


  return (
    <div className="flex flex-col gap-y-4">
      <form className="flex flex-col px-4 gap-y-4" onSubmit={handleSubmit}>
        <BoxWrapper>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="description">Description de la compétence *</label>
            <textarea
              className={textareaStyle}
              id="description"
              {...form.register("description")}
            />
          </div>
        </BoxWrapper>
        <BoxWrapper>
          <BadgeList badgeProp={skill?.badge} onSubmitBadge={addBadge} />
        </BoxWrapper>
        <DrawerFormButtons onCancel={handleCancel} />
      </form>
    </div>
  );
};

export default SkillForm;
