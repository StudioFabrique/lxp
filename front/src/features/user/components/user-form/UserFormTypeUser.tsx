import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, createSearchParams } from "react-router";
import { RefreshCcw } from "lucide-react";
import apiClient from "../../../../lib/axios";
import type Role from "../../../../utils/interfaces/role";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";

type Props = {
  roleId: string | null;
  sendEmail: boolean;
  onSetSendEmail: (v: boolean) => void;
  onSetRoleId: (v: string | null) => void;
  editMode?: boolean;
  disabled?: boolean;
};

const UserFormTypeUser = ({
  roleId, sendEmail, onSetSendEmail, onSetRoleId, editMode, disabled,
}: Props) => {
  const [showRefreshButton, setShowRefreshButton] = useState(false);

  const { data: roles, isLoading } = useQuery({
    queryKey: ["permission-roles"],
    queryFn: async () => {
      const res = await apiClient.get("/permission/role");
      return res.data.data as Role[];
    },
  });

  return (
    <Wrapper>
      <div className="flex justify-between h-fit items-center">
        <h2 className="font-bold text-xl">Type d'utilisateur</h2>
        <div className="flex gap-2 items-center">
          <Link
            className="btn btn-accent btn-sm normal-case tooltip"
            type="button"
            to={{
              pathname: "/admin/roles",
              search: createSearchParams({ callback: "true" }).toString(),
            }}
            onClick={() => setShowRefreshButton(true)}
            data-tip="Ouverture dans un nouvel onglet"
            target="_blank"
          >
            Gérer les roles
          </Link>
          {showRefreshButton && (
            <button
              type="button"
              data-tip="Rafraichir la liste de roles"
              className="btn btn-ghost btn-sm tooltip"
              disabled
            >
              <RefreshCcw width={20} height={20} />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-5">
        {isLoading ? (
          <p>Chargement des roles...</p>
        ) : (
          <div className="flex flex-col justify-between h-full gap-5">
            <div className="flex flex-col gap-y-4 overflow-y-auto">
              {(roles ?? []).map((role: Role) => (
                <span key={role._id} className="flex gap-x-2">
                  <input
                    name={role.role}
                    type="radio"
                    className="radio radio-primary"
                    onChange={() => onSetRoleId(role._id)}
                    checked={roleId === role._id}
                    disabled={disabled}
                  />
                  <label htmlFor="etudiant">{role.label}</label>
                </span>
              ))}
            </div>
            {!editMode && (
              <>
                <div className="divider" />
                <label className="flex place-items-center gap-x-2" htmlFor="sendEmail">
                  <input
                    className="checkbox checkbox-primary"
                    type="checkbox"
                    name="emailSent"
                    checked={sendEmail}
                    onChange={() => onSetSendEmail(!sendEmail)}
                    disabled={disabled}
                  />
                  Envoyer un mail d'invitation
                </label>
              </>
            )}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default UserFormTypeUser;
