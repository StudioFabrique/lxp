/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import defaultImage from "../../../../assets/images/module-default.jpg";

const ContenuDetailHeader: FC<{
  imageModuleHeader: any;
}> = ({ imageModuleHeader }) => {
  const classImage: React.CSSProperties = {
    backgroundImage: `url(${imageModuleHeader ? "data:image/jpeg;base64," + imageModuleHeader : defaultImage})`,
    width: "100%",
    height: "12rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <div>
      <div className="flex p-5" style={classImage} />
    </div>
  );
};

export default ContenuDetailHeader;
