/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import defaultImage from "../../../../../../assets/content-image-placeholders/module-default.jpg";
import bgImageGradient from "../../../../../../../src.legacy/utils/bg-image-gradient";

const ContenuDetailHeader: FC<{
  imageModuleHeader: any;
  title?: string;
}> = ({ imageModuleHeader, title }) => {
  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(
      imageModuleHeader
        ? `data:image/jpeg;base64,${imageModuleHeader}`
        : defaultImage,
    ),
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
        <p className="text-white text-xl font-bold">{title}</p>
      </div>
    </div>
  );
};

export default ContenuDetailHeader;
