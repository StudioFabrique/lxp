import { FC } from "react";

const ParcoursViewContenuDetailHeader: FC<{
  imageModuleHeader: any;
  moduleTitle: string;
}> = ({ imageModuleHeader, moduleTitle }) => {
  const classImage: React.CSSProperties = {
    backgroundImage: `url(${imageModuleHeader})`,
    width: "100%",
    height: "10rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <div className="flex p-5" style={classImage}>
      <p className="self-end">{moduleTitle}</p>
    </div>
  );
};

export default ParcoursViewContenuDetailHeader;