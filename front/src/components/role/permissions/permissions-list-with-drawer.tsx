import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import Wrapper from "../../UI/wrapper/wrapper.component";
import PermissionItem from "./permission-item";

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
    <div className="flex flex-col gap-6 p-4">
      <div className="flex justify-between items-center border-b border-base-content pb-3">
        <p className="w-full text-secondary font-bold text-lg">{title}</p>
        <RightSideDrawer buttonTitle="Ajouter des permissions" title={title}>
          <div />
        </RightSideDrawer>
      </div>
      <Wrapper>
        <div className="flex flex-wrap gap-3 p-2">
          {permissions?.map((item) => <PermissionItem name={item} />)}
        </div>
      </Wrapper>
    </div>
  );
};

export default PermissionsListWithDrawer;
