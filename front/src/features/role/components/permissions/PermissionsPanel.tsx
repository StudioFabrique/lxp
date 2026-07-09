import { ListPlus } from "lucide-react";
import RightSideDrawer from "../../../../components/UI/right-side-drawer/right-side-drawer";
import SubWrapper from "../../../../../src/components/wrappers/SubBoxWrapper";
import PermissionDeleteItem from "./PermissionDeleteItem";
import RemainingResourcesList from "./RemainingResourcesList";
import type { PermissionItem } from "../../api/role.api";
import QuestionMarkTooltip from "../../../../components/UI/question-mark-tooltip/question-mark-tooltip";

type PermissionsPanelProps = {
  drawerId: string;
  title: string;
  descriptionTooltip?: string;
  permissions?: PermissionItem[];
  remainingResources?: PermissionItem[];
  zIndex?: number;
  roleProtection: number;
  onAddPermission: (name: string) => void;
  onDeletePermission: (name: string) => void;
};

const PermissionsPanel = ({
  drawerId,
  title,
  descriptionTooltip,
  permissions,
  remainingResources,
  zIndex = 40,
  roleProtection,
  onAddPermission,
  onDeletePermission,
}: PermissionsPanelProps) => {
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
            </>
          ) : (
            <p>Aucune permission affectée</p>
          )}
        </div>
      </div>
    </SubWrapper>
  );
};

export default PermissionsPanel;
