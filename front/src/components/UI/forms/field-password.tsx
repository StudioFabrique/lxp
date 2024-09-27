import { CheckCircle, Eye, EyeOff } from "lucide-react";
import CircleXIcon from "../svg/circle-x-icon";
import { useState } from "react";

type Props = {
  value: string;
  name: string;
  match?: boolean;
  isValid: boolean;
  onSetValue: (value: string) => void;
};

export default function FieldPassword(props: Props) {
  const [visibility, setVisibility] = useState(false);

  const handleVisibility = () => {
    setVisibility((prevState) => !prevState);
  };

  const baseStyle =
    "w-fit input input-bordered focus:outline-none flex items-center gap-2";
  const style = `${baseStyle}${!props.isValid ? " input-error" : ""}`;

  return (
    <>
      <div className="w-full flex gap-x-2 justify-start items-center relative">
        <label className={style}>
          <input
            className="grow "
            name={props.name}
            type={visibility ? "text" : "password"}
            value={props.value}
            onChange={(e) => props.onSetValue(e.currentTarget.value)}
          />
          {/* Icône de visibilité */}
          {visibility ? (
            <EyeOff
              className="h-4 w-4 cursor-pointer"
              onClick={handleVisibility}
            />
          ) : (
            <Eye
              className="h-4 w-4 cursor-pointer"
              onClick={handleVisibility}
            />
          )}
        </label>
        {/* Icône d'erreur */}
        {!props.isValid ? (
          <div className="w-5 h-5 text-error flex place-items-center gap-x-2 absolute -right-8 top-1/2 transform -translate-y-1/2">
            <CircleXIcon />
          </div>
        ) : props.match && props.value.length > 0 ? (
          <span className="flex gap-x-2 items-center absolute -right-8 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="h-5 w-5 text-success" />
          </span>
        ) : props.value.length > 0 ? (
          <div className="w-5 h-5 text-error flex place-items-center gap-x-2 absolute -right-8 top-1/2 transform -translate-y-1/2">
            <CircleXIcon />
          </div>
        ) : null}
      </div>
      {/* Message d'erreur */}
      {!props.isValid ? (
        <span className="text-xs text-error w-full justify-center flex">
          <p>Le mot de passe est invalide</p>
        </span>
      ) : !props.match ? (
        <span className="text-xs text-error w-full justify-center flex">
          <p>Les mots de passe ne sont pas identiques</p>
        </span>
      ) : null}
    </>
  );
}
