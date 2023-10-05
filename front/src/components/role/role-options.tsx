import { Dispatch, FC, SetStateAction, useState } from "react";
import ThreeDotIcon from "../UI/svg/three-dot-icon.component";
import DeleteIcon from "../UI/svg/delete-icon.component";
import useHttp from "../../hooks/use-http";
import LoadingIcon from "../UI/svg/loading-icon.component";
import CopyIcon from "../UI/svg/copy-icon";

const RoleOptions: FC<{
  role: string;
  setIsRoleDeleted: Dispatch<SetStateAction<boolean>>;
}> = ({ role, setIsRoleDeleted }) => {
  const { sendRequest, isLoading } = useHttp();

  const [isVisible, setIsVisible] = useState<boolean>();

  // delete request

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
        <span
          onClick={handleSendDeletionRequest}
          className={`w-6 h-6 ${isLoading ? "animate-spin" : ""}`}
        >
          {isLoading ? <LoadingIcon /> : <DeleteIcon />}
        </span>
        <span className="w-6 h-6">
          <CopyIcon />
        </span>
      </div>
    </div>
  );
};

export default RoleOptions;
