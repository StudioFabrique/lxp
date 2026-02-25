/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file useUser.ts
 * @description Custom hook for user management operations in the application.
 *
 * This hook provides comprehensive functionality for user management, including:
 * - User listing with pagination and sorting
 * - User selection (individual and bulk)
 * - Role management and assignment
 * - User status updates
 * - User deletion
 * - Search functionality
 * - User statistics
 * - User invitations
 *
 * @returns {Object} An object containing the following properties and methods:
 *
 * @property {User} user - The current logged-in user
 * @property {Role} role - The currently selected role filter
 * @property {Role[]} roles - Available roles in the system
 * @property {User[]} dataList - The current list of users being displayed
 * @property {number} page - Current page number in pagination
 * @property {UsersStats[] | null} stats - Statistics about user counts by role
 * @property {boolean} showErrorModal - Controls the visibility of the error modal
 * @property {boolean} isSearchActive - Indicates if search mode is active
 * @property {boolean} allChecked - Indicates if all users are selected
 * @property {number} totalPages - Total number of pages available
 * @property {string} stype - Current sort field
 * @property {string} sdir - Current sort direction
 * @property {boolean} isLoading - Indicates if a request is in progress
 * @property {Error | null} error - Contains any error from the last request
 *
 * @function handleRoleSwitch - Changes the current role filter
 * @function handleSearchResult - Performs a search based on entity and value
 * @function handleGroupRolesChange - Updates roles for multiple selected users
 * @function handleUpdateManyStatus - Updates status for multiple selected users
 * @function handleDeleteUser - Deletes a specific user
 * @function handleRefreshDataList - Refreshes the user list
 * @function setErrorModal - Toggles the error modal visibility
 * @function handleAllChecked - Toggles selection of all users
 * @function handleRowCheck - Toggles selection of a specific user
 * @function handlePageNumber - Changes the current page
 * @function sortData - Changes the sort field and direction
 * @function handleUncheckALL - Deselects all users
 * @function sendInvitation - Sends invitation to users
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState, useCallback } from "react";
import UsersStats from "../../utils/interfaces/users-stats";
import Role from "../../utils/interfaces/role";
import { Context } from "../../store/context.store";
import toast from "react-hot-toast";
import usePagination from "../../hooks/use-pagination";
import useHttp from "../../hooks/use-http";
import hasPermission from "../../utils/hasPermission";
import User, { UserSelection } from "../../utils/interfaces/user";

