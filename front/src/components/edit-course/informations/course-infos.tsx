/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

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
  const { value: virtualClass } = useInput(
    (value) => regexUrl.test(value),
    useSelector((state: any) => state.courseInfos.course.virtualClass as string)
  );
  const [submitTags, setSubmitTags] = useState<boolean>(false);
  const [submitContacts, setSubmitContacts] = useState<boolean>(false);
  const [submitVirtualClass, setSubmitVirtualClass] = useState<boolean>(false);

  /**
   * récupère la liste des tags du composant enfant
   * pour la mettre à jour dans le state global
   * @param tags Tag[]
   */
  const handleUpdateTags = (tags: Tag[]) => {
    setSubmitTags(true);
    dispatch(courseInfosAction.setCourseTags(tags));
  };

  /**
   * récupère la liste des contacts du composant enfant
   * pour la mettre à jour dans le state global
   * @param contacts Contact[]
   */
  const handleUpdateContacts = (contacts: Contact[]) => {
    setSubmitContacts(true);
    dispatch(courseInfosAction.setCourseContacts(contacts));
  };

  const handleChangeVirtualClass = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    if (!submitVirtualClass) {
      setSubmitVirtualClass(true);
    }
    virtualClass.valueChangeHandler(event);
  };

  /**
   * détecte un changement au niveau des tags et envoi une
   * requête pour mettre à jour les tags du cours dans la bdd
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const applyData = (_data: any) => {
        setLoadingTags(false);
      };
      if (submitTags) {
        setLoadingTags(true);
        sendRequest(
          {
            path: `/course/tags/${courseId}`,
            method: "put",
            body: currentTags.map((item) => item.id),
          },
          applyData
        );
        setSubmitTags(false);
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [courseId, submitTags, currentTags, sendRequest]);

  /**
   * détecte un changement au niveau des contacts et envoi une
   * requête pour mettre à jour les contacts du cours dans la bdd
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const applyData = (_data: any) => {
        setLoadingContacts(false);
      };
      if (submitContacts) {
        setLoadingContacts(true);
        sendRequest(
          {
            path: `/course/contacts/${courseId}`,
            method: "put",
            body: currentContacts.map((item) => item.id),
          },
          applyData
        );
        setSubmitContacts(false);
      }
    }, autoSubmitTimer);

    return () => clearTimeout(timer);
  }, [courseId, currentContacts, submitContacts, sendRequest]);

  /**
   * détecté un changement de valeur du champ virtualClass
   * et met à jour le lien vers la classe virtuelle dans la bdd
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const applyData = (data: any) => {
        if (data.success) {
          toast.success(data.message);
          dispatch(courseInfosAction.setCourseVirtualClass(virtualClass.value));
        }
      };
      if (virtualClass.isValid && submitVirtualClass) {
        sendRequest(
          {
            path: `/course/virtual-class/${courseId}`,
            method: "put",
            body: { virtualClass: virtualClass.value },
          },
          applyData
        );
        setSubmitVirtualClass(false);
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [
    courseId,
    dispatch,
    sendRequest,
    submitVirtualClass,
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
        <VirtualClass
          onChangeValue={handleChangeVirtualClass}
          virtualClass={virtualClass}
        />
      </Wrapper>
    </div>
  );
};

export default CourseInfos;
