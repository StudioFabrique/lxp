/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useCourseSelector } from "../../../store/CourseContext";
import toast from "react-hot-toast";

import RightSideDrawer from "../../../../../../src.legacy/components/UI/right-side-drawer/right-side-drawer";
import useHttp from "../../../../../../src.legacy/hooks/use-http";
import Tag from "../../../../../../src.legacy/utils/interfaces/tag";
import SearchDropdown from "../../../../../../src.legacy/components/UI/search-dropdown/search-dropdown";
import TagItem from "../../../../../../src.legacy/components/UI/tag-item/tag-item";
import { LessonWithActivitiesCount } from "../../../../../../src.legacy/utils/interfaces/lesson";
import LessonsTable from "./lessons-table";

interface LessonsInDrawerProps {
  onAddNewLessons: (lessonsIds: number[]) => void;
}

const LessonsInDrawer = (props: LessonsInDrawerProps) => {
  const { sendRequest, error } = useHttp();
  const tags = useCourseSelector(
    (state) => state.course?.tags
  ) as Tag[];
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [tag, setTag] = useState<Tag | null>(null);
  const [lessonsList, setLessonsList] = useState<
    LessonWithActivitiesCount[] | null
  >(null);

  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
  };

  const handleSearchTag = (name: string, _property: string) => {
    const selectedTag = tags.find((tag) =>
      tag.name.toLowerCase().includes(name.toLowerCase())
    );
    if (selectedTag) {
      setTag(selectedTag);
    }
  };

  const handleFilterTags = (name: string, _property: string) => {
    if (name.length > 0) {
      setFilteredTags(
        tags!.filter((tag) =>
          tag.name.toLowerCase().includes(name.toLowerCase())
        )
      );
    }
  };

  const handleResetFilter = () => {
    setFilteredTags([]);
  };

  const handleAddLessons = (lessonsIds: number[]) => {
    const updatedLessons = lessonsList!.filter((lesson) =>
      lessonsIds.includes(lesson.id)
    );

    if (updatedLessons.length > 0) {
      props.onAddNewLessons(updatedLessons.map((item) => item.id!));
    }

    handleCloseDrawer("add-lessons");
    setTag(null);
    setLessonsList(null);
  };

  useEffect(() => {
    const applyData = (data: { data: LessonWithActivitiesCount[] }) => {
      setLessonsList(data.data);
    };
    if (tag) {
      sendRequest(
        {
          path: `/lesson/tag/${tag.id}`,
        },
        applyData
      );
    }
  }, [tag, sendRequest]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  return (
    <RightSideDrawer
      id="add-lessons"
      title="Ajouter du contenu de cours"
      visible={false}
      onCloseDrawer={handleCloseDrawer}
    >
      <div className="flex flex-col gap-y-2">
        <span className="flex flex-col gap-y-4">
          <label className="text-xs text-primary" htmlFor="tag">
            Saisissez un nom de tag pour trouver des contenus qui lui sont
            associé
          </label>
          <SearchDropdown
            addItem={handleSearchTag}
            filterItems={handleFilterTags}
            filteredItems={filteredTags}
            resetFilterItems={handleResetFilter}
            property="name"
            placeHolder="Ex : HTML"
          />
        </span>
        {tag ? (
          <>
            <div className="divider" />
            <TagItem tag={tag} />
          </>
        ) : null}
        <div className="divider" />
        {lessonsList && lessonsList.length > 0 ? (
          <LessonsTable
            list={lessonsList}
            onAddItems={handleAddLessons}
            onCloseDrawer={() => {}}
          />
        ) : (
          <p>Aucun contenu trouvé</p>
        )}
      </div>
    </RightSideDrawer>
  );
};
export default LessonsInDrawer;
