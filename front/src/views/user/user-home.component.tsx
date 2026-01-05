import { Link } from "react-router-dom";

import Pagination from "../../components/UI/pagination/pagination";
import Modal from "../../components/UI/modal/modal";
import UserList from "../../components/lists/user-list/user-list.component";
import UsersListStats from "../../components/lists/user-list/users-list-stats";
import Can from "../../components/UI/can/can.component";
import Header from "../../components/UI/header";
import UserRolesTabs from "../../components/user-list/user-roles-tabs";
import { userSearchOptions } from "../../config/search-options";
import useUser from "../../components/user-list/use-user";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import { PlusCircle } from "lucide-react";

const UserHome = () => {
  const {
    user,
    role,
    stats,
    isLoading,
    roles,
    handleRoleSwitch,
    handleSearchResult,
    handleRefreshDataList,
    handleGroupRolesChange,
    handleUpdateManyStatus,
    isDeleting,
    dataList,
    allChecked,
    page,
    handleRowCheck,
    handleAllChecked,
    sortData,
    handleUncheckALL,
    sdir,
    stype,
    handlePageNumber,
    error,
    handleDeleteUser,
    sendInvitation,
    showErrorModal,
    setErrorModal,
    totalPages,
    updateStatus,
    handleManyInvitations,
    setUserToDelete,
    userToDelete,
  } = useUser();

  return (
    <div>
      <section className="w-full h-full flex flex-col items-center gap-y-8">
        <Header
          title="Liste d'utilisateurs"
          description="Créez, modifiez et supprimez des comptes, assignez des rôles et des permissions, et mettez à jour vos utilisateurs"
        >
          <Can action="write" object="user">
            <Link className="btn btn-primary btn-soft" to="/admin/user/add">
              <PlusCircle />
              Créer un utilisateur
            </Link>
          </Can>
        </Header>

        <UsersListStats stats={stats} />

        <Wrapper additionalClassname="w-full">
          <div className="w-full">
            <UserRolesTabs
              isLoading={isLoading}
              user={user}
              role={role}
              roles={roles}
              handleRoleSwitch={handleRoleSwitch}
              handleSearchResult={handleSearchResult}
              handleRefreshDataList={handleRefreshDataList}
              handleGroupRolesChange={handleGroupRolesChange}
              handleUpdateManyStatus={handleUpdateManyStatus}
              dataList={dataList}
              userSearchOptions={userSearchOptions}
              onSendManyInvitations={handleManyInvitations}
            >
              <div className="w-full">
                <UserList
                  isLoading={isLoading}
                  allChecked={allChecked}
                  page={page}
                  role={role}
                  userList={dataList}
                  onRowCheck={handleRowCheck}
                  onAllChecked={handleAllChecked}
                  onSorting={sortData}
                  onUncheckAll={handleUncheckALL}
                  sdir={sdir}
                  stype={stype}
                  onDelete={setUserToDelete}
                  error={error}
                  sendInvitation={sendInvitation}
                  onToggleStatus={updateStatus}
                />
                {dataList.length > 0 ? (
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    setPage={handlePageNumber}
                  />
                ) : null}
              </div>
            </UserRolesTabs>
          </div>
        </Wrapper>
      </section>
      <>
        {showErrorModal ? (
          <Modal
            title="Mettre à jour les rôles des utilisateurs sélectionnés"
            rightLabel="Fermer"
            onRightClick={setErrorModal}
          >
            <p>Un ou plusieurs utilisateurs ne peuvent pas être mis à jour.</p>
          </Modal>
        ) : null}
      </>
      <>
        {userToDelete ? (
          <Modal
            title="Confirmation de suppression"
            isSubmitting={isDeleting}
            leftLabel="Annuler"
            rightLabel="Supprimer"
            onLeftClick={() => setUserToDelete(null)}
            onRightClick={handleDeleteUser}
          >
            <p>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action
              est irréversible.
            </p>
          </Modal>
        ) : null}
      </>
    </div>
  );
};

export default UserHome;
