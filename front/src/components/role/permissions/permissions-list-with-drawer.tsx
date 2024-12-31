import { ListPlus } from "lucide-react";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import Wrapper from "../../UI/wrapper/wrapper.component";
import PermissionItem from "./permission-item";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";

type PermissionsListWithDrawerProps = {
  title: string;
  permissions?: string[];
  ressources?: string[];
};

const PermissionsListWithDrawer = ({
  title,
  permissions,
  ressources,
}: PermissionsListWithDrawerProps) => {
  return (
    <SubWrapper>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center border-b border-base-content pb-3">
          <p className="w-full text-secondary font-bold text-lg">{title}</p>
          <div className="flex gap-5 items-center">
            <RightSideDrawer
              id="test"
              title={title}
              icon={<ListPlus className="w-5" />}
            >
              <div className="h-[80vh] w-[35rm] bg-black">
                <div className="flex flex-col gap-y-5 items-center h-[85%]"></div>
                <div className="flex flex-col gap-2"></div>
              </div>
            </RightSideDrawer>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 p-2">
          {permissions?.map((item) => (
            <PermissionItem key={item} name={item} />
          ))}
        </div>
      </div>
    </SubWrapper>
  );
};

export default PermissionsListWithDrawer;
