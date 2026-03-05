/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Loader from "../../components/UI/loader";
import Error404 from "../../components/error404";
import Contenu from "../../components/parcours-view/contenu/contenu";
import Informations from "../../components/parcours-view/informations";
import Description from "../../components/parcours-view/description";
import Tags from "../../components/parcours-view/tags";
import Awards from "../../components/parcours-view/awards";
import Contacts from "../../components/parcours-view/contacts";
import Competences from "../../components/parcours-view/competences";
import Objectifs from "../../components/parcours-view/objectifs";
import QuickStatistiques from "../../components/parcours-view/quick-statistiques/quick-statistiques";
import ProgressModulesStats from "../../components/parcours-view/progress-stats";
import HeaderMenu from "../../components/UI/header-menu";
import ImageHeader from "../../components/image-header";
import Can from "../../components/UI/can/can.component";
import { Bell, GraduationCap, RocketIcon, Search } from "lucide-react";
import useParcoursView from "./hooks/use-parcours-view";
import Header from "../../components/UI/header";
import toUpperFirstLetter from "../../utils/toUpperFirstLetter";

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
      modules.find((module) =>
        module.courses?.some((course) =>
          course.lessons?.some(
            (lesson) =>
              !lesson.lessonsRead || !lesson.lessonsRead[0]?.finishedAt,
          ),
        ),
      )?.id || modules[0].id;

    navigate(`/${currentRoute[0]}/parcours/module/${resumeModuleId}`);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <Header
        title={`Aperçu du parcours`}
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
                <Can key="header" object="cursus" action="read">
                  <HeaderMenu
                    key="header"
                    onClickResume={handleClickResume}
                    hideResumeCourseButton={!(modules?.length > 0)}
                  />
                </Can>,
              ]}
              hidePublished
            />
          </div>

          <div className="mt-5 flex flex-col gap-y-5">
            <QuickStatistiques studentCount={studentCount} />
            {modules?.length > 0 ? (
              <Can action="component" object="progression">
                <ProgressModulesStats modules={modules} />
              </Can>
            ) : null}
            <Can object="cursus" action="read">
              <Contenu modules={modules} />
            </Can>
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
