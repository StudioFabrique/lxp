/* eslint-disable @typescript-eslint/no-explicit-any */

import Wrapper from "../UI/wrapper/wrapper.component";
import DrawerFormButtons from "../UI/drawer-form-buttons/drawer-form-buttons.component";
import Field from "../UI/forms/field";
import React, { useState } from "react";
import { userQuickCreateSchema } from "../../lib/validation/parcours-edit/user-quick-create-val";
import { ZodError } from "zod";
import useForm from "../UI/forms/hooks/use-form";
import { validationErrors } from "../../helpers/validate";

type Props = {
  onSubmitUser: (newUser: any) => void;
  onCloseDrawer: (id: string) => void;
};

const UserQuickCreate = ({ onSubmitUser, onCloseDrawer }: Props) => {
  const [isActive, setIsActive] = useState(true);
  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm();

  // détermine si le compte de l'utilisateur sera activé dès sa création
  const handleToggleIsActive = () => {
    setIsActive((prevState) => !prevState);
  };

  const data = { values, errors, onChangeValue };

  // ferme le drawer et reset le formulaire
  const handleCancel = () => {
    onResetForm();
    onCloseDrawer("new-contact");
  };

  // vérifie si le formulaire est valide et le transmet les valeurs des champs au parent
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      userQuickCreateSchema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        console.log({ error });
        const errors = validationErrors(error);
        onValidationErrors(errors);
        return;
      }
    }

    onSubmitUser({ ...values, isActive });
    onResetForm();
    onCloseDrawer("new-contact");
  };

  //console.log("data :", values);

  return (
    <div className="flex flex-col">
      <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-4 px-4">
          <label className="flex gap-x-4 items-center cursor-pointer">
            <span className="text-primary/50">Status</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={isActive}
              onChange={handleToggleIsActive}
            />
            <span
              className={`label-text font-bold ${
                !isActive ? "text-primary/50" : "text-primary"
              }`}
            >
              {isActive ? "Actif" : "Inactif"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Wrapper>
            <Field
              label="Nom *"
              name="lastname"
              placeholder="Dupont"
              data={data}
            />

            <Field
              label="Prénom *"
              name="firstname"
              placeholder="Jean"
              data={data}
            />

            <Field
              label="Pseudo"
              name="nickname"
              placeholder="Toto"
              data={data}
            />

            <Field
              label="Email *"
              name="email"
              type="email"
              placeholder="Ex : email@exemple.com"
              data={data}
            />
          </Wrapper>
          <Wrapper>
            <Field
              label="Adresse"
              name="address"
              placeholder="Ex : 2 place royale"
              data={data}
            />

            <Field
              label="Ville"
              name="city"
              placeholder="Ex : Paris"
              data={data}
            />

            <Field
              label="Code Postal"
              name="postCode"
              placeholder="Ex : 75000"
              data={data}
            />

            <Field
              label="Numéro de téléphone"
              name="phoneNumber"
              placeholder="Ex : 01 02 03 04 05"
              data={data}
            />
          </Wrapper>
        </div>
        <div className="w-full flex flex-col gap-y-4">
          <p className="text-xs px-2 mt-2">
            Note : Les identifiants de l'utilisateur lui seront envoyés par mail
            à la validation du formulaire
          </p>
          <div className="w-full flex flex-col items-center gap-x-2 pr-2">
            {errors && errors.length > 0 ? (
              <p className="w-full text-left pl-2 font-bold text-error">
                {errors[0].message}
              </p>
            ) : null}
            <DrawerFormButtons onCancel={handleCancel} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserQuickCreate;
