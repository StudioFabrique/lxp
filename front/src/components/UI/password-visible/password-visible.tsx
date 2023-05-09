import { FC } from "react";

import hiddenPassword from "../../../assets/images/eye-closed.svg";
import visiblePassword from "../../../assets/images/eye-open.svg";
import styles from "./password-visible.module.scss";

const PasswordVisible: FC<{
  inputType: string;
  onPasswordVisibility: () => void;
}> = (props) => {
  return (
    <img
      className={styles["password-icon"]}
      src={props.inputType === "password" ? visiblePassword : hiddenPassword}
      alt="icone pour afficher le mot de passe en clair"
      onClick={props.onPasswordVisibility}
      width={30}
      height={30}
    />
  );
};

export default PasswordVisible;