const useUser = () => {
  // Context and state variables for user management
  const { user, roles } = useContext(Context);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [role, setRole] = useState<Role>(roles[0]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [stats, setStats] = useState<UsersStats[] | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination hook provides list manipulation and invitation capabilities
  const {
    allChecked,
    page,
    totalPages,
    dataList,
    stype,
    sdir,
    getList,
    sortData,
    initPagination,
    handlePageNumber,
    setPath,
    handleRowCheck,
    setAllChecked,
    setDataList,
    sendInvitation,
  } = usePagination("lastname", "/user/list/everything");

  // HTTP request hook for API communication
  const { isLoading, sendRequest, error } = useHttp(false);

  /**
   * Switches the current role filter and resets pagination and search
   * @param role - The role to switch to
   */
  const handleRoleSwitch = (role: Role) => {
    // Reset pagination and clear any active searches when changing roles
    initPagination();
    if (isSearchActive) {
      handleCloseSearch();
    }
    setRole(role);
    setIsSearchActive(false);
    setPath(`/user/list/${role.role}`);
  };

  /**
   * Toggles selection of all users in the current list
   */
  const handleAllChecked = () => {
    setAllChecked((prevAllchecked) => !prevAllchecked);
  };

  /**
   * Deselects all users - used when refreshing data or changing filters
   */
  const handleUncheckALL = useCallback(() => {
    setAllChecked(false);
  }, [setAllChecked]);

  /**
   * Performs a search based on entity type and search value
   * @param entityToSearch - The entity field to search in (e.g., "name", "email")
   * @param searchValue - The value to search for
   */
  const handleSearchResult = (entityToSearch: string, searchValue: string) => {
    initPagination();
    setPath(`/user/search/${role.role}/${entityToSearch}/${searchValue}`);
    getList();
    setIsSearchActive(true);
  };

  // Placeholder for search closing functionality
  const handleCloseSearch = () => {};

  /**
   * Updates roles for multiple selected users
   * Includes permission validation to ensure user has rights to change roles
   * @param updatedRoles - Array of roles to assign to selected users
   */
  const handleGroupRolesChange = async (updatedRoles: Array<Role>) => {
    // Filter selected users
    const selectedDataList = dataList.filter(
      (user: UserSelection) => user.isSelected === true,
    );
    const updatedDataList = Array<string>();

    // Check permissions for each selected user
    for (const selectedUser of selectedDataList) {
      if (
        user?.permissions &&
        hasPermission(user?.permissions, "update", updatedRoles[0].role) &&
        ((selectedUser!.roles[0].rank > 2 && updatedRoles[0].rank > 2) ||
          (selectedUser!.roles[0].rank <= 2 && updatedRoles[0].rank <= 2)) &&
        updatedRoles.length > 0
      ) {
        updatedDataList.push(selectedUser._id);
      }
    }

    // Show error if permissions are insufficient or no roles selected
    if (
      selectedDataList.length > updatedDataList.length ||
      updatedRoles.length < 1
    ) {
      setShowErrorModal(true);
      return;
    }

    const updatedRolesIds = updatedRoles.map((role: Role) => role._id);

    // Callback after successful role update
    const applyData = (_data: User[]) => {
      initPagination();
      getList();
      handleUncheckALL();
    };

    // Send request to update roles if there are users to update
    if (updatedDataList.length > 0) {
      sendRequest(
        {
          path: "/user/user-roles",
          method: "put",
          body: { usersToUpdate: updatedDataList, rolesId: updatedRolesIds },
        },
        applyData,
      );
    }
  };

  /**
   * Toggles the error modal visibility
   */
  const setErrorModal = () => {
    setShowErrorModal((prevState) => !prevState);
  };

  /**
   * Refreshes the user list and statistics
   * Used after operations that modify users
   */
  const handleRefreshDataList = () => {
    setIsSearchActive(false);
    setPath(`/user/list/${role.role}`);
    handleUncheckALL();
    getList();
    handleGetUsersStats();
  };

  // Set initial role when roles are loaded
  useEffect(() => {
    setRole(roles[0]);
  }, [roles]);

  // Fetch user list when page or role changes
  useEffect(() => {
    if (role) {
      getList();
    }
  }, [page, getList, role]);

  /**
   * Fetches user statistics from the API
   */
  const handleGetUsersStats = useCallback(() => {
    const applyData = (data: Array<UsersStats>) => {
      setStats(data);
    };
    sendRequest(
      {
        path: "/user/stats",
      },
      applyData,
    );
  }, [sendRequest]);

  // Fetch statistics on initial load
  useEffect(() => {
    handleGetUsersStats();
  }, [handleGetUsersStats]);

  /**
   * Updates status for multiple selected users
   * @param value - The status value to set ("active" or "inactive")
   */
  const handleUpdateManyStatus = (value: string) => {
    const applyData = (_data: User[]) => {
      handleRefreshDataList();
    };
    const usersToUpdate = dataList.filter((item) => item.isSelected);
    const usersIds = usersToUpdate.map((item) => item._id);
    sendRequest(
      {
        path: "/user/update-many-status",
        method: "put",
        body: { usersIds, status: value },
      },
      applyData,
    );
  };

  /**
   * Deletes a specific user by ID
   * @param id - The ID of the user to delete
   */
  const handleDeleteUser = () => {
    const applyData = ({ message }: { message: string }) => {
      toast.success(message);
      handleGetUsersStats();

      // Update local state to remove deleted user
      const dataToChange = dataList.filter((user) => user._id !== userToDelete);
      setUserToDelete(null);
      setDataList(dataToChange);
      setIsDeleting(false);
    };

    setIsDeleting(true);
    sendRequest(
      {
        path: `/user/${userToDelete}`,
        method: "delete",
      },
      applyData,
    );
  };

  // Update an user status (active or non active )
  const updateStatus = (id: string) => {
    const user = dataList.find((user) => user._id === id);
    if (!user) toast.error("Utilisateur introuvable");
    const value = !user.isActive;

    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        handleRefreshDataList();
      }
    };
    sendRequest(
      {
        path: "/user/update-user-status",
        method: "put",
        body: { userId: id, value: value },
      },
      applyData,
    );
  };

  const handleManyInvitations = () => {
    const userIds = dataList
      .filter((user) => user.isSelected)
      .map((user) => user._id);

    const applyData = (data: { message: string }) => {
      toast.success(data.message);
      handleRefreshDataList();
    };
    sendRequest(
      {
        path: "/user/invitations",
        method: "post",
        body: { userIds },
      },
      applyData,
    );
  };

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setShowErrorModal(false);
      setIsDeleting(false);
      setUserToDelete(null);
    }
  }, [error]);

  // Return all properties and methods needed by components using this hook
  return {
    allChecked,
    dataList,
    error,
    handleAllChecked,
    handleDeleteUser,
    handleGroupRolesChange,
    handleManyInvitations,
    handlePageNumber,
    handleRefreshDataList,
    handleRoleSwitch,
    handleRowCheck,
    handleSearchResult,
    handleUncheckALL,
    handleUpdateManyStatus,
    isDeleting,
    isLoading,
    isSearchActive,
    page,
    role,
    roles,
    sdir,
    sendInvitation,
    setErrorModal,
    setUserToDelete,
    showErrorModal,
    sortData,
    stats,
    stype,
    totalPages,
    updateStatus,
    user,
    userToDelete,
  };
};

export default useUser;
