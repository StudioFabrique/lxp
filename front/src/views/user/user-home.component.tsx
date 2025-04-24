/**
 * UserHome - A component that displays the users management page
 *
 * This component provides a complete user management interface with features like:
 * - Listing users with filtering by role
 * - User creation, deletion and status management
 * - Role assignment and bulk operations
 * - Pagination and sorting capabilities
 * - Search functionality
 * - Sending invitations to users
 *
 * @example
 * ```tsx
 * <UserHome />
 * ```
 */
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

const UserHome = () => {
  // Custom hook to handle all user management logic and state
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
  } = useUser();

  return (
    <main className="w-9/12">
      <section className="w-full h-full flex flex-col items-center py-8 gap-y-8">
        {/* Page header with title, description and action button */}
        <Header
          title="Liste d'utilisateurs"
          description="Créez, modifiez et supprimez des comptes, assignez des rôles et des permissions, et mettez à jour vos utilisateurs"
        >
          {/* Permission check - only users with 'write' permission on 'user' can see this button */}
          <Can action="write" object="user">
            <Link
              className="btn btn-primary text-base-100"
              to="/admin/user/add"
            >
              Créer un utilisateur
            </Link>
          </Can>
        </Header>

        {/* Statistics panel showing user counts by status */}
        <UsersListStats stats={stats} />

        {/* Main content wrapper */}
        <Wrapper>
          <div className="w-full">
            {/* Role-based tabs for filtering users */}
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
                {/* User listing table with sorting, selection and action capabilities */}
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
                  onDelete={handleDeleteUser}
                  error={error}
                  sendInvitation={sendInvitation}
                  onToggleStatus={updateStatus}
                />
                {/* Pagination controls - only shown when there are users to display */}
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
      {/* Error modal - displayed when bulk operations fail */}
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
    </main>
  );
};

export default UserHome;
