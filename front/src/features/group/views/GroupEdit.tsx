import { useSearchParams } from "react-router";
import GroupForm from "../components/group-form/GroupForm";
import GroupUserList from "../components/users/group-add-user-list/group-user-list";
import useGroupManage from "../hooks/useGroupManage";
import RecommendedActionTour from "../../../components/guided-tour/RecommendedActionTour";
import { groupCreationTourSteps } from "../../../components/guided-tour/recommended-action-tour-steps";

const GroupEdit = () => {
  const [searchParams] = useSearchParams();
  const fromParcours = searchParams.get("parcours");

  const {
    form,
    isEditing,
    usersToAdd,
    isLoading,
    onSubmit,
    onAddUsers,
    onDeleteUser,
    onCreateStudent,
  } = useGroupManage();

  return (
    <>
      <GroupForm
        form={form}
        isEditing={isEditing}
        onSubmitForm={onSubmit}
        isLoading={isLoading}
        fromParcours={fromParcours ?? undefined}
      >
        <div data-recommended-tour="group-members">
          <GroupUserList
            usersToAdd={usersToAdd}
            onAddUsers={onAddUsers}
            onDeleteUser={onDeleteUser}
            onCreateStudent={onCreateStudent}
          />
        </div>
      </GroupForm>
      {!isEditing ? (
        <RecommendedActionTour
          tutorial="group"
          steps={groupCreationTourSteps}
        />
      ) : null}
    </>
  );
};

export default GroupEdit;
