import { useEffect } from "react";
import { GroupModalContent } from "../../../../views/group/group-home.component";
import useHttp from "../../../../hooks/use-http";
import Loader from "../../../UI/loader";
import Group from "../../../../utils/interfaces/group";
import GroupEditForm from "../../../forms/group-form/group-form.component";

type EditFormModalProps = {
  modalContent: GroupModalContent;
};

const EditFormModal = ({ modalContent }: EditFormModalProps) => {
  const { sendRequest, isLoading } = useHttp(true);

  /**
   * À chaque fois que l'id de groupe du state modalContent change,
   * alors effectue une requête GET de la récupération utilisateurs
   * du nouveau groupe selectionné.
   */
  useEffect(() => {
    const applyData = (data: Group[]) => {};

    if (modalContent?.isModalOpen && modalContent?.groupId) {
      /* sendRequest(
        {
          path: `/user/group`,
          method: "post",
          body: [modalContent.groupId],
        },
        applyData
      ); */
    }
  }, [modalContent.groupId, modalContent?.isModalOpen, sendRequest]);

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col gap-10 w-full mt-2">
      <GroupEditForm
        isLoading={false}
        onSubmitForm={() => {}}
        gridType="rows"
        title={`Modifier le groupe ${modalContent.groupName}`}
        hideCancelButton
      />
    </div>
  );
};

export default EditFormModal;
