import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import Wrapper from "../../UI/wrapper/wrapper.component";
import CourseInfosForm from "./course-infos-form";
import Contact from "../../../utils/interfaces/contact";
import InheritedContacts from "../../inherited-items/inherited-contacts";
import InheritedTags from "../../inherited-items/inherited-tags";
import Tag from "../../../utils/interfaces/tag";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { courseInfosAction } from "../../../store/redux-toolkit/course/course-infos";
import useHttp from "../../../hooks/use-http";

const CourseInfos = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const title = useSelector(
    (state: any) => state.courseInfos.course.title
  ) as string;
  const description = useSelector(
    (state: any) => state.courseInfos.course.description
  ) as string;
  const contacts = useSelector(
    (state: any) => state.courseInfos.course.module.contacts
  ) as Contact[];
  const currentContacts = useSelector(
    (state: any) => state.courseInfos.course.contacts
  ) as Contact[];
  const tags = useSelector(
    (state: any) => state.courseInfos.course.module.parcours.tags
  ) as Tag[];
  const currentTags = useSelector(
    (state: any) => state.courseInfos.course.tags
  ) as Tag[];
  const isInitialRender = useRef(true);

  /**
   * envoi une requête pour mettre à jour la liste des tags
   * ou des contacts associés au cours
   */
  const handleSubmitData = useCallback(
    (value: unknown[], path: string) => {
      if (path === "tags") {
        setLoadingTags(true);
      } else {
        setLoadingContacts(true);
      }
      const applyData = (data: any) => {
        setLoadingTags(false);
        setLoadingContacts(false);
      };
      sendRequest(
        {
          path: `/course/${path}/${courseId}`,
          method: "put",
          body: value,
        },
        applyData
      );
    },
    [courseId, sendRequest]
  );

  /**
   * récupère la liste des tags du composant enfant
   * pour la mettre à jour dans le state global
   * @param tags Tag[]
   */
  const handleUpdateTags = (tags: Tag[]) => {
    dispatch(courseInfosAction.setCourseTags(tags));
  };

  /**
   * récupère la liste des contacts du composant enfant
   * pour la mettre à jour dans le state global
   * @param contacts Contact[]
   */
  const handleUpdateContacts = (contacts: Contact[]) => {
    dispatch(courseInfosAction.setCourseContacts(contacts));
  };

  /**
   * détecte un changement au niveau des tags et envoi une
   * requête pour mettre à jour les tags du cours dans la bdd
   */
  useEffect(() => {
    let timer: any;
    if (!isInitialRender.current) {
      timer = setTimeout(() => {
        console.log("tags triggered");
        handleSubmitData(
          currentTags.map((tag) => tag.id),
          "tags"
        );
      }, autoSubmitTimer);
    } else {
      isInitialRender.current = false;
    }
    return () => clearTimeout(timer);
  }, [currentTags, handleSubmitData]);

  /**
   * détecte un changement au niveau des tags et envoi une
   * requête pour mettre à jour les tags du cours dans la bdd
   */
  useEffect(() => {
    let timer: any;
    if (!isInitialRender.current) {
      timer = setTimeout(() => {
        console.log("contatcts triggered");
        handleSubmitData(
          currentContacts.map((contact) => contact.id),
          "contacts"
        );
      }, autoSubmitTimer);
    } else {
      isInitialRender.current = false;
    }
    return () => clearTimeout(timer);
  }, [currentContacts, handleSubmitData]);

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setLoadingTags(false);
      setLoadingContacts(false);
    }
  }, [error]);

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
        <Wrapper>
          <h2 className="text-xl font-bold">Informations</h2>
          <div className="flex flex-col gap-y-8">
            <CourseInfosForm
              courseId={+courseId!}
              courseTitle={title}
              courseDescription={description}
            />
          </div>
        </Wrapper>
        <div className="flex flex-col gap-y-8">
          <Wrapper>
            <InheritedContacts
              loading={loadingContacts}
              initialList={contacts}
              currentItems={currentContacts}
              property="name"
              onSubmit={handleUpdateContacts}
            />
          </Wrapper>
          <Wrapper>
            <InheritedTags
              loading={loadingTags}
              initialList={tags}
              currentItems={currentTags}
              property="name"
              onSubmit={handleUpdateTags}
            />
          </Wrapper>
        </div>
      </div>
    </div>
  );
};

export default CourseInfos;
