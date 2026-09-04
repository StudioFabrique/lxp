import { Dispatch, FC, SetStateAction, useContext } from "react";
import { UseFormRegister } from "react-hook-form";
import Wrapper from "../../../../components/wrappers/BoxWrapper";
import FormInput from "../../../../components/form/FormInput";
import ImageFileUpload from "../../../../components/UI/image-file-upload/image-file-upload";
import { avatarImageMaxSize } from "../../../../config/images-sizes";
import { AuthContext } from "../../../../store/AuthProvider";

type FormProps = {
  register: UseFormRegister<any>;
  errors: any;
};

const Info: FC<{
  formProps: FormProps;
  temporaryAvatar: { file: File | null; url: string | null };
  setTemporaryAvatar: Dispatch<
    SetStateAction<{ file: File | null; url: string | null }>
  >;
}> = ({ formProps, temporaryAvatar, setTemporaryAvatar }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Informations</h3>
      <Wrapper>
        <div className="flex flex-col gap-2">
          <div className="flex gap-10 justify-between">
            <FormInput
              label="Prénom"
              name="firstname"
              register={formProps.register}
              error={formProps.errors.firstname}
            />
            <div className="flex flex-col items-center gap-2">
              <h4>Avatar</h4>
              <ImageFileUpload
                temporaryImage={temporaryAvatar}
                onSetTemporaryImage={setTemporaryAvatar}
                maxSize={avatarImageMaxSize}
                existingImage={user?.avatar}
              />
            </div>
          </div>
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
          <div className="flex flex-col gap-y-2 w-full">
            <label htmlFor="current-role" className="text-sm font-bold">
              Rôle
            </label>
            <input
              id="current-role"
              className="w-full input input-bordered capitalize disabled:cursor-not-allowed disabled:text-base-content/60"
              type="text"
              value={user?.roles[0]?.label ?? ""}
              disabled
              readOnly
            />
          </div>
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
            label="Telephone"
            name="phoneNumber"
            register={formProps.register}
            error={formProps.errors.phoneNumber}
          />
        </div>
      </Wrapper>
    </div>
  );
};
export default Info;
