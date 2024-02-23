import { Dispatch, FC, Ref, SetStateAction, useContext } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Field from "../../UI/forms/field";
import CustomError from "../../../utils/interfaces/custom-error";
import { Context } from "../../../store/context.store";
import ProfileImageFileUpload from "../../UI/image-file-upload/profile-image-file-upload";
import { avatarImageMaxSize } from "../../../config/images-sizes";

type FormProps = {
  values: Record<string, string>;
  errors: CustomError[];
  onChangeValue: (field: string, value: string) => void;
  onResetForm: () => void;
};

const Info: FC<{
  formProps: FormProps;
  firstInputRef: Ref<HTMLInputElement>;
  temporaryAvatar: { file: File | null; url: string | null };
  setTemporaryAvatar: Dispatch<
    SetStateAction<{ file: File | null; url: string | null }>
  >;
}> = ({ formProps, firstInputRef, temporaryAvatar, setTemporaryAvatar }) => {
  const { user } = useContext(Context);

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
          />
          <Field name="lastname" label="Nom" data={formProps} />
          <Field name="nickname" label="Pseudo" data={formProps} />
          <div className="flex gap-5 justify-between">
            <Field name="email" label="Email" data={formProps} />
            <div className="flex flex-col w-[50%] items-end gap-2">
              <h4>Avatar</h4>
              <ProfileImageFileUpload
                temporaryAvatar={temporaryAvatar}
                onSetTemporaryAvatar={setTemporaryAvatar}
                maxSize={avatarImageMaxSize}
                existingAvatar={user?.avatar}
              />
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};
export default Info;
