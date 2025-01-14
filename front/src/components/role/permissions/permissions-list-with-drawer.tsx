import { ListPlus } from "lucide-react";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import PermissionDeleteItem from "./permission-delete-item";
import PermissionAddItem from "./permission-add-item";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";

type PermissionsListWithDrawerProps = {
  drawerId: string;
  title: string;
  descriptionTooltip?: string;
  permissions?: { name: string; fullName: string; description: string }[];
  remainingResources?: {
    name: string;
    fullName: string;
    description: string;
  }[];
  zIndex?: number;
  roleProtected?: boolean;
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
  roleProtected,
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
              <QuestionMarkTooltip tooltipValue={descriptionTooltip} />
            )}
          </div>
          <div className="flex gap-5 items-center">
            <RightSideDrawer
              id={drawerId}
              zIndex={zIndex}
              title={title}
              icon={<ListPlus className="w-5" />}
            >
              <div className="flex flex-col gap-2 overflow-x-hidden h-[85vh] w-[95%]">
                <h3 className="font-bold">Permissions disponibles</h3>
                {remainingResources?.length ? (
                  remainingResources.map((res) => (
                    <PermissionAddItem
                      key={res.name}
                      name={res.name}
                      fullName={res.fullName}
                      description={res.description}
                      inactive={roleProtected}
                      onAddPermission={onAddPermission}
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
          {permissions && permissions.length > 0 ? (
            permissions.map((item) => (
              <PermissionDeleteItem
                key={item.name}
                name={item.name}
                fullName={item.fullName}
                description={item.description}
                inactive={roleProtected}
                onDeleteItem={onDeletePermission}
              />
            ))
          ) : (
            <p>Aucune permission affectée</p>
          )}
        </div>
      </div>
    </SubWrapper>
  );
};

export default PermissionsListWithDrawer;
