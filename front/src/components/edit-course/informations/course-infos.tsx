/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import Wrapper from "../../UI/wrapper/wrapper.component";
import CourseInfosForm from "./course-infos-form";
import Contact from "../../../utils/interfaces/contact";
import Tag from "../../../utils/interfaces/tag";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { courseInfosAction } from "../../../store/redux-toolkit/course/course-infos";
import useHttp from "../../../hooks/use-http";
import VirtualClass from "../../virtual-class";
import useInput from "../../../hooks/use-input";
import { regexUrl } from "../../../utils/constantes";
import TagsWithDrawer from "../../inherited-items/tags-with-drawer";
import ContactsWithDrawer from "../../inherited-items/contacts-with-drawer";
import SubWrapper from "../../UI/sub-wrapper/sub-wrapper.component";

const CourseInfos = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const moduleTitle = useSelector(
    (state: any) => state.courseInfos.course.module.title
  ) as string;
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
  const visibility = useSelector(
    (state: any) => state.courseInfos.course.visibility
  ) as boolean;
  const isInitialRender = useRef(true);
  const { value: virtualClass } = useInput(
    (value) => regexUrl.test(value),
    useSelector((state: any) => state.courseInfos.course.virtualClass as string)
  );
  const isInitialVirtual = useRef(true);
  const [submit, setSubmit] = useState<boolean>(false);

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const applyData = (_data: any) => {
        setLoadingTags(false);
        setLoadingContacts(false);
      };
      if (submit) {
        sendRequest(
          {
            path: `/course/${path}/${courseId}`,
            method: "put",
            body: value,
          },
          applyData
        );
      }
    },
    [courseId, submit, sendRequest]
  );

  /**
   * récupère la liste des tags du composant enfant
   * pour la mettre à jour dans le state global
   * @param tags Tag[]
   */
  const handleUpdateTags = (tags: Tag[]) => {
    setSubmit(true);
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
    const timer = setTimeout(() => {
      handleSubmitData(
        currentTags.map((tag) => tag.id),
        "tags"
      );
      setSubmit(false);
    }, autoSubmitTimer);

    return () => clearTimeout(timer);
  }, [currentTags, handleSubmitData]);

  /**
   * détecte un changement au niveau des contacts et envoi une
   * requête pour mettre à jour les contacts du cours dans la bdd
   */
  useEffect(() => {
    let timer: any;
    if (!isInitialRender.current) {
      timer = setTimeout(() => {
        handleSubmitData(
          currentContacts.map((contact) => contact.id),
          "contacts"
        );
        setSubmit(false);
      }, autoSubmitTimer);
    } else {
      isInitialRender.current = false;
    }
    return () => clearTimeout(timer);
  }, [currentContacts, handleSubmitData]);

  /**
   * détecté un changement de valeur du champ virtualClass
   * et met à jour le lien vers la classe virtuelle dans la bdd
   */
  useEffect(() => {
    let timer: any;
    if (!isInitialVirtual.current) {
      const applyData = (data: any) => {
        if (data.success) {
          toast.success(data.message);
          dispatch(courseInfosAction.setCourseVirtualClass(virtualClass.value));
        }
      };
      timer = setTimeout(() => {
        if (virtualClass.isValid) {
          sendRequest(
            {
              path: `/course/virtual-class/${courseId}`,
              method: "put",
              body: { virtualClass: virtualClass.value },
            },
            applyData
          );
        }
      }, autoSubmitTimer);
    } else {
      isInitialVirtual.current = false;
    }
    return () => clearTimeout(timer);
  }, [
    courseId,
    dispatch,
    sendRequest,
    virtualClass.isValid,
    virtualClass.value,
  ]);

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setLoadingTags(false);
      setLoadingContacts(false);
    }
  }, [error]);

  return (
    <div className="w-full flex flex-col gap-y-8">
      <h2 className="text-3xl font-extrabold">Informations</h2>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
        <Wrapper>
          <div className="flex flex-col gap-y-8">
            <span className="flex flex-col gap-y-4">
              <h2 className="font-bold">Titre du module</h2>
              <SubWrapper>
                <p>{moduleTitle}</p>
              </SubWrapper>
            </span>
            <CourseInfosForm
              courseId={+courseId!}
              courseTitle={title}
              courseDescription={description}
              visibility={visibility}
            />
          </div>
        </Wrapper>
        <div className="flex flex-col gap-y-8">
          <Wrapper>
            <ContactsWithDrawer
              loading={loadingContacts}
              initialList={contacts}
              currentItems={currentContacts}
              property="name"
              onSubmit={handleUpdateContacts}
            />
          </Wrapper>
          <Wrapper>
            <TagsWithDrawer
              loading={loadingTags}
              initialList={tags}
              currentItems={currentTags}
              property="name"
              onSubmit={handleUpdateTags}
            />
          </Wrapper>
        </div>
      </div>
      <Wrapper>
        <VirtualClass virtualClass={virtualClass} />
      </Wrapper>
    </div>
  );
};

export default CourseInfos;
