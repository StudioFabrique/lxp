import { formatTitle } from "../../../../../utils/helpers/text-helpers";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCourseSelector, useCourseDispatch } from "../../../store/CourseContext";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { useEffect, useState } from "react";

import BoxWrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import CourseInfosForm from "./course-infos-form";
import Contact from "../../../../../../src/utils/interfaces/contact";
import Tag from "../../../../../../src/utils/interfaces/tag";
import { autoSubmitTimer } from "../../../../../config/auto-submit-timer";
import VirtualClass from "../../../../../../src/components/virtual-class";
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
  const virtualClass = useCourseSelector((state) => state.course?.virtualClass) ?? "";
  const [submitTags, setSubmitTags] = useState<boolean>(false);
  const [submitContacts, setSubmitContacts] = useState<boolean>(false);

  const handleUpdateTags = (tags: Tag[]) => {
    setSubmitTags(true);
    dispatch({ type: "SET_COURSE_TAGS", payload: tags });
  };

  const handleUpdateContacts = (contacts: Contact[]) => {
    setSubmitContacts(true);
    dispatch({ type: "SET_COURSE_CONTACTS", payload: contacts });
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

  const saveVirtualClass = async (url: string) => {
    try {
      const data = await courseApi.mutations.updateVirtualClass(courseId!, url);
      if (!data.success) throw new Error(data.message);
      dispatch({ type: "SET_COURSE_VIRTUAL_CLASS", payload: url });
      toast.success(data.message);
    } catch (error) { toast.error("Le lien vers la classe virtuelle n'a pas été mis à jour"); throw error; }
  };

  return (
    <div className="w-full flex flex-col gap-y-8">
      <h2 className="text-3xl font-extrabold">Informations</h2>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
        <BoxWrapper>
          <div className="flex flex-col gap-y-8">
            <span className="flex flex-col gap-y-4">
              <h2 className="font-bold">Titre du module</h2>
              <SubWrapper>
                <p>{formatTitle(moduleTitle)}</p>
              </SubWrapper>
            </span>
            <CourseInfosForm
              courseId={+courseId!}
              courseTitle={title}
              courseDescription={description}
              visibility={visibility}
            />
          </div>
        </BoxWrapper>
        <div className="flex flex-col gap-y-8">
          <BoxWrapper>
            <ContactsWithDrawer
              loading={loadingContacts}
              initialList={contacts}
              currentItems={currentContacts}
              property={["firstname", "lastname"]}
              onSubmit={handleUpdateContacts}
            />
          </BoxWrapper>
          <BoxWrapper>
            <CourseTags
              onSubmit={handleUpdateTags}
              loading={loadingTags}
              tags={currentTags || []}
              inheritedTags={inheritedTags || []}
            />
          </BoxWrapper>
        </div>
      </div>
      <BoxWrapper>
        <VirtualClass
          onSave={saveVirtualClass}
          value={virtualClass}
        />
      </BoxWrapper>
    </div>
  );
};

export default CourseInfos;
