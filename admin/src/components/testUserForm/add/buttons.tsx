import { FC, useEffect, useState } from "react";

export const Add: FC<{ isLoading: boolean }> = (props) => {
  const [buttonClass, setButtonClass] = useState("btn loading");

  useEffect(() => {
    props.isLoading ? setButtonClass("btn loading") : setButtonClass("btn");
  }, [props.isLoading]);

  return (
    <button className={buttonClass} type="submit">
      Créer l'utilisateur
    </button>
  );
};
