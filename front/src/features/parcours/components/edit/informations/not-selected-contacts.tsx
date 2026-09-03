import { useCallback, useContext, useMemo } from "react";
import Contact from "../../../../../../src/utils/interfaces/contact";
import useEagerLoadingList from "../../../../../../src/hooks/useEagerLoadingList";
import SortColumnIcon from "../../../../../components/UI/sort-column-icon/sort-column-icon";
import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";
import UserQuickCreate from "../../../../../../src/components/user-quick-create/user-quick-create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { parcoursApi } from "../../../api/parcours.api";
import { parcoursKeys } from "../../../api/parcours.keys";
import { getApiErrorMessage } from "../../../../../utils/helpers/api-error-message";
import { getContactFullName } from "../../../../../utils/helpers/contact-full-name";
import { AuthContext } from "../../../../../store/AuthProvider";

interface NotSelectedContactsProps {
  list?: Contact[];
  onAddItems?: (contactsIds: number[]) => void;
  onCloseDrawer?: (id: string) => void;
}

type Teacher = {
  firstname: string;
  lastname: string;
  email: string;
  nickname?: string;
  address?: string;
  city?: string;
  postCode?: string;
  phoneNumber?: string;
};

const NotSelectedContacts = (props: NotSelectedContactsProps) => {
  const { user } = useContext(AuthContext);
  const canCreateTeacher = user?.roles.some(({ rank }) => rank < 2) ?? false;
  const {
    allChecked,
    list,
    fieldSort,
    direction,
    setAllChecked,
    handleRowCheck,
    sortData,
  } = useEagerLoadingList(props.list!, "lastname");
  const queryClient = useQueryClient();

  const { mutate: createTeacher } = useMutation({
    mutationFn: (teacher: Teacher) =>
      parcoursApi.mutations.createTeacher(teacher),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({
          queryKey: parcoursKeys.availableContacts(),
        });
      }
    },
    onError: (error) => {
      // L'API refuse en 409 une adresse email déjà utilisée : ce motif était
      // remplacé par un message générique qui ne disait pas quoi corriger.
      toast.error(
        getApiErrorMessage(error, "Erreur lors de la création du contact"),
      );
    },
  });

  const handleAllChecked = useCallback(() => {
    setAllChecked((prevState) => !prevState);
  }, [setAllChecked]);

  const table = useMemo(() => {
    return (
      <table className="table w-full border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th>
              <input
                className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                type="checkbox"
                checked={allChecked}
                onChange={handleAllChecked}
              />
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("lastname");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Prénom et nom</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="lastname"
                  direction={direction}
                />
              </div>
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                sortData("role");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Role</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="role"
                  direction={direction}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {list &&
            list.map((item) => (
              <tr
                className="bg-secondary/10 hover:bg-secondary/20 hover:text-base-content"
                key={item.id}
              >
                <td>
                  <input
                    className="my-auto checkbox checkbox-sm rounded-md checkbox-primary"
                    type="checkbox"
                    checked={
                      item.isSelected !== undefined ? item.isSelected : false
                    }
                    onChange={() => handleRowCheck(item.id)}
                  />
                </td>
                <td>{getContactFullName(item)}</td>
                <td>{item.role}</td>
              </tr>
            ))}
        </tbody>
      </table>
    );
  }, [
    allChecked,
    direction,
    fieldSort,
    handleAllChecked,
    handleRowCheck,
    list,
    sortData,
  ]);

  const handleAddContacts = () => {
    if (list) {
      const contacts = list
        .filter((item) => item.isSelected)
        .map((item) => item.id);
      props.onAddItems!(contacts);
      props.onCloseDrawer!("add-contacts");
    }
  };

  const handleCloseDrawer = (id: string) => {
    console.log("click");

    document.getElementById(id)?.click();
  };

  const submitNewTeacher = (teacher: Teacher) => {
    createTeacher(teacher);
  };

  return (
    <>
      {list && list.length > 0 ? (
        <>
          {table}
          <div className="w-full flex justify-between mt-4">
            {canCreateTeacher ? (
              <button
                className="btn btn-accent"
                onClick={() => handleCloseDrawer("new-contact")}
              >
                Créer un contact
              </button>
            ) : (
              <span />
            )}
            <button className="btn btn-primary" onClick={handleAddContacts}>
              Ajouter
            </button>
          </div>
          {canCreateTeacher ? (
            <RightSideDrawer
              id="new-contact"
              title="Ajouter une ressource pédagogique"
              visible={false}
            >
              <UserQuickCreate
                onCloseDrawer={handleCloseDrawer}
                onSubmitUser={submitNewTeacher}
              />
            </RightSideDrawer>
          ) : null}
        </>
      ) : (
        <div className="flex flex-col gap-y-8">
          <p>Tous les contacts ont déja été ajoutés</p>
          {canCreateTeacher ? (
            <>
              <button
                className="btn btn-accent"
                onClick={() => {
                  handleCloseDrawer("new-contact");
                }}
              >
                Créer un contact
              </button>
              <RightSideDrawer
                id="new-contact"
                title="Ajouter une ressource pédagogique"
                visible={false}
              >
                <UserQuickCreate
                  onCloseDrawer={handleCloseDrawer}
                  onSubmitUser={submitNewTeacher}
                />
              </RightSideDrawer>
            </>
          ) : null}
        </div>
      )}
    </>
  );
};

export default NotSelectedContacts;
