import {
  Dispatch,
  FC,
  MouseEvent,
  MouseEventHandler,
  SetStateAction,
  useState,
} from "react";
import ThreeDotIcon from "../../UI/svg/three-dot-icon.component";
import DeleteIcon from "../../UI/svg/delete-icon.component";
import useHttp from "../../../hooks/use-http";
import LoadingIcon from "../../UI/svg/loading-icon.component";
import CopyIcon from "../../UI/svg/copy-icon";
import SuccessIcon from "../../UI/svg/success-icon";
import { IRoleItem } from "../../../views/role/role";

const RoleOptions: FC<{
  role: string;
  setRoles: Dispatch<SetStateAction<IRoleItem[]>>;
  setIsRoleDeleted: Dispatch<SetStateAction<boolean>>;
}> = ({ role, setRoles, setIsRoleDeleted }) => {
  const { sendRequest, isLoading } = useHttp();

  const [isVisible, setIsVisible] = useState<boolean>();
  const [isCopySuccessful, setIsCopySuccessful] = useState<boolean>();

  // Role deletion request
  const handleSendDeletionRequest = () => {
    const applyData = (data: any) => {
      setIsVisible(false);
      setIsRoleDeleted(true);
    };

    sendRequest(
      { path: `/permission/role/${role}`, method: "delete" },
      applyData
    );
  };

  // Role copy request
  const handleSendCopyRequest = () => {
    const applyData = (data: any) => {
      console.log(data.data);

      setIsCopySuccessful(true);
      setRoles((roles) => [...roles, data.data]);
    };

    sendRequest(
      { path: `/permission/role`, method: "post", body: { role: role } },
      applyData
    );
  };

  const handleVisible: MouseEventHandler<HTMLSpanElement> = (
    e: MouseEvent<HTMLSpanElement>
  ) => {
    e.stopPropagation();
    setIsVisible(!isVisible);
    setIsCopySuccessful(false);
  };

  return (
    <div className="flex">
      <button
        type="button"
        onClick={handleVisible}
        className="btn btn-primary btn-sm w-8"
      >
        <span className="flex stroke-primary-content w-6 h-6">
          <ThreeDotIcon />
        </span>
      </button>
      <div
        className={`bg-primary p-2 px-1 flex flex-col absolute translate-x-14 rounded-lg stroke-primary-content ${
          isVisible ? "visible" : "invisible"
        }`}
      >
        {isLoading ? (
          <span className="animate-spin">
            <LoadingIcon />
          </span>
        ) : (
          <>
            <span onClick={handleSendDeletionRequest} className="w-6 h-6">
              <DeleteIcon />
            </span>
            {isCopySuccessful ? (
              <span className="w-6 h-6">
                <SuccessIcon />
              </span>
            ) : (
              <span onClick={handleSendCopyRequest} className="w-6 h-6">
                <CopyIcon />
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoleOptions;
