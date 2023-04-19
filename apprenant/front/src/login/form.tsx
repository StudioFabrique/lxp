import styles from "./form.module.css";
import { useState } from "react";

const Form = () => {
  const [isPasswordHidden, setPasswordHideState] = useState(true);
  const [passwordValue, setPasswordValue] = useState("");

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordValue(e.target.value);
  }
  return (
    <div className="w-[70%] flex flex-col gap-y-4">
      <p className="text-[14pt] font-bold">Se connecter</p>
      {/* input 1 */}
      <input
        className="p-[20px] pl-[30px] rounded-[15px] w-full bg-purple-light placeholder:text-purple-discrete"
        type="text"
        placeholder="Identifiant"
      />
      <span className="flex">
        {/* input 2 */}
        <input
          className="rounded-l-[15px] bg-purple-light w-full p-[20px] pl-[30px] placeholder:text-purple-discrete"
          type={isPasswordHidden ? "password" : "text"}
          placeholder="Mot de passe"
          onChange={handlePasswordChange}
        />
        <button
          className={`bg-no-repeat bg-contain bg-center w-[10%] bg-purple-light rounded-r-[15px]
        ${isPasswordHidden ? styles.bgEyeClosed : styles.bgEyeOpen}
      `}
          onClick={() => setPasswordHideState(!isPasswordHidden)}
        />
      </span>

      <div className="flex flex-row justify-between mt-3">
        <button className="ml-2 text-[8pt]">Mot de passe oublié?</button>
        <button className="bg-pink p-3 rounded-md pr-6 pl-6 text-white text-[8pt]">
          Je me connecte
        </button>
      </div>
    </div>
  );
};

export default Form;
