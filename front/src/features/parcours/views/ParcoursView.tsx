/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router";
import { Fragment } from "react";
import FadeWrapper from "../../../../src.legacy/components/UI/fade-wrapper/fade-wrapper";
import Loader from "../../../../src.legacy/components/UI/loader";
import Error404 from "../../../../src.legacy/components/error404";
import Contenu from "../components/display/contenu/contenu";
import Informations from "../components/display/informations";
import Description from "../components/display/description";
import Tags from "../components/display/tags";
import Awards from "../components/display/awards";
import Contacts from "../components/display/contacts";
import Competences from "../components/display/competences";
import Objectifs from "../components/display/objectifs";
import QuickStatistiques from "../components/display/quick-statistiques/quick-statistiques";
import ProgressModulesStats from "../components/display/progress-stats";
import HeaderMenu from "../../../../src.legacy/components/UI/header-menu";
import ImageHeader from "../../../../src.legacy/components/image-header";
import { Bell, GraduationCap, RocketIcon, Search } from "lucide-react";
import useParcoursView from "../hooks/useParcoursView";
import Header from "../../../../src.legacy/components/UI/header";
import toUpperFirstLetter from "../../../../src.legacy/utils/toUpperFirstLetter";
import PermissionGuard from "../../../components/guards/PermissionGuard";

const ParcoursView = () => {
  const {
    isLoading,
    error,
    image,
    parcours,
    parcoursInfos,
    modules,
    studentCount,
  } = useParcoursView();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentRoute = pathname.split("/").slice(1) ?? [];

  const handleClickResume = () => {
    const resumeModuleId =
      modules?.find((module) =>
        module.courses?.some((course) =>
          course.lessons?.some(
            (lesson) =>
              !lesson.lessonsRead || !lesson.lessonsRead[0]?.finishedAt,
          ),
        ),
      )?.id || modules?.[0]?.id;

    navigate(`/${currentRoute[0]}/parcours/module/${resumeModuleId}`);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <Header
        title="Aperçu du parcours"
        description="Bienvenue dans votre espace. Commencez votre apprentissage ou
            reprenez là où vous vous êtes arrêté."
      >
        <div className="flex gap-4 w-full">
          <button className="btn btn-outline btn-primary">
            <Search />
          </button>
          <button className="btn btn-outline btn-primary">
            <Bell />
          </button>
        </div>
      </Header>
      {isLoading ? (
        <Loader />
      ) : error.length === 0 ? (
        <FadeWrapper>
          <div className="w-full">
            <ImageHeader
              imageUrl={image ?? "/images/parcours-default.webp"}
              title={toUpperFirstLetter(parcoursInfos.title) as string}
              titleIcon={<RocketIcon className="stroke-white w-5" />}
              subTitle={toUpperFirstLetter(parcours.formation?.title) as string}
              subTitleIcon={<GraduationCap className="stroke-white w-5" />}
              children={[
                <Fragment key="fragment" />,
                <PermissionGuard key="header" object="cursus" action="read">
                  <HeaderMenu
                    key="header"
                    onClickResume={handleClickResume}
                    hideResumeCourseButton={!(modules?.length > 0)}
                  />
                </PermissionGuard>,
              ]}
              hidePublished
            />
          </div>

          <div className="mt-5 flex flex-col gap-y-5">
            <QuickStatistiques studentCount={studentCount} />
            {modules?.length > 0 ? (
              <PermissionGuard action="component" object="progression">
                <ProgressModulesStats modules={modules} />
              </PermissionGuard>
            ) : null}
            <PermissionGuard object="cursus" action="read">
              <Contenu modules={modules} />
            </PermissionGuard>
            <div className="grid lg:grid-cols-3 gap-x-5 gap-y-5">
              <div className="grid grid-rows-2 gap-y-5">
                <Informations />
                <Description />
              </div>
              <div className="grid grid-rows-2 gap-y-5">
                <Tags />
                <Awards />
              </div>
              <div>
                <Contacts />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <Competences />
              <Objectifs />
            </div>
          </div>
        </FadeWrapper>
      ) : (
        <Error404 />
      )}
    </div>
  );
};

export default ParcoursView;
