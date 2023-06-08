import React, { FC } from "react";
import Portal from "../portal/portal";

const Toast: FC<{
  message: string;
  type: string;
}> = ({ message, type }) => {
  const setAlertColor = () => {
    return `alert alert-${type}`;
  };

  return (
    <Portal>
      <div className="w-3/6 toast toast-top toast-center">
        <div className={setAlertColor()}>
          <span>{message}</span>
        </div>
      </div>
    </Portal>
  );
};

export default Toast;
