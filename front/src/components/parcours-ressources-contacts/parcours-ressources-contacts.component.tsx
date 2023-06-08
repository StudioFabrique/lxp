import React, { FC, useEffect, useMemo } from "react";
import useItems from "../../hooks/use-items";
import { sortArray } from "../../utils/sortArray";
import User from "../../utils/interfaces/user";
import useHttp from "../../hooks/use-http";
import SearchDropdown from "../UI/search-dropdown/search-dropdown";
import ParcoursUserItem from "../parcours-user-item/parcours-user-item.component";
import Role from "../../utils/interfaces/role";
import { autoSubmitTimer } from "../../config/auto-submit-timer";

type UserItem = {
  _id: string;
  name: string;
  roles: Array<Role>;
};

const property = "name";

const ParcoursRessourcesContacts: FC<{
  onSubmitContacts: (contacts: Array<UserItem>) => void;
}> = ({ onSubmitContacts }) => {
  console.log("contacts is rendering");
  const { sendRequest } = useHttp();
  const {
    selectedItems,
    filteredItems,
    addItem,
    filterItems,
    resetFilterItems,
    removeItem,
    initItems,
  } = useItems();

  useEffect(() => {
    const applyData = (data: any) => {
      const userItems = Array<UserItem>();
      data.list.forEach((user: User) => {
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
        path: "/user/teacher/lastname/asc?page=1&limit=100",
      },
      applyData
    );
  }, [initItems, sendRequest]);

  const handleRemoveUser = (user: UserItem) => {
    removeItem(user, "_id");
  };

  const contactsToSubmit = useMemo(() => {
    return {
      contacts: selectedItems,
    };
  }, [selectedItems]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSubmitContacts(contactsToSubmit.contacts);
    }, autoSubmitTimer);
    return () => {
      clearTimeout(timer);
    };
  }, [contactsToSubmit.contacts, onSubmitContacts]);

  return (
    <div className="flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/10">
      <h3 className="font-bold text-xl">Ressources et Contacts</h3>
      <SearchDropdown
        addItem={addItem}
        filterItems={filterItems}
        resetFilterItems={resetFilterItems}
        filteredItems={filteredItems}
        property="name"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
        </svg>
      </SearchDropdown>
      <ul className="flex flex-col gap-y-2">
        {selectedItems && selectedItems.length > 0
          ? selectedItems.map((user: UserItem) => (
              <li className="bg-base-100 px-4 py-2 rounded-lg" key={user._id}>
                <ParcoursUserItem user={user} onRemoveUser={handleRemoveUser} />
              </li>
            ))
          : null}
      </ul>
    </div>
  );
};

const MemoizedParcoursRessourcesContacts = React.memo(
  ParcoursRessourcesContacts
);

export default MemoizedParcoursRessourcesContacts;
