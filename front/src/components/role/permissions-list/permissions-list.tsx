import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { IRoleItem } from "../../../views/role/role";
import RoleSelector from "./role-selector";
import useHttp from "../../../hooks/use-http";
import RessourcesByAction from "./ressources-by-action";
import toast from "react-hot-toast";
import { Context } from "../../../store/context.store";

const PermissionsList: FC<{
  roles: IRoleItem[];
  currentRole: IRoleItem;
  setCurrentRole: Dispatch<SetStateAction<IRoleItem>>;
}> = ({ roles, currentRole, setCurrentRole }) => {
  const {
    defineRulesFor,
    roles: roleFromContext,
    fetchRoles,
    user,
  } = useContext(Context);
  const {
    sendRequest: sendRequestPermissions,
    isLoading: isLoadingPermissions,
  } = useHttp(true);

  const { sendRequest: sendRequestRessources, isLoading: isLoadingRessources } =
    useHttp(true);

  const [permissions, setPermissions] = useState([]);
  const [ressources, setRessources] = useState<{
    ressources: string[];
    roles: string[];
  } | null>(null);

  const handleChangePermission = (
    ressourceName: string,
    checked: boolean,
    action: string
  ) => {
    checked
      ? setPermissions((oldPermissions: any) =>
          oldPermissions.filter((permission: any) => {
            if (permission.action === action)
              return {
                ...permission,
                ressources: permission.ressources.push(ressourceName),
              };
            return permission;
          })
        )
      : setPermissions((oldPermissions: any) => {
          return oldPermissions.map((permission: any) => {
            if (permission.action === action)
              return {
                ...permission,
                ressources: permission.ressources.filter(
                  (res: string) => ressourceName !== res
                ),
              };
            return permission;
          });
        });
  };

  const handleSubmitPermissions = () => {
    const applyData = (data: any) => {
      fetchRoles(user!.roles[0]);
      defineRulesFor();
      console.log(roleFromContext);
      toast.success(data.message);
    };

    sendRequestPermissions(
      {
        path: `/permission/role/${currentRole._id}`,
        body: { permissions },
        method: "put",
      },
      applyData
    );
  };

  /**
   * Récupérer les permissions.
   * Rafraichir les permissions lors de la modification d'un role du composant parent.
   */
  const handleGetPermissions = useCallback(() => {
    const applyData = (data: any) => {
      setPermissions(data.data);
    };

    if (roles)
      sendRequestPermissions(
        { path: `/permission/${currentRole?.role}` },
        applyData
      );
  }, [currentRole, sendRequestPermissions, roles]);

  const handleGetRessources = useCallback(() => {
    const applyData = (data: any) => {
      setRessources(data.data);
    };

    sendRequestRessources({ path: `/permission/ressources` }, applyData);
  }, [sendRequestRessources]);

  useEffect(() => {
    handleGetPermissions();
  }, [handleGetPermissions]);

  useEffect(() => {
    handleGetRessources();
  }, [handleGetRessources]);

  return (
    <Wrapper>
      <h2 className="font-bold text-xl">Gestion des permissions</h2>
      <div className="flex justify-between items-center my-5">
        <RoleSelector
          roles={roles}
          currentRole={currentRole}
          onSetCurrentRole={setCurrentRole}
        />

        <button
          onClick={handleSubmitPermissions}
          type="button"
          className="btn btn-primary"
        >
          Sauvegarder
        </button>
      </div>
      {isLoadingRessources || isLoadingPermissions ? (
        <span className="loading loading-spinner" />
      ) : (
        <div className="flex justify-between">
          <div className="flex flex-col gap-y-5 w-full">
            <p className="bg-primary text-primary-content p-2 rounded-lg text-center">
              Permissions
            </p>
            {ressources?.ressources.map((res) => (
              <p
                key={res}
                className="bg-secondary p-2 rounded-lg capitalize"
              >{`Gestion ${res}`}</p>
            ))}
            <hr className="border-black w-[105%]" />
            {ressources?.roles.map((res) => (
              <p
                key={res}
                className="bg-secondary p-2 rounded-lg capitalize"
              >{`Gestion ${res}`}</p>
            ))}
          </div>
          <span className="w-10" />
          <RessourcesByAction
            action="read"
            title="Lecture"
            ressources={ressources}
            unfilteredPermissions={permissions}
            onChangePermission={handleChangePermission}
            roundedLeft
          />
          <RessourcesByAction
            action="write"
            title="Création"
            ressources={ressources}
            unfilteredPermissions={permissions}
            onChangePermission={handleChangePermission}
          />
          <RessourcesByAction
            action="update"
            title="Édition"
            ressources={ressources}
            unfilteredPermissions={permissions}
            onChangePermission={handleChangePermission}
          />
          <RessourcesByAction
            action="delete"
            title="Suppression"
            ressources={ressources}
            unfilteredPermissions={permissions}
            onChangePermission={handleChangePermission}
            roundedRight
          />
        </div>
      )}
    </Wrapper>
  );
};

export default PermissionsList;
