import { FC } from "react";
import { UseFormRegister } from "react-hook-form";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import FormInput from "../../../../components/form/FormInput";

type FormProps = {
  register: UseFormRegister<any>;
  errors: any;
};

const Info: FC<{
  formProps: FormProps;
}> = ({ formProps }) => (
  <div className="flex flex-col gap-2">
    <BoxWrapper>
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <FormInput
            label="Prénom"
            name="firstname"
            register={formProps.register}
            error={formProps.errors.firstname}
          />
          <FormInput
            label="Nom"
            name="lastname"
            register={formProps.register}
            error={formProps.errors.lastname}
          />
          <FormInput
            label="Pseudo"
            name="nickname"
            register={formProps.register}
            error={formProps.errors.nickname}
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            register={formProps.register}
            error={formProps.errors.email}
          />
          <p className="text-xs text-base-content/60">
            Toute nouvelle adresse doit être validée depuis l'email reçu avant
            de remplacer l'adresse actuelle.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <FormInput
            label="Adresse"
            name="address"
            register={formProps.register}
            error={formProps.errors.address}
          />
          <FormInput
            label="Ville"
            name="city"
            register={formProps.register}
            error={formProps.errors.city}
          />
          <FormInput
            label="Code Postal"
            name="postCode"
            register={formProps.register}
            error={formProps.errors.postCode}
          />
          <FormInput
            label="Téléphone"
            name="phoneNumber"
            register={formProps.register}
            error={formProps.errors.phoneNumber}
          />
        </div>
      </div>
    </BoxWrapper>
  </div>
);
export default Info;
