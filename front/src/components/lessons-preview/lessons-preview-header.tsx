import { Fragment } from "react/jsx-runtime";
import ImageHeader from "../image-header";
import HeaderMenu from "../UI/header-menu";
import Module from "../../utils/interfaces/module";
import { useLocation } from "react-router-dom";

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
      subTitle={moduleData.parcours}
      subTitleLinkTo={`/${baseRoute}/parcours/view/${moduleData.parcoursId}`}
      children={[<Fragment key="fragment" />, <HeaderMenu key="header" />]}
      hidePublished
    />
  );
};

export default LessonsPreviewHeader;
