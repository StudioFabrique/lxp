/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import defaultImage from "../../../../assets/images/module-default.jpg";

const ContenuDetailHeader: FC<{
  imageModuleHeader: any;
  title?: string;
}> = ({ imageModuleHeader, title }) => {
  const classImage: React.CSSProperties = {
    backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0)), ${
      imageModuleHeader
        ? "url('data:image/jpeg;base64," + imageModuleHeader + "')"
        : `url(${defaultImage})`
    }`,
    width: "100%",
    height: "12rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <div>
      <div className="flex flex-col justify-end p-5" style={classImage}>
        <p className="text-base-100 text-xl font-bold">{title}</p>
      </div>
    </div>
  );
};

export default ContenuDetailHeader;
