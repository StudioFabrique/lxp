/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { GroupModalContent } from "../../../../views/group/group-home.component";
import useHttp from "../../../../hooks/use-http";
import Loader from "../../../UI/loader";
import Group from "../../../../utils/interfaces/group";
import GroupEditForm from "../../../forms/group-form/group-form.component";
import toast from "react-hot-toast";

type EditFormModalProps = {
  modalContent: GroupModalContent;
};

const EditFormModal = ({ modalContent }: EditFormModalProps) => {
  const { sendRequest, isLoading } = useHttp(true);
  const [group, setGroup] = useState<Group>();

  const handleSubmitForm = (data: any, file: File) => {
    const applyData = () => {
      toast.success("Informations du groupe mis à jour");
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("image", file);

    sendRequest(
      {
        path: `/group/${modalContent.groupId}`,
        method: "put",
        body: formData,
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
    const applyData = (data: { data: Group }) => {
      setGroup(data.data);
    };

    if (modalContent?.isModalOpen && modalContent?.groupId) {
      sendRequest(
        {
          path: `/group/${modalContent.groupId}`,
        },
        applyData
      );
    }
  }, [modalContent.groupId, modalContent?.isModalOpen, sendRequest]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-10 w-full mt-2">
      {group && (
        <GroupEditForm
          group={group}
          isLoading={false}
          onSubmitForm={handleSubmitForm}
          gridType="rows"
          title={`Modifier le groupe ${modalContent.groupName}`}
          hideCancelButton
          hideDetailsComponent
        />
      )}
    </div>
  );
};

export default EditFormModal;
