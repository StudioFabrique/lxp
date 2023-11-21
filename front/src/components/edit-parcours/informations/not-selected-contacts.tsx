import { useCallback, useEffect, useMemo } from "react";
import Contact from "../../../utils/interfaces/contact";
import useEagerLoadingList from "../../../hooks/use-eager-loading-list";
import SortColumnIcon from "../../UI/sort-column-icon.component/sort-column-icon.component";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import UserQuickCreate from "../../user-quick-create/user-quick-create";
import { parcoursContactsAction } from "../../../store/redux-toolkit/parcours/parcours-contacts";
import { useDispatch } from "react-redux";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import User from "../../../utils/interfaces/user";

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
  isActive: boolean;
};

const NotSelectedContacts = (props: NotSelectedContactsProps) => {
  const {
    allChecked,
    list,
    fieldSort,
    direction,
    setAllChecked,
    handleRowCheck,
    sortData,
  } = useEagerLoadingList(props.list!, "name");
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();

  /**
   * gère le coche / décochage de toutes les checkboxes
   */
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
                sortData("name");
              }}
            >
              <div className="flex items-center gap-x-2">
                <p>Nom</p>
                <SortColumnIcon
                  fieldSort={fieldSort}
                  column="name"
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
                <td>{item.name}</td>
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
    document.getElementById(id)?.click();
  };

  /**
   * envoi d'une requête pour enregistrer dans la bdd un formateur créé à la volée
   */
  const submitNewTeacher = (teacher: Teacher) => {
    const processData = (data: {
      success: boolean;
      message: string;
      contact: User;
    }) => {
      if (data.success) {
        toast.success(data.message);
        dispatch(parcoursContactsAction.addNewContact(data.contact));
        dispatch(parcoursContactsAction.setNotSelectedContacts());
      }
    };
    sendRequest(
      {
        path: "/user/new-teacher",
        method: "post",
        body: teacher,
      },
      processData
    );
  };

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      {list && list.length > 0 ? (
        <>
          {table}
          <div className="w-full flex justify-between mt-4">
            <button
              className="btn btn-accent"
              onClick={() => handleCloseDrawer("new-contact")}
            >
              Créer un contact
            </button>
            <button className="btn btn-primary" onClick={handleAddContacts}>
              Ajouter
            </button>
          </div>
          <RightSideDrawer
            id="new-contact"
            title="Ajouter un Formateur"
            visible={false}
            //onCloseDrawer={handleCloseDrawer}
          >
            <UserQuickCreate
              onCloseDrawer={handleCloseDrawer}
              onSubmitUser={submitNewTeacher}
            />
          </RightSideDrawer>
        </>
      ) : (
        <p>Tous les contacts ont déja été ajoutés</p>
      )}
    </>
  );
};

export default NotSelectedContacts;
