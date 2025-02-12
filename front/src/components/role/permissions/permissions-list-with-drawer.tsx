import { ListPlus } from "lucide-react";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";
import PermissionDeleteItem from "./permission-delete-item";
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";
import RemainingResourcesList from "./remaining-resources-list";

type PermissionsListWithDrawerProps = {
  drawerId: string;
  title: string;
  descriptionTooltip?: string;
  permissions?: {
    name: string;
    fullName: string;
    description?: string;
    isRole?: boolean;
  }[];
  remainingResources?: {
    name: string;
    fullName: string;
    description?: string;
    isRole?: boolean;
  }[];
  zIndex?: number;
  roleProtection: number;
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
  roleProtection,
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
              <RemainingResourcesList
                remainingResources={remainingResources}
                roleProtection={roleProtection}
                onAddPermission={onAddPermission}
              />
            </RightSideDrawer>
          </div>
        </div>
        <div className="flex flex-col gap-10 p-2">
          {permissions && permissions.length > 0 ? (
            <>
              {permissions.some((item) => !item.isRole) && (
                <div className="flex flex-wrap gap-3">
                  <div className="w-full flex items-center gap-2">
                    <h4 className="font-semibold">Permissions</h4>
                    {/* <QuestionMarkTooltip tooltipValue="" /> */}
                  </div>
                  {permissions
                    .filter((item) => !item.isRole)
                    .map((item) => (
                      <PermissionDeleteItem
                        key={item.name}
                        name={item.name}
                        fullName={item.fullName}
                        description={item.description}
                        isRole={item.isRole}
                        inactive={roleProtection >= 2}
                        onDeleteItem={onDeletePermission}
                      />
                    ))}
                </div>
              )}
              {permissions.some((item) => item.isRole) && (
                <div className="flex flex-wrap gap-3">
                  <div className="w-full flex items-center gap-2">
                    <h4 className="font-semibold">Rôles autorisés</h4>
                    <QuestionMarkTooltip tooltipValue="Les permissions de rôle ici concernent les rôles sur lesquels ce role est autorisé à effectuer des actions." />
                  </div>
                  {permissions
                    .filter((item) => item.isRole)
                    .map((item) => (
                      <PermissionDeleteItem
                        key={item.name}
                        name={item.name}
                        fullName={item.fullName}
                        description={item.description}
                        isRole={item.isRole}
                        inactive={roleProtection >= 2}
                        onDeleteItem={onDeletePermission}
                      />
                    ))}
                </div>
              )}
            </>
          ) : (
            <p>Aucune permission affectée</p>
          )}
        </div>
      </div>
    </SubWrapper>
  );
};

export default PermissionsListWithDrawer;
