import { ReactNode } from "react";
import User, { UserSelection } from "../../utils/interfaces/user";
import Role from "../../utils/interfaces/role";
import Tabs from "../UI/tabs/tabs.component";
import RefreshIcon from "../UI/svg/refresh-icon.component";
import Can from "../UI/can/can.component";
import DropdownActionsUser from "../lists/user-list/dropdown-actions-user";
import SearchUser from "../../components/UI/search/search.component";
import SearchOption from "../../utils/interfaces/search-options";

type Props = {
  children: ReactNode;
  user: User | null;
  role: Role | null;
  roles: Array<Role>;
  handleRoleSwitch: (role: Role) => void;
  handleSearchResult: (entityToSearch: string, searchValue: string) => void;
  handleRefreshDataList: () => void;
  handleGroupRolesChange: (updatedRoles: Array<Role>) => void;
  handleUpdateManyStatus: (value: string) => void;
  dataList: UserSelection[];
  userSearchOptions: SearchOption[];
  isLoading: boolean;
  onSendManyInvitations: () => void;
};

export default function UserRolesTabs(props: Props) {
  return (
    <div className="w-full flex flex-col items-center gap-y-8 mt-4">
      <div className="w-full flex justify-between items-start gap-y-8">
        <div className="w-4/6">
          {props.user && props.role ? (
            <Tabs
              role={props.role}
              roles={props.roles}
              onRoleSwitch={props.handleRoleSwitch}
            />
          ) : null}
        </div>
        <div className="flex justify-end w-2/6">
          <div className="w-[30rem] flex justify-end items-center gap-x-2">
            <SearchUser
              options={props.userSearchOptions}
              onSearch={props.handleSearchResult}
            />
            <button
              className={`${
                props.isLoading
                  ? "btn btn-outline btn-sm btn-circle border-none text-primary animate-spin"
                  : "btn btn-outline btn-sm btn-circle border-none text-primary"
              }`}
              disabled={props.isLoading}
              onClick={props.handleRefreshDataList}
            >
              <RefreshIcon size={6} />
            </button>
            {!props.role ? null : (
              <Can action="update" object={props.role.role}>
                <DropdownActionsUser
                  userToUpdate={props.user ?? undefined}
                  itemsList={props.dataList}
                  roleTab={props.role}
                  onGroupRolesChange={props.handleGroupRolesChange}
                  onUpdateManyStatus={props.handleUpdateManyStatus}
                  onSendManyInvitations={props.onSendManyInvitations}
                />
              </Can>
            )}
          </div>
        </div>
      </div>
      {props.children}
    </div>
  );
}
