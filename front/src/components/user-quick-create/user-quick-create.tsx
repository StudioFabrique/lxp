/* eslint-disable @typescript-eslint/no-explicit-any */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DrawerFormButtons from "../../components/UI/drawer-form-buttons/drawer-form-buttons.component";
import BoxWrapper from "../wrappers/BoxWrapper";
import FormInput from "../form/FormInput";
import { userQuickCreateSchema } from "../../../src/config/validation/parcours-edit/user-quick-create-val";

type Props = {
  onSubmitUser: (newUser: any) => void;
  onCloseDrawer: (id: string) => void;
};

const UserQuickCreate = ({ onSubmitUser, onCloseDrawer }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userQuickCreateSchema),
    defaultValues: {
      lastname: "",
      firstname: "",
      nickname: "",
      email: "",
      address: "",
      city: "",
      postCode: "",
      phoneNumber: "",
    },
  });

  // ferme le drawer et reset le formulaire
  const handleCancel = () => {
    reset();
    onCloseDrawer("new-contact");
  };

  // vérifie si le formulaire est valide et le transmet les valeurs des champs au parent
  const onSubmit = handleSubmit((data: any) => {
    onSubmitUser(data);
    reset();
    onCloseDrawer("new-contact");
  });

  return (
    <div className="flex flex-col">
      <form className="flex flex-col gap-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BoxWrapper>
            <FormInput
              label="Prénom *"
              name="firstname"
              placeholder="Jean"
              register={register}
              error={errors.firstname}
            />

            <FormInput
              label="Nom *"
              name="lastname"
              placeholder="Dupont"
              register={register}
              error={errors.lastname}
            />

            <FormInput
              label="Pseudo"
              name="nickname"
              placeholder="jean64"
              register={register}
              error={errors.nickname}
            />

            <FormInput
              label="Email *"
              name="email"
              type="email"
              placeholder="email@exemple.com"
              register={register}
              error={errors.email}
            />
          </BoxWrapper>
          <BoxWrapper>
            <FormInput
              label="Adresse"
              name="address"
              placeholder="2 place royale"
              register={register}
              error={errors.address}
            />

            <FormInput
              label="Ville"
              name="city"
              placeholder="Paris"
              register={register}
              error={errors.city}
            />

            <FormInput
              label="Code Postal"
              name="postCode"
              placeholder="75000"
              register={register}
              error={errors.postCode}
            />

            <FormInput
              label="Numéro de téléphone"
              name="phoneNumber"
              placeholder="01 02 03 04 05"
              register={register}
              error={errors.phoneNumber}
            />
          </BoxWrapper>
        </div>
        <div className="w-full flex flex-col gap-y-4">
          <p className="text-xs px-2 mt-2">
            Note : Le formateur recevra un lien par mail pour créer son mot de
            passe. Son compte sera activé à cette occasion.
          </p>
          <div className="w-full flex flex-col items-center gap-x-2 pr-2">
            <DrawerFormButtons onCancel={handleCancel} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserQuickCreate;
