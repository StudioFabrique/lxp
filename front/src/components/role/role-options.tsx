import { Dispatch, FC, SetStateAction, useState } from "react";
import ThreeDotIcon from "../UI/svg/three-dot-icon.component";
import DeleteIcon from "../UI/svg/delete-icon.component";
import useHttp from "../../hooks/use-http";
import LoadingIcon from "../UI/svg/loading-icon.component";
import CopyIcon from "../UI/svg/copy-icon";
import SuccessIcon from "../UI/svg/success-icon";

const RoleOptions: FC<{
  role: string;
  setIsRoleDeleted: Dispatch<SetStateAction<boolean>>;
}> = ({ role, setIsRoleDeleted }) => {
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
      setIsCopySuccessful(true);
    };

    sendRequest(
      { path: `/permission/role`, method: "post", body: { role: role } },
      applyData
    );
  };

  return (
    <div className="flex">
      <span onClick={() => setIsVisible(!isVisible)} className="w-6 h-6">
        <ThreeDotIcon />
      </span>
      <div
        className={`flex flex-col absolute translate-x-10 ${
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
