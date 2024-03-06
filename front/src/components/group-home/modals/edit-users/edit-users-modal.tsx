import { useEffect, useState } from "react";
import { GroupModalContent } from "../../../../views/group/group-home.component";
import useHttp from "../../../../hooks/use-http";
import User from "../../../../utils/interfaces/user";
import GroupUserItem from "../../../lists/group-add-user-list/group-user-item";
import Loader from "../../../UI/loader";
import Group from "../../../../utils/interfaces/group";

type EditUsersModalProps = {
  modalContent: GroupModalContent;
};

const EditUsersModal = ({ modalContent }: EditUsersModalProps) => {
  const { sendRequest, isLoading } = useHttp(true);
  const [users, setUsers] = useState<User[]>();

  const handleDeleteUser = (user: User) => {
    const applyData = () => {
      setUsers((previousUsers) =>
        previousUsers?.filter((prevUser) => prevUser._id !== user._id)
      );
    };

    sendRequest(
      {
        path: `/group/user/${modalContent.groupId}/${user._id}`,
        method: "delete",
      },
      applyData
    );
  };

  /**
   * À chaque fois que l'id de groupe du state modalContent change,
   * alors effectue une requête GET de la récupération utilisateurs
   * du nouveau groupe selectionné.
   */
  useEffect(() => {
    const applyData = (data: Group[]) => {
      setUsers(data[0].users);
    };

    if (modalContent?.isModalOpen && modalContent?.groupId) {
      sendRequest(
        {
          path: `/user/group`,
          method: "post",
          body: [modalContent.groupId],
        },
        applyData
      );
    }
  }, [modalContent.groupId, modalContent?.isModalOpen, sendRequest]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-10 w-full mt-2">
      <div className="flex flex-col gap-y-10">
        <span className="flex justify-between items-center">
          <h3 className="text-xl font-bold">
            Utilisateurs existants du groupe
          </h3>
          <button type="button" className="btn btn-primary">
            Ajouter des utilisateurs à ce groupe
          </button>
        </span>
        <table>
          <thead>
            <tr className="flex w-full justify-between px-5">
              <th>Avatar</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4 h-[50vh] overflow-y-auto">
            {users && users?.length > 0 ? (
              users?.map((user) => (
                <GroupUserItem
                  key={user._id}
                  user={user}
                  onDeleteUser={handleDeleteUser}
                  flex={true}
                />
              ))
            ) : (
              <tr>
                <td>
                  <p>Aucun utilisateur dans le groupe</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditUsersModal;
