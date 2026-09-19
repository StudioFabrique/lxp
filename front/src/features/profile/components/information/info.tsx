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
  isStudent?: boolean;
}> = ({ formProps, isStudent }) => (
  <div className="flex flex-col gap-2">
    <BoxWrapper unstyled>
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
      {isStudent && <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 font-medium">Mes passions <span className="text-xs font-normal text-base-content/60">Séparez-les par une virgule.</span><textarea className="textarea textarea-bordered w-full" {...formProps.register("passions")} /></label>
        <label className="flex flex-col gap-2 font-medium">Mes liens <span className="text-xs font-normal text-base-content/60">Un lien par ligne.</span><textarea className="textarea textarea-bordered w-full" {...formProps.register("personalLinks")} /></label>
      </div>}
    </BoxWrapper>
  </div>
);
export default Info;
