import { ListPlus, HelpCircle } from "lucide-react";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import PermissionDeleteItem from "./permission-delete-item";
import PermissionAddItem from "./permission-add-item";

type PermissionsListWithDrawerProps = {
  drawerId: string;
  title: string;
  descriptionTooltip?: string;
  permissions?: { name: string; description: string }[];
  remainingResources?: { name: string; description: string }[];
  zIndex?: number;
  onAddPermission: (name: string) => void;
  onDeletePermission: (name: string) => void;
};

const PermissionsListWithDrawer = ({
  drawerId,
  title,
  descriptionTooltip,
  permissions,
  remainingResources,
  zIndex = 40,
  onAddPermission,
  onDeletePermission,
}: PermissionsListWithDrawerProps) => {
  return (
    <SubWrapper>
      <div className="flex flex-col gap-6 p-4">
        <div className="flex justify-between items-center border-b border-base-content pb-3">
          <div className="flex items-center gap-2">
            <p className="text-secondary font-bold text-lg">{title}</p>
            {descriptionTooltip && (
              <div
                className="tooltip tooltip-right"
                data-tip={descriptionTooltip}
              >
                <HelpCircle className="w-4 h-4 stroke-base-content/60" />
              </div>
            )}
          </div>
          <div className="flex gap-5 items-center">
            <RightSideDrawer
              id={drawerId}
              zIndex={zIndex}
              title={title}
              icon={<ListPlus className="w-5" />}
            >
              <div className="flex flex-col gap-2 h-full overflow-y-scroll">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold">Permissions disponibles</h3>
                  {remainingResources ? (
                    remainingResources.map((res) => (
                      <PermissionAddItem
                        key={res.name}
                        name={res.name}
                        description={res.description}
                        onAddPermission={onAddPermission}
                      />
                    ))
                  ) : (
                    <p>Aucune permissions à ajouter</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 mt-8">
                  <h3 className="font-bold">Permissions actuelles</h3>
                  {permissions?.map((res) => (
                    <PermissionAddItem
                      key={res.name}
                      name={res.name}
                      description={res.description}
                      inactive
                    />
                  ))}
                </div>
              </div>
            </RightSideDrawer>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 p-2">
          {permissions?.map((item) => (
            <PermissionDeleteItem
              key={item.name}
              name={item.name}
              onDeleteItem={onDeletePermission}
            />
          ))}
        </div>
      </div>
    </SubWrapper>
  );
};

export default PermissionsListWithDrawer;
