import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import ImageHeader from "../../components/image-header";
import HeaderMenu from "../../components/UI/header-menu";

const ModuleView = () => {
  return (
    <FadeWrapper>
      <ImageHeader
        imageUrl={/* image */ "test"}
        title={/* parcoursInfos.title */ "test"}
        subTitle={/* parcours.formation?.title */ "test"}
        children={[<></>, <HeaderMenu />]}
      />
    </FadeWrapper>
  );
};

export default ModuleView;
