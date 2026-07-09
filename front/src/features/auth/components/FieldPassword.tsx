import { CheckCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const CircleXIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-full w-full"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

type Props = {
  label?: string;
  value: string;
  name: "password" | "password2";
  match?: boolean;
  isValid: boolean;
  onChange: (field: "password" | "password2", value: string) => void;
};

const FieldPassword = ({
  label,
  value,
  name,
  match,
  isValid,
  onChange,
}: Props) => {
  const [visibility, setVisibility] = useState(false);

  const baseStyle =
    "w-full input input-bordered focus:outline-none flex items-center gap-2";
  const style = `${baseStyle}${!isValid ? " input-error" : ""}`;

  return (
    <>
      <label className="flex flex-col gap-y-2" htmlFor={name}>
        <p>{label}</p>
        <span className="w-full flex gap-x-2 justify-start items-center relative">
          <div className={style}>
            <input
              className="grow w-64"
              name={name}
              type={visibility ? "text" : "password"}
              value={value}
              onChange={(e) => onChange(name, e.currentTarget.value)}
            />
            {visibility ? (
              <EyeOff
                className="h-4 w-4 cursor-pointer"
                onClick={() => setVisibility(false)}
              />
            ) : (
              <Eye
                className="h-4 w-4 cursor-pointer"
                onClick={() => setVisibility(true)}
              />
            )}
          </div>
          {!isValid ? (
            <div className="w-5 h-5 text-error flex place-items-center gap-x-2 absolute -right-8 top-1/2 transform -translate-y-1/2">
              <CircleXIcon />
            </div>
          ) : match && value.length > 0 ? (
            <span className="flex gap-x-2 items-center absolute -right-8 top-1/2 transform -translate-y-1/2">
              <CheckCircle className="h-5 w-5 text-success" />
            </span>
          ) : value.length > 0 ? (
            <div className="w-5 h-5 text-error flex place-items-center gap-x-2 absolute -right-8 top-1/2 transform -translate-y-1/2">
              <CircleXIcon />
            </div>
          ) : null}
        </span>
      </label>
      {!isValid ? (
        <span className="text-xs text-error w-full justify-center flex">
          <p>Le mot de passe est invalide</p>
        </span>
      ) : !match ? (
        <span className="text-xs text-error w-full justify-center flex">
          <p>Les mots de passe ne sont pas identiques</p>
        </span>
      ) : null}
    </>
  );
};

export default FieldPassword;
