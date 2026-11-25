import { useCallback, useContext, useMemo, useState } from "react";
import Contact from "../../../../../../src/utils/interfaces/contact";
import { sortArray } from "../../../../../utils/helpers/sort-array";
import SortColumnIcon from "../../../../../components/UI/sort-column-icon/sort-column-icon";
import { Link, useParams } from "react-router";
import { getContactFullName } from "../../../../../utils/helpers/contact-full-name";
import { AuthContext } from "../../../../../store/AuthProvider";
import { PlusCircle } from "lucide-react";
import { createContactUrlFromParcours } from "../../../helpers/parcours-contact-creation";

interface NotSelectedContactsProps {
  list?: Contact[];
  onAddItems?: (contactsIds: number[]) => void;
  onCloseDrawer?: (id: string) => void;
}

const NotSelectedContacts = (props: NotSelectedContactsProps) => {
  const { id: parcoursId } = useParams();
  const { user } = useContext(AuthContext);
  const canCreateTeacher =
    (user?.roles[0]?.rank ?? 4) < 2 && parcoursId !== undefined;
  // La création passe par la page de création d'utilisateur, comme pour les groupes.
  const createContactUrl = parcoursId
    ? createContactUrlFromParcours(parcoursId)
    : undefined;
  const [selectedContactIds, setSelectedContactIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [direction, setDirection] = useState(true);
  const fieldSort = "lastname";
  const list = useMemo(
    () =>
      sortArray(
        (props.list ?? []).map((contact) => ({
          ...contact,
          isSelected:
            contact.id !== undefined && selectedContactIds.has(contact.id),
        })),
        fieldSort,
        direction,
      ),
    [props.list, selectedContactIds, direction],
  );
  const allChecked =
    list.length > 0 && list.every((contact) => contact.isSelected);
  const handleAllChecked = useCallback(() => {
    setSelectedContactIds((previousIds) => {
      const nextIds = new Set(previousIds);
      list?.forEach((contact) => {
        if (contact.id !== undefined) {
          if (allChecked) nextIds.delete(contact.id);
          else nextIds.add(contact.id);
        }
      });
      return nextIds;
    });
  }, [allChecked, list]);

  const handleContactCheck = useCallback((contact: Contact) => {
    if (contact.id === undefined) return;

    setSelectedContactIds((previousIds) => {
      const nextIds = new Set(previousIds);
      if (contact.isSelected) nextIds.delete(contact.id!);
      else nextIds.add(contact.id!);
      return nextIds;
    });
  }, []);

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
                aria-label="Sélectionner tous les contacts"
                onChange={handleAllChecked}
              />
            </th>
            <th
              className="cursor-pointer"
              onClick={() => {
                setDirection((previous) => !previous);
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
                    aria-label={`Sélectionner ${getContactFullName(item)}`}
                    onChange={() => handleContactCheck(item)}
                  />
                </td>
                <td>{getContactFullName(item)}</td>
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
    handleContactCheck,
    list,
  ]);

  const handleAddContacts = () => {
    if (list) {
      const contacts = list
        .filter((item) => item.isSelected)
        .map((item) => item.id!);
      props.onAddItems!(contacts);
      props.onCloseDrawer!("add-contacts");
    }
  };

  return (
    <>
      {list && list.length > 0 ? (
        <>
          {table}
          <div className="w-full flex flex-wrap justify-between gap-2 mt-4">
            {canCreateTeacher ? (
              <Link className="btn btn-accent" to={createContactUrl!}>
                Créer un contact
              </Link>
            ) : (
              <span />
            )}
            <button className="btn btn-primary" onClick={handleAddContacts}>
              Ajouter
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-y-8">
          {canCreateTeacher ? (
            <Link
              className="btn btn-primary flex items-center"
              to={createContactUrl!}
            >
              <PlusCircle aria-hidden="true" />
              Créer un contact
            </Link>
          ) : null}
        </div>
      )}
    </>
  );
};

export default NotSelectedContacts;
