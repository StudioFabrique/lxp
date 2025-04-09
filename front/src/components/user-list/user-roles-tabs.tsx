import { ReactNode } from "react";
import User from "../../utils/interfaces/user";
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
  dataList: User[];
  userSearchOptions: SearchOption[];
  isLoading: boolean;
};

export default function UserRolesTabs(props: Props) {
  return (
    <div className="flex flex-col items-start gap-y-8">
      {props.user && props.role ? (
        <Tabs
          role={props.role}
          roles={props.roles}
          onRoleSwitch={props.handleRoleSwitch}
        />
      ) : null}
      <div className="flex  justify-end w-full">
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
                itemsList={props.dataList}
                roleTab={props.role}
                onGroupRolesChange={props.handleGroupRolesChange}
                onUpdateManyStatus={props.handleUpdateManyStatus}
              />
            </Can>
          )}
        </div>
      </div>
      {props.children}
    </div>
  );
}
