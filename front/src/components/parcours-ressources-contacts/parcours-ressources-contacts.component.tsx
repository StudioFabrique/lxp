import { useEffect } from "react";
import useItems from "../../hooks/use-items";
import { sortArray } from "../../utils/sortArray";
import User from "../../utils/interfaces/user";
import useHttp from "../../hooks/use-http";
import SearchDropdown from "../UI/search-dropdown/search-dropdown";
import ParcoursUserItem from "../parcours-user-item/parcours-user-item.component";
import Role from "../../utils/interfaces/role";

type UserItem = {
  _id: string;
  name: string;
  roles: Array<Role>;
};

const property = "name";

const ParcoursRessourcesContacts = () => {
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

  return (
    <div className="flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/10">
      <h3 className="font-bold text-xl">Ressources et Contacts</h3>
      <SearchDropdown
        addItem={addItem}
        filterItems={filterItems}
        resetFilterItems={resetFilterItems}
        filteredItems={filteredItems}
        property="name"
      />
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

export default ParcoursRessourcesContacts;
