import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GroupModalContent } from "../../../../views/group/group-home.component";
import useHttp from "../../../../hooks/use-http";
import User from "../../../../utils/interfaces/user";
import GroupUserItem from "../../../lists/group-add-user-list/group-user-item";
import Loader from "../../../UI/loader";
import Group from "../../../../utils/interfaces/group";

type EditUsersModalProps = {
  modalContent: GroupModalContent;
  setModalContent: Dispatch<SetStateAction<GroupModalContent | undefined>>;
  onClickAddUsers: () => void;
  onSetUsersInSelectedGroup: Dispatch<SetStateAction<User[] | undefined>>;
};

const EditUsersModal = ({
  modalContent,
  setModalContent,
  onClickAddUsers,
  onSetUsersInSelectedGroup,
}: EditUsersModalProps) => {
  const { sendRequest, isLoading } = useHttp(true);
  const [users, setUsers] = useState<User[]>();

  const handleDeleteUser = (user: User) => {
    const applyData = () => {
      setUsers((previousUsers) =>
        previousUsers?.filter((prevUser) => prevUser._id !== user._id)
      );
      onSetUsersInSelectedGroup(
        (prevUsers) =>
          prevUsers && prevUsers.filter((item) => item._id !== user._id)
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
      if (data[0].users) {
        setUsers(data[0].users);
        onSetUsersInSelectedGroup(data[0].users);
        setModalContent((prevContent) => {
          return { ...prevContent, refresh: false };
        });
      }
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
  }, [
    modalContent?.groupId,
    modalContent?.isModalOpen,
    modalContent?.refresh,
    onSetUsersInSelectedGroup,
    sendRequest,
    setModalContent,
  ]);

  if (isLoading)
    return (
      <div className="w-full min-h-[60vh]">
        <Loader />
      </div>
    );

  return (
    <div className="flex flex-col gap-10 w-full mt-2 min-h-[60vh]">
      <div className="flex flex-col gap-y-10">
        <span className="flex justify-between items-center">
          <h3 className="text-xl font-bold">
            Utilisateurs existants du groupe
          </h3>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClickAddUsers}
          >
            Ajouter des utilisateurs à ce groupe
          </button>
        </span>
        {users && users?.length > 0 ? (
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
              {users?.map((user) => (
                <GroupUserItem
                  key={user._id}
                  user={user}
                  onDeleteUser={handleDeleteUser}
                  flex={true}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun utilisateur dans le groupe</p>
        )}
      </div>
    </div>
  );
};

export default EditUsersModal;
