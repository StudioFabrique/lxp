import { FC, Ref, useContext } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Field from "../../UI/forms/field";
import CustomError from "../../../utils/interfaces/custom-error";
import { Context } from "../../../store/context.store";
import { EditIcon, User } from "lucide-react";

type FormProps = {
  values: Record<string, string>;
  errors: CustomError[];
  onChangeValue: (field: string, value: string) => void;
  onResetForm: () => void;
};

const Info: FC<{
  formProps: FormProps;
  editMode: boolean;
  firstInputRef: Ref<HTMLInputElement>;
}> = ({ formProps, editMode, firstInputRef }) => {
  const { user } = useContext(Context);

  const onClickChangeAvatar = () => {};

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">Information</h3>
      <Wrapper>
        <div className="flex flex-col gap-4">
          <Field
            fieldRef={firstInputRef}
            name="firstname"
            label="Prénom"
            data={formProps}
            isDisabled={!editMode}
          />
          <Field
            name="lastname"
            label="Nom"
            data={formProps}
            isDisabled={!editMode}
          />
          <Field
            name="nickname"
            label="Pseudo"
            data={formProps}
            isDisabled={!editMode}
          />
          <div className="flex gap-5 justify-between">
            <Field
              name="email"
              label="Email"
              data={formProps}
              isDisabled={!editMode}
            />
            <div className="flex flex-col w-[50%] items-end gap-2">
              <h4>Avatar</h4>
              <button
                type="button"
                onClick={onClickChangeAvatar}
                className="btn btn-primary text-white p-0 rounded-lg h-[60px] w-[60px]"
              >
                <img
                  className="h-[58px] w-[58px] rounded-lg border-2 border-primary object-cover"
                  src={`data:image/jpeg;base64,${user?.avatar}`}
                  alt="User Avatar"
                />
                <span className="flex justify-end items-end p-1 absolute h-[56px] w-[56px] rounded-lg backdrop-blur-[2px] opacity-0 hover:opacity-100">
                  <EditIcon className="text-primary-content stroke-[3px]" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};
export default Info;
