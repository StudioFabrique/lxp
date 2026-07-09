import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router";
import { ThemeContext } from "../../../../src/store/ThemeProvider";
import { usePasswordUpdate } from "../hooks/usePasswordUpdate";
import PasswordUpdateForm from "./PasswordUpdateForm";
import PasswordUpdateSuccess from "./PasswordUpdateSuccess";
import PasswordUpdateError from "./PasswordUpdateError";

type Props = {
  message: string;
};

const PasswordUpdateHome = ({ message }: Props) => {
  const { chooseTheme } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();

  const {
    checkToken,
    error,
    handleChange,
    handleSubmit,
    isValid,
    password,
    password2,
    success,
    submitLoader,
  } = usePasswordUpdate(searchParams.get("id") ?? "");

  useEffect(() => {
    chooseTheme("classic", "light");
  }, [chooseTheme]);

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  return error.length > 0 ? (
    <section className="flex flex-col gap-y-8 justify-center items-center">
      <PasswordUpdateError error={error} url="/" />
    </section>
  ) : success ? (
    <section className="flex flex-col place-items-center">
      <PasswordUpdateSuccess message={message} url="/" />
    </section>
  ) : (
    <section>
      <PasswordUpdateForm
        onChange={handleChange}
        password={password}
        password2={password2}
        onSubmit={handleSubmit}
        isValid={isValid}
        submitLoader={submitLoader}
      />
    </section>
  );
};

export default PasswordUpdateHome;
