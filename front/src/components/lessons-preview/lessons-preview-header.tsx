import { Fragment } from "react/jsx-runtime";
import ImageHeader from "../image-header";
import HeaderMenu from "../UI/header-menu";
import Module from "../../utils/interfaces/module";
import { useLocation } from "react-router-dom";
import { ComponentIcon, RocketIcon } from "lucide-react";
import defaultImage from "../../assets/images/module-default.jpg";
import toUpperFirstLetter from "../../utils/toUpperFirstLetter";

type LessonsPreviewHeaderProps = {
  moduleData: Module & { parcours: string };
};

const LessonsPreviewHeader = ({ moduleData }: LessonsPreviewHeaderProps) => {
  const { pathname } = useLocation();
  const baseRoute = pathname.split("/")[1];

  return (
    <ImageHeader
      imageUrl={
        moduleData.image
          ? `data:image/jpeg;base64,${moduleData.image}`
          : defaultImage
      }
      title={toUpperFirstLetter(moduleData.title) as string}
      titleIcon={<ComponentIcon className="stroke-white w-5" />}
      subTitle={toUpperFirstLetter(moduleData.parcours) as string}
      subTitleIcon={<RocketIcon className="stroke-white w-5" />}
      subTitleLinkTo={`/${baseRoute}/parcours/view/${moduleData.parcoursId}`}
      children={[<Fragment key="fragment" />, <HeaderMenu key="header" />]}
      hidePublished
    />
  );
};

export default LessonsPreviewHeader;
