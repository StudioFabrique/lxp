import {
  ChangeEventHandler,
  Dispatch,
  FC,
  Ref,
  SetStateAction,
  useContext,
  useRef,
} from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Field from "../../UI/forms/field";
import CustomError from "../../../utils/interfaces/custom-error";
import { Context } from "../../../store/context.store";
import { EditIcon } from "lucide-react";
import imageProfileReplacement from "../../../config/image-profile-replacement";

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

  const fileUploadRef: Ref<HTMLInputElement> = useRef(null);

  const onClickChangeAvatar = () => {
    fileUploadRef.current?.click();
  };

  const onSubmitAvatar: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.currentTarget.files![0];
    const temporaryUrl = URL.createObjectURL(file);
    setTemporaryAvatar({ file: file, url: temporaryUrl });
  };

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
              <button
                type="button"
                onClick={onClickChangeAvatar}
                className="btn btn-primary text-white p-0 rounded-lg h-[60px] w-[60px]"
              >
                <img
                  className="h-[58px] w-[58px] rounded-lg border-2 border-primary object-cover"
                  src={
                    temporaryAvatar.url
                      ? temporaryAvatar.url
                      : `data:image/jpeg;base64,${
                          user?.avatar ?? imageProfileReplacement
                        }`
                  }
                  alt="User Avatar"
                />
                <span className="flex justify-end items-end p-1 absolute h-[56px] w-[56px] rounded-lg backdrop-blur-[2px] opacity-0 hover:opacity-100">
                  <EditIcon className="text-primary-content stroke-[3px]" />
                </span>
                <input
                  ref={fileUploadRef}
                  className="hidden"
                  type="file"
                  onChange={onSubmitAvatar}
                />
              </button>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};
export default Info;
