import { FC } from "react";

import hiddenPassword from "../../../assets/images/eye-closed.svg";
import visiblePassword from "../../../assets/images/eye-open.svg";
// On supprime l'import du module SCSS qui crée conflit
// import styles from "./password-visible.module.scss";

const PasswordVisible: FC<{
  inputType: string;
  onPasswordVisibility: () => void;
}> = (props) => {
  return (
    <img
      // On utilise Tailwind pour le curseur et s'assurer qu'il ne soit pas déformé
      className="cursor-pointer object-contain w-4 h-4 hover:opacity-70 transition-opacity"
      src={props.inputType === "password" ? visiblePassword : hiddenPassword}
      alt="icone pour afficher le mot de passe en clair"
      onClick={props.onPasswordVisibility}
    />
  );
};

export default PasswordVisible;
