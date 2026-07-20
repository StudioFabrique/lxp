import { Fragment } from "react/jsx-runtime";
import ImageHeader from "../../../../src/components/image-header/image-header";
import HeaderMenu from "../../../components/UI/header-menu";
import Module from "../../../../src/utils/interfaces/module";
import { useLocation } from "react-router";
import { ComponentIcon, RocketIcon } from "lucide-react";
import defaultImage from "../../../assets/images/module-default.jpg";
import { toUpperFirstLetter } from "../../../../src/utils/helpers/text-helpers";
import { normalizeImageSource } from "../../../utils/images/image-source";

type ModuleContentExplorerHeaderProps = {
  moduleData: Module & { parcours: string };
};

const ModuleContentExplorerHeader = ({
  moduleData,
}: ModuleContentExplorerHeaderProps) => {
  const { pathname } = useLocation();
  const baseRoute = pathname.split("/")[1];

  return (
    <ImageHeader
      imageUrl={
        moduleData.image ? normalizeImageSource(moduleData.image) : defaultImage
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

export default ModuleContentExplorerHeader;
