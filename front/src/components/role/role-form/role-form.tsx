import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import useInput from "../../../hooks/use-input";
import { regexGeneric, regexNumber } from "../../../utils/constantes";
import { setInputStyle } from "../../../utils/formClasses";
import Wrapper from "../../UI/wrapper/wrapper.component";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import { IRoleItem } from "../../../views/role/role";

const RoleCreateForm: FC<{
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
}> = ({ setRoles }) => {
  const {
    sendRequest,
    isLoading: isRequestLoading,
    error: requestError,
  } = useHttp();

  const [isActive, SetActive] = useState(true);

  const { value: name } = useInput(
    (value: string) => regexGeneric.test(value),
    ""
  );

  const { value: description } = useInput(
    (value: string) => regexGeneric.test(value),
    ""
  );

  const { value: rank } = useInput(
    (value: string) => regexNumber.test(value),
    ""
  );

  const handleSubmitRole = () => {
    const applyData = (data: any) => {
      setRoles((currentRoles) => [...currentRoles, data.data]);
      toast.success("Rôle créé avec succès");
    };

    if (name.isValid && description.isValid)
      sendRequest(
        {
          path: `/permission/role`,
          method: "post",
          body: { role: name.value, rank: 1 },
        },
        applyData
      );
    else toast.error("Le formulaire n'est pas valide");
  };

  useEffect(() => {
    if (requestError) toast.error("problème requête");
  }, [requestError]);

  return (
    <Wrapper>
      <span className="flex flex-col gap-y-1">
        <h2 className="flex flex-col gap-y-4 font-bold">Création de rôles</h2>
      </span>

      <span className="flex flex-col gap-y-1">
        <p>Nom du rôle</p>
        <input
          type="text"
          name="name"
          id="name"
          className={setInputStyle(name.hasError)}
          onChange={name.valueChangeHandler}
          onBlur={name.valueBlurHandler}
          defaultValue={name.value}
        />
      </span>

      <span className="flex flex-col gap-y-1">
        <p>Description</p>
        <input
          type="text"
          name="description"
          id="description"
          className={setInputStyle(description.hasError)}
          onChange={description.valueChangeHandler}
          onBlur={description.valueBlurHandler}
          defaultValue={description.value}
        />
      </span>

      <span className="flex gap-x-1">
        <p>Status</p>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          onChange={(e) => SetActive(e.currentTarget.checked)}
        />
        <p>{isActive ? "Actif" : "Inactif"}</p>
      </span>

      {isRequestLoading ? (
        <button type="button" className="btn">
          <span className="loading loading-spinner" />
        </button>
      ) : (
        <button type="button" className="btn" onClick={handleSubmitRole}>
          Ajouter
        </button>
      )}
    </Wrapper>
  );
};

export default RoleCreateForm;
