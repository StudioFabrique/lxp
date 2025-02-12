import { Fragment } from "react/jsx-runtime";
import ImageHeader from "../image-header";
import HeaderMenu from "../UI/header-menu";
import Module from "../../utils/interfaces/module";
import { useLocation } from "react-router-dom";
import { ComponentIcon, RocketIcon } from "lucide-react";

type LessonsPreviewHeaderProps = {
  moduleData: Module & { parcours: string; parcoursId: number };
};

const LessonsPreviewHeader = ({ moduleData }: LessonsPreviewHeaderProps) => {
  const { pathname } = useLocation();
  const baseRoute = pathname.split("/")[1];

  return (
    <ImageHeader
      imageUrl={`data:image/jpeg;base64,${moduleData.image}`}
      title={moduleData.title}
      titleIcon={<ComponentIcon className="stroke-white" />}
      subTitle={moduleData.parcours}
      subTitleIcon={<RocketIcon className="stroke-white" />}
      subTitleLinkTo={`/${baseRoute}/parcours/view/${moduleData.parcoursId}`}
      children={[<Fragment key="fragment" />, <HeaderMenu key="header" />]}
      hidePublished
    />
  );
};

export default LessonsPreviewHeader;
