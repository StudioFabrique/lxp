import { useEffect, useState } from "react";
import { EditUsersModalContent } from "../../../../views/group/group-home.component";
import useHttp from "../../../../hooks/use-http";
import User from "../../../../utils/interfaces/user";
import GroupUserItem from "../../../lists/group-add-user-list/group-user-item";
import Loader from "../../../UI/loader";
import Group from "../../../../utils/interfaces/group";

type EditUsersModalProps = {
  modalContent: EditUsersModalContent;
};

const EditUsersModal = ({ modalContent }: EditUsersModalProps) => {
  const { sendRequest, isLoading } = useHttp(true);
  const [users, setUsers] = useState<User[]>();

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
    <table className="w-full mt-2">
      <tbody className="flex flex-col gap-2">
        {users && users?.length > 0 ? (
          users?.map((user) => (
            <GroupUserItem
              key={user._id}
              user={user}
              onDeleteUser={(user) =>
                setUsers((previousUsers) =>
                  previousUsers?.filter((prevUser) => prevUser._id !== user._id)
                )
              }
              flex
            />
          ))
        ) : (
          <tr>
            <p>Aucun utilisateur dans le groupe</p>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default EditUsersModal;
