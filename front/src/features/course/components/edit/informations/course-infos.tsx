/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCourseSelector, useCourseDispatch } from "../../../store/CourseContext";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

import Wrapper from "../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import CourseInfosForm from "./course-infos-form";
import Contact from "../../../../../../src.legacy/utils/interfaces/contact";
import Tag from "../../../../../../src.legacy/utils/interfaces/tag";
import { autoSubmitTimer } from "../../../../../../src.legacy/config/auto-submit-timer";
import useHttp from "../../../../../../src.legacy/hooks/use-http";
import VirtualClass from "../../../../../../src.legacy/components/virtual-class";
import useInput from "../../../../../../src.legacy/hooks/use-input";
import { regexUrl } from "../../../../../../src.legacy/utils/constantes";
import ContactsWithDrawer from "../../../../../../src.legacy/components/inherited-items/contacts-with-drawer";
import SubWrapper from "../../../../../../src.legacy/components/UI/sub-wrapper/sub-wrapper.component";
import CourseTags from "./course-tags";
import { ParcoursProvider } from "../../../../parcours/store/ParcoursContext";

const CourseInfos = () => {
  const { courseId } = useParams();
  const dispatch = useCourseDispatch();
  const { sendRequest, error } = useHttp();
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const moduleTitle = useCourseSelector(
    (state) => state.course?.module?.title
  ) as string;
  const title = useCourseSelector(
    (state) => state.course?.title
  ) as string;
  const description = useCourseSelector(
    (state) => state.course?.description
  ) as string;
  const contacts = useCourseSelector(
    (state) => state.course?.module?.contacts
  ) as Contact[];
  const currentContacts = useCourseSelector(
    (state) => state.course?.contacts
  ) as Contact[];
  const currentTags = useCourseSelector(
    (state) => state.course?.tags
  ) as Tag[];
  const visibility = useCourseSelector(
    (state) => state.course?.visibility
  ) as boolean;
  const { value: virtualClass } = useInput(
    (value) => regexUrl.test(value),
    useCourseSelector((state) => state.course?.virtualClass as string)
  );
  const [submitTags, setSubmitTags] = useState<boolean>(false);
  const [submitContacts, setSubmitContacts] = useState<boolean>(false);
  const [submitVirtualClass, setSubmitVirtualClass] = useState<boolean>(false);

  console.log("TAGS :", currentTags);

  const handleUpdateTags = (tags: Tag[]) => {
    setSubmitTags(true);
    dispatch({ type: "SET_COURSE_TAGS", payload: tags });
  };

  const handleUpdateContacts = (contacts: Contact[]) => {
    setSubmitContacts(true);
    dispatch({ type: "SET_COURSE_CONTACTS", payload: contacts });
  };

  const handleChangeVirtualClass = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    if (!submitVirtualClass) {
      setSubmitVirtualClass(true);
    }
    virtualClass.valueChangeHandler(event);
  };

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

  useEffect(() => {
    const timer = setTimeout(() => {
      const applyData = (data: any) => {
        if (data.success) {
          toast.success(data.message);
          dispatch({ type: "SET_COURSE_VIRTUAL_CLASS", payload: virtualClass.value });
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
            <ParcoursProvider>
              <CourseTags
                onSubmit={handleUpdateTags}
                loading={loadingTags}
                tags={currentTags || []}
              />
            </ParcoursProvider>
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
