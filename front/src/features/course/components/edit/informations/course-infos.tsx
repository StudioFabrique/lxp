/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCourseSelector, useCourseDispatch } from "../../../store/CourseContext";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

import Wrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import CourseInfosForm from "./course-infos-form";
import Contact from "../../../../../../src/utils/interfaces/contact";
import Tag from "../../../../../../src/utils/interfaces/tag";
import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import VirtualClass from "../../../../../../src/components/virtual-class";
import useInput from "../../../../../hooks/useInput";
import { regexUrl } from "../../../../../config/constantes";
import ContactsWithDrawer from "../../../../../../src/components/shared/inherited-items/contacts-with-drawer";
import SubWrapper from "../../../../../../src/components/wrappers/SubBoxWrapper";
import CourseTags from "./course-tags";
import { courseApi } from "../../../api/course.api";

const CourseInfos = () => {
  const { courseId } = useParams();
  const dispatch = useCourseDispatch();
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
  const inheritedTags = useCourseSelector(
    (state) => state.course?.module?.parcours?.tags,
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
    const timer = setTimeout(async () => {
      if (submitTags) {
        setLoadingTags(true);
        try {
          await courseApi.mutations.updateTags(
            courseId!,
            currentTags.map((item) => item.id).filter((id): id is number => id !== undefined),
          );
        } catch (err: any) {
          toast.error(err?.response?.data?.message ?? "Erreur inconnue");
        }
        setLoadingTags(false);
        setSubmitTags(false);
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [courseId, submitTags, currentTags]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (submitContacts) {
        setLoadingContacts(true);
        try {
          await courseApi.mutations.updateContacts(
            courseId!,
            currentContacts.map((item) => item.id).filter((id): id is number => id !== undefined),
          );
        } catch (err: any) {
          toast.error(err?.response?.data?.message ?? "Erreur inconnue");
        }
        setLoadingContacts(false);
        setSubmitContacts(false);
      }
    }, autoSubmitTimer);

    return () => clearTimeout(timer);
  }, [courseId, currentContacts, submitContacts]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (virtualClass.isValid && submitVirtualClass) {
        try {
          const data = await courseApi.mutations.updateVirtualClass(
            courseId!,
            virtualClass.value,
          );
          if (data.success) {
            toast.success(data.message);
            dispatch({ type: "SET_COURSE_VIRTUAL_CLASS", payload: virtualClass.value });
          }
        } catch (err: any) {
          toast.error(err?.response?.data?.message ?? "Erreur inconnue");
        }
        setSubmitVirtualClass(false);
      }
    }, autoSubmitTimer);
    return () => clearTimeout(timer);
  }, [
    courseId,
    dispatch,
    submitVirtualClass,
    virtualClass.isValid,
    virtualClass.value,
  ]);

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
            <CourseTags
              onSubmit={handleUpdateTags}
              loading={loadingTags}
              tags={currentTags || []}
              inheritedTags={inheritedTags || []}
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
