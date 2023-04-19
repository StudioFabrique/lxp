import { Dispatch, FC, SetStateAction } from "react";
import useInput from "../../hooks/use-input";
import { regexMail } from "../../utils/constantes";
import FadeWrapper from "../UI/FadeWrapper/FadeWrapper";

const ResetPasswordForm: FC<{
  setResetPasswordState: Dispatch<SetStateAction<boolean>>;
  onSubmit: (email: string) => void;
}> = (props) => {
  const { value: email } = useInput(
    (value: string) => value.length < 1 || regexMail.test(value)
  );

  let formIsValid = false;
  formIsValid = email.isValid;

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    if (formIsValid && email.value.trim().length > 0) {
      props.onSubmit(email.value.trim());
    }
  };

  const handleClickFormChange = (e: React.MouseEvent) => {
    e.preventDefault();
    props.setResetPasswordState(false);
  };

  return (
    <FadeWrapper>
      <form className="w-[70%] flex flex-col gap-y-4" onSubmit={submitHandler}>
        <button onClick={handleClickFormChange}>Retour</button>
        <input type="text" value={email.value} />
        <div className="flex flex-row justify-center mt-3">
          <button className="btn normal-case bg-pink-900 p-3 rounded-md pr-6 pl-6 text-white text-[8pt]">
            Réinitialiser
          </button>
        </div>
      </form>
    </FadeWrapper>
  );
};

export default ResetPasswordForm;
