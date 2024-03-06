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
      <div className="flex flex-col gap-y-4">
        <h3 className="text-xl font-bold">Utilisateurs existants du groupe</h3>
        <table>
          <tbody className="flex flex-col gap-2">
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
