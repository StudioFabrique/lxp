import { useNavigate, useParams } from "react-router-dom";
import ImageHeader from "../../components/image-header/image-header";
import useHttp from "../../hooks/use-http";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Parcours from "../../utils/interfaces/parcours";
import { parcoursAction } from "../../store/redux-toolkit/parcours/parcours";
import { parcoursInformationsAction } from "../../store/redux-toolkit/parcours/parcours-informations";
import { tagsAction } from "../../store/redux-toolkit/tags";
import { parcoursContactsAction } from "../../store/redux-toolkit/parcours/parcours-contacts";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";
import { parcoursObjectivesAction } from "../../store/redux-toolkit/parcours/parcours-objectives";
import FadeWrapper from "../../components/UI/fade-wrapper/fade-wrapper";
import Loader from "../../components/UI/loader";
import Error404 from "../../components/error404";
import ParcoursStatistiques from "../../components/view-parcours/parcours-statistiques";
import ParcoursContenu from "../../components/view-parcours/parcours-contenu/parcours-contenu";
import ParcoursInformations from "../../components/view-parcours/parcours-informations";
import ParcoursDescription from "../../components/view-parcours/parcours-description";

let initialState = true;

const ParcoursView = () => {
  const { id } = useParams();
  const { sendRequest, error } = useHttp();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [image, setImage] = useState<string | undefined>(undefined);
  //   const infos = useSelector((state: any) => state.parcoursInformations.infos);
  //   const skills = useSelector((state: any) => state.parcoursSkills.skills);
  //   const objectives = useSelector(
  //     (state: any) => state.parcoursObjectives.objectives
  //   );
  //   const tags = useSelector((state: any) => state.tags.currentTags);
  //   const contacts = useSelector(
  //     (state: any) => state.parcoursContacts.currentContacts
  //   );

  /**
   * enregistrement de l'image du parcours dans la bdd
   */
  const updateImage = useCallback(
    (image: File) => {
      const formData = new FormData();
      formData.append("parcoursId", id!);
      formData.append("image", image);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const processData = (_data: any) => {};
      sendRequest(
        {
          path: "/parcours/update-image",
          method: "put",
          body: formData,
        },
        processData
      );
    },
    [id, sendRequest]
  );

  /**
   * télécharge les données du parcours depuis la bdd et initialise les différentes propriétés du parcours
   */
  useEffect(() => {
    const processData = (data: Parcours) => {
      // mets en mémoire l'id du parcours pour le rendre disponible aux éléments de la vue
      dispatch(parcoursAction.setParcoursId(data.id));
      dispatch(
        parcoursInformationsAction.updateParcoursInfos({
          title: data.title,
          description: data.description,
        })
      );
      dispatch(
        parcoursInformationsAction.updateParcoursDates({
          startDate: data.startDate,
          endDate: data.endDate,
        })
      );
      dispatch(parcoursAction.setParcoursFormation(data.formation));
      if (data.image) {
        setImage(`data:image/jpeg;base64,${data.image}`);
      }
      if (data.tags.length > 0) {
        dispatch(
          tagsAction.setCurrentTags(data.tags.map((item: any) => item.tag))
        );
      } else {
        dispatch(
          tagsAction.setCurrentTags(
            data.formation.tags.map((item: any) => item.tag)
          )
        );
      }

      if (data.virtualClass) {
        dispatch(parcoursInformationsAction.setVirtualClass(data.virtualClass));
      }

      if (data.contacts.length > 0) {
        dispatch(
          parcoursContactsAction.setCurrentContacts(
            data.contacts.map((item: any) => item.contact)
          )
        );
      }
      if (data.skills.length > 0) {
        dispatch(
          parcoursSkillsAction.setSkillsList(
            data.skills.map((item: any) => item.skill)
          )
        );
      }

      if (data.bonusSkills.length > 0) {
        dispatch(parcoursSkillsAction.setSkillsList(data.bonusSkills));
      }

      if (data.objectives.length > 0) {
        dispatch(
          parcoursObjectivesAction.addImportedObjectivesToObjectives(
            data.objectives
          )
        );
      }

      setIsLoading(false);
    };
    if (initialState) {
      setIsLoading(true);
      sendRequest(
        {
          path: `/parcours/parcours-by-id/${id}`,
        },
        processData
      );
      initialState = false;
    }
  }, [id, dispatch, sendRequest]);

  /**
   * réinitialise les données du parcours lorsque l'utilisateur quitte la page
   */
  useEffect(() => {
    return () => {
      initialState = true;
      dispatch(parcoursAction.reset());
      dispatch(parcoursInformationsAction.reset());
      dispatch(tagsAction.reset());
      dispatch(parcoursContactsAction.reset());
      dispatch(parcoursSkillsAction.reset());
      dispatch(parcoursObjectivesAction.reset());
    };
  }, [dispatch]);

  return (
    <div className="w-full h-full flex flex-col justify-start items-center px-8 py-2">
      {isLoading ? (
        <Loader />
      ) : error.length === 0 ? (
        <FadeWrapper>
          <div className="w-full">
            <ImageHeader
              defaultImage="/images/parcours-default.webp"
              image={image}
              onUpdateImage={updateImage}
            />
            <div className="w-full 2xl:w-4/6 mt-16 flex flex-col gap-y-5">
              <ParcoursStatistiques />
              <ParcoursContenu />
              <div className="grid grid-cols-3 gap-x-5">
                <div className="grid grid-rows-2 gap-y-5">
                  <ParcoursInformations />
                  <ParcoursDescription />
                </div>
                <div className="grid grid-rows-2 gap-y-5">
                  {/* <ParcoursTags /> */}
                  {/* <ParcoursAwards /> */}
                </div>
                <div>{/* <ParcoursContacts /> */}</div>
              </div>
              <div className="grid grid-cols-2 gap-x-5">
                {/* <Competences /> */}
                {/* <Objectifs /> */}
              </div>
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
