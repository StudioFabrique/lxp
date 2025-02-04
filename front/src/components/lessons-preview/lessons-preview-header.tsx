import { Fragment } from "react/jsx-runtime";
import ImageHeader from "../image-header";
import HeaderMenu from "../UI/header-menu";
import Module from "../../utils/interfaces/module";

type LessonsPreviewHeader = { moduleData: Module };

const LessonsPreviewHeader = ({ moduleData }: LessonsPreviewHeader) => (
  <ImageHeader
    imageUrl={`data:image/jpeg;base64,${moduleData.image}`}
    title={moduleData.title}
    subTitle={`${moduleData.parcours} > Module`}
    children={[<Fragment key="fragment" />, <HeaderMenu key="header" />]}
  />
);

export default LessonsPreviewHeader;
