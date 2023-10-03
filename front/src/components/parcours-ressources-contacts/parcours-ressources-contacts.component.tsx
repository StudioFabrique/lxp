import React, { FC, useCallback, useEffect, useMemo } from "react";
import useItems from "../../hooks/use-items";
import { sortArray } from "../../utils/sortArray";
import User from "../../utils/interfaces/user";
import useHttp from "../../hooks/use-http";
import SearchDropdown from "../UI/search-dropdown/search-dropdown";
import ParcoursUserItem from "../parcours-user-item/parcours-user-item.component";
import Role from "../../utils/interfaces/role";
import { autoSubmitTimer } from "../../config/auto-submit-timer";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import UserQuickCreate from "../user-quick-create/user-quick-create";
import Wrapper from "../UI/wrapper/wrapper.component";

type UserItem = {
  _id: string;
  name: string;
  roles: Array<Role>;
};

const property = "name";

const ParcoursRessourcesContacts: FC<{
  onSubmitContacts: (contacts: Array<UserItem>) => void;
}> = ({ onSubmitContacts }) => {
  const { sendRequest } = useHttp();
  const {
    selectedItems,
    filteredItems,
    addItem,
    filterItems,
    resetFilterItems,
    removeItem,
    initItems,
  } = useItems(); // custom hook qui gère les transferts d'objets entre deux listes

  /**
   * envoie une requête http pour récup la liste des formateurs et la stock en mémoire dans un custom hook "useList"
   */
  const fetchTeachers = useCallback(() => {
    const applyData = (data: any) => {
      const userItems = Array<UserItem>();
      data.forEach((user: User) => {
        userItems.push({
          _id: user._id,
          name: `${user.firstname} ${user.lastname}`,
          roles: user.roles,
        });
      });
      initItems(sortArray(userItems, property));
    };
    sendRequest(
      {
        path: "/parcours/contacts",
      },
      applyData
    );
  }, [initItems, sendRequest]);

  // envoie une requête pour récupérer la liste des formateurs au montage du composant
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleRemoveUser = (user: UserItem) => {
    removeItem(user, "_id");
  };

  const contactsToSubmit = useMemo(() => {
    return {
      contacts: selectedItems,
    };
  }, [selectedItems]);

  /**
   * mise à jour automatique de la liste des contacts vers le composant parent
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      onSubmitContacts(contactsToSubmit.contacts);
    }, autoSubmitTimer);
    return () => {
      clearTimeout(timer);
    };
  }, [contactsToSubmit.contacts, onSubmitContacts]);

  // TODO: requête pour enregistrer le nouveau formateur
  const handleSubmitNewUser = (newUser: {
    email: string;
    firstname: string;
    lastname: string;
  }) => {
    fetchTeachers();
  };

  /**
   * fermeture du drawer
   * @param id string
   */
  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  return (
    <Wrapper>
      <h3 className="font-bold text-xl">Ressources et Contacts</h3>
      <div className="flex gap-x-2 w-full">
        <SearchDropdown
          addItem={addItem}
          filterItems={filterItems}
          resetFilterItems={resetFilterItems}
          filteredItems={filteredItems}
          property="name"
          placeHolder="Ajouter un nouveau contact..."
        />
        <RightSideDrawer
          title="Ajouter un Formateur"
          onCloseDrawer={handleCloseDrawer}
        >
          <UserQuickCreate onSubmitUser={handleSubmitNewUser} />
        </RightSideDrawer>
      </div>
      <ul className="flex flex-col gap-y-2">
        {selectedItems && selectedItems.length > 0
          ? selectedItems.map((user: UserItem) => (
              <li className="bg-base-100 px-4 py-2 rounded-lg" key={user._id}>
                <ParcoursUserItem user={user} onRemoveUser={handleRemoveUser} />
              </li>
            ))
          : null}
      </ul>
    </Wrapper>
  );
};

export default ParcoursRessourcesContacts;
