import { ListPlus } from "lucide-react";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import PermissionDeleteItem from "./permission-delete-item";
import PermissionAddItem from "./permission-add-item";

type PermissionsListWithDrawerProps = {
  drawerId: string;
  title: string;
  permissions?: string[];
  remainingRessources?: { name: string; description: string }[];
};

const PermissionsListWithDrawer = ({
  drawerId,
  title,
  permissions,
  remainingRessources,
}: PermissionsListWithDrawerProps) => {
  return (
    <SubWrapper>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center border-b border-base-content pb-3">
          <p className="w-full text-secondary font-bold text-lg">{title}</p>
          <div className="flex gap-5 items-center">
            <RightSideDrawer
              id={drawerId}
              title={title}
              icon={<ListPlus className="w-5" />}
            >
              <div className="h-[80vh] w-[35rm] bg-black">
                {remainingRessources ? (
                  remainingRessources.map((res) => (
                    <PermissionAddItem
                      key={res.name}
                      name={res.name}
                      description={res.description}
                    />
                  ))
                ) : (
                  <p>Aucune permissions à ajouter</p>
                )}
              </div>
            </RightSideDrawer>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 p-2">
          {permissions?.map((item) => (
            <PermissionDeleteItem key={item} name={item} />
          ))}
        </div>
      </div>
    </SubWrapper>
  );
};

export default PermissionsListWithDrawer;
