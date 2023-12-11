import { FC } from "react";

const ParcoursViewContenuDetailHeader: FC<{
  imageModuleHeader: any;
  moduleTitle: string | undefined;
}> = ({ imageModuleHeader, moduleTitle }) => {
  console.log(imageModuleHeader);

  const classImage: React.CSSProperties = {
    backgroundImage: `url('data:image/jpeg;base64,${imageModuleHeader}')`,
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

export default ParcoursViewContenuDetailHeader;
